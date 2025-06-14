const request = require('supertest');
const express = require('express');
const { Op } = require('sequelize');
const assessmentController = require('./assessmentController');
const {
  GroupMember,
  User,
  PeerAssessment,
  Task,
  Sprint,
  Project,
  Group,
  Class,
  InstructorEvaluation,
} = require('../models');

// Initialize Express app for testing
const app = express();
app.use(express.json());

// Mock middleware for authentication
const mockVerifyToken = (req, res, next) => {
  req.user = { id: 1 }; // Mock instructor_id for saveInstructorEvaluation and updateInstructorEvaluation
  req.userId = 1; // For consistency with other controllers
  next();
};

// Define routes for testing
app.get('/peer-assessments/:projectId/:groupId/:assessorId', mockVerifyToken, assessmentController.getPeerAssessments);
app.post('/assessments/:projectId/:groupId', mockVerifyToken, assessmentController.saveAssessment);
app.get('/task-stats/:projectId', mockVerifyToken, assessmentController.getTaskStats);
app.get('/member-task-stats/:projectId/:groupId', mockVerifyToken, assessmentController.getMemberTaskStats);
app.put('/assessments/:projectId/:groupId/:assessmentId', mockVerifyToken, assessmentController.updateAssessment);
app.get('/instructor-evaluations/:projectId/:groupId', mockVerifyToken, assessmentController.getInstructorEvaluations);
app.post('/instructor-evaluations/:projectId/:groupId', mockVerifyToken, assessmentController.saveInstructorEvaluation);
app.put('/instructor-evaluations/:projectId/:groupId/:evaluationId', mockVerifyToken, assessmentController.updateInstructorEvaluation);

// Mock Sequelize models
jest.mock('./mocks/models-index', () => ({
  GroupMember: { findOne: jest.fn(), findAll: jest.fn() },
  User: { findOne: jest.fn() },
  PeerAssessment: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
  Task: { findAll: jest.fn() },
  Sprint: { findAll: jest.fn() },
  Project: { findOne: jest.fn() },
  Group: { findOne: jest.fn() },
  Class: {},
  InstructorEvaluation: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
  Op: require('sequelize').Op,
}));

