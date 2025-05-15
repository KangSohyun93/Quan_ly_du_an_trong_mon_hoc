import express from 'express';
import { getGroups, getMembersByGroupId } from '../services/memberService.js';

const router = express.Router();

// API endpoint để lấy danh sách nhóm
router.get('/', async (req, res) => {
    try {
        const groups = await getGroups();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
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

export default router;