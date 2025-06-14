const { Sprint } = require('../models');
const { Op } = require('sequelize');
const { getSprintsByProjectId, getTargetSprintIdForFilter, createSprintForProject } = require('./sprintService');

jest.mock('./mocks/models-index', () => ({
  Sprint: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Op: require('sequelize').Op,
}));

describe('Sprint Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSprintsByProjectId', () => {
    it('should fetch sprints successfully for a given projectId', async () => {
      const mockSprints = [
        { sprint_id: 1, sprint_number: 1, sprint_name: 'Sprint 1' },
        { sprint_id: 2, sprint_number: 2, sprint_name: 'Sprint 2' },
      ];
      Sprint.findAll.mockResolvedValue(mockSprints);

      const result = await getSprintsByProjectId(1);

      expect(result).toEqual(mockSprints);
      expect(Sprint.findAll).toHaveBeenCalledWith({
        where: { project_id: 1 },
        attributes: ['sprint_id', 'sprint_number', 'sprint_name', 'start_date', 'end_date', 'created_at'],
        order: [['sprint_number', 'ASC']],
      });
    });

    it('should throw error if projectId is not provided', async () => {
      await expect(getSprintsByProjectId()).rejects.toThrow('Project ID is required to fetch sprints.');
    });

    it('should throw error on database failure', async () => {
      Sprint.findAll.mockRejectedValue(new Error('Database error'));
      await expect(getSprintsByProjectId(1)).rejects.toThrow('Could not fetch sprints for project 1.');
    });
  });

  describe('getTargetSprintIdForFilter', () => {
    it('should return current sprint ID when filter is "current"', async () => {
      const mockSprint = { sprint_id: 1 };
      Sprint.findOne.mockResolvedValue(mockSprint);

      const result = await getTargetSprintIdForFilter(1, 'current');

      expect(result).toBe(1);
      expect(Sprint.findOne).toHaveBeenCalledWith({
        where: { project_id: 1, end_date: { [Op.gte]: expect.any(Date) } },
        order: [['end_date', 'ASC']],
        limit: 1,
        attributes: ['sprint_id'],
      });
    });

    it('should return last sprint ID if no current sprint found', async () => {
      Sprint.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ sprint_id: 2 });

      const result = await getTargetSprintIdForFilter(1, 'current');

      expect(result).toBe(2);
      expect(Sprint.findOne).toHaveBeenCalledWith({
        where: { project_id: 1 },
        order: [['sprint_number', 'DESC']],
        limit: 1,
        attributes: ['sprint_id'],
      });
    });

    it('should return specific sprint ID when provided', async () => {
      const result = await getTargetSprintIdForFilter(1, '3');
      expect(result).toBe(3);
    });

    it('should return null for "all" filter', async () => {
      const result = await getTargetSprintIdForFilter(1, 'all');
      expect(result).toBe(null);
    });

    it('should throw error if projectId is not provided', async () => {
      await expect(getTargetSprintIdForFilter()).rejects.toThrow('Project ID is required to determine target sprint.');
    });
  });

  describe('createSprintForProject', () => {
    it('should create a sprint successfully', async () => {
      const mockSprint = { sprint_id: 1, sprint_name: 'New Sprint' };
      Sprint.create.mockResolvedValue(mockSprint);

      const result = await createSprintForProject(1, { sprint_name: 'New Sprint', start_date: '2025-01-01', end_date: '2025-01-14' });

      expect(result).toEqual(mockSprint);
      expect(Sprint.create).toHaveBeenCalledWith({
        project_id: 1,
        sprint_name: 'New Sprint',
        start_date: '2025-01-01',
        end_date: '2025-01-14',
      });
    });

    it('should throw error if projectId is not provided', async () => {
      await expect(createSprintForProject()).rejects.toThrow('Project ID is required to create a sprint.');
    });

    it('should handle unique constraint error', async () => {
      Sprint.create.mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });
      await expect(createSprintForProject(1, { sprint_name: 'New Sprint' }))
        .rejects.toThrow('A sprint with this number might already exist for the project, or DB trigger issue.');
    });

    it('should throw error on other database failures', async () => {
      Sprint.create.mockRejectedValue(new Error('Database error'));
      await expect(createSprintForProject(1, { sprint_name: 'New Sprint' }))
        .rejects.toThrow('Could not create sprint for project 1.');
    });
  });
});