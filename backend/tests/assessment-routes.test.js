const request = require('supertest');
const express = require('express');
const assessmentRoutes = require('./assessment-routes');
const assessmentController = require('../controllers/assessmentController');
const { Group, Project, Class, InstructorEvaluation, User, GroupMember } = require('../models');

// Initialize Express app for testing
const app = express();
app.use(express.json());
app.use('/api/assessments', assessmentRoutes);

// Mock middleware for authentication
const mockVerifyToken = (req, res, next) => {
  req.user = { id: 1, role: 'Instructor' }; // Default to Instructor role
  next();
};

// Mock assessmentController methods
jest.mock('../controllers/assessmentController', () => ({
  getPeerAssessments: jest.fn(),
  saveAssessment: jest.fn(),
  getTaskStats: jest.fn(),
  getMemberTaskStats: jest.fn(),
  updateAssessment: jest.fn(),
  saveInstructorEvaluation: jest.fn(),
  updateInstructorEvaluation: jest.fn(),
}));

// Mock Sequelize models
jest.mock('./mocks/models-index', () => ({
  Group: { findOne: jest.fn() },
  Project: { findOne: jest.fn() },
  Class: {},
  InstructorEvaluation: { findAll: jest.fn() },
  User: {},
  GroupMember: { findOne: jest.fn() },
}));

