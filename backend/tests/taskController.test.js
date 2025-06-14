const request = require('supertest');
const express = require('express');
const { Op } = require('sequelize');
const taskController = require('./taskController');
const {
  Task,
  TaskChecklist,
  TaskComment,
  Sprint,
  Project,
  User,
  Group,
  GroupMember,
} = require('../models');

// Initialize Express app for testing
const app = express();
app.use(express.json());

// Mock middleware for authentication
const mockVerifyToken = (req, res, next) => {
  req.userId = 1;
  req.isTeamLead = true;
  next();
};

// Define routes for testing
app.get('/tasks', mockVerifyToken, taskController.getTasks);
app.get('/tasks/:taskId', mockVerifyToken, taskController.getTaskDetails);
app.post('/tasks/comments', mockVerifyToken, taskController.addComment);
app.put('/tasks/checklists/:checklistId', mockVerifyToken, taskController.updateChecklistItem);
app.delete('/tasks/checklists/:checklistId', mockVerifyToken, taskController.deleteChecklistItem);
app.put('/tasks/:taskId', mockVerifyToken, taskController.updateTask);
app.delete('/tasks/:taskId', mockVerifyToken, taskController.deleteTask);
app.get('/sprints', mockVerifyToken, taskController.getSprints);
app.post('/sprints', mockVerifyToken, taskController.createSprint);
app.post('/tasks', mockVerifyToken, taskController.createTask);
app.get('/group-members', mockVerifyToken, taskController.getGroupMembersByProject);

// Mock Sequelize models
jest.mock('./mocks/models-index', () => ({
  Task: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    sequelize: {
      literal: jest.fn().mockReturnValue('COUNT(*)'),
    },
  },
  TaskChecklist: {
    findByPk: jest.fn(),
    create: jest.fn(),
    bulkCreate: jest.fn(),
    destroy: jest.fn(),
  },
  TaskComment: {
    create: jest.fn(),
  },
  Sprint: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  Project: {
    findByPk: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
  Group: {},
  GroupMember: {},
}));

