import express from 'express';
import { getGroups, getMembersByGroupId, getPeerAssessments } from '../services/memberService.js';
import pool from '../db.js'; // Import database pool

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

export default router;