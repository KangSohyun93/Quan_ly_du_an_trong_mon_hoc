const {
    User, Class, Group, Project, ClassMember, GroupMember, PeerAssessment,
    sequelize, Sequelize
} = require('../models');
const { Op, QueryTypes } = Sequelize; // QueryTypes có thể không cần nếu không còn query rå

// Import các service phụ trợ
const projectService = require('./projectService');
const taskService = require('./taskService');
const contributionService = require('./contributionService'); // Cho commit & LOC stats
const sprintService = require('./sprintService'); // Service mới cho logic sprint

/**
 * Lấy danh sách các nhóm mà người dùng có thể thấy dựa trên vai trò và lớp học.
 */
async function getGroupsForUserByClass(userId, classId, userRole) {
    if (!userId || !classId || !userRole) {
        console.error('getGroupsForUserByClass called with missing parameters.');
        throw new Error('Internal server error: Missing required parameters.');
    }
    try {
        const includeOptions = [
            { model: Class, attributes: ['class_name'], required: true },
            { model: Project, attributes: ['project_id'], required: false } // Project liên kết với Group
        ];
        let whereClause = { class_id: classId };

        if (userRole === 'Instructor') {
            whereClause['$Class.instructor_id$'] = userId;
        } else if (userRole === 'Student') {
            includeOptions.push({
                model: GroupMember,
                as: 'groupMembers',
                where: { user_id: userId },
                attributes: [],
                required: true
            });
        } else if (userRole !== 'Admin') {
            console.warn(`Unhandled role: ${userRole} for userId: ${userId} in getGroupsForUserByClass.`);
            return [];
        }

        const groups = await Group.findAll({
            where: whereClause,
            include: includeOptions,
            attributes: ['group_id', 'group_name'],
            order: [['group_name', 'ASC']],
        });

        return groups.map(g => {
            const groupJson = g.toJSON();
            return {
                group_id: groupJson.group_id,
                group_name: groupJson.group_name,
                project_id: groupJson.Project?.project_id || null,
                class_name: groupJson.Class.class_name
            };
        });
    } catch (error) {
        console.error(`Error in getGroupsForUserByClass (user: ${userId}, class: ${classId}, role: ${userRole}):`, error);
        throw new Error('Internal server error while fetching groups list.');
    }
}

/**
 * Lấy thông tin chi tiết của các thành viên trong một nhóm, bao gồm thống kê task của họ.
 */
