const { GroupMember, User, PeerAssessment, Task, Sprint, Project } = require('../models');
const { Op } = require('sequelize');

const getGroupMembers = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'projectId phải là số nguyên dương' });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: 'Dự án không tồn tại' });
    }

    const members = await GroupMember.findAll({
      where: { group_id: project.group_id },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'role'],
        },
      ],
    });

    res.status(200).json(
      members.map(m => ({
        user_id: m.User.user_id,
        username: m.User.username,
        role: m.User.role,
      }))
    );
  } catch (error) {
    console.error('Lỗi trong getGroupMembers:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getPeerAssessments = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const assessorId = parseInt(req.params.assessorId, 10);
    if (isNaN(projectId) || projectId <= 0 || isNaN(assessorId) || assessorId <= 0) {
      return res.status(400).json({ message: 'projectId và assessorId phải là số nguyên dương' });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: 'Dự án không tồn tại' });
    }

    const assessments = await PeerAssessment.findAll({
      where: {
        group_id: project.group_id,
        assessor_id: assessorId,
      },
      include: [
        {
          model: User,
          as: 'assessee',
          attributes: ['username'],
        },
      ],
    });

    res.status(200).json(assessments);
  } catch (error) {
    console.error('Lỗi trong getPeerAssessments:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const saveAssessment = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    const { assessor_id, assessee_id, rating, comment } = req.body;

    if (isNaN(projectId) || projectId <= 0 || !assessor_id || !assessee_id || !rating) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: 'Dự án không tồn tại' });
    }

    await PeerAssessment.create({
      group_id: project.group_id,
      assessor_id,
      assessee_id,
      rating,
      comment,
    });

    res.status(200).json({ message: 'Đánh giá đã được lưu' });
  } catch (error) {
    console.error('Lỗi trong saveAssessment:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'projectId phải là số nguyên dương' });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: 'Dự án không tồn tại' });
    }

    const tasks = await Task.findAll({
      include: [
        {
          model: Sprint,
          where: { project_id: projectId },
        },
      ],
    });

    const stats = {
      total: tasks.length,
      toDo: tasks.filter(t => t.status === 'To Do').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      done: tasks.filter(t => t.status === 'Done').length,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Lỗi trong getTaskStats:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getMemberTaskStats = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'projectId phải là số nguyên dương' });
    }

    const project = await Project.findOne({ where: { project_id: projectId } });
    if (!project) {
      return res.status(404).json({ message: 'Dự án không tồn tại' });
    }

    const members = await GroupMember.findAll({
      where: { group_id: project.group_id },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username'],
        },
      ],
    });

    const stats = await Promise.all(
      members.map(async (member) => {
        const tasks = await Task.findAll({
          where: {
            assigned_to: member.User.user_id,
            '$Sprint.project_id$': projectId,
          },
          include: [
            {
              model: Sprint,
            },
          ],
        });

        return {
          user_id: member.User.user_id,
          username: member.User.username,
          total: tasks.length,
          toDo: tasks.filter(t => t.status === 'To Do').length,
          inProgress: tasks.filter(t => t.status === 'In Progress').length,
          done: tasks.filter(t => t.status === 'Done').length,
        };
      })
    );

    res.status(200).json(stats);
  } catch (error) {
    console.error('Lỗi trong getMemberTaskStats:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getGroupMembers, getPeerAssessments, saveAssessment, getTaskStats, getMemberTaskStats };