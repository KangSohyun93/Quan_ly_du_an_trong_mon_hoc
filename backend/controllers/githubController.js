// backend/controllers/commitController.js
const contributionService = require('../services/contributionService');
const githubService = require('../services/githubService');
const projectService = require('../services/projectService');

async function getProjectCommits(req, res) {
    const projectId = req.params.projectId;
    console.log(`[Controller] GET /api/projects/${projectId}/commits request received for processing`);
    try {
        // Sử dụng Promise.all để gọi song song nếu các hàm không phụ thuộc nhau
        const [commits, projectInstance] = await Promise.all([
            contributionService.getCommits(projectId),
            projectService.getProjectById(projectId)
        ]);

        let projectStartDate = null;
        let projectEndDate = null;

        if (projectInstance) {
            // Nếu projectInstance là Sequelize instance, truy cập thuộc tính trực tiếp
            // hoặc dùng .get('column_name') / .toJSON() nếu cần plain object
            projectStartDate = projectInstance.created_at; // Hoặc projectInstance.get('created_at')
            projectEndDate = projectInstance.end_date;     // Hoặc projectInstance.get('end_date')
        } else {
            console.warn(`[Controller] Project details not found for projectId ${projectId} when fetching commits.`);
        }

        console.log(`[Controller] Commits for projectId ${projectId}: ${commits.length}, Project Start: ${projectStartDate}, Project End: ${projectEndDate}`);
        res.json({
            commits,
            projectStartDate,
            projectEndDate
        });
    } catch (error) {
        console.error(`[Controller] Error in GET /api/projects/${projectId}/commits:`, error);
        res.status(500).json({ error: 'Could not get commits. ' + error.message });
    }
}

async function getProjectLOCSummary(req, res) {
    const projectId = req.params.projectId;
    console.log(`[Controller] GET /api/projects/${projectId}/loc_summary request received for processing`);
    try {
        const [locData, projectInstance] = await Promise.all([
            contributionService.getProjectLOCData(projectId),
            projectService.getProjectById(projectId)
        ]);

        let projectStartDate = null;
        let projectEndDate = null;

        if (projectInstance) {
            projectStartDate = projectInstance.created_at;
            projectEndDate = projectInstance.end_date;
        } else {
            console.warn(`[Controller] Project details not found for projectId ${projectId} when fetching LOC summary.`);
        }

        console.log(`[Controller] LOC data for projectId ${projectId}: ${locData.length} entries, Project Start: ${projectStartDate}, Project End: ${projectEndDate}`);
        res.json({
            locData,
            projectStartDate,
            projectEndDate
        });
    } catch (error) {
        console.error(`[Controller] Error in GET /api/projects/${projectId}/loc_summary:`, error);
        res.status(500).json({ error: 'Could not get LOC data. ' + error.message });
    }
}

async function refreshProjectCommits(req, res) {
    const projectId = req.params.projectId;
    console.log(`[Controller] POST /api/projects/${projectId}/commits/refresh request received for processing`);
    try {
        // fetchAndStoreCommits trong githubService đã trả về { success, message, count, data }
        const result = await githubService.fetchAndStoreCommits(projectId); // Đảm bảo tên hàm này đúng với file githubService.js

        if (result.success) {
            res.json({ message: result.message || `Successfully refreshed and processed ${result.count} commits from GitHub for project ${projectId}.`, count: result.count });
        } else {
            // Sử dụng message từ service nếu có, hoặc một thông báo chung
            res.status(500).json({ error: result.message || `Failed to refresh commits for project ${projectId}. Check server logs.` });
        }
    } catch (error) { // Bắt các lỗi không mong muốn từ service (nếu service throw error)
        console.error(`[Controller] Unexpected error in POST /api/projects/${projectId}/commits/refresh:`, error);
        res.status(500).json({ error: 'Failed to refresh commits from GitHub due to an unexpected error.' });
    }
}

module.exports = {
    getProjectCommits,
    getProjectLOCSummary,
    refreshProjectCommits,
};