const express = require('express');
const router = express.Router();
const instructorGroupController = require('../controllers/instructorGroupController');

// Route để lấy danh sách nhóm theo instructorId
router.get('/', instructorGroupController.getInstructorGroups);

module.exports = router;