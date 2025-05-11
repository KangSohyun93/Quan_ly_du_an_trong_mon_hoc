const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET: Lấy danh sách cấu hình
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT sc.config_id, sc.config_key, sc.config_value, sc.updated_at, u.username AS updated_by
      FROM SystemConfigurations sc
      LEFT JOIN Users u ON sc.updated_by = u.user_id
      `
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching configurations:', error);
    res.status(500).json({ message: 'Error fetching configurations' });
  }
});

// POST: Thêm hoặc cập nhật cấu hình
router.post('/', async (req, res) => {
  const { config_id, config_key, config_value, updated_by } = req.body;
  try {
    if (config_id) {
      // Cập nhật cấu hình
      await pool.query(
        `
        UPDATE SystemConfigurations
        SET config_key = ?, config_value = ?, updated_by = ?, updated_at = NOW()
        WHERE config_id = ?
        `,
        [config_key, config_value, updated_by, config_id]
      );
    } else {
      // Thêm cấu hình mới
      await pool.query(
        `
        INSERT INTO SystemConfigurations (config_key, config_value, updated_by, updated_at)
        VALUES (?, ?, ?, NOW())
        `,
        [config_key, config_value, updated_by]
      );
    }
    res.json({ message: 'Configuration saved successfully' });
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({ message: 'Error saving configuration' });
  }
});

module.exports = router;