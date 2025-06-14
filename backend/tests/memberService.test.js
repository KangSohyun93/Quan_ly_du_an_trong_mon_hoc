const { Group, GroupMember, User, PeerAssessment, sequelize } = require('../models');
const { Op, QueryTypes } = require('sequelize');
const projectService = require('./projectService');
const taskService = require('./taskService');
const contributionService = require('./contributionService');
const sprintService = require('./sprintService');
const {
  getGroupsForUserByClass,
  getGroupMembersWithTaskDetails,
  getPeerAssessmentsForGroup,
  getSprintsOfProjectInGroup,
  getProjectOverallStatsForGroup,
} = require('./memberService');

jest.mock('./mocks/models-index', () => ({
  Group: { findAll: jest.fn(), findByPk: jest.fn(), count: jest.fn() },
  GroupMember: { findAll: jest.fn() },
  User: {},
  PeerAssessment: { findAll: jest.fn() },
  sequelize: { query: jest.fn(), literal: jest.fn() },
  Op: require('sequelize').Op,
  QueryTypes: { SELECT: 'SELECT' },
}));

jest.mock('./projectService', () => ({ getProjectByGroupId: jest.fn() }));
jest.mock('./taskService', () => ({ getTasksByProjectId: jest.fn(), getTaskStatsForProject: jest.fn() }));
jest.mock('./contributionService', () => ({ getCommitStatsByProjectId: jest.fn() }));
jest.mock('./sprintService', () => ({ getSprintsByProjectId: jest.fn(), getTargetSprintIdForFilter: jest.fn() }));

