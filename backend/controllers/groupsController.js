// backend/controllers/groupController.js
const memberService = require('../services/memberService');
const { User, Project, Sprint, Task, sequelize, QueryTypes } = require('../models'); // Import các model cần thiết và sequelize

// Hàm này sẽ thay thế logic trong GET / của routes
async function listGroups(req, res) {
    const { userId, classId } = req.query;
    const numUserId = userId ? parseInt(userId, 10) : null;
    const numClassId = classId ? parseInt(classId, 10) : null;

    if (!numUserId || !numClassId) {
        return res.status(400).json({ error: 'userId and classId query parameters are required.' });
    }

    try {
        // Lấy user role bằng Sequelize model
        const user = await User.findByPk(numUserId, { attributes: ['role'] });
        if (!user) {
            return res.status(404).json({ error: `User with ID ${numUserId} not found.` });
        }
        const userRole = user.role;

        // Gọi service đã được viết lại bằng Sequelize
        const groupsData = await memberService.getGroups(numUserId, numClassId, userRole); // Đảm bảo hàm này đã được cập nhật
        res.json({ role: userRole, groups: groupsData });
    } catch (error) {
        console.error(`Error in GET /api/groups (userId: ${numUserId}, classId: ${numClassId}):`, error);
        res.status(500).json({ error: error.message || 'Internal server error while fetching groups.' });
    }
}

// Hàm này thay thế logic trong GET /:groupId của routes
async function getGroupDetails(req, res) {
    const { groupId } = req.params;
    try {
        // Gọi service đã được viết lại bằng Sequelize
        const data = await memberService.getMembersByGroupId(groupId); // Đảm bảo hàm này đã được cập nhật
        res.json(data);
    } catch (error) {
        console.error(`Error in GET /api/groups/${groupId}:`, error);
        if (error.message.includes('not found')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error while fetching group details.' });
        }
    }
}

// Hàm này thay thế logic trong GET /:groupId/peer-assessments
async function getGroupPeerAssessments(req, res) {
    const { groupId } = req.params;
    try {
        // Gọi service đã được viết lại bằng Sequelize
        const peerAssessments = await memberService.getPeerAssessments(groupId); // Đảm bảo hàm này đã được cập nhật
        res.json(peerAssessments);
    } catch (error) {
        console.error(`Error in GET /api/groups/${groupId}/peer-assessments:`, error);
        if (error.message.includes('not found')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error while fetching peer assessments.' });
        }
    }
}

// Hàm này thay thế logic trong GET /:groupId/task-summary
// Logic này phức tạp, nên được đưa vào một service, ví dụ taskService.getTaskSummaryForGroup
// Tạm thời, chúng ta sẽ viết lại nó ở đây bằng Sequelize models
async function getGroupTaskSummary(req, res) {
    const { groupId } = req.params;
    const { sprintId } = req.query; // sprintId có thể là 'all' hoặc một ID cụ thể

    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required.' });
    }

    try {
        const groupProject = await Project.findOne({
            where: { group_id: groupId },
            attributes: ['project_id']
        });

        if (!groupProject) {
            return res.status(404).json({ error: `Project not found for group ${groupId}` });
        }
        const projectId = groupProject.project_id;

        // Lấy danh sách sprints cho dropdown
        const sprintOptionsResult = await Sprint.findAll({
            where: { project_id: projectId },
            attributes: ['sprint_id', 'sprint_number', 'sprint_name'],
            order: [['sprint_number', 'ASC']],
            raw: true
        });

        // Xây dựng điều kiện cho tasks
        let taskWhereClause = { '$sprint.project_id$': projectId }; // Tham chiếu project_id qua association 'sprint'
        if (sprintId && sprintId !== 'all') {
            taskWhereClause.sprint_id = sprintId;
        }

        const tasks = await Task.findAll({
            where: taskWhereClause,
            include: [{
                model: Sprint,
                as: 'sprint', // Quan trọng: phải có alias nếu đã định nghĩa trong association
                attributes: [] // Không cần lấy cột từ Sprint ở đây
            }],
            attributes: [
                'status', 'due_date', 'completed_at',
                [sequelize.fn('COUNT', sequelize.col('Tasks.task_id')), 'count'] // Đảm bảo Task.task_id
            ],
            group: [
                sequelize.col('Tasks.status'),
                sequelize.col('Tasks.due_date'),
                sequelize.col('Tasks.completed_at')
            ], // Đảm bảo Task.status, ...
            raw: true
        });

        let completed = 0, inProgress = 0, toDo = 0, lateCompleted = 0, overdueIncomplete = 0;
        const now = new Date();

        tasks.forEach(task => {
            const count = parseInt(task.count, 10); // count trả về từ DB có thể là string
            const dueDate = task.due_date ? new Date(task.due_date) : null;
            const completedAt = task.completed_at ? new Date(task.completed_at) : null;

            if (task.status === 'Completed') {
                if (completedAt && dueDate && completedAt > dueDate) lateCompleted += count;
                else completed += count;
            } else if (task.status === 'In-Progress') {
                if (dueDate && dueDate < now) overdueIncomplete += count;
                else inProgress += count;
            } else if (task.status === 'To-Do') {
                if (dueDate && dueDate < now) overdueIncomplete += count;
                else toDo += count;
            }
        });

        res.json({
            sprintOptions: sprintOptionsResult.map(s => ({ id: s.sprint_id, name: `Sprint ${s.sprint_number}${s.sprint_name ? ` - ${s.sprint_name}` : ''}` })),
            summary: { completed, inProgress, toDo, lateCompleted, overdueIncomplete }
        });

    } catch (error) {
        console.error(`Error in GET /api/groups/${groupId}/task-summary:`, error);
        if (error.sql) {
            console.error("Failed SQL:", error.sql);
        }
        res.status(500).json({ error: 'Internal server error while fetching task summary.' });
    }
}


// Hàm này thay thế logic trong GET /:groupId/sprints
async function getGroupSprints(req, res) {
    const { groupId } = req.params;
    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required.' });
    }
    try {
        // Gọi service đã được viết lại bằng Sequelize
        const sprints = await memberService.getSprintsByGroupId(groupId); // Đảm bảo hàm này đã được cập nhật
        res.json(sprints);
    } catch (error) {
        console.error(`Error in GET /api/groups/${groupId}/sprints:`, error);
        res.status(500).json({ error: 'Could not fetch sprints for the group.' });
    }
}

// Hàm này thay thế logic trong GET /:groupId/stats
async function getGroupStats(req, res) {
    const { groupId } = req.params;
    const { sprintId } = req.query;

    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required.' });
    }
    try {
        // Gọi service đã được viết lại bằng Sequelize
        const stats = await memberService.getProjectStats(groupId, sprintId); // Đảm bảo hàm này đã được cập nhật
        res.json(stats);
    } catch (error) {
        console.error(`Error in GET /api/groups/${groupId}/stats:`, error);
        res.status(500).json({ error: 'Could not fetch project statistics.' });
    }
}

module.exports = {
    listGroups,
    getGroupDetails,
    getGroupPeerAssessments,
    getGroupTaskSummary,
    getGroupSprints,
    getGroupStats,
};