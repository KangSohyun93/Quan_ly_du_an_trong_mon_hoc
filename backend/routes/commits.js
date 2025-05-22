import express from 'express';
import { getCommits } from '../models/contributionModel.js'; // Đảm bảo model được import đúng

const router = express.Router();

router.get('/:projectId/commits', async (req, res) => {
    const projectId = req.params.projectId;
    console.log(`[Route] GET /api/projects/${projectId}/commits request received`); // LOG C1
    try {
        const commits = await getCommits(projectId);
        console.log(`[Route] Commits retrieved from DB for projectId ${projectId}:`, commits.length); // LOG C2
        res.json(commits);
    } catch (error) {
        console.error(`[Route] Error in GET /api/projects/${projectId}/commits:`, error); // LOG C3
        res.status(500).json({ error: 'Không thể lấy commit' });
    }
});

export default router;