async function getGroupMembersWithTaskDetails(groupId) {
    try {
        const group = await Group.findByPk(groupId, {
            include: [
                {
                    model: GroupMember,
                    as: 'groupMembers',
                    include: {
                        model: User,
                        attributes: ['user_id', 'username', 'avatar']
                    },
                    attributes: ['joined_at']
                }
            ],
            attributes: ['group_id', 'leader_id']
        });

        if (!group) throw new Error(`Group with ID ${groupId} not found`);

        const project = await projectService.getProjectByGroupId(groupId);
        if (!project) throw new Error(`Project not found for group ${groupId}`);
        const projectId = project.project_id;
        const leaderId = group.leader_id;

        if (!group.groupMembers || group.groupMembers.length === 0) {
            return { members: [], sprintData: {} };
        }

        const allProjectTasks = await taskService.getTasksByProjectId(projectId);

        const now = new Date();
        const formattedMembers = group.groupMembers.map(gm => {
            const user = gm.User.toJSON();
            const memberTasks = allProjectTasks.filter(task => task.assigned_to === user.user_id);

            let completed = 0, inProgress = 0, toDo = 0, lateCompletion = 0, overdueIncomplete = 0;
            memberTasks.forEach(task => {
                const dueDate = task.due_date ? new Date(task.due_date) : null;
                const completedAt = task.completed_at ? new Date(task.completed_at) : null;
                if (task.status === 'Completed') {
                    if (completedAt && dueDate && completedAt > dueDate) lateCompletion++; else completed++;
                } else if (task.status === 'In-Progress') {
                    if (dueDate && dueDate < now) overdueIncomplete++; else inProgress++;
                } else if (task.status === 'To-Do') {
                    if (dueDate && dueDate < now) overdueIncomplete++; else toDo++;
                }
            });
            const joinDate = new Date(gm.joined_at);
            const workDays = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 3600 * 24));

            return {
                name: user.username, avatar: user.avatar || 'https://i.pravatar.cc/150?img=1',
                role: user.user_id === leaderId ? 'PM' : 'Member',
                joinDate: gm.joined_at, workDays,
                completed, inProgress, toDo, lateCompletion, overdueIncomplete,
                total: memberTasks.length,
            };
        });

        // Phần sprintDataRaw: Gọi service để lấy dữ liệu này nếu đã tách.
        // Nếu chưa tách, giữ nguyên query rå hoặc viết lại logic ORM ở đây.
        // Giả sử taskService có hàm getSprintTaskDataForGroup:
        // const sprintData = await taskService.getSprintTaskDataForGroup(groupId, projectId);
        // Hoặc giữ lại query rå hiện tại nếu chưa có service đó:
        const sprintDataRaw = await sequelize.query(`
            SELECT u.user_id, u.username, s.sprint_id, s.sprint_number AS sprint,
                   COALESCE(SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END), 0) AS sprint_completed_tasks,
                   COALESCE(COUNT(t.task_id), 0) AS sprint_total_tasks,
                   COALESCE(SUM(CASE WHEN t.status = 'Completed' AND t.completed_at > t.due_date THEN 1 WHEN t.status != 'Completed' AND t.due_date < NOW() THEN 1 ELSE 0 END), 0) AS sprint_late_tasks 
            FROM GroupMembers gm_sprint JOIN Users u ON gm_sprint.user_id = u.user_id JOIN \`Groups\` g_sprint ON gm_sprint.group_id = g_sprint.group_id JOIN Projects p_details ON p_details.group_id = g_sprint.group_id JOIN Sprints s ON s.project_id = p_details.project_id LEFT JOIN Tasks t ON t.sprint_id = s.sprint_id AND t.assigned_to = u.user_id
            WHERE gm_sprint.group_id = :groupId GROUP BY u.user_id, u.username, s.sprint_id, s.sprint_number ORDER BY u.user_id, s.sprint_number
        `, { replacements: { groupId: groupId }, type: QueryTypes.SELECT });

        const sprintData = {};
        group.groupMembers.forEach(gm => {
            const user = gm.User.toJSON();
            sprintData[user.username] = sprintDataRaw
                .filter(row => row.user_id === user.user_id)
                .map(row => ({ sprint: row.sprint, completed: +row.sprint_completed_tasks, total: +row.sprint_total_tasks, late: +row.sprint_late_tasks }));
        });


        return { members: formattedMembers, sprintData };
    } catch (error) {
        console.error(`Error in getGroupMembersWithTaskDetails for group ${groupId}:`, error);
        throw error;
    }
}

/**
 * Lấy dữ liệu đánh giá ngang hàng cho một nhóm.
 */
