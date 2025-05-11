const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const projectController = require('../controllers/projectController');
const peerAssessmentController = require('../controllers/peerAssessmentController');
const { getProjectByClassId } = require('../models/projectModel');
const instructorGroupController = require('../controllers/instructorGroupController');

// Route cho sinh viên
router.get('/', groupController.getGroups);

// Route cho giảng viên
router.get('/instructor', instructorGroupController.getInstructorGroups);

// Route để lấy dự án theo classId
router.get('/by-class', async (req, res) => {
  const classId = parseInt(req.query.class_id, 10);
  const userId = parseInt(req.query.user_id, 10);

  if (isNaN(classId) || classId <= 0 || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: 'classId và userId phải là số nguyên dương' });
  }

  try {
    const project = await getProjectByClassId(classId, userId);
    if (!project) {
      return res.status(404).json({ error: 'Không tìm thấy dự án cho lớp học này' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Lỗi khi lấy dự án theo classId:', error.message, error.stack);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Route để lấy dự án theo projectId
router.get('/projects/:projectId', projectController.getProject);

// Route để lấy tasks theo sprintId
router.get('/sprints/:sprintId/tasks', projectController.getTasks);

// Route để lấy danh sách thành viên theo projectId
router.get('/projects/:projectId/members', peerAssessmentController.getGroupMembers);

// Route để lấy đánh giá theo projectId và assessorId
router.get('/projects/:projectId/assessments/:assessorId', peerAssessmentController.getPeerAssessments);

// Route để lưu đánh giá
router.post('/projects/:projectId/assessments', peerAssessmentController.saveAssessment);

// Route để lấy thống kê task theo projectId
router.get('/projects/:projectId/task-stats', peerAssessmentController.getTaskStats);

// Route để lấy thống kê task của từng thành viên theo projectId
router.get('/projects/:projectId/member-task-stats', peerAssessmentController.getMemberTaskStats);

module.exports = router;