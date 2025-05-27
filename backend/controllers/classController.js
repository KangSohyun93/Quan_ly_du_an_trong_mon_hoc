const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const {
  Group,
  Project,
  GroupMember,
  Class,
  User,
  ClassMember,
} = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
exports.importClass = async (req, res) => {
  try {
    const classId = req.params.id;
    if (!req.file) return res.status(400).send("No file uploaded");

    // Lấy đường dẫn file đã upload
    const filePath = req.file.path;

    try {
      // Đọc workbook
      const workbook = xlsx.readFile(filePath);
      // Đọc sheet đầu tiên
      const sheetName = workbook.SheetNames[0];
      // console.log(">>>sheetName", sheetName);
      const worksheet = workbook.Sheets[sheetName];
      // console.log(">>>worksheet", worksheet);

      // Chuyển sheet sang JSON
      const data = xlsx.utils.sheet_to_json(worksheet);
      // console.log(">>>data", data);

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const groupNumber = row.__EMPTY;
        const email = row.__EMPTY_1?.trim().toLowerCase();
        const isLeader = row.__EMPTY_2 === "Yes";
        const groupName = row.__EMPTY_3;
        const projectName = row.__EMPTY_4;
        const description = row.__EMPTY_5;
        const toolsUsed = row.__EMPTY_6;

        console.log(`Row ${i + 1}:`);
        console.log(`  Group Number: ${groupNumber}`);
        console.log(`  Email: ${email}`);
        console.log(`  Is Leader: ${isLeader}`);
        console.log(`  Group Name: ${groupName}`);
        console.log(`  Project Name: ${projectName}`);
        console.log(`  Description: ${description}`);
        console.log(`  Tools Used: ${toolsUsed}`);
        console.log("---------------------");

        // Tìm user theo email
        const user = await User.findOne({ where: { email: email } });
        if (!user) continue;

        // Tìm (hoặc tạo) group theo groupNumber và class_id
        let group = await Group.findOne({
          where: { group_number: groupNumber, class_id: classId },
        });

        if (!group) {
          const groupData = {
            group_name: isLeader
              ? groupName || "Unnamed Group"
              : "Unnamed Group",
            group_number: groupNumber,
            class_id: classId,
          };

          // Chỉ thêm leader_id nếu là leader (và user_id tồn tại)
          if (isLeader && user && user.user_id) {
            groupData.leader_id = user.user_id;
          }

          group = await Group.create(groupData);
        }

        // Nếu là leader, có thể cập nhật leader_id hoặc group_name
        if (isLeader) {
          let updated = false;

          if (!group.leader_id && user && user.user_id) {
            group.leader_id = user.user_id;
            updated = true;
          }

          if (
            (!group.group_name || group.group_name === "Unnamed Group") &&
            groupName
          ) {
            group.group_name = groupName;
            updated = true;
          }

          if (updated) {
            await group.save();
          }
        }

        // Thêm vào GroupMembers nếu chưa có
        const existingGM = await GroupMember.findOne({
          where: { group_id: group.group_id, user_id: user.user_id },
        });
        if (!existingGM) {
          await GroupMember.create({
            group_id: group.group_id,
            user_id: user.user_id,
          });
        }

        // Nếu là leader và có project name → tạo Project nếu chưa có
        const existingProject = await Project.findOne({
          where: { group_id: group.group_id },
        });

        if (isLeader && projectName && !existingProject) {
          await Project.create({
            project_name: projectName,
            group_id: group.group_id,
            description: description || null,
            tools_used: toolsUsed || null,
          });
        }
      }

      // Xoá file tạm sau khi xử lý (tùy chọn)
      fs.unlinkSync(filePath);

      res.json({});
    } catch (err) {
      console.error("error:", err);
      res.status(500).send("Lỗi đọc file Excel");
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
exports.joinClass = async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;
  try {
    //console.log(">>>userid:", userId);
    const classroom = await Class.findOne({
      where: { secret_code: code }, // ✅ đúng cú pháp Sequelize
    });
    //console.log(">>>classroom:", classroom);
    if (!classroom) {
      return res.status(404).json({ message: "Lớp không tồn tại" });
    }
    // 2. Kiểm tra xem user đã là thành viên chưa
    const existingMember = await ClassMember.findOne({
      where: {
        class_id: classroom.class_id, // hoặc classroom.id nếu field tên là id
        user_id: userId,
      },
    });
    // console.log(">>>>>>>>>>>>existingMember", existingMember);
    if (existingMember) {
      return res.status(400).json({ message: "Bạn đã tham gia lớp này rồi" });
    }

    // 3. Tạo bản ghi ClassMember mới
    const newMember = new ClassMember({
      class_id: classroom.class_id,
      user_id: userId,
    });
    await newMember.save();

    return res
      .status(200)
      .json({ message: "Tham gia lớp thành công", class: classroom });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
exports.searchClass = async (req, res) => {
  const { searchText = "" } = req.query;
  const userId = req.userId;

  try {
    const classes = await Class.findAll({
      where: {
        [Op.or]: [
          {
            class_name: {
              [Op.like]: `%${searchText}%`,
            },
          },
          {
            semester: searchText,
          },
        ],
      },
      include: [
        {
          model: ClassMember,
          include: [
            {
              model: User,
              attributes: ["user_id", "username", "avatar"],
            },
          ],
        },
        {
          model: Group,
          include: [
            {
              model: Project,
              attributes: ["project_id", "project_name"],
            },
            {
              model: GroupMember,
              as: "groupMembers",
              where: { user_id: userId },
              required: false,
              include: [
                {
                  model: User,
                  attributes: ["user_id", "username"],
                },
              ],
            },
          ],
        },
      ],
      attributes: ["class_id", "class_name", "semester"],
    });

    const result = classes.map((c, index) => {
      const members =
        c.ClassMembers?.map((cm) => ({
          id: cm.User.user_id,
          username: cm.User.username,
          avatar: cm.User.avatar,
        })) || [];

      // Kiểm tra xem user có trong class không
      const hasJoined = c.ClassMembers.some((cm) => cm.user_id === +userId);

      // Tìm group user đang ở (nếu có)
      const userGroup = c.Groups?.find((g) =>
        g.groupMembers?.some((gm) => gm.user_id === +userId)
      );

      return {
        classId: c.class_id,
        className: c.class_name,
        semester: c.semester,
        memberCount: members.length,
        members,
        avatarNumber: index,
        avatarColor: getRandomAvatarColor(),
        ...(hasJoined && userGroup
          ? {
              groupName: userGroup.group_name,
              projectName: userGroup.Project?.project_name || null,
              projectId: userGroup.Project?.project_id || null,
            }
          : {}),
      };
    });

    return res.json(result);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm lớp:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
};
exports.getClass = async (req, res) => {
  const userId = req.userId;
  try {
    const classes = await Class.findAll({
      include: [
        // Lọc các lớp mà user này đang tham gia
        {
          model: User,
          through: { model: ClassMember },
          where: { user_id: userId },
          attributes: [], // Không cần lấy dữ liệu ở đây
          required: true, // bắt buộc user phải thuộc lớp
        },
        // Lấy toàn bộ member của lớp (ClassMembers)
        {
          model: ClassMember,
          include: [
            {
              model: User,
              attributes: ["user_id", "username", "avatar"],
            },
          ],
        },
        {
          model: Group,
          include: [
            {
              model: Project,
              attributes: ["project_name", "project_id"],
            },
            {
              model: GroupMember,
              as: "groupMembers",
              include: [
                {
                  model: User,
                  attributes: ["user_id", "username", "avatar"],
                },
              ],
            },
          ],
        },
      ],
      attributes: ["class_id", "class_name"],
    });

    const result = classes.map((c, index) => {
      const group = c.Groups[0];

      // Lấy member từ ClassMember
      const members =
        c.ClassMembers?.map((cm) => ({
          id: cm.User.user_id,
          username: cm.User.username,
          avatar: cm.User.avatar,
        })) || [];

      return {
        classId: c.class_id,
        className: c.class_name,
        groupName: group?.group_name || null,
        projectName: group?.Project?.project_name || null,
        projectId: group?.Project?.project_id || null,
        memberCount: members.length,
        members,
        avatarNumber: index,
        avatarColor: getRandomAvatarColor(),
      };
    });

    return res.json(result);
  } catch (err) {
    console.error("Error fetching user class info:", err);
    return res.status(500).json({ error: "Lỗi server" });
  }
};

function getRandomAvatarColor() {
  const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#3F51B5",
    "#03A9F4",
    "#009688",
    "#4CAF50",
    "#FF5722",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