async function getPeerAssessmentsForGroup(groupId) {
    try {
        const groupIdNum = parseInt(groupId, 10);
        if (isNaN(groupIdNum)) throw new Error('Invalid groupId');

        const groupExists = await Group.count({ where: { group_id: groupIdNum } });
        if (groupExists === 0) throw new Error(`Group with ID ${groupIdNum} not found`);

        const reviews = await PeerAssessment.findAll({
            where: { group_id: groupIdNum },
            include: [
                { model: User, as: 'assessee', attributes: ['user_id', 'username'] },
                { model: User, as: 'assessor', attributes: ['user_id', 'username'] }
            ],
            attributes: [
                'note', 'deadline_score', 'friendly_score', 'quality_score',
                'team_support_score', 'responsibility_score',
                [
                    sequelize.literal(`(
                        COALESCE(deadline_score, 0) + 
                        COALESCE(friendly_score, 0) + 
                        COALESCE(quality_score, 0) + 
                        COALESCE(team_support_score, 0) + 
                        COALESCE(responsibility_score, 0)
                    ) / 5.0`),
                    'review_average_score'
                ]
            ],
            order: [
                [sequelize.literal('`assessee.username`'), 'ASC'],
                [sequelize.literal('`assessor.username`'), 'ASC']
            ], // Sắp xếp qua alias
            raw: true, nest: true
        });

        const peerReviewData = [];
        if (reviews.length > 0) {
            const membersMap = new Map();
            for (const review of reviews) {
                const assesseeName = review.assessee.username;
                if (!membersMap.has(assesseeName)) {
                    membersMap.set(assesseeName, { totalReviewScoreSum: 0, reviewCount: 0, details: [] });
                }
                const memberData = membersMap.get(assesseeName);

                const averageScoreValue = parseFloat(review.review_average_score);
                const reviewAvg = !isNaN(averageScoreValue) ? parseFloat(averageScoreValue.toFixed(1)) : 0;
                // const reviewAvg = review.review_average_score ? parseFloat(review.review_average_score.toFixed(1)) : 0;
                memberData.totalReviewScoreSum += reviewAvg;
                memberData.reviewCount++;
                memberData.details.push({
                    reviewer: review.assessor.username,
                    overallReviewScore: reviewAvg,
                    comment: review.note || null,
                    scores: {
                        deadline: review.deadline_score ?? 0,
                        friendly: review.friendly_score ?? 0,
                        quality: review.quality_score ?? 0,
                        teamSupport: review.team_support_score ?? 0,
                        responsibility: review.responsibility_score ?? 0,
                    }
                });
            }
            for (const [name, data] of membersMap) {
                const finalAvgScore = data.reviewCount > 0 ? parseFloat((data.totalReviewScoreSum / data.reviewCount).toFixed(1)) : 0;
                peerReviewData.push({ name, score: finalAvgScore, details: data.details });
            }
        }
        return peerReviewData;
    } catch (error) {
        console.error(`Error fetching peer assessments for group ${groupId}:`, error.message, error.stack);
        throw error;
    }
}

/**
 * Lấy danh sách các sprint của một project, thông qua groupId.
 */
async function getSprintsOfProjectInGroup(groupId) {
    try {
        const project = await projectService.getProjectByGroupId(groupId);
        if (!project) {
            console.warn(`Project not found for group ${groupId} when fetching sprints.`);
            return [];
        }
        // Giả sử sprintService có hàm getSprintsByProjectId
        const sprints = await sprintService.getSprintsByProjectId(project.project_id);
        return sprints.map(s => ({ // sprintService nên trả về cấu trúc này hoặc memberService tự map
            id: s.sprint_id,
            number: s.sprint_number,
            name: s.sprint_name || `Sprint ${s.sprint_number}`,
            startDate: s.start_date,
            endDate: s.end_date
        }));
    } catch (error) {
        console.error(`Error in getSprintsOfProjectInGroup for group ${groupId}:`, error);
        throw error;
    }
}

/**
 * Lấy các thống kê tổng quan của project (tasks, commits, LOC) cho một group.
 */
async function getProjectOverallStatsForGroup(groupId, sprintIdFilter) {
    try {
        const project = await projectService.getProjectByGroupId(groupId);
        if (!project) throw new Error(`Project not found for group ${groupId}`);
        const projectId = project.project_id;

        // 1. Commit Stats
        const { totalCommits, totalLinesAdded: totalLOC } = await contributionService.getCommitStatsByProjectId(projectId);

        // 2. Task stats
        // Logic xác định sprintId để filter
        const targetSprintId = await sprintService.getTargetSprintIdForFilter(projectId, sprintIdFilter);

        // Lấy thống kê task từ taskService
        const {
            totalProjectTasks,
            selectedSprintTasks, // tasks trong sprint được filter
            tasksCompleted,      // tasks hoàn thành trong sprint được filter (hoặc toàn project)
            tasksLate            // tasks trễ trong sprint được filter (hoặc toàn project)
        } = await taskService.getTaskStatsForProject(projectId, targetSprintId);


        return {
            totalProjectTasks,
            selectedSprintTasks,
            tasksCompleted,
            tasksLate,
            totalCommits: totalCommits || 0,
            totalLOC: totalLOC || 0,
        };
    } catch (error) {
        console.error(`Error in getProjectOverallStatsForGroup (group ${groupId}):`, error);
        throw error;
    }
}

module.exports = {
    getGroups: getGroupsForUserByClass, // Đổi tên export nếu cần
    getMembersByGroupId: getGroupMembersWithTaskDetails,
    getPeerAssessments: getPeerAssessmentsForGroup,
    getSprintsByGroupId: getSprintsOfProjectInGroup,
    getProjectStats: getProjectOverallStatsForGroup,
};
