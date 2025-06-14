const request = require('supertest');
const express = require('express');
const taskRoutes = require('../routes/task-routes');
const taskController = require('../controllers/taskController');

// Initialize Express app for testing
const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

// Mock middleware for authentication
const mockVerifyToken = (req, res, next) => {
  req.userId = 1;
  req.isTeamLead = true; // Default to team lead for permissions
  next();
};

// Mock taskController methods
jest.mock('../controllers/taskController', () => ({
  addComment: jest.fn(),
  updateChecklistItem: jest.fn(),
  deleteChecklistItem: jest.fn(),
  getSprints: jest.fn(),
  createSprint: jest.fn(),
  getGroupMembersByProject: jest.fn(),
  getTasks: jest.fn(),
  createTask: jest.fn(),
  getTaskDetails: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reapply mock middleware for each test
    taskRoutes.stack.forEach((layer) => {
      if (layer.route && layer.route.stack.some((middleware) => middleware.name === 'verifyToken')) {
        layer.route.stack = layer.route.stack.map((middleware) =>
          middleware.name === 'verifyToken' ? mockVerifyToken : middleware
        );
      }
    });
  });

  describe('POST /api/tasks/comments', () => {
    it('should call addComment controller', async () => {
      taskController.addComment.mockImplementation((req, res) => res.status(201).json({ message: 'Comment added' }));

      const response = await request(app)
        .post('/api/tasks/comments')
        .send({ task_id: 1, comment_text: 'Test comment' });

      expect(response.status).toBe(201);
      expect(taskController.addComment).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/tasks/checklists/:checklistId', () => {
    it('should call updateChecklistItem controller', async () => {
      taskController.updateChecklistItem.mockImplementation((req, res) => res.status(200).json({ message: 'Checklist updated' }));

      const response = await request(app)
        .patch('/api/tasks/checklists/1')
        .send({ is_completed: true });

      expect(response.status).toBe(200);
      expect(taskController.updateChecklistItem).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/tasks/checklists/:checklistId', () => {
    it('should call deleteChecklistItem controller', async () => {
      taskController.deleteChecklistItem.mockImplementation((req, res) => res.status(200).json({ message: 'Checklist deleted' }));

      const response = await request(app).delete('/api/tasks/checklists/1');

      expect(response.status).toBe(200);
      expect(taskController.deleteChecklistItem).toHaveBeenCalled();
    });
  });

  describe('GET /api/tasks/sprints', () => {
    it('should call getSprints controller', async () => {
      taskController.getSprints.mockImplementation((req, res) => res.status(200).json([]));

      const response = await request(app).get('/api/tasks/sprints');

      expect(response.status).toBe(200);
      expect(taskController.getSprints).toHaveBeenCalled();
    });
  });

  describe('POST /api/tasks/sprints', () => {
    it('should call createSprint controller', async () => {
      taskController.createSprint.mockImplementation((req, res) => res.status(201).json({ message: 'Sprint created' }));

      const response = await request(app)
        .post('/api/tasks/sprints')
        .send({ project_id: 1, sprint_name: 'Sprint 1' });

      expect(response.status).toBe(201);
      expect(taskController.createSprint).toHaveBeenCalled();
    });
  });

  describe('GET /api/tasks/group-members-by-project', () => {
    it('should call getGroupMembersByProject controller', async () => {
      taskController.getGroupMembersByProject.mockImplementation((req, res) => res.status(200).json([]));

      const response = await request(app).get('/api/tasks/group-members-by-project');

      expect(response.status).toBe(200);
      expect(taskController.getGroupMembersByProject).toHaveBeenCalled();
    });
  });

  describe('GET /api/tasks', () => {
    it('should call getTasks controller', async () => {
      taskController.getTasks.mockImplementation((req, res) => res.status(200).json([]));

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(taskController.getTasks).toHaveBeenCalled();
    });
  });

  describe('POST /api/tasks', () => {
    it('should call createTask controller', async () => {
      taskController.createTask.mockImplementation((req, res) => res.status(201).json({ message: 'Task created' }));

      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'New Task', sprint_id: 1 });

      expect(response.status).toBe(201);
      expect(taskController.createTask).toHaveBeenCalled();
    });
  });

  describe('GET /api/tasks/:taskId', () => {
    it('should call getTaskDetails controller', async () => {
      taskController.getTaskDetails.mockImplementation((req, res) => res.status(200).json({ task_id: 1 }));

      const response = await request(app).get('/api/tasks/1');

      expect(response.status).toBe(200);
      expect(taskController.getTaskDetails).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/tasks/:taskId', () => {
    it('should call updateTask controller', async () => {
      taskController.updateTask.mockImplementation((req, res) => res.status(200).json({ message: 'Task updated' }));

      const response = await request(app)
        .patch('/api/tasks/1')
        .send({ status: 'In Progress' });

      expect(response.status).toBe(200);
      expect(taskController.updateTask).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/tasks/:taskId', () => {
    it('should call deleteTask controller', async () => {
      taskController.deleteTask.mockImplementation((req, res) => res.status(200).json({ message: 'Task deleted' }));

      const response = await request(app).delete('/api/tasks/1');

      expect(response.status).toBe(200);
      expect(taskController.deleteTask).toHaveBeenCalled();
    });
  });
});