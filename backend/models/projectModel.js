const pool = require('../config/db');

const getProjectById = async (projectId) => {
  try {
    console.log(`Bắt đầu truy vấn dự án cho projectId: ${projectId}`);

    const [projectRows] = await pool.query(
      `
      SELECT 
        p.project_id,
        p.project_name,
        p.description,
        p.tools_used,
        p.status,
        p.github_repo_url,
        g.group_id,
        g.group_name,
        c.class_id,
        c.class_name
      FROM Projects p
      JOIN Groups g ON p.group_id = g.group_id
      JOIN Classes c ON g.class_id = c.class_id
      WHERE p.project_id = ?;
      `,
      [projectId]
    );

    if (projectRows.length === 0) {
      console.log(`Không tìm thấy dự án với projectId: ${projectId}`);
      return null;
    }

    const project = projectRows[0];

    // Lấy danh sách thành viên
    const [memberRows] = await pool.query(
      `
      SELECT 
        u.user_id,
        u.username,
        u.avatar
      FROM GroupMembers gm
      JOIN Users u ON gm.user_id = u.user_id
      WHERE gm.group_id = ?;
      `,
      [project.group_id]
    );
    project.members = memberRows.map(row => ({
      user_id: row.user_id,
      username: row.username,
      avatar: row.avatar || '/uploads/default.jpg' // Sử dụng đường dẫn mặc định từ public/uploads
    }));

    // Lấy danh sách sprint
    const [sprintRows] = await pool.query(
      `
      SELECT 
        sprint_id,
        sprint_name,
        sprint_number,
        start_date,
        end_date
      FROM Sprints
      WHERE project_id = ?;
      `,
      [projectId]
    );
    project.sprints = sprintRows;

    return project;
  } catch (error) {
    console.error('Lỗi trong getProjectById:', error.message, error.stack);
    throw new Error('Lỗi khi lấy thông tin dự án');
  }
};

const getTasksBySprintId = async (sprintId) => {
  try {
    console.log(`Bắt đầu truy vấn task cho sprint_id: ${sprintId}`);

    const [rows] = await pool.query(
      `
      SELECT 
        t.task_id,
        t.title,
        t.description,
        t.status,
        t.due_date,
        t.progress_percentage,
        u.user_id AS assigned_to_id,
        u.username AS assigned_to_username
      FROM Tasks t
      LEFT JOIN Users u ON t.assigned_to = u.user_id
      WHERE t.sprint_id = ?;
      `,
      [sprintId]
    );

    return rows;
  } catch (error) {
    console.error('Lỗi trong getTasksBySprintId:', error.message, error.stack);
    throw new Error('Lỗi khi lấy danh sách task');
  }
};

const getProjectByClassId = async (classId, userId) => {
  try {
    console.log(`Bắt đầu truy vấn dự án cho classId: ${classId}, userId: ${userId}`);

    const [projectRows] = await pool.query(
      `
      SELECT 
        p.project_id,
        p.project_name,
        p.description,
        p.tools_used,
        p.status,
        p.github_repo_url,
        g.group_id,
        g.group_name,
        c.class_id,
        c.class_name
      FROM Projects p
      JOIN Groups g ON p.group_id = g.group_id
      JOIN Classes c ON g.class_id = c.class_id
      JOIN GroupMembers gm ON gm.group_id = g.group_id
      WHERE g.class_id = ? AND gm.user_id = ?;
      `,
      [classId, userId]
    );

    if (projectRows.length === 0) {
      console.log(`Không tìm thấy dự án cho classId: ${classId}, userId: ${userId}`);
      return null;
    }

    const project = projectRows[0];

    // Lấy danh sách thành viên
    const [memberRows] = await pool.query(
      `
      SELECT 
        u.user_id,
        u.username,
        u.avatar
      FROM GroupMembers gm
      JOIN Users u ON gm.user_id = u.user_id
      WHERE gm.group_id = ?;
      `,
      [project.group_id]
    );
    project.members = memberRows.map(row => ({
      user_id: row.user_id,
      username: row.username,
      avatar: row.avatar || '/uploads/default.jpg' // Sử dụng đường dẫn mặc định từ public/uploads
    }));

    // Lấy danh sách sprint
    const [sprintRows] = await pool.query(
      `
      SELECT 
        sprint_id,
        sprint_name,
        sprint_number,
        start_date,
        end_date
      FROM Sprints
      WHERE project_id = ?;
      `,
      [project.project_id]
    );
    project.sprints = sprintRows;

    return project;
  } catch (error) {
    console.error('Lỗi trong getProjectByClassId:', error.message, error.stack);
    throw new Error('Lỗi khi lấy thông tin dự án theo classId');
  }
};

module.exports = { getProjectById, getTasksBySprintId, getProjectByClassId };