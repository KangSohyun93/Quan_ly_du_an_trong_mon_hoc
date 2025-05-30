import pool from '../db.js';

async function getGroups(userId, classId, userRole) {
    // userId, classId, and userRole are expected to be validated and provided by the caller (e.g., route handler)
    if (!userId || !classId || !userRole) {
        console.error('getGroups called without userId, classId, or userRole.');
        throw new Error('Internal server error: Missing required parameters for fetching groups.');
    }

    try {
        let query;
        const params = [classId]; // Start with classId for all queries

        if (userRole === 'Instructor') {
            query = `
                SELECT g.group_id, g.group_name, p.project_id, c.class_name
                FROM \`Groups\` g
                JOIN Classes c ON g.class_id = c.class_id
                LEFT JOIN Projects p ON g.group_id = p.group_id
                WHERE g.class_id = ? AND c.instructor_id = ?
                ORDER BY g.group_name
            `;
            params.push(userId); // Add instructor's userId
        } else if (userRole === 'Student') {
            query = `
                SELECT g.group_id, g.group_name, p.project_id, c.class_name
                FROM \`Groups\` g
                JOIN GroupMembers gm ON g.group_id = gm.group_id
                JOIN Classes c ON g.class_id = c.class_id 
                LEFT JOIN Projects p ON g.group_id = p.group_id
                WHERE g.class_id = ? AND gm.user_id = ?
                ORDER BY g.group_name
            `;
            params.push(userId); // Add student's userId
        } else if (userRole === 'Admin') {
            // Admin sees all groups in the specified classId
            query = `
                SELECT g.group_id, g.group_name, p.project_id, c.class_name
                FROM \`Groups\` g
                JOIN Classes c ON g.class_id = c.class_id
                LEFT JOIN Projects p ON g.group_id = p.group_id
                WHERE g.class_id = ? 
                ORDER BY g.group_name
            `;
            // No additional userId needed for params, already has classId
        } else {
            console.warn(`Unhandled role: ${userRole} for userId: ${userId} in getGroups.`);
            return []; // Return empty for unhandled roles
        }

        const [groups] = await pool.query(query, params);
        return groups;
    } catch (error) {
        console.error(`Error fetching groups for user ${userId} (role: ${userRole}) in class ${classId}:`, error);
        throw new Error('Internal server error while fetching groups list.');
    }
}

