const { Project } = require('../models');

async function getProjectById(projectId) {
    try {
        // Trả về instance để có thể dùng các phương thức ORM nếu cần
        const projectInstance = await Project.findByPk(projectId);
        if (!projectInstance) {
            console.warn(`[ProjectService] Project with id ${projectId} not found.`);
            return null;
        }
        return projectInstance;
    } catch (error) {
        console.error(`[ProjectService] Error fetching project by id ${projectId}:`, error);
        throw error;
    }
}

async function getProjectByGroupId(groupId) {
    try {
        const projectInstance = await Project.findOne({
            where: { group_id: groupId },
            // attributes: ['project_id', 'project_name', /* ... */] // Chọn cột nếu cần
        });
        if (!projectInstance) {
            // console.warn(`[ProjectService] Project for group id ${groupId} not found.`);
            return null; // Hoặc throw lỗi tùy theo logic gọi
        }
        return projectInstance; // Trả về instance
    } catch (error) {
        console.error(`[ProjectService] Error fetching project by groupId ${groupId}:`, error);
        throw error;
    }
}

module.exports = { getProjectById, getProjectByGroupId };