describe('Assessment Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reapply mock middleware for each test
    assessmentRoutes.stack.forEach((layer) => {
      if (layer.route && layer.route.stack.some((middleware) => middleware.name === 'verifyToken')) {
        layer.route.stack = layer.route.stack.map((middleware) =>
          middleware.name === 'verifyToken' ? mockVerifyToken : middleware
        );
      }
    });
  });

  describe('GET /api/assessments/groups/:groupId/projects/:projectId/peerassessments/:assessorId', () => {
    it('should call getPeerAssessments controller', async () => {
      assessmentController.getPeerAssessments.mockImplementation((req, res) => res.status(200).json([]));

      const response = await request(app).get('/api/assessments/groups/1/projects/1/peerassessments/1');

      expect(response.status).toBe(200);
      expect(assessmentController.getPeerAssessments).toHaveBeenCalled();
    });
  });

  describe('POST /api/assessments/groups/:groupId/projects/:projectId/peerassessments', () => {
    it('should call saveAssessment controller', async () => {
      assessmentController.saveAssessment.mockImplementation((req, res) => res.status(200).json({ message: 'Assessment saved' }));

      const response = await request(app)
        .post('/api/assessments/groups/1/projects/1/peerassessments')
        .send({ assessor_id: 1, assessee_id: 2 });

      expect(response.status).toBe(200);
      expect(assessmentController.saveAssessment).toHaveBeenCalled();
    });
  });

  describe('GET /api/assessments/groups/:groupId/projects/:projectId/task-stats', () => {
    it('should call getTaskStats controller', async () => {
      assessmentController.getTaskStats.mockImplementation((req, res) => res.status(200).json({ total: 5 }));

      const response = await request(app).get('/api/assessments/groups/1/projects/1/task-stats');

      expect(response.status).toBe(200);
      expect(assessmentController.getTaskStats).toHaveBeenCalled();
    });
  });

  describe('GET /api/assessments/groups/:groupId/projects/:projectId/member-task-stats', () => {
    it('should call getMemberTaskStats controller', async () => {
      assessmentController.getMemberTaskStats.mockImplementation((req, res) => res.status(200).json([]));

      const response = await request(app).get('/api/assessments/groups/1/projects/1/member-task-stats');

      expect(response.status).toBe(200);
      expect(assessmentController.getMemberTaskStats).toHaveBeenCalled();
    });
  });

  describe('PUT /api/assessments/groups/:groupId/projects/:projectId/peerassessments/:assessmentId', () => {
    it('should call updateAssessment controller', async () => {
      assessmentController.updateAssessment.mockImplementation((req, res) => res.status(200).json({ message: 'Assessment updated' }));

      const response = await request(app)
        .put('/api/assessments/groups/1/projects/1/peerassessments/1')
        .send({ deadline_score: 4 });

      expect(response.status).toBe(200);
      expect(assessmentController.updateAssessment).toHaveBeenCalled();
    });
  });

  describe('GET /api/assessments/groups/:groupId/projects/:projectId/instructor-evaluations', () => {
    it('should fetch evaluations for instructor role', async () => {
      Group.findOne.mockResolvedValue({ group_id: 1, Class: { instructor_id: 1 } });
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      const mockEvaluations = [{ evaluation_id: 1, user: { user_id: 2, username: 'student' } }];
      InstructorEvaluation.findAll.mockResolvedValue(mockEvaluations);

      const response = await request(app).get('/api/assessments/groups/1/projects/1/instructor-evaluations');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvaluations);
      expect(InstructorEvaluation.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { group_id: 1, instructor_id: 1 },
      }));
    });

    it('should fetch evaluations for student role', async () => {
      Group.findOne.mockResolvedValue({ group_id: 1, Class: { instructor_id: 2 } });
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      GroupMember.findOne.mockResolvedValue({ group_id: 1, user_id: 1 });
      const mockEvaluations = [{ evaluation_id: 1, user: { user_id: 1, username: 'student' } }];
      InstructorEvaluation.findAll.mockResolvedValue(mockEvaluations);

      const response = await request(app)
        .get('/api/assessments/groups/1/projects/1/instructor-evaluations')
        .set('Authorization', 'Bearer mock-token-student');

      // Mock student role
      app.use((req, res, next) => {
        req.user = { id: 1, role: 'Student' };
        next();
      });

      const responseStudent = await request(app).get('/api/assessments/groups/1/projects/1/instructor-evaluations');

      expect(responseStudent.status).toBe(200);
      expect(responseStudent.body).toEqual(mockEvaluations);
      expect(InstructorEvaluation.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { group_id: 1, user_id: 1 },
      }));
    });

    it('should return 400 for invalid IDs', async () => {
      const response = await request(app).get('/api/assessments/groups/invalid/projects/1/instructor-evaluations');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ID nhóm và dự án phải là số nguyên dương.');
    });

    it('should return 404 if group not found', async () => {
      Group.findOne.mockResolvedValue(null);
      const response = await request(app).get('/api/assessments/groups/1/projects/1/instructor-evaluations');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Không tìm thấy nhóm.');
    });

    it('should return 403 for instructor not in class', async () => {
      Group.findOne.mockResolvedValue({ group_id: 1, Class: { instructor_id: 2 } });
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      const response = await request(app).get('/api/assessments/groups/1/projects/1/instructor-evaluations');
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Không có quyền truy cập. Bạn không phải là giảng viên của lớp này.');
    });

    it('should return 403 for student not in group', async () => {
      Group.findOne.mockResolvedValue({ group_id: 1, Class: { instructor_id: 2 } });
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      GroupMember.findOne.mockResolvedValue(null);

      app.use((req, res, next) => {
        req.user = { id: 1, role: 'Student' };
        next();
      });

      const response = await request(app).get('/api/assessments/groups/1/projects/1/instructor-evaluations');
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Không có quyền truy cập. Bạn không phải là thành viên của nhóm này.');
    });

    it('should return 403 for invalid role', async () => {
      app.use((req, res, next) => {
        req.user = { id: 1, role: 'Admin' };
        next();
      });

      const response = await request(app).get('/api/assessments/groups/1/projects/1/instructor-evaluations');
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Vai trò người dùng không hợp lệ để xem đánh giá này.');
    });
  });

  describe('POST /api/assessments/groups/:groupId/projects/:projectId/instructor-evaluations', () => {
    it('should call saveInstructorEvaluation controller', async () => {
      assessmentController.saveInstructorEvaluation.mockImplementation((req, res) => res.status(201).json({ message: 'Evaluation saved' }));

      const response = await request(app)
        .post('/api/assessments/groups/1/projects/1/instructor-evaluations')
        .send({ user_id: 2, score: 85 });

      expect(response.status).toBe(201);
      expect(assessmentController.saveInstructorEvaluation).toHaveBeenCalled();
    });
  });

  describe('PUT /api/assessments/groups/:groupId/projects/:projectId/instructor-evaluations/:evaluationId', () => {
    it('should call updateInstructorEvaluation controller', async () => {
      assessmentController.updateInstructorEvaluation.mockImplementation((req, res) => res.status(200).json({ message: 'Evaluation updated' }));

      const response = await request(app)
        .put('/api/assessments/groups/1/projects/1/instructor-evaluations/1')
        .send({ score: 90 });

      expect(response.status).toBe(200);
      expect(assessmentController.updateInstructorEvaluation).toHaveBeenCalled();
    });
  });
});