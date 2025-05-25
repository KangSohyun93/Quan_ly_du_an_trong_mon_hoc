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

router.get('/:projectId/loc_summary', async (req, res) => {
    const projectId = req.params.projectId;
    console.log(`[Route] GET /api/projects/${projectId}/loc_summary request received`);
    try {
        const locData = await getProjectLOCData(projectId);

        // Tương tự, lấy ngày bắt đầu/kết thúc dự án để frontend có thể sử dụng
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

        console.log(`[Route] LOC data for projectId ${projectId}: ${locData.length} entries, Project Start: ${projectStartDate}, End: ${projectEndDate}`);
        res.json({
            locData,
            projectStartDate,
            projectEndDate
        });
    } catch (error) {
        console.error(`[Route] Error in GET /api/projects/${projectId}/loc_summary:`, error);
        res.status(500).json({ error: 'Could not get LOC data' });
    }
});

router.post('/:projectId/commits/refresh', async (req, res) => {
    const projectId = req.params.projectId;
    console.log(`[Route] POST /api/projects/${projectId}/commits/refresh request received`);
    try {
        // fetchAndStoreCommits giờ đã lấy cả LOC added/removed
        const fetchedCommits = await fetchAndStoreCommits(projectId);
        if (fetchedCommits) {
            res.json({ message: `Successfully refreshed and processed ${fetchedCommits.length} commits (including LOC data) from GitHub for project ${projectId}.`, count: fetchedCommits.length });
        } else {
            res.status(500).json({ error: `Failed to refresh commits for project ${projectId}. Check server logs.` });
        }
    } catch (error) {
        console.error(`[Route] Error in POST /api/projects/${projectId}/commits/refresh:`, error);
        res.status(500).json({ error: 'Failed to refresh commits from GitHub.' });
    }
});

export default router;