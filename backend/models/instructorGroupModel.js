const pool = require('../config/db');

const getGroupsByInstructorId = async (instructorId) => {
  try {
    console.log(`Bắt đầu truy vấn nhóm cho instructorId: ${instructorId}`);

    // Truy vấn chính: Lấy thông tin duy nhất của mỗi lớp và tổng hợp dữ liệu nhóm/thành viên
    const [rows] = await pool.query(
      `
      SELECT 
        c.class_id AS classId,
        c.class_name AS className,
        c.semester,
        (SELECT COUNT(DISTINCT g.group_id) 
         FROM Groups g 
         WHERE g.class_id = c.class_id) AS groupCount,
        (SELECT COUNT(DISTINCT cm.user_id) 
         FROM ClassMembers cm
         WHERE cm.class_id = c.class_id) AS studentCount
      FROM Classes c
      WHERE c.instructor_id = ?;
      `,
      [instructorId]
    );

    console.log('Dữ liệu lớp thô từ truy vấn chính:', rows);

    // Nếu không có lớp nào, trả về mảng rỗng
    if (!rows || rows.length === 0) {
      console.log('Không tìm thấy lớp nào cho instructorId:', instructorId);
      return [];
    }

    // Tổng hợp tất cả thành viên từ các nhóm trong cùng classId
    const groupsWithMembers = await Promise.all(
      rows.map(async (row) => {
        if (!row.classId) {
          return {
            ...row,
            members: [],
            avatar: '/uploads/default.jpg'
          };
        }

        // Lấy tất cả thành viên từ các nhóm trong cùng classId
        const [allMemberRows] = await pool.query(
          `
        SELECT DISTINCT u.user_id, u.avatar
        FROM ClassMembers cm
        JOIN Users u ON cm.user_id = u.user_id
        WHERE cm.class_id = ?;
          `,
          [row.classId]
        );

        console.log(`Tất cả thành viên của classId ${row.classId}:`, allMemberRows);

        const members = allMemberRows.map(member => ({
          user_id: member.user_id,
          avatar: member.avatar || '/uploads/default.jpg'
        }));
        return {
          ...row,
          members: members,
          avatar: (members.length > 0 ? members[0].avatar : '/uploads/default.jpg')
        };
      })
    );

    console.log('Dữ liệu lớp cuối cùng:', groupsWithMembers);
    return groupsWithMembers;
  } catch (error) {
    console.error('Lỗi trong getGroupsByInstructorId:', error.message, error.stack);
    throw new Error('Lỗi khi lấy danh sách nhóm');
  }
};

module.exports = { getGroupsByInstructorId };