/* backend/index.js */
const express = require('express');
const cors = require('cors');
const groupRoutes = require('./routes/groupRoutes');
const { getClassesByInstructorId } = require('./models/instructorGroupModel');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/groups', groupRoutes);

// Endpoint mới cho giảng viên
app.get('/api/instructor/classes/:id', async (req, res) => {
  try {
    const instructorId = parseInt(req.params.id);
    const classes = await getClassesByInstructorId(instructorId);
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: `Lỗi khi lấy danh sách lớp: ${error.message}` });
  }
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});