const { Group, Project, GroupMember, Class, User } = require("../models");

exports.group_introduce = async (req, res) => {
  try {
    const groupId = req.params.id;

    // Tìm group + leader + class
    const group = await Group.findOne({
      where: { group_id: groupId },
      include: [
        {
          model: User,
          as: 'leader',
          attributes: ['user_id', 'username', 'role', 'avatar'], // leader info
        },
        {
          model: Class,
          attributes: ['class_id', 'class_name'],
        },
      ],
    });
    
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Lấy project của nhóm
    const project = await Project.findOne({
      where: { group_id: group.group_id }
    });

    // Lấy thành viên nhóm
    const members = await GroupMember.findAll({
      where: { group_id: group.group_id },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'role', 'avatar']
        }
      ]
    });

    // Trả về JSON
    res.json({
      project: {
        name: project?.project_name || null,
        code: project?.project_id || null,
        description: project?.description || null,
        technologies: project?.tools_used || [],
        githubLink: project?.github_repo_url || null,
      },
      group: {
        code: group.group_number,
        name: group.group_name,
        className: group.Class.class_name,
        leader_id: group.leader.user_id
      },
      members: members.map(m => ({
        name: m.User.username,
        role: m.User.user_id === group.leader.user_id ? 'Leader' : 'Member',
        avatarUrl: m.User.avatar || null
      }))
    });

  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