async function getMembersByGroupId(groupId) {
    const connection = await pool.getConnection();
    try {
        const [groupCheck] = await connection.query(`SELECT 1 FROM \`Groups\` WHERE group_id = ?`, [groupId]);
        if (groupCheck.length === 0) {
            connection.release();
            throw new Error(`Group with ID ${groupId} not found`);
        }

        // Lấy project_id để có thể join với Sprints và Tasks một cách chính xác
        const [projectRows] = await connection.query(
            'SELECT project_id FROM Projects WHERE group_id = ?',
            [groupId]
        );
        if (projectRows.length === 0) {
            connection.release();
            throw new Error(`Project not found for group ${groupId}`);
        }
        const projectId = projectRows[0].project_id;

        // Lấy danh sách thành viên và thông tin cơ bản
        const [membersBasicInfo] = await connection.query(`
            SELECT 
                u.user_id, u.username AS name, u.avatar,
                g.leader_id, gm.joined_at AS joinDate,
                DATEDIFF(NOW(), gm.joined_at) AS workDays
            FROM GroupMembers gm
            JOIN Users u ON gm.user_id = u.user_id
            JOIN \`Groups\` g ON gm.group_id = g.group_id
            WHERE gm.group_id = ?
        `, [groupId]);

        if (membersBasicInfo.length === 0) {
            connection.release();
            return { members: [], sprintData: {} }; // Trả về rỗng nếu không có thành viên
        }

        // Lấy tất cả tasks của project, cùng với thông tin sprint_id, due_date, completed_at, status, assigned_to
        const [allProjectTasks] = await connection.query(`
            SELECT 
                t.task_id, t.assigned_to, t.status, t.due_date, t.completed_at, t.sprint_id, s.sprint_number
            FROM Tasks t
            JOIN Sprints s ON t.sprint_id = s.sprint_id
            WHERE s.project_id = ?
        `, [projectId]);

        const now = new Date();
        const formattedMembers = membersBasicInfo.map(member => {
            const memberTasks = allProjectTasks.filter(task => task.assigned_to === member.user_id);
            
            let completed = 0;
            let inProgress = 0;
            let toDo = 0;
            let lateCompletion = 0;
            let overdueIncomplete = 0;
            let totalMemberTasks = memberTasks.length; // Tổng số task của thành viên này

            memberTasks.forEach(task => {
                const dueDate = task.due_date ? new Date(task.due_date) : null;
                const completedAt = task.completed_at ? new Date(task.completed_at) : null;

                if (task.status === 'Completed') {
                    if (completedAt && dueDate && completedAt > dueDate) {
                        lateCompletion++;
                    } else {
                        completed++;
                    }
                } else if (task.status === 'In-Progress') {
                    if (dueDate && dueDate < now) {
                        overdueIncomplete++;
                    } else {
                        inProgress++;
                    }
                } else if (task.status === 'To-Do') {
                    if (dueDate && dueDate < now) {
                        overdueIncomplete++;
                    } else {
                        toDo++;
                    }
                }
            });

            return {
                name: member.name,
                avatar: member.avatar || 'https://i.pravatar.cc/150?img=1',
                role: member.user_id === member.leader_id ? 'PM' : 'Member',
                joinDate: member.joinDate,
                workDays: Number(member.workDays),
                // Các trường mới cho MemberCompletionChart
                completed: completed,
                inProgress: inProgress,
                toDo: toDo,
                lateCompletion: lateCompletion,
                overdueIncomplete: overdueIncomplete,
                total: totalMemberTasks, // Tổng số task được assign cho member này
                // Các trường cũ (notStarted) không còn cần thiết nếu dùng 5 trạng thái mới
                // notStarted: toDo, // Hoặc giữ lại nếu vẫn dùng ở đâu đó, nhưng sẽ thừa nếu dùng 5 trạng thái
            };
        });

        // Lấy dữ liệu sprint cho từng thành viên (sprintData cho MemberInfo)
        // Phần này cần đảm bảo nó vẫn hoạt động đúng, hoặc có thể cần điều chỉnh nếu
        // định nghĩa "late" trong sprintData khác với "lateCompletion" ở trên.
        // Hiện tại, "late" trong sprintData có vẻ là tổng số task bị trễ (bao gồm cả chưa hoàn thành)
        const [sprintDataRaw] = await connection.query(`
            SELECT 
                u.user_id, u.username, s.sprint_id, s.sprint_number AS sprint,
                COALESCE(SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END), 0) AS sprint_completed_tasks,
                COALESCE(COUNT(t.task_id), 0) AS sprint_total_tasks,
                COALESCE(SUM(CASE 
                                WHEN t.status = 'Completed' AND t.completed_at IS NOT NULL AND t.due_date IS NOT NULL AND t.completed_at > t.due_date THEN 1 
                                WHEN t.status != 'Completed' AND t.due_date IS NOT NULL AND t.due_date < NOW() THEN 1
                                ELSE 0 
                            END), 0) AS sprint_late_tasks 
            FROM GroupMembers gm
            JOIN Users u ON gm.user_id = u.user_id
            JOIN Projects p_details ON p_details.group_id = gm.group_id
            JOIN Sprints s ON s.project_id = p_details.project_id
            LEFT JOIN Tasks t ON t.sprint_id = s.sprint_id AND t.assigned_to = u.user_id
            WHERE gm.group_id = ?
            GROUP BY u.user_id, u.username, s.sprint_id, s.sprint_number
            ORDER BY u.user_id, s.sprint_number
        `, [groupId]);
        
        const sprintData = {};
        membersBasicInfo.forEach(member => {
            sprintData[member.name] = sprintDataRaw
                .filter(row => row.user_id === member.user_id)
                .map(row => ({
                    sprint: row.sprint,
                    completed: Number(row.sprint_completed_tasks), // Đổi tên cho rõ
                    total: Number(row.sprint_total_tasks),       // Đổi tên cho rõ
                    late: Number(row.sprint_late_tasks),         // Đổi tên cho rõ
                }));
        });
        connection.release();
        return { members: formattedMembers, sprintData };
    } catch (error) {
        if (connection) connection.release(); // Đảm bảo giải phóng connection nếu có lỗi sớm
        console.error(`Error fetching members and detailed task stats for group ${groupId}:`, error);
        throw error;
    }
}

