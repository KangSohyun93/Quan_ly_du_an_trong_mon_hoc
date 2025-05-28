const { Group, Class, User, ClassMember, GroupMember, Project, Sprint, Task, Sequelize } = require('../models');
const { Op } = require('sequelize');

const getGroupsByInstructorId = async (req, res) => {
  try {
    const instructorId = req.userId;
    console.log(`Bắt đầu truy vấn nhóm cho instructorId: ${instructorId}`);

    const classes = await Class.findAll({
      where: { instructor_id: instructorId },
      attributes: [
        'class_id',
        'class_name',
        'semester',
        [
          Sequelize.literal(`(
            SELECT COUNT(DISTINCT g.group_id)
            FROM groups g
            WHERE g.class_id = Class.class_id
          )`),
          'groupCount',
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(DISTINCT cm.user_id)
            FROM classmembers cm
            WHERE cm.class_id = Class.class_id
          )`),
          'studentCount',
        ],
      ],
    });

    console.log('Dữ liệu lớp thô:', classes);

    if (!classes || classes.length === 0) {
      console.log('Không tìm thấy lớp nào cho instructorId:', instructorId);
      return res.status(200).json([]);
    }

    const groupsWithMembers = await Promise.all(
      classes.map(async (cls) => {
        const classId = cls.class_id;
        const members = await ClassMember.findAll({
          where: { class_id: classId },
          include: [
            {
              model: User,
              attributes: ['user_id', 'avatar'],
            },
          ],
        });

        console.log(`Thành viên của classId ${classId}:`, members);

        const formattedMembers = members.map((m) => ({
          user_id: m.User.user_id,
          avatar: m.User.avatar || '/uploads/default.jpg',
        }));

        return {
          classId: cls.class_id,
          className: cls.class_name,
          semester: cls.semester,
          groupCount: cls.dataValues.groupCount,
          studentCount: cls.dataValues.studentCount,
          members: formattedMembers,
          avatar: formattedMembers.length > 0 ? formattedMembers[0].avatar : '/uploads/default.jpg',
        };
      })
    );

    console.log('Dữ liệu lớp cuối cùng:', groupsWithMembers);
    res.status(200).json(groupsWithMembers);
  } catch (error) {
    console.error('Lỗi trong getGroupsByInstructorId:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getGroupsByClassId = async (req, res) => {
  try {
    const classId = parseInt(req.params.classId, 10);
    if (isNaN(classId) || classId <= 0) {
      return res.status(400).json({ message: 'classId phải là số nguyên dương' });
    }

    console.log(`Bắt đầu truy vấn nhóm cho classId: ${classId}`);

    const groups = await Group.findAll({
      where: { class_id: classId },
      include: [
        {
          model: Project,
          attributes: ['project_name', 'description', 'status'],
        },
      ],
      attributes: [
        'group_id',
        'group_name',
        'class_id',
        [
          Sequelize.literal(`(
            SELECT COUNT(DISTINCT gm.user_id)
            FROM group_members gm
            WHERE gm.group_id = Group.group_id
          )`),
          'memberCount',
        ],
        [
          Sequelize.literal(`(
            SELECT MAX(COALESCE(t.completed_at, t.created_at))
            FROM tasks t
            JOIN sprints s ON t.sprint_id = s.sprint_id
            JOIN projects p2 ON s.project_id = p2.project_id
            WHERE p2.group_id = Group.group_id
          )`),
          'lastUpdated',
        ],
      ],
    });

    console.log('Dữ liệu nhóm thô:', groups);

    if (!groups || groups.length === 0) {
      console.log('Không tìm thấy nhóm nào cho classId:', classId);
      return res.status(200).json([]);
    }

    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => {
        const members = await GroupMember.findAll({
          where: { group_id: group.group_id },
          include: [
            {
              model: User,
              attributes: ['user_id', 'avatar'],
            },
          ],
        });

        console.log(`Thành viên của groupId ${group.group_id}:`, members);

        const formattedMembers = members.map((m) => ({
          user_id: m.User.user_id,
          avatar: m.User.avatar || '/uploads/default.jpg',
        }));

        return {
          groupId: group.group_id,
          groupName: group.group_name,
          classId: group.class_id,
          projectName: group.Project?.project_name || null,
          description: group.Project?.description || null,
          status: group.Project?.status || null,
          memberCount: group.dataValues.memberCount,
          lastUpdated: group.dataValues.lastUpdated,
          members: formattedMembers,
          avatar: formattedMembers.length > 0 ? formattedMembers[0].avatar : '/uploads/default.jpg',
        };
      })
    );

    console.log('Dữ liệu nhóm cuối cùng:', groupsWithMembers);
    res.status(200).json(groupsWithMembers);
  } catch (error) {
    console.error('Lỗi trong getGroupsByClassId:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getMembersByClassId = async (req, res) => {
  try {
    const classId = parseInt(req.params.classId, 10);
    if (isNaN(classId) || classId <= 0) {
      return res.status(400).json({ message: 'classId phải là số nguyên dương' });
    }

    console.log(`Bắt đầu truy vấn thành viên cho classId: ${classId}`);

    const members = await ClassMember.findAll({
      where: { class_id: classId },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'email', 'avatar'],
        },
        {
          model: GroupMember,
          required: false,
          include: [
            {
              model: Group,
              where: { class_id: classId },
              required: false,
              attributes: ['group_id', 'group_name', 'group_number'],
            },
          ],
        },
      ],
    });

    console.log('Dữ liệu thành viên thô:', members);

    if (!members || members.length === 0) {
      console.log('Không tìm thấy thành viên nào cho classId:', classId);
      return res.status(200).json([]);
    }

    const formattedMembers = members.map((m) => ({
      user_id: m.User.user_id,
      username: m.User.username,
      email: m.User.email,
      avatar: m.User.avatar || '/uploads/default.jpg',
      group_id: m.GroupMembers[0]?.Group?.group_id || null,
      group_name: m.GroupMembers[0]?.Group?.group_name || 'Chưa có nhóm',
      group_number: m.GroupMembers[0]?.Group?.group_number || 999999,
    })).sort((a, b) => {
      if (a.group_number === b.group_number) {
        return a.username.localeCompare(b.username);
      }
      return a.group_number - b.group_number;
    });

    console.log('Dữ liệu thành viên cuối cùng:', formattedMembers);
    res.status(200).json(formattedMembers);
  } catch (error) {
    console.error('Lỗi trong getMembersByClassId:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getGroupsByInstructorId, getGroupsByClassId, getMembersByClassId };