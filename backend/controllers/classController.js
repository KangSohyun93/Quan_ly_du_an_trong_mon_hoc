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
  console.log("🔥 Đã vào controller importClass");
  try {
    const classId = req.params.id;
    if (!req.file) return res.status(400).send("No file uploaded");

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath); // ✅ Đọc file từ ổ đĩa
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // Dạng mảng

    console.log(Object.keys(data[0]));

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const groupNumber = row[0]; // cột 0
      const email = row[1]?.trim().toLowerCase(); // cột 1
      const isLeader = row[2]?.toLowerCase() === "yes"; // cột 2
      const groupName = row[3];
      const projectName = row[4];
      const description = row[5];
      const toolsUsed = row[6];
      const linkGit = row[7];
      if (!email || !groupNumber) continue;
      // Tìm user theo email
      const user = await User.findOne({ where: { email } });
      if (!user) continue;

      // Đảm bảo user đã là thành viên của lớp
      const existingClassMember = await ClassMember.findOne({
        where: { class_id: classId, user_id: user.user_id },
      });
      if (!existingClassMember) {
        await ClassMember.create({
          class_id: classId,
          user_id: user.user_id,
        });
      }

      // Tìm hoặc tạo group
      let group = await Group.findOne({
        where: { group_number: groupNumber, class_id: classId },
      });

      if (!group) {
        const groupData = {
          group_name: isLeader ? groupName || "Unnamed Group" : "Unnamed Group",
          group_number: groupNumber,
          class_id: classId,
        };

        if (isLeader && user.user_id) {
          groupData.leader_id = user.user_id;
        }

        group = await Group.create(groupData);
      }

      // Nếu là leader, cập nhật leader_id và group_name nếu cần
      if (isLeader) {
        let updated = false;

        if (!group.leader_id && user.user_id) {
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

      // Thêm user vào group nếu chưa có
      const existingGM = await GroupMember.findOne({
        where: { group_id: group.group_id, user_id: user.user_id },
      });

      if (!existingGM) {
        await GroupMember.create({
          group_id: group.group_id,
          user_id: user.user_id,
        });
      }

      // Nếu là leader và có project name, tạo project nếu chưa có
      const existingProject = await Project.findOne({
        where: { group_id: group.group_id },
      });
      if (isLeader && projectName && existingProject) {
        await existingProject.update({
          project_name: projectName,
          description: description || null,
          tools_used: toolsUsed || null,
          github_repo_url: linkGit || null,
        });
      }

      if (isLeader && projectName && !existingProject) {
        await Project.create({
          project_name: projectName,
          group_id: group.group_id,
          description: description || null,
          tools_used: toolsUsed || null,
          github_repo_url: linkGit || null,
        });
      }
    }

    // Xoá file tạm
    fs.unlinkSync(filePath);

    return res.json({ message: "Import thành công" });
  } catch (error) {
    console.error("Lỗi khi import class:", error);
    return res.status(500).json({ error: "Lỗi xử lý dữ liệu Excel" });
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
      attributes: ["class_id", "class_name", "semester", "instructor_id"],
    });

    const result = classes.map((c, index) => {
      const members =
        c.ClassMembers?.map((cm) => ({
          id: cm.User.user_id,
          username: cm.User.username,
          avatar: cm.User.avatar,
        })) || [];

      const hasJoined = c.ClassMembers.some((cm) => cm.user_id === userId);
      const userGroup = c.Groups?.find((g) =>
        g.groupMembers?.some((gm) => gm.user_id === userId)
      );

      const groupCount = c.Groups?.length || 0;

      const baseResult = {
        instructorId: c.instructor_id,
        classId: c.class_id,
        className: c.class_name,
        semester: c.semester,
        memberCount: members.length,
        groupCount, // 👈 thêm dòng này
        members,
        avatarNumber: index,
        avatarColor: getRandomAvatarColor(),
      };

      if (!userGroup) return baseResult;

      return {
        ...baseResult,
        ...(hasJoined
          ? {
              groupName: userGroup.group_name,
              groupId: userGroup.group_id,
              projectName: userGroup.Project?.project_name || null,
              projectId: userGroup.Project?.project_id || null,
              hasJoin: true,
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
      attributes: ["semester", "class_id", "class_name"],
    });

    const result = classes.map((c, index) => {
      // Tìm group mà user đang tham gia
      const userGroup = c.Groups.find((group) =>
        group.groupMembers?.some((gm) => gm.user_id === userId)
      );

      // Lấy member từ ClassMember
      const members =
        c.ClassMembers?.map((cm) => ({
          id: cm.User.user_id,
          username: cm.User.username,
          avatar: cm.User.avatar,
        })) || [];

      return {
        hasJoin: true,
        classId: c.class_id,
        className: c.class_name,
        semester: c.semester,
        groupName: userGroup?.group_name || null,
        groupId: userGroup?.group_id || null,
        projectName: userGroup?.Project?.project_name || null,
        projectId: userGroup?.Project?.project_id || null,
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
exports.getAllClass = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: User,
          as: "instructor", // alias đặt rõ ràng
          attributes: ["user_id", "username"],
        },
      ],
      attributes: ["class_id", "class_name", "semester", "created_at"],
      order: [["created_at", "DESC"]],
      raw: true,
      nest: true,
    });
    const result = classes.map((c, index) => ({
      classId: c.class_id,
      className: c.class_name || "",
      semester: c.semester,
      createdAt: c.created_at,
      createdBy: c.instructor?.username || "Unknown",
      avatarNumber: index,
      avatarColor: getRandomAvatarColor(),
    }));

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching classes:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.getClassforGV = async (req, res) => {
  try {
    const userId = req.userId;

    const classes = await Class.findAll({
      where: { instructor_id: userId },
      include: [
        {
          model: User,
          as: "instructor",
          attributes: ["user_id", "username"],
        },
        {
          model: ClassMember,
          include: [
            {
              model: User,
              attributes: ["user_id", "username", "avatar", "email"],
            },
          ],
        },
        {
          model: Group,
          include: [
            {
              model: User, // Thành viên nhóm
              attributes: ["user_id", "username", "avatar", "email"],
              through: { attributes: [] }, // Xóa thông tin phụ từ bảng trung gian (GroupMember)
            },
          ],
          attributes: ["group_id", "group_name", "group_number"],
        },
      ],
      attributes: ["class_id", "class_name", "semester", "created_at"],
      order: [["created_at", "DESC"]],
    });

    const result = classes.map((c, index) => {
      // Members của lớp học
      const members =
        c.ClassMembers?.map((cm) => ({
          id: cm.User.user_id,
          username: cm.User.username,
          avatar: cm.User.avatar,
          email: cm.User.email,
        })) || [];

      // Danh sách các group trong lớp học
      const groups =
        c.Groups?.map((g) => ({
          groupId: g.group_id,
          groupName: g.group_name,
          groupNumber: g.group_number,
          members:
            g.Users?.map((u) => ({
              id: u.user_id,
              username: u.username,
              avatar: u.avatar,
              //email: u.email,
            })) || [],
        })) || [];

      return {
        hasJoin: true,
        classId: c.class_id,
        className: c.class_name,
        semester: c.semester,
        memberCount: members.length,
        groupCount: groups.length,
        members,
        groups,
        avatarNumber: index,
        avatarColor: getRandomAvatarColor(),
      };
    });

    return res.json(result);
  } catch (error) {
    console.error("Error fetching classes for instructor:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.createClass = async (req, res) => {
  const { class_id, class_name, semester, secret_code } = req.body;
  const userId = req.userId;
  // Kiểm tra dữ liệu đầu vào
  //console.log(">>>createClass:", req.body);
  try {
    // Kiểm tra xem lớp đã tồn tại chưa
    const existingClass = await Class.findOne({
      where: { class_id: class_id },
    });

    if (existingClass) {
      return res.status(400).json({ message: "Lớp đã tồn tại" });
    }

    // Tạo lớp mới
    const newClass = await Class.create({
      class_id: class_id,
      class_name: class_name,
      semester,
      instructor_id: userId,
      secret_code: secret_code || generateSecretCode(), // Nếu không có secret_code thì tự động tạo
    });

    // // Tạo bản ghi ClassMember cho người tạo lớp
    // await ClassMember.create({
    //   class_id: newClass.class_id,
    //   user_id: userId,
    // });

    return res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
};
const generateSecretCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};
exports.deleteClass = async (req, res) => {
  const classId = req.params.id;
  try {
    // Tìm lớp theo ID
    const classroom = await Class.findByPk(classId);
    if (!classroom) {
      return res.status(404).json({ message: "Lớp không tồn tại" });
    }

    // Xoá lớp
    await classroom.destroy();
    return res.status(200).json({ message: "Xoá lớp thành công" });
  } catch (error) {
    console.error("Error deleting class:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
};
exports.updateClass = async (req, res) => {
  const classId = req.params.id;
  const { class_name, semester, secret_code } = req.body;

  try {
    // Tìm lớp theo ID
    const classroom = await Class.findByPk(classId);
    if (!classroom) {
      return res.status(404).json({ message: "Lớp không tồn tại" });
    }

    // Cập nhật thông tin lớp
    classroom.class_name = class_name || classroom.class_name;
    classroom.semester = semester || classroom.semester;
    classroom.secret_code = secret_code || classroom.secret_code;

    await classroom.save();

    return res.status(200).json(classroom);
  } catch (error) {
    console.error("Error updating class:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
};