describe('Assessment Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /peer-assessments/:projectId/:groupId/:assessorId', () => {
    it('should fetch peer assessments successfully', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      GroupMember.findOne.mockResolvedValue({ group_id: 1, user_id: 1 });
      const mockAssessments = [{ assessment_id: 1, assessee: { username: 'user1' } }];
      PeerAssessment.findAll.mockResolvedValue(mockAssessments);

      const response = await request(app).get('/peer-assessments/1/1/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAssessments);
      expect(PeerAssessment.findAll).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should return 400 if invalid IDs', async () => {
      const response = await request(app).get('/peer-assessments/invalid/1/1');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('projectId, groupId và assessorId phải là số nguyên dương');
    });

    it('should return 404 if project not found', async () => {
      Project.findOne.mockResolvedValue(null);
      const response = await request(app).get('/peer-assessments/1/1/1');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Dự án không tồn tại');
    });

    it('should return 403 if assessor not in group', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      GroupMember.findOne.mockResolvedValue(null);
      const response = await request(app).get('/peer-assessments/1/1/1');
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Người dùng không thuộc nhóm này');
    });
  });

  describe('POST /assessments/:projectId/:groupId', () => {
    it('should save peer assessment successfully', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      GroupMember.findOne.mockImplementation((query) => Promise.resolve({ group_id: 1, user_id: query.where.user_id }));
      PeerAssessment.findOne.mockResolvedValue(null);
      PeerAssessment.create.mockResolvedValue({ assessment_id: 1 });

      const response = await request(app)
        .post('/assessments/1/1')
        .send({
          assessor_id: 1,
          assessee_id: 2,
          deadline_score: 4,
          friendly_score: 3,
          quality_score: 5,
          team_support_score: 2,
          responsibility_score: 4,
          note: 'Good work',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Đánh giá đã được lưu');
      expect(PeerAssessment.create).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should return 400 if invalid scores', async () => {
      const response = await request(app)
        .post('/assessments/1/1')
        .send({
          assessor_id: 1,
          assessee_id: 2,
          deadline_score: 6, // Invalid score
          friendly_score: 3,
          quality_score: 5,
          team_support_score: 2,
          responsibility_score: 4,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Dữ liệu không hợp lệ: Điểm số phải là số nguyên từ 0 đến 5.');
    });

    it('should return 400 if assessor and assessee are the same', async () => {
      const response = await request(app)
        .post('/assessments/1/1')
        .send({
          assessor_id: 1,
          assessee_id: 1,
          deadline_score: 4,
          friendly_score: 3,
          quality_score: 5,
          team_support_score: 2,
          responsibility_score: 4,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Không thể tự đánh giá bản thân');
    });
  });

  describe('GET /task-stats/:projectId', () => {
    it('should fetch task stats successfully', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1 });
      const mockTasks = [
        { status: 'To-Do' },
        { status: 'In-Progress' },
        { status: 'Completed' },
      ];
      Task.findAll.mockResolvedValue(mockTasks);

      const response = await request(app).get('/task-stats/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ total: 3, toDo: 1, inProgress: 1, done: 1 });
    });

    it('should return 400 if invalid projectId', async () => {
      const response = await request(app).get('/task-stats/invalid');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('projectId phải là số nguyên dương');
    });
  });

  describe('GET /member-task-stats/:projectId/:groupId', () => {
    it('should fetch member task stats successfully', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      GroupMember.findAll.mockResolvedValue([{ User: { user_id: 1 } }]);
      Sprint.findAll.mockResolvedValue([{ sprint_id: 1 }]);
      Task.findAll.mockResolvedValue([{ assigned_to: 1, status: 'To-Do', due_date: '2023-01-01' }]);

      const response = await request(app).get('/member-task-stats/1/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, total: 1, toDo: 1, inProgress: 0, done: 0, delayed: 1 }]);
    });

    it('should return 404 if project not found', async () => {
      Project.findOne.mockResolvedValue(null);
      const response = await request(app).get('/member-task-stats/1/1');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Dự án không tồn tại');
    });
  });

  describe('PUT /assessments/:projectId/:groupId/:assessmentId', () => {
    it('should update peer assessment successfully', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      GroupMember.findOne.mockImplementation((query) => Promise.resolve({ group_id: 1, user_id: query.where.user_id }));
      PeerAssessment.findOne.mockResolvedValue({ update: jest.fn().mockResolvedValue(true) });

      const response = await request(app)
        .put('/assessments/1/1/1')
        .send({
          assessor_id: 1,
          assessee_id: 2,
          deadline_score: 4,
          friendly_score: 3,
          quality_score: 5,
          team_support_score: 2,
          responsibility_score: 4,
          note: 'Updated note',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Đánh giá đã được cập nhật');
    });

    it('should return 404 if assessment not found', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      GroupMember.findOne.mockImplementation((query) => Promise.resolve({ group_id: 1, user_id: query.where.user_id }));
      PeerAssessment.findOne.mockResolvedValue(null);

      const response = await request(app)
        .put('/assessments/1/1/1')
        .send({
          assessor_id: 1,
          assessee_id: 2,
          deadline_score: 4,
          friendly_score: 3,
          quality_score: 5,
          team_support_score: 2,
          responsibility_score: 4,
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Đánh giá không tồn tại hoặc bạn không có quyền chỉnh sửa');
    });
  });

  describe('GET /instructor-evaluations/:projectId/:groupId', () => {
    it('should fetch instructor evaluations successfully', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      const mockEvaluations = [{ evaluation_id: 1, user: { user_id: 1, username: 'user1' } }];
      InstructorEvaluation.findAll.mockResolvedValue(mockEvaluations);

      const response = await request(app).get('/instructor-evaluations/1/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvaluations);
    });

    it('should return 400 if invalid IDs', async () => {
      const response = await request(app).get('/instructor-evaluations/invalid/1');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('projectId và groupId phải là số nguyên dương');
    });
  });

  describe('POST /instructor-evaluations/:projectId/:groupId', () => {
    it('should save instructor evaluation successfully', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      Group.findOne.mockResolvedValue({ group_id: 1, Class: { instructor_id: 1 } });
      GroupMember.findOne.mockResolvedValue({ group_id: 1, user_id: 2 });
      InstructorEvaluation.create.mockResolvedValue({ evaluation_id: 1 });

      const response = await request(app)
        .post('/instructor-evaluations/1/1')
        .send({ user_id: 2, score: 85, comments: 'Good performance' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Đánh giá đã được lưu');
      expect(InstructorEvaluation.create).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should return 403 if user is not instructor', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      Group.findOne.mockResolvedValue({ group_id: 1, Class: { instructor_id: 2 } });

      const response = await request(app)
        .post('/instructor-evaluations/1/1')
        .send({ user_id: 2, score: 85 });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Không có quyền. Bạn không phải là giảng viên của lớp này.');
    });
  });

  describe('PUT /instructor-evaluations/:projectId/:groupId/:evaluationId', () => {
    it('should update instructor evaluation successfully', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      Group.findOne.mockResolvedValue({ group_id: 1, Class: { instructor_id: 1 } });
      InstructorEvaluation.findOne.mockResolvedValue({ update: jest.fn().mockResolvedValue(true) });

      const response = await request(app)
        .put('/instructor-evaluations/1/1/1')
        .send({ score: 90, comments: 'Updated performance' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Đánh giá đã được cập nhật');
    });

    it('should return 404 if evaluation not found', async () => {
      Project.findOne.mockResolvedValue({ project_id: 1, group_id: 1 });
      Group.findOne.mockResolvedValue({ group_id: 1, Class: { instructor_id: 1 } });
      InstructorEvaluation.findOne.mockResolvedValue(null);

      const response = await request(app)
        .put('/instructor-evaluations/1/1/1')
        .send({ score: 90 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Đánh giá không tồn tại hoặc bạn không có quyền chỉnh sửa cho đánh giá này.');
    });
  });
});