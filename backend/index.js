const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const configurationsRoutes = require('./routes/configurations');
const groupRoutes = require('./routes/groupRoutes');
const instructorGroupRoutes = require('./routes/instructorGroupRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('frontend/public/uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/configurations', configurationsRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/instructor-groups', instructorGroupRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});