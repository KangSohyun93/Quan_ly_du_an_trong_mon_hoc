const express = require('express');
const cors = require('cors');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes');
const instructorGroupRoutes = require('./routes/instructorGroupRoutes');
const classRoutes = require('./routes/classRoutes');
const configurationsRouter = require('./routes/configurations');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/groups', groupRoutes);
app.use('/api', userRoutes);
app.use('/api/instructor-groups', instructorGroupRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/configurations', configurationsRouter);


// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});