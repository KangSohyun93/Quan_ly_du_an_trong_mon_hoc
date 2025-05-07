const Group = require("../models/GroupModel");
const Project = require("../models/ProjectModel");
const GroupMember = require("../models/MemberGroupModel");
const Class = require("../models/ClassModel");
const User = require("../models/UserModel");

exports.group_introduce = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId)
      .populate("leader")
      .populate("classId");
    const project = await Project.findOne({ groupId: group._id });
    const members = await GroupMember.find({ groupId: group._id }).populate(
      "userId"
    );
    res.json({
      project: {
        name: project.projectName,
        code: project.project_id,
        description: project.description,
        technologies: project.toolsUsed, // hoặc lấy từ db nếu có
        githubLink: project.githubRepoUrl,
      },
      group: {
        code: group.groupNumber,
        name: group.groupName,
        className: group.classId.className,
      },
      members: members.map((m) => ({
        name: m.userId.name,
        role: m.userId.role || "Member", // giả sử có trường role
        avatarUrl: m.userId.avatarUrl || null,
      })),
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