async function getPeerAssessments(groupId) {
    try {
        const groupIdNum = parseInt(groupId, 10);
        if (isNaN(groupIdNum)) {
            throw new Error('Invalid groupId');
        }

        const [groupCheck] = await pool.query('SELECT 1 FROM `Groups` WHERE group_id = ?', [groupIdNum]);
        if (groupCheck.length === 0) {
            throw new Error(`Group with ID ${groupId} not found`);
        }

        // Fetch all individual reviews with their detailed scores
        const [reviews] = await pool.query(`
            SELECT 
                u_assessee.username AS assessee_name,
                u_assessor.username AS reviewer_name,
                pa.note AS comment,
                pa.deadline_score,
                pa.friendly_score,
                pa.quality_score,
                pa.team_support_score,
                pa.responsibility_score,
                (COALESCE(pa.deadline_score, 0) + 
                 COALESCE(pa.friendly_score, 0) + 
                 COALESCE(pa.quality_score, 0) + 
                 COALESCE(pa.team_support_score, 0) + 
                 COALESCE(pa.responsibility_score, 0)) / 5.0 AS review_average_score
            FROM PeerAssessments pa
            JOIN Users u_assessee ON pa.assessee_id = u_assessee.user_id
            JOIN Users u_assessor ON pa.assessor_id = u_assessor.user_id
            WHERE pa.group_id = ?
            ORDER BY assessee_name, reviewer_name
        `, [groupIdNum]);

        const peerReviewData = [];
        if (reviews.length > 0) {
            const membersMap = new Map();

            for (const review of reviews) {
                if (!membersMap.has(review.assessee_name)) {
                    membersMap.set(review.assessee_name, { totalReviewScoreSum: 0, reviewCount: 0, details: [] });
                }
                const memberData = membersMap.get(review.assessee_name);

                const reviewAvg = review.review_average_score ? Number(Number(review.review_average_score).toFixed(1)) : 0;

                memberData.totalReviewScoreSum += reviewAvg;
                memberData.reviewCount++;
                memberData.details.push({
                    reviewer: review.reviewer_name,
                    overallReviewScore: reviewAvg,
                    comment: review.comment || null, // Keep null if no comment
                    scores: {
                        deadline: review.deadline_score === null ? 0 : review.deadline_score,
                        friendly: review.friendly_score === null ? 0 : review.friendly_score,
                        quality: review.quality_score === null ? 0 : review.quality_score,
                        teamSupport: review.team_support_score === null ? 0 : review.team_support_score,
                        responsibility: review.responsibility_score === null ? 0 : review.responsibility_score,
                    }
                });
            }

            for (const [name, data] of membersMap) {
                const finalAvgScore = data.reviewCount > 0 ? data.totalReviewScoreSum / data.reviewCount : 0;
                peerReviewData.push({
                    name: name,
                    score: Number(finalAvgScore.toFixed(1)),
                    details: data.details
                });
            }
        }
        return peerReviewData;
    } catch (error) {
        console.error(`Error fetching peer assessments for group ${groupId}:`, error.message, error.stack);
        throw error;
    }
}

export async function getSprintsByGroupId(groupId) {
    const connection = await pool.getConnection();
    try {
        const [projectRows] = await connection.query(
            'SELECT project_id FROM Projects WHERE group_id = ?',
            [groupId]
        );
        if (projectRows.length === 0) {
            throw new Error(`Project not found for group ${groupId}`);
        }
        const projectId = projectRows[0].project_id;

        const [sprints] = await connection.query(
            'SELECT sprint_id, sprint_number, sprint_name, start_date, end_date FROM Sprints WHERE project_id = ? ORDER BY sprint_number ASC',
            [projectId]
        );
        return sprints.map(s => ({
            id: s.sprint_id,
            number: s.sprint_number,
            name: s.sprint_name || `Sprint ${s.sprint_number}`, // Fallback name
            startDate: s.start_date,
            endDate: s.end_date
        }));
    } finally {
        connection.release();
    }
}

