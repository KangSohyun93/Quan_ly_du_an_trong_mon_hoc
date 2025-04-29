/* backend/controllers/projectController.js */
const { getProjectById, getTasksBySprintId } = require('../models/projectModel');

const getProject = async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);

  if (isNaN(projectId) || projectId <= 0) {
    return res.status(400).json({ error: 'projectId phải là một số nguyên dương' });
  }

  try {
    console.log(`Yêu cầu lấy dự án cho projectId: ${projectId}`);
    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Dự án không tồn tại' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Lỗi trong getProject:', error.message, error.stack);
    res.status(500).json({ error: `Lỗi server: ${error.message}` });
  }
};

const getTasks = async (req, res) => {
  const sprintId = parseInt(req.query.sprint_id, 10);

  if (isNaN(sprintId) || sprintId <= 0) {
    return res.status(400).json({ error: 'sprint_id phải là một số nguyên dương' });
  }

  try {
    console.log(`Yêu cầu lấy task cho sprint_id: ${sprintId}`);
    const tasks = await getTasksBySprintId(sprintId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Lỗi trong getTasks:', error.message, error.stack);
    res.status(500).json({ error: `Lỗi server: ${error.message}` });
  }
};

module.exports = { getProject, getTasks };