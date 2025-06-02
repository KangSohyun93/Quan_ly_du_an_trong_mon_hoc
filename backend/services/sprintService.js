const { Sprint } = require('../models'); // Sprint model giờ được lấy từ models/index.js
const { Op, Sequelize } = require('sequelize'); // Sequelize (class) để lấy Op

/**
 * Lấy tất cả các sprint của một project.
 * @param {number} projectId - ID của project.
 * @returns {Promise<Array<Object>>} - Mảng các sprint instances hoặc plain objects.
 */
async function getSprintsByProjectId(projectId) {
    if (!projectId) {
        throw new Error('Project ID is required to fetch sprints.');
    }
    try {
        const sprints = await Sprint.findAll({
            where: { project_id: projectId },
            attributes: ['sprint_id', 'sprint_number', 'sprint_name', 'start_date', 'end_date', 'created_at'],
            order: [['sprint_number', 'ASC']],
            // raw: true, // Tùy chọn: trả về plain objects
        });
        return sprints;
    } catch (error) {
        console.error(`[SprintService] Error fetching sprints for project ${projectId}:`, error);
        throw new Error(`Could not fetch sprints for project ${projectId}.`);
    }
}

/**
 * Xác định sprint_id mục tiêu dựa trên filter (current, all, hoặc id cụ thể).
 * @param {number} projectId - ID của project.
 * @param {string|number|null} sprintIdFilter - 'current', 'all', hoặc một sprint_id.
 * @returns {Promise<number|null>} - sprint_id tìm được, hoặc null.
 */
async function getTargetSprintIdForFilter(projectId, sprintIdFilter) {
    if (!projectId) {
        throw new Error('Project ID is required to determine target sprint.');
    }
    let targetSprintId = null;

    if (sprintIdFilter && sprintIdFilter !== 'all') {
        if (sprintIdFilter === 'current') {
            const currentSprint = await Sprint.findOne({
                where: {
                    project_id: projectId,
                    end_date: { [Op.gte]: new Date() }
                },
                order: [['end_date', 'ASC']],
                limit: 1,
                attributes: ['sprint_id']
            });

            if (currentSprint) {
                targetSprintId = currentSprint.sprint_id;
            } else {
                const lastSprint = await Sprint.findOne({
                    where: { project_id: projectId },
                    order: [['sprint_number', 'DESC']],
                    limit: 1,
                    attributes: ['sprint_id']
                });
                if (lastSprint) {
                    targetSprintId = lastSprint.sprint_id;
                }
            }
        } else {
            const parsedId = parseInt(sprintIdFilter, 10);
            if (!isNaN(parsedId)) {
                targetSprintId = parsedId;
            }
        }
    }
    return targetSprintId;
}

/**
 * Tạo một sprint mới cho project.
 * sprint_number sẽ được tự động gán bởi trigger trong DB.
 * @param {number} projectId - ID của project.
 * @param {Object} sprintData - Dữ liệu của sprint (sprint_name, start_date, end_date).
 * @returns {Promise<Object>} - Sprint instance vừa được tạo.
 */
async function createSprintForProject(projectId, sprintData) {
    if (!projectId) {
        throw new Error('Project ID is required to create a sprint.');
    }
    // Có thể thêm kiểm tra cho sprintData ở đây
    // if (!sprintData || !sprintData.sprint_name) {
    //     throw new Error('Sprint name is required.');
    // }

    try {
        const newSprint = await Sprint.create({
            project_id: projectId,
            sprint_name: sprintData.sprint_name || null, // Cho phép null nếu không có tên
            start_date: sprintData.start_date || null,
            end_date: sprintData.end_date || null,
            // sprint_number không cần truyền vì DB trigger sẽ xử lý
        });
        return newSprint;
    } catch (error) {
        console.error(`[SprintService] Error creating sprint for project ${projectId}:`, error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Lỗi này có thể xảy ra nếu trigger gán sprint_number bị trùng
            throw new Error('A sprint with this number might already exist for the project, or DB trigger issue.');
        }
        throw new Error(`Could not create sprint for project ${projectId}.`);
    }
}

module.exports = {
    getSprintsByProjectId,
    getTargetSprintIdForFilter,
    createSprintForProject,
};