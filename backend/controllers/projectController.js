const { Project, Group, GroupMember, Sprint, Task } = require('../models');

const getProjectByClassId = async (req, res) => {
  try {
    const classId = parseInt(req.query.class_id, 10);
    const userId = parseInt(req.query.user_id, 10);

    if (isNaN(classId) || classId <= 0 || isNaN(userId) || userId <= 0) {
      return res.status(400).json({ error: 'classId và userId phải là số nguyên dương' });
    }

    const project = await Project.findOne({
      include: [
        {
          model: Group,
          where: { class_id: classId },
          include: [
            {
              model: GroupMember,
              where: { user_id: userId },
            },
          ],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: 'Không tìm thấy dự án cho lớp học này' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Lỗi khi lấy dự án theo classId:', error.message, error.stack);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

const getProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    if (isNaN(projectId) || projectId <= 0) {
      return res.status(400).json({ message: 'projectId phải là số nguyên dương' });
    }

    const project = await Project.findOne({
      where: { project_id: projectId },
      include: [
        {
          model: Group,
          attributes: ['group_id', 'group_name', 'group_number'],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: 'Dự án không tồn tại' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Lỗi trong getProject:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getTasks = async (req, res) => {
  try {
    const sprintId = parseInt(req.params.sprintId, 10);
    if (isNaN(sprintId) || sprintId <= 0) {
      return res.status(400).json({ message: 'sprintId phải là số nguyên dương' });
    }

    const tasks = await Task.findAll({
      where: { sprint_id: sprintId },
      include: [
        {
          model: Sprint,
          attributes: ['sprint_name'],
        },
      ],
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Lỗi trong getTasks:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getProjectByClassId, getProject, getTasks };