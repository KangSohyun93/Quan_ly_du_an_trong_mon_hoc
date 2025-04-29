const pool = require('../config/db');

// Lấy danh sách nhóm dựa trên user_id
const getGroupsByUserId = async (userId) => {
  try {
    console.log(`Bắt đầu truy vấn nhóm cho user_id: ${userId}`);
    
    // Truy vấn thông tin nhóm
    const [rows] = await pool.query(
      `
      SELECT 
        c.class_id,
        c.class_name,
        g.group_id,
        g.group_name,
        p.project_name,
        (SELECT COUNT(*) FROM GroupMembers gm2 WHERE gm2.group_id = g.group_id) as member_count
      FROM Classes c
      JOIN Groups g ON c.class_id = g.class_id
      JOIN Projects p ON p.group_id = g.group_id
      JOIN GroupMembers gm ON gm.group_id = g.group_id
      WHERE gm.user_id = ?
      GROUP BY g.group_id;
      `,
      [userId]
    );

    console.log(`Truy vấn trả về ${rows.length} nhóm`);

    // Lấy danh sách thành viên cho từng nhóm
    const groups = await Promise.all(
      rows.map(async (group, index) => {
        console.log(`Lấy thành viên cho group_id: ${group.group_id}`);
        const [members] = await pool.query(
          `
          SELECT u.user_id, u.avatar
          FROM GroupMembers gm
          JOIN Users u ON gm.user_id = u.user_id
          WHERE gm.group_id = ?
          `,
          [group.group_id]
        );

        return {
          className: group.class_name,
          groupName: group.group_name,
          projectName: group.project_name || 'Chưa có dự án',
          memberCount: group.member_count,
          avatarNumber: (index + 1).toString(),
          avatarColor: ['#18a0fb', '#ff0000', '#00ff00', '#ffff00', '#0000ff', '#800080'][index % 6],
          members: members.map((member) => ({
            userId: member.user_id,
            avatar: member.avatar,
          })),
        };
      })
    );

    return groups;
  } catch (error) {
    console.error('Lỗi trong getGroupsByUserId:', error.message, error.stack);
    throw new Error(`Lỗi khi lấy danh sách nhóm: ${error.message}`);
  }
};

module.exports = { getGroupsByUserId };