describe('Task Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('should fetch tasks successfully with projectId', async () => {
      const mockTasks = [
        { task_id: 1, title: 'Task 1', sprint: { project_id: 1 } },
      ];
      Task.findAll.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get('/tasks')
        .query({ projectId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
      expect(Task.findAll).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should handle server error', async () => {
      Task.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/tasks')
        .query({ projectId: 1 });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Server error: Database error');
    });
  });

  describe('GET /tasks/:taskId', () => {
    it('should fetch task details successfully', async () => {
      const mockTask = {
        task_id: 1,
        title: 'Task 1',
        assignedUser: { user_id: 1, username: 'user1' },
      };
      Task.findByPk.mockResolvedValue(mockTask);

      const response = await request(app).get('/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTask);
      expect(Task.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
    });

    it('should return 404 if task not found', async () => {
      Task.findByPk.mockResolvedValue(null);

      const response = await request(app).get('/tasks/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('POST /tasks/comments', () => {
    it('should add a comment successfully', async () => {
      Task.findByPk.mockResolvedValue({ task_id: 1 });
      TaskComment.create.mockResolvedValue({ comment_id: 1 });

      const response = await request(app)
        .post('/tasks/comments')
        .send({ task_id: 1, user_id: 1, comment_text: 'Test comment' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Comment added successfully');
      expect(TaskComment.create).toHaveBeenCalledWith({
        task_id: 1,
        user_id: 1,
        comment_text: 'Test comment',
      });
    });

    it('should return 404 if task not found', async () => {
      Task.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .post('/tasks/comments')
        .send({ task_id: 1, user_id: 1, comment_text: 'Test comment' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('PUT /tasks/checklists/:checklistId', () => {
    it('should update checklist item successfully for team lead', async () => {
      TaskChecklist.findByPk.mockResolvedValue({
        checklist_id: 1,
        task: { assigned_to: 2 },
        item_description: 'Old description',
        is_completed: false,
        save: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app)
        .put('/tasks/checklists/1')
        .send({ item_description: 'New description', is_completed: true });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Checklist item updated successfully.');
      expect(TaskChecklist.findByPk).toHaveBeenCalledWith('1', expect.any(Object));
    });

    it('should return 403 if non-assigned user tries to update is_completed', async () => {
      TaskChecklist.findByPk.mockResolvedValue({
        checklist_id: 1,
        task: { assigned_to: 2 },
        is_completed: false,
        save: jest.fn(),
      });

      const response = await request(app)
        .put('/tasks/checklists/1')
        .send({ is_completed: true });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        'Only the assigned user can update subtask completion status.'
      );
    });

    it('should return 400 if invalid is_completed value', async () => {
      TaskChecklist.findByPk.mockResolvedValue({
        checklist_id: 1,
        task: { assigned_to: 1 },
        save: jest.fn(),
      });

      const response = await request(app)
        .put('/tasks/checklists/1')
        .send({ is_completed: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid is_completed value. Must be boolean.');
    });
  });

  describe('DELETE /tasks/checklists/:checklistId', () => {
    it('should delete checklist item successfully for team lead', async () => {
      TaskChecklist.findByPk.mockResolvedValue({
        checklist_id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app).delete('/tasks/checklists/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Checklist item deleted');
    });

    it('should return 403 if user is not team lead', async () => {
      TaskChecklist.findByPk.mockResolvedValue({ checklist_id: 1 });
      app.use((req, res, next) => {
        req.userId = 1;
        req.isTeamLead = false;
        next();
      });

      const response = await request(app).delete('/tasks/checklists/1');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Only team leads can delete subtasks');
    });
  });

  describe('PUT /tasks/:taskId', () => {
    it('should update task successfully', async () => {
      Task.findByPk.mockResolvedValue({
        task_id: 1,
        assigned_to: 1,
        status: 'To-Do',
        progress_percentage: 0,
        save: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app)
        .put('/tasks/1')
        .send({ status: 'In Progress', progress_percentage: 50 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task updated successfully');
    });

    it('should return 403 if user is not assigned', async () => {
      Task.findByPk.mockResolvedValue({
        task_id: 1,
        assigned_to: 2,
        save: jest.fn(),
      });

      const response = await request(app)
        .put('/tasks/1')
        .send({ status: 'In Progress' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Only assigned users can update tasks');
    });
  });

  describe('DELETE /tasks/:taskId', () => {
    it('should delete task successfully for team lead', async () => {
      Task.findByPk.mockResolvedValue({
        task_id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app).delete('/tasks/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
    });

    it('should return 403 if user is not team lead', async () => {
      Task.findByPk.mockResolvedValue({ task_id: 1 });
      app.use((req, res, next) => {
        req.userId = 1;
        req.isTeamLead = false;
        next();
      });

      const response = await request(app).delete('/tasks/1');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Only team leads can delete tasks');
    });
  });

  describe('GET /sprints', () => {
    it('should fetch sprints successfully', async () => {
      const mockSprints = [{ sprint_id: 1, sprint_name: 'Sprint 1' }];
      Sprint.findAll.mockResolvedValue(mockSprints);

      const response = await request(app)
        .get('/sprints')
        .query({ projectId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSprints);
      expect(Sprint.findAll).toHaveBeenCalledWith({ where: { project_id: 1 } });
    });
  });

  describe('POST /sprints', () => {
    it('should create sprint successfully', async () => {
      Project.findByPk.mockResolvedValue({ project_id: 1 });
      Sprint.count.mockResolvedValue(0);
      Sprint.create.mockResolvedValue({ sprint_id: 1 });

      const response = await request(app)
        .post('/sprints')
        .send({
          project_id: 1,
          sprint_name: 'Sprint 1',
          start_date: '2023-01-01',
          end_date: '2023-01-14',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Sprint created');
      expect(Sprint.create).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should return 404 if project not found', async () => {
      Project.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .post('/sprints')
        .send({ project_id: 1, sprint_name: 'Sprint 1' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Project not found');
    });
  });

  describe('POST /tasks', () => {
    it('should create task successfully with subtasks', async () => {
      Sprint.findByPk.mockResolvedValue({ sprint_id: 1 });
      Task.create.mockResolvedValue({ task_id: 1 });
      TaskChecklist.bulkCreate.mockResolvedValue([]);

      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'New Task',
          sprint_id: 1,
          assigned_to: 1,
          subtasks: ['Subtask 1', 'Subtask 2'],
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Task created');
      expect(Task.create).toHaveBeenCalledWith(expect.any(Object));
      expect(TaskChecklist.bulkCreate).toHaveBeenCalled();
    });

    it('should return 404 if sprint not found', async () => {
      Sprint.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .post('/tasks')
        .send({ title: 'New Task', sprint_id: 1 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Sprint not found');
    });
  });

  describe('GET /group-members', () => {
    it('should fetch group members successfully', async () => {
      const mockMembers = [
        { user_id: 1, username: 'user1' },
        { user_id: 2, username: 'user2' },
      ];
      Project.findByPk.mockResolvedValue({
        project_id: 1,
        Group: { GroupMembers: mockMembers.map((user) => ({ User: user })) },
      });

      const response = await request(app)
        .get('/group-members')
        .query({ projectId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMembers);
    });

    it('should return 404 if no group members found', async () => {
      Project.findByPk.mockResolvedValue({ project_id: 1, Group: null });

      const response = await request(app)
        .get('/group-members')
        .query({ projectId: 1 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No group members found');
    });
  });
});