const request = require('supertest');
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const xlsx = require('xlsx');
const classController = require('./classController');
const {
  Group,
  Project,
  GroupMember,
  Class,
  User,
  ClassMember,
} = require('../models');
const { Op } = require('sequelize');

// Initialize Express app for testing
const app = express();
app.use(express.json());

// Mock multer for file uploads
const upload = multer({ dest: 'uploads/' });
app.post('/classes/:id/import', mockVerifyToken, upload.single('file'), classController.importClass);
app.post('/classes/join', mockVerifyToken, classController.joinClass);
app.get('/classes/search', mockVerifyToken, classController.searchClass);
app.get('/classes', mockVerifyToken, classController.getClass);
app.get('/classes/all', mockVerifyToken, classController.getAllClass);
app.get('/classes/instructor', mockVerifyToken, classController.getClassforGV);
app.post('/classes', mockVerifyToken, classController.createClass);
app.delete('/classes/:id', mockVerifyToken, classController.deleteClass);
app.put('/classes/:id', mockVerifyToken, classController.updateClass);

// Mock middleware for authentication
const mockVerifyToken = (req, res, next) => {
  req.userId = 1;
  next();
};

// Mock Sequelize models
jest.mock('./mocks/models-index', () => ({
  Group: { findOne: jest.fn(), create: jest.fn(), save: jest.fn() },
  Project: { findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
  GroupMember: { findOne: jest.fn(), create: jest.fn() },
  Class: { findOne: jest.fn(), findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn(), destroy: jest.fn(), save: jest.fn() },
  User: { findOne: jest.fn() },
  ClassMember: { findOne: jest.fn(), create: jest.fn() },
  Op: require('sequelize').Op,
}));

// Mock fs and xlsx
jest.mock('fs', () => ({
  promises: { unlink: jest.fn() },
}));
jest.mock('xlsx', () => ({
  readFile: jest.fn(),
  utils: { sheet_to_json: jest.fn() },
}));

describe('Class Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /classes/:id/import', () => {
    it('should import class successfully', async () => {
      xlsx.readFile.mockReturnValue({ Sheets: { Sheet1: {} }, SheetNames: ['Sheet1'] });
      xlsx.utils.sheet_to_json.mockReturnValue([
        ['groupNumber', 'email', 'isLeader', 'groupName', 'projectName', 'description', 'toolsUsed', 'linkGit'],
        [1, 'test@example.com', 'yes', 'Group 1', 'Project 1', 'Desc', 'Tools', 'github.com'],
      ]);
      User.findOne.mockResolvedValue({ user_id: 1, email: 'test@example.com' });
      ClassMember.findOne.mockResolvedValue(null);
      ClassMember.create.mockResolvedValue({});
      Group.findOne.mockResolvedValue(null);
      Group.create.mockResolvedValue({ group_id: 1, save: jest.fn() });
      GroupMember.findOne.mockResolvedValue(null);
      GroupMember.create.mockResolvedValue({});
      Project.findOne.mockResolvedValue(null);
      Project.create.mockResolvedValue({});
      fs.promises.unlink.mockResolvedValue();

      const response = await request(app)
        .post('/classes/1/import')
        .attach('file', Buffer.from('fake content'), 'test.xlsx');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Import thành công');
      expect(Group.create).toHaveBeenCalled();
      expect(Project.create).toHaveBeenCalled();
    });

    it('should return 400 if no file uploaded', async () => {
      const response = await request(app).post('/classes/1/import');
      expect(response.status).toBe(400);
      expect(response.body).toBe('No file uploaded');
    });
  });

  describe('POST /classes/join', () => {
    it('should join class successfully', async () => {
      Class.findOne.mockResolvedValue({ class_id: 1, secret_code: 'ABC123' });
      ClassMember.findOne.mockResolvedValue(null);
      ClassMember.create.mockResolvedValue({});

      const response = await request(app)
        .post('/classes/join')
        .send({ code: 'ABC123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Tham gia lớp thành công');
      expect(ClassMember.create).toHaveBeenCalledWith({ class_id: 1, user_id: 1 });
    });

    it('should return 404 if class not found', async () => {
      Class.findOne.mockResolvedValue(null);
      const response = await request(app)
        .post('/classes/join')
        .send({ code: 'ABC123' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Lớp không tồn tại');
    });

    it('should return 400 if already joined', async () => {
      Class.findOne.mockResolvedValue({ class_id: 1 });
      ClassMember.findOne.mockResolvedValue({ class_id: 1, user_id: 1 });

      const response = await request(app)
        .post('/classes/join')
        .send({ code: 'ABC123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Bạn đã tham gia lớp này rồi');
    });
  });

  describe('GET /classes/search', () => {
    it('should search classes successfully', async () => {
      Class.findAll.mockResolvedValue([
        {
          class_id: 1,
          class_name: 'Test Class',
          semester: '2023',
          ClassMembers: [{ User: { user_id: 1, username: 'user1', avatar: 'avatar1' } }],
          Groups: [],
        },
      ]);

      const response = await request(app).get('/classes/search?searchText=Test');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          classId: 1,
          className: 'Test Class',
          semester: '2023',
          hasJoin: true,
        }),
      ]);
    });
  });

  describe('GET /classes', () => {
    it('should fetch user classes successfully', async () => {
      Class.findAll.mockResolvedValue([
        {
          class_id: 1,
          class_name: 'Test Class',
          semester: '2023',
          ClassMembers: [{ User: { user_id: 1, username: 'user1', avatar: 'avatar1' } }],
          Groups: [],
        },
      ]);

      const response = await request(app).get('/classes');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          classId: 1,
          className: 'Test Class',
          semester: '2023',
          hasJoin: true,
        }),
      ]);
    });
  });

  describe('GET /classes/all', () => {
    it('should fetch all classes successfully', async () => {
      Class.findAll.mockResolvedValue([
        {
          class_id: 1,
          class_name: 'Test Class',
          semester: '2023',
          created_at: new Date(),
          instructor: { user_id: 1, username: 'instructor1' },
        },
      ]);

      const response = await request(app).get('/classes/all');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          classId: 1,
          className: 'Test Class',
          semester: '2023',
          createdBy: 'instructor1',
        }),
      ]);
    });
  });

  describe('GET /classes/instructor', () => {
    it('should fetch instructor classes successfully', async () => {
      Class.findAll.mockResolvedValue([
        {
          class_id: 1,
          class_name: 'Test Class',
          semester: '2023',
          instructor_id: 1,
          ClassMembers: [{ User: { user_id: 2, username: 'user1', avatar: 'avatar1', email: 'user1@example.com' } }],
          Groups: [],
        },
      ]);

      const response = await request(app).get('/classes/instructor');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          classId: 1,
          className: 'Test Class',
          semester: '2023',
          hasJoin: true,
        }),
      ]);
    });
  });

  describe('POST /classes', () => {
    it('should create class successfully', async () => {
      Class.findOne.mockResolvedValue(null);
      Class.create.mockResolvedValue({ class_id: 1, class_name: 'New Class' });

      const response = await request(app)
        .post('/classes')
        .send({ class_id: 'CL001', class_name: 'New Class', semester: '2023', secret_code: 'ABC123' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({ class_id: 'CL001', class_name: 'New Class' }));
      expect(Class.create).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should return 400 if class already exists', async () => {
      Class.findOne.mockResolvedValue({ class_id: 'CL001' });

      const response = await request(app)
        .post('/classes')
        .send({ class_id: 'CL001', class_name: 'New Class', semester: '2023' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Lớp đã tồn tại');
    });
  });

  describe('DELETE /classes/:id', () => {
    it('should delete class successfully', async () => {
      Class.findByPk.mockResolvedValue({ destroy: jest.fn().mockResolvedValue(true) });

      const response = await request(app).delete('/classes/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Xoá lớp thành công');
    });

    it('should return 404 if class not found', async () => {
      Class.findByPk.mockResolvedValue(null);

      const response = await request(app).delete('/classes/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Lớp không tồn tại');
    });
  });

  describe('PUT /classes/:id', () => {
    it('should update class successfully', async () => {
      Class.findByPk.mockResolvedValue({
        class_id: 1,
        class_name: 'Old Class',
        semester: '2022',
        save: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app)
        .put('/classes/1')
        .send({ class_name: 'Updated Class', semester: '2023', secret_code: 'XYZ789' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ class_name: 'Updated Class', semester: '2023' }));
    });

    it('should return 404 if class not found', async () => {
      Class.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/classes/1')
        .send({ class_name: 'Updated Class' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Lớp không tồn tại');
    });
  });
});