export async function getProjectStats(groupId, sprintIdFilter) {
    const connection = await pool.getConnection();
    try {
        const [projectRows] = await connection.query(
            'SELECT project_id FROM Projects WHERE group_id = ?',
            [groupId]
        );
        if (projectRows.length === 0) {
            throw new Error(`Project not found for group ${groupId}`);
        }
        const projectId = projectRows[0].project_id;

        let totalTasks = 0;
        let sprintTasks = 0; // Nhiệm vụ của sprint được chọn (hoặc sprint hiện tại)
        let completedTasks = 0; // Tổng hoàn thành của project hoặc sprint được chọn
        let lateTasks = 0; // Tổng trễ hạn của project hoặc sprint được chọn

        // 1. Tổng Commit và Tổng LOC cho toàn bộ project
        const [commitStats] = await connection.query(
            `SELECT 
                COUNT(contribution_id) AS totalCommits,
                SUM(lines_added) AS totalLinesAdded,
                SUM(lines_removed) AS totalLinesRemoved
             FROM GitContributions WHERE project_id = ?`,
            [projectId]
        );
        const totalCommits = commitStats[0]?.totalCommits || 0;
        const totalLOC = (commitStats[0]?.totalLinesAdded || 0); // Chỉ tính dòng thêm, hoặc (added - removed) tùy bạn

        // 2. Task stats
        let taskQueryBase = `SELECT COUNT(t.task_id) AS count, t.status, t.due_date, t.completed_at 
                             FROM Tasks t JOIN Sprints s ON t.sprint_id = s.sprint_id 
                             WHERE s.project_id = ?`;
        const queryParamsBase = [projectId];

        // Lấy tổng nhiệm vụ toàn dự án
        const [allTasksCountRows] = await connection.query(
            `SELECT COUNT(*) as count FROM Tasks t JOIN Sprints s ON t.sprint_id = s.sprint_id WHERE s.project_id = ?`,
            [projectId]
        );
        totalTasks = allTasksCountRows[0]?.count || 0;

        // Xử lý sprintIdFilter
        let currentSprintIdToFilter = null;
        if (sprintIdFilter && sprintIdFilter !== 'all') {
            if (sprintIdFilter === 'current') {
                // Logic để xác định sprint hiện tại (ví dụ: sprint có end_date gần nhất trong tương lai hoặc start_date gần nhất trong quá khứ)
                // Đây là ví dụ đơn giản, bạn có thể cần logic phức tạp hơn
                const [currentSprintRows] = await connection.query(
                    `SELECT sprint_id FROM Sprints 
                     WHERE project_id = ? AND end_date >= CURDATE() 
                     ORDER BY end_date ASC LIMIT 1`,
                    [projectId]
                );
                if (currentSprintRows.length > 0) {
                    currentSprintIdToFilter = currentSprintRows[0].sprint_id;
                } else {
                    // Fallback: lấy sprint cuối cùng nếu không có sprint nào đang diễn ra
                    const [lastSprintRows] = await connection.query(
                        `SELECT sprint_id FROM Sprints 
                         WHERE project_id = ? 
                         ORDER BY sprint_number DESC LIMIT 1`,
                        [projectId]
                    );
                    if (lastSprintRows.length > 0) {
                        currentSprintIdToFilter = lastSprintRows[0].sprint_id;
                    }
                }
            } else {
                currentSprintIdToFilter = parseInt(sprintIdFilter, 10);
            }
        }

        // Tính toán completedTasks và lateTasks dựa trên sprint được filter (hoặc toàn bộ project nếu không filter)
        let filterCondition = "";
        const filterParams = [projectId];
        if (currentSprintIdToFilter) {
            filterCondition = " AND s.sprint_id = ?";
            filterParams.push(currentSprintIdToFilter);
        }

        const [tasksForStats] = await connection.query(
            `SELECT t.status, t.due_date, t.completed_at 
             FROM Tasks t JOIN Sprints s ON t.sprint_id = s.sprint_id 
             WHERE s.project_id = ? ${filterCondition}
            `, filterParams
        );

        tasksForStats.forEach(task => {
            if (task.status === 'Completed') {
                completedTasks++;
                if (task.completed_at && task.due_date && new Date(task.completed_at) > new Date(task.due_date)) {
                    lateTasks++;
                }
            } else if (task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Completed') {
                // Task quá hạn nhưng chưa hoàn thành cũng được tính là "trễ" theo một nghĩa nào đó cho StatCard
                // Hoặc bạn có thể có định nghĩa khác cho "Trễ hạn" trong StatCard
                lateTasks++;
            }
        });

        // Lấy số nhiệm vụ cho sprint cụ thể (nếu có filter)
        if (currentSprintIdToFilter) {
            const [sprintSpecificTasksCountRows] = await connection.query(
                `SELECT COUNT(*) as count FROM Tasks WHERE sprint_id = ?`,
                [currentSprintIdToFilter]
            );
            sprintTasks = sprintSpecificTasksCountRows[0]?.count || 0;
        } else {
            // Nếu không filter sprint, "Sprint Tasks" có thể là tổng tasks hoặc một giá trị mặc định/ý nghĩa khác
            sprintTasks = totalTasks;
        }

        return {
            totalProjectTasks: totalTasks,       // Tổng nhiệm vụ của dự án
            selectedSprintTasks: sprintTasks,    // Nhiệm vụ của sprint đang chọn (hoặc 'current')
            tasksCompleted: completedTasks,      // Hoàn thành (của project hoặc sprint đang chọn)
            tasksLate: lateTasks,                // Trễ hạn (của project hoặc sprint đang chọn)
            totalCommits: totalCommits,
            totalLOC: totalLOC,
        };
    } finally {
        connection.release();
    }
}

export { getGroups, getMembersByGroupId, getPeerAssessments };