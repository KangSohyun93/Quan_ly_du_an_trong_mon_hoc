// instructorGroupModel.js
const pool = require('../config/db');

const getGroupsByInstructorId = async (instructorId) => {
  try {
    console.log(`Bắt đầu truy vấn nhóm cho instructorId: ${instructorId}`);

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

    if (!rows || rows.length === 0) {
      console.log('Không tìm thấy lớp nào cho instructorId:', instructorId);
      return [];
    }

    const groupsWithMembers = await Promise.all(
      rows.map(async (row) => {
        if (!row.classId) {
          return {
            ...row,
            members: [],
            avatar: '/uploads/default.jpg'
          };
        }

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

const getGroupsByClassId = async (classId) => {
  try {
    console.log(`Bắt đầu truy vấn nhóm cho classId: ${classId}`);

    const [rows] = await pool.query(
      `
      SELECT 
        g.group_id AS groupId,
        g.group_name AS groupName,
        g.class_id AS classId,
        p.project_name AS projectName,
        p.description,
        p.status,
        (SELECT COUNT(DISTINCT gm.user_id) 
         FROM GroupMembers gm 
         WHERE gm.group_id = g.group_id) AS memberCount,
        (SELECT MAX(COALESCE(t.completed_at, t.created_at)) 
         FROM Tasks t 
         JOIN Sprints s ON t.sprint_id = s.sprint_id 
         JOIN Projects p2 ON s.project_id = p2.project_id 
         WHERE p2.group_id = g.group_id) AS lastUpdated
      FROM Groups g
      LEFT JOIN Projects p ON g.group_id = p.group_id
      WHERE g.class_id = ?;
      `,
      [classId]
    );

    console.log('Dữ liệu nhóm thô từ truy vấn chính:', rows);

    if (!rows || rows.length === 0) {
      console.log('Không tìm thấy nhóm nào cho classId:', classId);
      return [];
    }

    const groupsWithMembers = await Promise.all(
      rows.map(async (row) => {
        if (!row.groupId) {
          return {
            ...row,
            members: [],
            avatar: '/uploads/default.jpg'
          };
        }

        const [memberRows] = await pool.query(
          `
          SELECT DISTINCT u.user_id, u.avatar
          FROM GroupMembers gm
          JOIN Users u ON gm.user_id = u.user_id
          WHERE gm.group_id = ?;
          `,
          [row.groupId]
        );

        console.log(`Thành viên của groupId ${row.groupId}:`, memberRows);

        const members = memberRows.map(member => ({
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

    console.log('Dữ liệu nhóm cuối cùng:', groupsWithMembers);
    return groupsWithMembers;
  } catch (error) {
    console.error('Lỗi trong getGroupsByClassId:', error.message, error.stack);
    throw new Error('Lỗi khi lấy danh sách nhóm trong lớp');
  }
};

const getMembersByClassId = async (classId) => {
  try {
    console.log(`Bắt đầu truy vấn thành viên cho classId: ${classId}`);

    const [rows] = await pool.query(
      `
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.avatar,
        g.group_id,
        g.group_name,
        g.group_number,
        IF(g.group_id IS NULL, 'Chưa có nhóm', g.group_name) AS display_group_name,
        IF(g.group_id IS NULL, 999999, g.group_number) AS sort_group_number
      FROM ClassMembers cm
      JOIN Users u ON cm.user_id = u.user_id
      LEFT JOIN GroupMembers gm ON u.user_id = gm.user_id 
        AND gm.group_id IN (SELECT group_id FROM \`Groups\` WHERE class_id = ?)
      LEFT JOIN \`Groups\` g ON gm.group_id = g.group_id
      WHERE cm.class_id = ?
      ORDER BY sort_group_number, g.group_name, u.username;
      `,
      [classId, classId]
    );

    console.log('Dữ liệu thành viên thô từ truy vấn:', rows);

    if (!rows || rows.length === 0) {
      console.log('Không tìm thấy thành viên nào cho classId:', classId);
      return [];
    }

    const members = rows.map(row => ({
      user_id: row.user_id,
      username: row.username,
      email: row.email,
      avatar: row.avatar || '/uploads/default.jpg',
      group_id: row.group_id || null,
      group_name: row.display_group_name,
      group_number: row.sort_group_number
    }));

    console.log('Dữ liệu thành viên cuối cùng:', members);
    return members;
  } catch (error) {
    console.error('Lỗi trong getMembersByClassId:', error.message, error.stack);
    throw new Error('Lỗi khi lấy danh sách thành viên trong lớp');
  }
};

module.exports = { getGroupsByInstructorId, getGroupsByClassId, getMembersByClassId };