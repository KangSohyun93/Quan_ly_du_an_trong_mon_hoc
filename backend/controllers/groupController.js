const { Group, Project, GroupMember, Class, User } = require('../models');
const sequelize = require('sequelize');

const getGroups = async (req, res) => {
  try {
    const userId = parseInt(req.query.user_id, 10);
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ message: 'user_id phải là số nguyên dương' });
    }

    console.log(`Yêu cầu lấy nhóm cho userId: ${userId}`);
    const groups = await Group.findAll({
      include: [
        {
          model: Class,
          attributes: ['class_id', 'class_name'],
        },
        {
          model: Project,
          attributes: ['project_id', 'project_name'],
        },
        {
          model: GroupMember,
          as: 'groupMembers', // Thêm dòng này!
          where: { user_id: userId },
          attributes: [],
        },
      ],
      attributes: [
        'group_id',
        'group_name',
        'class_id',
        [sequelize.fn('COUNT', sequelize.col('groupMembers.user_id')), 'memberCount'],
      ],
      group: ['Group.group_id', 'Class.class_id', 'Project.project_id'],
    });

    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => {
        const members = await GroupMember.findAll({
          where: { group_id: group.group_id },
          include: [{ model: User, attributes: ['user_id', 'avatar'] }],
        });
        return {
          group_id: group.group_id,
          group_name: group.group_name,
          classId: group.class_id,
          className: group.Class?.class_name,
          projectId: group.Project?.project_id,
          projectName: group.Project?.project_name,
          memberCount: group.dataValues.memberCount,
          members: members.map((m) => ({
            user_id: m.User.user_id,
            avatar: m.User.avatar || '/uploads/default.jpg',
          })),
          avatar: members.length > 0 ? members[0].User.avatar || '/uploads/default.jpg' : '/uploads/default.jpg',
        };
      })
    );

    console.log(`Trả về ${groupsWithMembers.length} nhóm cho userId: ${userId}`);
    res.status(200).json(groupsWithMembers);
  } catch (error) {
    console.error('Lỗi trong getGroups:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const group_introduce = async (req, res) => {
  try {
    const groupId = parseInt(req.params.id, 10);
    if (isNaN(groupId) || groupId <= 0) {
      return res.status(400).json({ message: 'groupId phải là số nguyên dương' });
    }

    console.log(`Yêu cầu thông tin nhóm: groupId=${groupId}`);
    const group = await Group.findOne({
      where: { group_id: groupId },
      include: [
        {
          model: User,
          as: 'leader',
          attributes: ['user_id', 'username', 'role', 'avatar'],
        },
        {
          model: Class,
          attributes: ['class_id', 'class_name'],
        },
        {
          model: Project,
          attributes: ['project_id', 'project_name', 'description', 'tools_used', 'github_repo_url'],
        },
      ],
    });

    if (!group) {
      console.warn(`Không tìm thấy nhóm: groupId=${groupId}`);
      return res.status(404).json({ message: 'Nhóm không tồn tại' });
    }

    const members = await GroupMember.findAll({
      where: { group_id: group.group_id },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'role', 'avatar'],
        },
      ],
    });

    const response = {
      project: {
        name: group.Project?.project_name || null,
        code: group.Project?.project_id || null,
        description: group.Project?.description || null,
        technologies: group.Project?.tools_used ? group.Project.tools_used.split(',') : [],
        githubLink: group.Project?.github_repo_url || null,
      },
      group: {
        code: group.group_number,
        name: group.group_name,
        className: group.Class?.class_name,
        leader_id: group.leader?.user_id,
      },
      members: members.map((m) => ({
        name: m.User.username,
        role: m.User.user_id === group.leader?.user_id ? 'Leader' : 'Member',
        avatarUrl: m.User.avatar || null,
      })),
    };

    console.log(`Trả về thông tin nhóm: groupId=${groupId}`);
    res.status(200).json(response);
  } catch (error) {
    console.error('Lỗi trong group_introduce:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { getGroups, group_introduce };