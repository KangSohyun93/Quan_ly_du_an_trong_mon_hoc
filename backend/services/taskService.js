const { Task, Sprint, sequelize } = require('../models'); // sequelize có thể cần cho các hàm tổng hợp
const { Op } = Sequelize = require('sequelize'); // Op từ class Sequelize

async function getTasksByProjectId(projectId) {
    try {
        return await Task.findAll({
            include: [{
                model: Sprint,
                as: 'sprint',
                where: { project_id: projectId },
                attributes: ['sprint_id', 'sprint_number'],
                required: true
            }],
            // raw: true, // Trả về plain objects nếu service gọi không cần instance
            // nest: true
        });
    } catch (error) {
        console.error(`[TaskService] Error fetching tasks for project ${projectId}:`, error);
        throw new Error(`Could not fetch tasks for project ${projectId}`);
    }
}

// Hàm tính toán thống kê task (thay thế logic trong getProjectOverallStats)
async function getTaskStatsForProject(projectId, sprintIdForFilter = null) {
    try {
        const totalProjectTasks = await Task.count({
            include: [{ model: Sprint, as: 'sprint', where: { project_id: projectId }, attributes: [] }]
        });

        let whereTasks = {};
        if (sprintIdForFilter) {
            whereTasks.sprint_id = sprintIdForFilter;
        }
        // Nếu không có sprintIdForFilter, sẽ lấy tất cả task của project để tính completed/late

        const tasksToAnalyze = await Task.findAll({
            include: [{ model: Sprint, as: 'sprint', where: { project_id: projectId }, attributes: [] }],
            where: whereTasks,
            attributes: ['status', 'due_date', 'completed_at']
        });

        let tasksCompleted = 0;
        let tasksLate = 0;
        const now = new Date();
        tasksToAnalyze.forEach(task => {
            if (task.status === 'Completed') {
                tasksCompleted++;
                if (task.completed_at && task.due_date && new Date(task.completed_at) > new Date(task.due_date)) {
                    tasksLate++;
                }
            } else if (task.due_date && new Date(task.due_date) < now && task.status !== 'Completed') {
                tasksLate++;
            }
        });

        const selectedSprintTasks = sprintIdForFilter
            ? await Task.count({ where: { sprint_id: sprintIdForFilter } })
            : totalProjectTasks;

        return {
            totalProjectTasks,
            selectedSprintTasks,
            tasksCompleted,
            tasksLate
        };
    } catch (error) {
        console.error(`[TaskService] Error fetching task stats for project ${projectId}:`, error);
        throw new Error(`Could not fetch task stats for project ${projectId}`);
    }
}

// (Có thể thêm hàm getSprintTaskDataForGroup để thay thế query rå trong getGroupMembersWithTaskDetails)

module.exports = {
    getTasksByProjectId,
    getTaskStatsForProject,
};