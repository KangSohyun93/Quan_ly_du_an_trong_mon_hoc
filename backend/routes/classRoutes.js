const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// API endpoint để tạo lớp học mới
router.post('/create', async (req, res) => {
  const { class_id, class_name, semester, secret_code, instructor_id } = req.body;

  const classCode = secret_code || Math.random().toString(36).substring(2, 10).toUpperCase();

  const query = `
    INSERT INTO Classes (class_id, class_name, semester, secret_code, instructor_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [class_id, class_name, semester, classCode, instructor_id];

  try {
    await pool.query(query, values);
    res.status(201).json({
      message: 'Class created successfully',
      class: {
        classId: class_id,
        className: class_name,
        semester,
        code: classCode,
      },
    });
  } catch (err) {
    console.error('Error creating class:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      if (err.sqlMessage.includes('class_id')) {
        return res.status(400).json({ error: 'Class ID already exists' });
      }
      if (err.sqlMessage.includes('secret_code')) {
        return res.status(400).json({ error: 'Secret code already exists' });
      }
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Instructor ID does not exist' });
    }
    return res.status(500).json({ error: 'Failed to create class' });
  }
});

// API endpoint để chỉnh sửa thông tin lớp học
router.put('/:classId', async (req, res) => {
  const { classId } = req.params;
  const { class_name, semester, secret_code } = req.body;
  const instructorId = req.user?.user_id; // Giả định lấy từ middleware xác thực (JWT hoặc session)

  // Kiểm tra dữ liệu đầu vào
  if (!class_name && !semester && !secret_code) {
    return res.status(400).json({ error: 'At least one field (class_name, semester, secret_code) is required' });
  }

  // Xây dựng query động dựa trên các trường được cung cấp
  const updates = [];
  const values = [];
  if (class_name) {
    updates.push('class_name = ?');
    values.push(class_name);
  }
  if (semester) {
    updates.push('semester = ?');
    values.push(semester);
  }
  if (secret_code) {
    updates.push('secret_code = ?');
    values.push(secret_code);
  }
  values.push(classId, instructorId);

  const query = `
    UPDATE Classes 
    SET ${updates.join(', ')}
    WHERE class_id = ? AND instructor_id = ?
  `;

  try {
    const [result] = await pool.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Unauthorized or class not found' });
    }
    res.status(200).json({ message: 'Class updated successfully' });
  } catch (err) {
    console.error('Error updating class:', err);
    if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('secret_code')) {
      return res.status(400).json({ error: 'Secret code already exists' });
    }
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// API endpoint để lấy danh sách lớp học
router.get('/list', async (req, res) => {
  const query = 'SELECT * FROM Classes';
  try {
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching classes:', err);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// API endpoint để xóa lớp học
router.delete('/delete/:classId', async (req, res) => {
  const { classId } = req.params;

  const query = 'DELETE FROM Classes WHERE class_id = ?';
  try {
    const [result] = await pool.query(query, [classId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error('Error deleting class:', err);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

module.exports = router;