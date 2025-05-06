const Group = require("../models/GroupModel");
const Project = require("../models/ProjectModel");
const GroupMember = require("../models/MemberGroupModel");
const User = require("../models/UserModel");

exports.group_introduce = async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate("leaderId");
    const project = await Project.findOne({ classId: group.classId });
    const members = await GroupMember.find({ groupId }).populate("userId");

    res.json({
      project: {
        name: project.project_name,
        code: project.project_id,
        description: project.description,
        technologies: ["HTML", "CSS", "ReactJS", "NodeJS"], // hoặc lấy từ db nếu có
        githubLink: project.github_repo_url,
      },
      group: {
        code: groupId,
        name: group.group_name,
      },
      members: members.map((m) => ({
        name: m.userId.name,
        role: m.userId.role || "Member", // giả sử có trường role
        avatarUrl: m.userId.avatarUrl || null,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};
