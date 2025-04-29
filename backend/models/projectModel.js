/* backend/models/projectModel.js */
const pool = require('../config/db');

const getProjectById = async (projectId) => {
  try {
    console.log(`Bắt đầu truy vấn dự án cho projectId: ${projectId}`);

    const [rows] = await pool.query(
      `
      SELECT 
        p.project_id,
        p.project_name,
        g.group_id,
        g.group_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'user_id', u.user_id,
            'avatar', u.avatar
          )
        ) AS members,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'sprint_id', s.sprint_id,
            'sprint_name', s.sprint_name,
            'sprint_number', s.sprint_number
          )
        ) AS sprints
      FROM Projects p
      JOIN Groups g ON p.group_id = g.group_id
      LEFT JOIN GroupMembers gm ON gm.group_id = g.group_id
      LEFT JOIN Users u ON gm.user_id = u.user_id
      LEFT JOIN Sprints s ON s.project_id = p.project_id
      WHERE p.project_id = ?
      GROUP BY p.project_id, p.project_name, g.group_id, g.group_name;
      `,
      [projectId]
    );

    if (rows.length === 0) {
      return null;
    }

    const project = rows[0];
    project.members = JSON.parse(project.members);
    project.sprints = JSON.parse(project.sprints);
    return project;
  } catch (error) {
    console.error('Lỗi trong getProjectById:', error.message, error.stack);
    throw new Error(`Lỗi khi lấy thông tin dự án: ${error.message}`);
  }
};

const getTasksBySprintId = async (sprintId) => {
  try {
    console.log(`Bắt đầu truy vấn task cho sprint_id: ${sprintId}`);

    const [rows] = await pool.query(
      `
      SELECT 
        task_id,
        title,
        description,
        status,
        due_date,
        progress_percentage
      FROM Tasks
      WHERE sprint_id = ?;
      `,
      [sprintId]
    );

    return rows;
  } catch (error) {
    console.error('Lỗi trong getTasksBySprintId:', error.message, error.stack);
    throw new Error(`Lỗi khi lấy danh sách task: ${error.message}`);
  }
};

const getProjectByClassId = async (classId, userId) => {
  try {
    console.log(`Bắt đầu truy vấn dự án cho classId: ${classId}, userId: ${userId}`);

    const [rows] = await pool.query(
      `
      SELECT 
        p.project_id,
        p.project_name,
        g.group_id,
        g.group_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'user_id', u.user_id,
            'avatar', u.avatar
          )
        ) AS members,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'sprint_id', s.sprint_id,
            'sprint_name', s.sprint_name,
            'sprint_number', s.sprint_number
          )
        ) AS sprints
      FROM Projects p
      JOIN Groups g ON p.group_id = g.group_id
      JOIN GroupMembers gm ON gm.group_id = g.group_id
      LEFT JOIN Users u ON gm.user_id = u.user_id
      LEFT JOIN Sprints s ON s.project_id = p.project_id
      WHERE g.class_id = ?
      AND gm.user_id = ?
      GROUP BY p.project_id, p.project_name, g.group_id, g.group_name;
      `,
      [classId, userId]
    );

    if (rows.length === 0) {
      return null;
    }

    const project = rows[0];
    project.members = JSON.parse(project.members);
    project.sprints = JSON.parse(project.sprints);
    return project;
  } catch (error) {
    console.error('Lỗi trong getProjectByClassId:', error.message, error.stack);
    throw new Error(`Lỗi khi lấy thông tin dự án theo classId: ${error.message}`);
  }
};

module.exports = { getProjectById, getTasksBySprintId, getProjectByClassId };