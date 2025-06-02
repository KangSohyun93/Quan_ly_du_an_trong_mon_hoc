const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupsController'); // Import controller mới

// API endpoint để lấy danh sách nhóm
router.get('/', groupController.listGroups);

// API endpoint để lấy dữ liệu members và sprintData
router.get('/:groupId', groupController.getGroupDetails);

// API endpoint để lấy dữ liệu đánh giá ngang hàng
router.get('/:groupId/peer-assessments', groupController.getGroupPeerAssessments);

// API Endpoint để lấy dữ liệu tóm tắt nhiệm vụ cho TaskChart
router.get('/:groupId/task-summary', groupController.getGroupTaskSummary);

// API Lấy danh sách Sprints cho một Group (thông qua Project)
router.get('/:groupId/sprints', groupController.getGroupSprints);

// API Lấy dữ liệu thống kê cho StatCards
router.get('/:groupId/stats', groupController.getGroupStats);

module.exports = router;