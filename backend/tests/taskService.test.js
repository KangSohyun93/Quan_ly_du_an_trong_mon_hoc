const { Task, Sprint } = require('../models');
const { Op } = require('sequelize');
const { getTasksByProjectId, getTaskStatsForProject } = require('./taskService');

jest.mock('./mocks/models-index', () => ({
  Task: { findAll: jest.fn(), count: jest.fn() },
  Sprint: {},
  Op: require('sequelize').Op,
}));

describe('Task Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasksByProjectId', () => {
    it('should fetch tasks successfully for a given projectId', async () => {
      const mockTasks = [
        { task_id: 1, sprint: { sprint_id: 1, sprint_number: 1 } },
        { task_id: 2, sprint: { sprint_id: 1, sprint_number: 1 } },
      ];
      Task.findAll.mockResolvedValue(mockTasks);

      const result = await getTasksByProjectId(1);

      expect(result).toEqual(mockTasks);
      expect(Task.findAll).toHaveBeenCalledWith({
        include: [{ model: Sprint, as: 'sprint', where: { project_id: 1 }, attributes: ['sprint_id', 'sprint_number'], required: true }],
      });
    });

    it('should throw error on database failure', async () => {
      Task.findAll.mockRejectedValue(new Error('Database error'));
      await expect(getTasksByProjectId(1)).rejects.toThrow('Could not fetch tasks for project 1');
    });
  });

  describe('getTaskStatsForProject', () => {
    it('should fetch task stats successfully with sprint filter', async () => {
      Task.count.mockResolvedValue(5);
      Task.findAll.mockResolvedValue([
        { status: 'Completed', due_date: '2025-01-01', completed_at: '2025-01-02' },
        { status: 'In-Progress', due_date: '2025-01-01' },
        { status: 'To-Do' },
      ]);

      const result = await getTaskStatsForProject(1, 1);

      expect(result).toEqual({
        totalProjectTasks: 5,
        selectedSprintTasks: 3,
        tasksCompleted: 1,
        tasksLate: 2, // One late completion, one overdue incomplete
      });
      expect(Task.count).toHaveBeenCalledWith({
        include: [{ model: Sprint, as: 'sprint', where: { project_id: 1 }, attributes: [] }],
      });
      expect(Task.findAll).toHaveBeenCalledWith({
        include: [{ model: Sprint, as: 'sprint', where: { project_id: 1 }, attributes: [] }],
        where: { sprint_id: 1 },
        attributes: ['status', 'due_date', 'completed_at'],
      });
    });

    it('should fetch task stats without sprint filter', async () => {
      Task.count.mockResolvedValue(5);
      Task.findAll.mockResolvedValue([
        { status: 'Completed', due_date: '2025-01-01', completed_at: '2025-01-01' },
        { status: 'In-Progress' },
      ]);

      const result = await getTaskStatsForProject(1);

      expect(result).toEqual({
        totalProjectTasks: 5,
        selectedSprintTasks: 5,
        tasksCompleted: 1,
        tasksLate: 0,
      });
    });

    it('should throw error on database failure', async () => {
      Task.count.mockRejectedValue(new Error('Database error'));
      await expect(getTaskStatsForProject(1)).rejects.toThrow('Could not fetch task stats for project 1');
    });
  });
});