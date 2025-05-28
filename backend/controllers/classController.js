const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { Group, Project, GroupMember, Class, User, ClassMember } = require('../models');
const { Op } = require('sequelize');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../frontend/public/uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file Excel'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('file');

// Định nghĩa hàm thông thường thay vì exports.functionName
const createClass = async (req, res) => {
  const { class_id, class_name, semester, secret_code, instructor_id } = req.body;
  const classCode = secret_code || Math.random().toString(36).substring(2, 10).toUpperCase();

  try {
    const existingClass = await Class.findOne({ where: { class_id } });
    if (existingClass) {
      return res.status(400).json({ error: 'Class ID already exists' });
    }

    const existingCode = await Class.findOne({ where: { secret_code: classCode } });
    if (existingCode) {
      return res.status(400).json({ error: 'Secret code already exists' });
    }

    const instructor = await User.findOne({ where: { user_id: instructor_id } });
    if (!instructor) {
      return res.status(400).json({ error: 'Instructor ID does not exist' });
    }

    const newClass = await Class.create({
      class_id,
      class_name,
      semester,
      secret_code: classCode,
      instructor_id,
    });

    res.status(201).json({
      message: 'Class created successfully',
      class: {
        classId: newClass.class_id,
        className: newClass.class_name,
        semester: newClass.semester,
        code: newClass.secret_code,
      },
    });
  } catch (err) {
    console.error('Error creating class:', err);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

const updateClass = async (req, res) => {
  const { classId } = req.params;
  const { class_name, semester, secret_code } = req.body;
  const instructorId = req.userId; // Lấy từ middleware verifyToken

  if (!class_name && !semester && !secret_code) {
    return res.status(400).json({ error: 'At least one field (class_name, semester, secret_code) is required' });
  }

  try {
    const classToUpdate = await Class.findOne({
      where: { class_id: classId, instructor_id: instructorId },
    });
    if (!classToUpdate) {
      return res.status(403).json({ error: 'Unauthorized or class not found' });
    }

    const updates = {};
    if (class_name) updates.class_name = class_name;
    if (semester) updates.semester = semester;
    if (secret_code) {
      const existingCode = await Class.findOne({ where: { secret_code, class_id: { [Op.ne]: classId } } });
      if (existingCode) {
        return res.status(400).json({ error: 'Secret code already exists' });
      }
      updates.secret_code = secret_code;
    }

    await classToUpdate.update(updates);
    res.status(200).json({ message: 'Class updated successfully' });
  } catch (err) {
    console.error('Error updating class:', err);
    res.status(500).json({ error: 'Failed to update class' });
  }
};

const getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.status(200).json(classes);
  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

const deleteClass = async (req, res) => {
  const { classId } = req.params;

  try {
    const classToDelete = await Class.findOne({ where: { class_id: classId } });
    if (!classToDelete) {
      return res.status(404).json({ error: 'Class not found' });
    }

    await classToDelete.destroy();
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error('Error deleting class:', err);
    res.status(500).json({ error: 'Failed to delete class' });
  }
};

const importClass = async (req, res) => {
  try {
    const classId = parseInt(req.params.id, 10);
    if (isNaN(classId) || classId <= 0) {
      return res.status(400).json({ message: 'classId phải là số nguyên dương' });
    }

    upload(req, res, async (err) => {
      if (err) {
        console.error('Lỗi upload file:', err.message);
        return res.status(400).json({ message: `Lỗi upload: ${err.message}` });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'Không có file được upload' });
      }

      console.log(`Nhập lớp từ Excel cho classId: ${classId}`);
      const filePath = req.file.path;

      try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const groupNumber = row.__EMPTY;
          const email = row.__EMPTY_1?.trim().toLowerCase();
          const isLeader = row.__EMPTY_2 === 'Yes';
          const groupName = row.__EMPTY_3;
          const projectName = row.__EMPTY_4;
          const description = row.__EMPTY_5;
          const toolsUsed = row.__EMPTY_6;

          console.log(`Xử lý dòng ${i + 1}: email=${email}, groupNumber=${groupNumber}, isLeader=${isLeader}`);

          if (!email) continue;

          const user = await User.findOne({ where: { email } });
          if (!user) {
            console.warn(`Không tìm thấy user với email: ${email}`);
            continue;
          }

          let group = await Group.findOne({
            where: { group_number: groupNumber, class_id: classId },
          });

          if (!group) {
            const groupData = {
              group_name: isLeader ? groupName || 'Unnamed Group' : 'Unnamed Group',
              group_number: groupNumber,
              class_id: classId,
              leader_id: isLeader && user ? user.user_id : null,
            };
            group = await Group.create(groupData);
            console.log(`Tạo group mới: group_id=${group.group_id}`);
          }

          if (isLeader) {
            let updated = false;
            if (!group.leader_id && user) {
              group.leader_id = user.user_id;
              updated = true;
            }
            if (groupName && group.group_name === 'Unnamed Group') {
              group.group_name = groupName;
              updated = true;
            }
            if (updated) {
              await group.save();
              console.log(`Cập nhật group: group_id=${group.group_id}`);
            }
          }

          const existingGM = await GroupMember.findOne({
            where: { group_id: group.group_id, user_id: user.user_id },
          });
          if (!existingGM) {
            await GroupMember.create({
              group_id: group.group_id,
              user_id: user.user_id,
            });
            console.log(`Thêm thành viên vào group: user_id=${user.user_id}, group_id=${group.group_id}`);
          }

          if (isLeader && projectName) {
            const existingProject = await Project.findOne({
              where: { group_id: group.group_id },
            });
            if (!existingProject) {
              await Project.create({
                project_name: projectName,
                group_id: group.group_id,
                description: description || null,
                tools_used: toolsUsed || null,
              });
              console.log(`Tạo project mới cho group_id=${group.group_id}`);
            }
          }
        }

        fs.unlinkSync(filePath);
        console.log(`Hoàn tất nhập lớp cho classId: ${classId}`);
        res.json({ message: 'Nhập lớp thành công' });
      } catch (err) {
        console.error('Lỗi đọc file Excel:', err.message, err.stack);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ message: 'Lỗi đọc file Excel' });
      }
    });
  } catch (error) {
    console.error('Lỗi trong importClass:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const joinClass = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.userId;
    if (!code || !userId) {
      return res.status(400).json({ message: 'Mã lớp hoặc userId không hợp lệ' });
    }

    console.log(`Yêu cầu tham gia lớp: userId=${userId}, code=${code}`);
    const classroom = await Class.findOne({ where: { secret_code: code } });
    if (!classroom) {
      console.warn(`Không tìm thấy lớp với code: ${code}`);
      return res.status(404).json({ message: 'Lớp không tồn tại' });
    }

    const existingMember = await ClassMember.findOne({
      where: { class_id: classroom.class_id, user_id: userId },
    });
    if (existingMember) {
      console.warn(`User đã tham gia lớp: userId=${userId}, classId=${classroom.class_id}`);
      return res.status(400).json({ message: 'Bạn đã tham gia lớp này rồi' });
    }

    await ClassMember.create({
      class_id: classroom.class_id,
      user_id: userId,
    });
    console.log(`Tham gia lớp thành công: userId=${userId}, classId=${classroom.class_id}`);
    res.status(200).json({ message: 'Tham gia lớp thành công', class: classroom });
  } catch (error) {
    console.error('Lỗi trong joinClass:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const searchClass = async (req, res) => {
  try {
    const { searchText = '' } = req.query;
    console.log(`Tìm kiếm lớp với searchText: ${searchText}`);

    const classes = await Class.findAll({
      where: {
        [Op.or]: [
          { class_name: { [Op.like]: `%${searchText}%` } },
          { semester: searchText },
        ],
      },
    });

    console.log(`Tìm thấy ${classes.length} lớp`);
    res.json(classes);
  } catch (error) {
    console.error('Lỗi trong searchClass:', error.message, error.stack);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { createClass, updateClass, getClasses, deleteClass, importClass, joinClass, searchClass };