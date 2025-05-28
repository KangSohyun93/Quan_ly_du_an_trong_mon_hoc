const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const projectController = require('../controllers/projectController');
const peerAssessmentController = require('../controllers/peerAssessmentController');
const instructorGroupController = require('../controllers/instructorGroupController');
const verifyToken = require('../middleware/verify-token');

router.get('/', verifyToken, groupController.getGroups);
router.get('/:id', verifyToken, groupController.group_introduce);
router.get('/instructor', verifyToken, instructorGroupController.getGroupsByInstructorId);
router.get('/by-class', verifyToken, projectController.getProjectByClassId);
router.get('/projects/:projectId', verifyToken, projectController.getProject);
router.get('/sprints/:sprintId/tasks', verifyToken, projectController.getTasks);
router.get('/projects/:projectId/members', verifyToken, peerAssessmentController.getGroupMembers);
router.get('/projects/:projectId/assessments/:assessorId', verifyToken, peerAssessmentController.getPeerAssessments);
router.post('/projects/:projectId/assessments', verifyToken, peerAssessmentController.saveAssessment);
router.get('/projects/:projectId/task-stats', verifyToken, peerAssessmentController.getTaskStats);
router.get('/projects/:projectId/member-task-stats', verifyToken, peerAssessmentController.getMemberTaskStats);

module.exports = router;