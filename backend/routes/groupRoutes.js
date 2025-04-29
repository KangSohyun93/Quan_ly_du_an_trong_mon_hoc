/* backend/routes/groupRoutes.js */
const express = require('express');
const router = express.Router();
const { getGroups } = require('../controllers/groupController');
const { getProject, getTasks } = require('../controllers/projectController');

// Route để lấy danh sách nhóm
router.get('/', getGroups);

// Route để lấy thông tin dự án
router.get('/projects/:projectId', getProject);

// Route để lấy danh sách task
router.get('/tasks', getTasks);

module.exports = router;