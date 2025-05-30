import express from 'express';
import { getGroups, getMembersByGroupId, getPeerAssessments, getSprintsByGroupId, getProjectStats } from '../services/memberService.js';
import pool from '../db.js'; 

const router = express.Router();

// API endpoint để lấy danh sách nhóm (modified)
router.get('/', async (req, res) => {
    const { userId, classId } = req.query;

    // Validate and parse query parameters
    const numUserId = userId ? parseInt(userId, 10) : null;
    const numClassId = classId ? parseInt(classId, 10) : null;

    if (!numUserId || !numClassId) {
        return res.status(400).json({ error: 'userId and classId query parameters are required.' });
    }

    try {
        // Fetch user role
        const [users] = await pool.query('SELECT role FROM Users WHERE user_id = ?', [numUserId]);
        if (users.length === 0) {
            return res.status(404).json({ error: `User with ID ${numUserId} not found.` });
        }
        const userRole = users[0].role;

        // Get groups based on user, class, and role
        const groupsData = await getGroups(numUserId, numClassId, userRole);

        // Return role and groups
        res.json({ role: userRole, groups: groupsData });

    } catch (error) {
        // Log the detailed error on the server
        console.error(`Error in GET /api/groups (userId: ${numUserId}, classId: ${numClassId}):`, error);
        // Send a generic error message to the client
        res.status(500).json({ error: error.message || 'Internal server error while fetching groups.' });
    }
});

// API endpoint để lấy dữ liệu members và sprintData
router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        const data = await getMembersByGroupId(groupId);
        res.json(data);
    } catch (error) {
        if (error.message.includes('not found')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// API endpoint để lấy dữ liệu đánh giá ngang hàng
router.get('/:groupId/peer-assessments', async (req, res) => {
    const { groupId } = req.params;
    try {
        const peerAssessments = await getPeerAssessments(groupId);
        res.json(peerAssessments);
    } catch (error) {
        if (error.message.includes('not found')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// API Endpoint để lấy dữ liệu tóm tắt nhiệm vụ cho TaskChart
router.get('/:groupId/task-summary', async (req, res) => {
    const { groupId } = req.params;
    const { sprintId } = req.query; // sprintId có thể là 'all' hoặc một ID cụ thể

    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required.' });
    }

    try {
        const connection = await pool.getConnection();

        // 1. Lấy project_id từ group_id
        const [projectRows] = await connection.query(
            'SELECT project_id FROM Projects WHERE group_id = ?',
            [groupId]
        );

        if (projectRows.length === 0) {
            connection.release();
            return res.status(404).json({ error: `Project not found for group ${groupId}` });
        }
        const projectId = projectRows[0].project_id;

        // 2. Lấy danh sách tất cả các sprint của dự án để tạo select options
        const [sprints] = await connection.query(
            'SELECT sprint_id, sprint_number, sprint_name FROM Sprints WHERE project_id = ? ORDER BY sprint_number',
            [projectId]
        );

        // 3. Xây dựng query để lấy dữ liệu tasks
        let tasksQuery = `
            SELECT 
                t.status, 
                t.due_date, 
                t.completed_at,
                COUNT(t.task_id) AS count
            FROM Tasks t
            JOIN Sprints s ON t.sprint_id = s.sprint_id
            WHERE s.project_id = ?
        `;
        const queryParams = [projectId];

        if (sprintId && sprintId !== 'all') {
            tasksQuery += ' AND t.sprint_id = ?';
            queryParams.push(sprintId);
        }
        tasksQuery += ' GROUP BY t.status, t.due_date, t.completed_at';

        const [tasks] = await connection.query(tasksQuery, queryParams);
        connection.release();

        // 4. Xử lý dữ liệu tasks để tổng hợp
        let completed = 0;
        let inProgress = 0;
        let toDo = 0;
        let lateCompleted = 0; // Hoàn thành trễ hạn
        let overdueIncomplete = 0; // Quá hạn nhưng chưa hoàn thành

        const now = new Date();

        tasks.forEach(task => {
            const dueDate = task.due_date ? new Date(task.due_date) : null;
            const completedAt = task.completed_at ? new Date(task.completed_at) : null;

            if (task.status === 'Completed') {
                if (completedAt && dueDate && completedAt > dueDate) {
                    lateCompleted += task.count;
                } else {
                    completed += task.count;
                }
            } else if (task.status === 'In-Progress') {
                if (dueDate && dueDate < now) { // Quá hạn nhưng vẫn đang làm -> coi như OverdueIncomplete
                    overdueIncomplete += task.count;
                } else {
                    inProgress += task.count;
                }
            } else if (task.status === 'To-Do') {
                if (dueDate && dueDate < now) { // Quá hạn nhưng vẫn To-Do -> coi như OverdueIncomplete
                    overdueIncomplete += task.count;
                } else {
                    toDo += task.count;
                }
            }
        });

        res.json({
            sprintOptions: sprints.map(s => ({ id: s.sprint_id, name: `Sprint ${s.sprint_number}${s.sprint_name ? ` - ${s.sprint_name}` : ''}` })),
            summary: {
                completed,
                inProgress,
                toDo,
                lateCompleted,
                overdueIncomplete,
            }
        });

    } catch (error) {
        console.error(`Error in GET /api/groups/${groupId}/task-summary:`, error);
        res.status(500).json({ error: 'Internal server error while fetching task summary.' });
    }
});

// API Lấy danh sách Sprints cho một Group (thông qua Project)
router.get('/:groupId/sprints', async (req, res) => {
    const { groupId } = req.params;
    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required.' });
    }
    try {
        const sprints = await getSprintsByGroupId(groupId);
        res.json(sprints);
    } catch (error) {
        console.error(`Error in GET /api/groups/${groupId}/sprints:`, error);
        res.status(500).json({ error: 'Could not fetch sprints for the group.' });
    }
});

// API Lấy dữ liệu thống kê cho StatCards
router.get('/:groupId/stats', async (req, res) => {
    const { groupId } = req.params;
    const { sprintId } = req.query; // sprintId có thể là 'current', 'all', hoặc một ID cụ thể

    if (!groupId) {
        return res.status(400).json({ error: 'Group ID is required.' });
    }
    try {
        const stats = await getProjectStats(groupId, sprintId);
        res.json(stats);
    } catch (error) {
        console.error(`Error in GET /api/groups/${groupId}/stats:`, error);
        res.status(500).json({ error: 'Could not fetch project statistics.' });
    }
});

export default router;