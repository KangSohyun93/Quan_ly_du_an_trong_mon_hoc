const pool = require('../config/db');

const getClassesByInstructorId = async (instructorId) => {
  try {
    console.log(`Bắt đầu truy vấn lớp cho instructor_id: ${instructorId}`);

    const [rows] = await pool.query(
      `
      SELECT 
        c.class_id,
        c.class_name,
        COUNT(DISTINCT g.group_id) as group_count,
        COUNT(gm.user_id) as member_count
      FROM Classes c
      LEFT JOIN Groups g ON c.class_id = g.class_id
      LEFT JOIN GroupMembers gm ON g.group_id = gm.group_id
      WHERE c.instructor_id = ?
      GROUP BY c.class_id, c.class_name;
      `,
      [instructorId]
    );

    console.log(`Truy vấn trả về ${rows.length} lớp`);

    const classes = await Promise.all(
      rows.map(async (classItem, index) => {
        const [projects] = await pool.query(
          `
          SELECT p.project_name
          FROM Projects p
          JOIN Groups g ON p.group_id = g.group_id
          WHERE g.class_id = ?
          `,
          [classItem.class_id]
        );

        const [members] = await pool.query(
          `
          SELECT DISTINCT u.user_id, u.avatar
          FROM GroupMembers gm
          JOIN Groups g ON gm.group_id = g.group_id
          JOIN Users u ON gm.user_id = u.user_id
          WHERE g.class_id = ?
          `,
          [classItem.class_id]
        );

        return {
          className: classItem.class_name,
          groupCount: classItem.group_count,
          projectNames: projects.map(p => p.project_name || 'Chưa có dự án'),
          memberCount: classItem.member_count,
          avatarNumber: (index + 1).toString(),
          avatarColor: ['#18a0fb', '#ff0000', '#00ff00', '#ffff00', '#0000ff', '#800080'][index % 6],
          members: members.map((member) => ({
            userId: member.user_id,
            avatar: member.avatar,
          })),
        };
      })
    );

    return classes;
  } catch (error) {
    console.error('Lỗi trong getClassesByInstructorId:', error.message, error.stack);
    throw new Error(`Lỗi khi lấy danh sách lớp: ${error.message}`);
  }
};

module.exports = { getClassesByInstructorId };