describe('Member Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGroupsForUserByClass', () => {
    it('should fetch groups for instructor role', async () => {
      const mockGroups = [{ group_id: 1, group_name: 'Group 1', Class: { class_name: 'Class 1' }, Project: { project_id: 1 } }];
      Group.findAll.mockResolvedValue(mockGroups);

      const result = await getGroupsForUserByClass(1, 1, 'Instructor');

      expect(result).toEqual([{ group_id: 1, group_name: 'Group 1', project_id: 1, class_name: 'Class 1' }]);
      expect(Group.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { class_id: 1, '$Class.instructor_id$': 1 },
      }));
    });

    it('should fetch groups for student role', async () => {
      const mockGroups = [{ group_id: 1, group_name: 'Group 1', Class: { class_name: 'Class 1' }, Project: null }];
      Group.findAll.mockResolvedValue(mockGroups);

      const result = await getGroupsForUserByClass(1, 1, 'Student');

      expect(result).toEqual([{ group_id: 1, group_name: 'Group 1', project_id: null, class_name: 'Class 1' }]);
      expect(Group.findAll).toHaveBeenCalledWith(expect.objectContaining({
        include: expect.arrayContaining([{ model: GroupMember, as: 'groupMembers', where: { user_id: 1 } }]),
      }));
    });

    it('should return empty array for unhandled role', async () => {
      const result = await getGroupsForUserByClass(1, 1, 'Unknown');
      expect(result).toEqual([]);
    });

    it('should throw error for missing parameters', async () => {
      await expect(getGroupsForUserByClass()).rejects.toThrow('Internal server error: Missing required parameters.');
    });
  });

  describe('getGroupMembersWithTaskDetails', () => {
    it('should fetch group members with task details', async () => {
      Group.findByPk.mockResolvedValue({
        group_id: 1,
        leader_id: 1,
        groupMembers: [{ User: { user_id: 1, username: 'user1', avatar: 'avatar1' }, joined_at: '2025-01-01' }],
      });
      projectService.getProjectByGroupId.mockResolvedValue({ project_id: 1 });
      taskService.getTasksByProjectId.mockResolvedValue([{ assigned_to: 1, status: 'Completed', due_date: '2025-01-02', completed_at: '2025-01-03' }]);
      sequelize.query.mockResolvedValue([
        { user_id: 1, username: 'user1', sprint_id: 1, sprint: 1, sprint_completed_tasks: 1, sprint_total_tasks: 1, sprint_late_tasks: 1 },
      ]);

      const result = await getGroupMembersWithTaskDetails(1);

      expect(result.members).toEqual([expect.objectContaining({
        name: 'user1',
        role: 'PM',
        lateCompletion: 1,
        total: 1,
      })]);
      expect(result.sprintData).toEqual({ user1: [{ sprint: 1, completed: 1, total: 1, late: 1 }] });
    });

    it('should throw error if group not found', async () => {
      Group.findByPk.mockResolvedValue(null);
      await expect(getGroupMembersWithTaskDetails(1)).rejects.toThrow('Group with ID 1 not found');
    });

    it('should return empty members if no group members', async () => {
      Group.findByPk.mockResolvedValue({ group_id: 1, leader_id: 1, groupMembers: [] });
      projectService.getProjectByGroupId.mockResolvedValue({ project_id: 1 });
      taskService.getTasksByProjectId.mockResolvedValue([]);

      const result = await getGroupMembersWithTaskDetails(1);

      expect(result).toEqual({ members: [], sprintData: {} });
    });
  });

  describe('getPeerAssessmentsForGroup', () => {
    it('should fetch peer assessments successfully', async () => {
      Group.count.mockResolvedValue(1);
      PeerAssessment.findAll.mockResolvedValue([
        {
          assessee: { user_id: 1, username: 'user1' },
          assessor: { user_id: 2, username: 'user2' },
          deadline_score: 4,
          friendly_score: 3,
          quality_score: 5,
          team_support_score: 2,
          responsibility_score: 4,
          note: 'Good work',
          review_average_score: '3.6',
        },
      ]);

      const result = await getPeerAssessmentsForGroup(1);

      expect(result).toEqual([
        expect.objectContaining({
          name: 'user1',
          score: 3.6,
          details: [expect.objectContaining({ reviewer: 'user2', overallReviewScore: 3.6 })],
        }),
      ]);
    });

    it('should throw error if group not found', async () => {
      Group.count.mockResolvedValue(0);
      await expect(getPeerAssessmentsForGroup(1)).rejects.toThrow('Group with ID 1 not found');
    });

    it('should throw error if groupId is invalid', async () => {
      await expect(getPeerAssessmentsForGroup('invalid')).rejects.toThrow('Invalid groupId');
    });
  });

  describe('getSprintsOfProjectInGroup', () => {
    it('should fetch sprints for group successfully', async () => {
      projectService.getProjectByGroupId.mockResolvedValue({ project_id: 1 });
      sprintService.getSprintsByProjectId.mockResolvedValue([
        { sprint_id: 1, sprint_number: 1, sprint_name: 'Sprint 1', start_date: '2025-01-01', end_date: '2025-01-14' },
      ]);

      const result = await getSprintsOfProjectInGroup(1);

      expect(result).toEqual([{ id: 1, number: 1, name: 'Sprint 1', startDate: '2025-01-01', endDate: '2025-01-14' }]);
    });

    it('should return empty array if no project found', async () => {
      projectService.getProjectByGroupId.mockResolvedValue(null);
      const result = await getSprintsOfProjectInGroup(1);
      expect(result).toEqual([]);
    });
  });

  describe('getProjectOverallStatsForGroup', () => {
    it('should fetch project stats successfully', async () => {
      projectService.getProjectByGroupId.mockResolvedValue({ project_id: 1 });
      contributionService.getCommitStatsByProjectId.mockResolvedValue({ totalCommits: 10, totalLinesAdded: 1000 });
      sprintService.getTargetSprintIdForFilter.mockResolvedValue(1);
      taskService.getTaskStatsForProject.mockResolvedValue({
        totalProjectTasks: 5,
        selectedSprintTasks: 3,
        tasksCompleted: 2,
        tasksLate: 1,
      });

      const result = await getProjectOverallStatsForGroup(1, 'current');

      expect(result).toEqual({
        totalProjectTasks: 5,
        selectedSprintTasks: 3,
        tasksCompleted: 2,
        tasksLate: 1,
        totalCommits: 10,
        totalLOC: 1000,
      });
    });

    it('should throw error if project not found', async () => {
      projectService.getProjectByGroupId.mockResolvedValue(null);
      await expect(getProjectOverallStatsForGroup(1)).rejects.toThrow('Project not found for group 1');
    });
  });
});