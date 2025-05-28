const express = require('express');
const router = express.Router();
const instructorGroupController = require('../controllers/instructorGroupController');
const verifyToken = require('../middleware/verify-token');

router.get('/', verifyToken, instructorGroupController.getGroupsByInstructorId);
router.get('/classes/:classId', verifyToken, instructorGroupController.getGroupsByClassId);
router.get('/classes/:classId/members', verifyToken, instructorGroupController.getMembersByClassId);

module.exports = router;