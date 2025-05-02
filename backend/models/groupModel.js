const pool = require('../config/db');

const getGroupsByUserId = async (userId) => {
  try {
    console.log(`Bắt đầu truy vấn nhóm cho userId: ${userId}`);

    const [rows] = await pool.query(
      `
      SELECT 
        g.group_id,
        g.group_name,
        g.class_id AS classId,
        c.class_name AS className,
        p.project_id AS projectId,
        p.project_name AS projectName,
        COUNT(DISTINCT gm.user_id) AS memberCount
      FROM Groups g
      JOIN Classes c ON g.class_id = c.class_id
      LEFT JOIN Projects p ON p.group_id = g.group_id
      JOIN GroupMembers gm ON gm.group_id = g.group_id
      WHERE gm.user_id = ?
      GROUP BY g.group_id, g.group_name, c.class_id, c.class_name, p.project_id, p.project_name;
      `,
      [userId]
    );

    const groups = await Promise.all(
      rows.map(async (row) => {
        const [memberRows] = await pool.query(
          `
          SELECT 
            u.user_id,
            u.avatar
          FROM GroupMembers gm
          JOIN Users u ON gm.user_id = u.user_id
          WHERE gm.group_id = ?;
          `,
          [row.group_id]
        );
        row.members = memberRows.map(member => ({
          user_id: member.user_id,
          avatar: member.avatar || '/uploads/default.jpg'
        }));
        row.avatar = (row.members.length > 0 ? row.members[0].avatar : '/uploads/default.jpg');
        return row;
      })
    );

    return groups;
  } catch (error) {
    console.error('Lỗi trong getGroupsByUserId:', error.message, error.stack);
    throw new Error('Lỗi khi lấy danh sách nhóm');
  }
};

module.exports = { getGroupsByUserId };