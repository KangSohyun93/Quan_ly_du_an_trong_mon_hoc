// import express from 'express';
// import { getCommits } from '../models/contributionModel.js'; // Đảm bảo model được import đúng

// const router = express.Router();

// router.get('/:projectId/commits', async (req, res) => {
//     const projectId = req.params.projectId;
//     console.log(`[Route] GET /api/projects/${projectId}/commits request received`); // LOG C1
//     try {
//         const commits = await getCommits(projectId);
//         console.log(`[Route] Commits retrieved from DB for projectId ${projectId}:`, commits.length); // LOG C2
//         res.json(commits);
//     } catch (error) {
//         console.error(`[Route] Error in GET /api/projects/${projectId}/commits:`, error); // LOG C3
//         res.status(500).json({ error: 'Không thể lấy commit' });
//     }
// });

// export default router;

// backend/routes/commits.js
import express from 'express';
import { getCommits } from '../models/contributionModel.js';
import { fetchAndStoreCommits } from '../services/contributionService.js';
import pool from '../db.js'; // Import pool để query Projects

const router = express.Router();

router.get('/:projectId/commits', async (req, res) => {
    const projectId = req.params.projectId;
    console.log(`[Route] GET /api/projects/${projectId}/commits request received`);
    try {
        const commits = await getCommits(projectId); // Lấy tất cả commits

        // Lấy thông tin ngày bắt đầu và kết thúc dự án
        const [projectDetails] = await pool.query(
            'SELECT created_at AS project_start_date, end_date AS project_end_date FROM Projects WHERE project_id = ?',
            [projectId]
        );

        let projectStartDate = null;
        let projectEndDate = null;

        if (projectDetails.length > 0) {
            projectStartDate = projectDetails[0].project_start_date;
            projectEndDate = projectDetails[0].project_end_date;
        }

        console.log(`[Route] Commits for projectId ${projectId}: ${commits.length}, Start: ${projectStartDate}, End: ${projectEndDate}`);
        res.json({
            commits,
            projectStartDate,
            projectEndDate
        });
    } catch (error) {
        console.error(`[Route] Error in GET /api/projects/${projectId}/commits:`, error);
        res.status(500).json({ error: 'Could not get commits' });
    }
});

// Endpoint POST /:projectId/commits/refresh không thay đổi
router.post('/:projectId/commits/refresh', async (req, res) => {
    // ... (như cũ)
    const projectId = req.params.projectId;
    console.log(`[Route] POST /api/projects/${projectId}/commits/refresh request received`);
    try {
        const fetchedCommits = await fetchAndStoreCommits(projectId);
        if (fetchedCommits) {
            res.json({ message: `Successfully refreshed and processed ${fetchedCommits.length} commits from GitHub for project ${projectId}.`, count: fetchedCommits.length });
        } else {
            res.status(500).json({ error: `Failed to refresh commits for project ${projectId}. Check server logs.` });
        }
    } catch (error) {
        console.error(`[Route] Error in POST /api/projects/${projectId}/commits/refresh:`, error);
        res.status(500).json({ error: 'Failed to refresh commits from GitHub.' });
    }
});

export default router;