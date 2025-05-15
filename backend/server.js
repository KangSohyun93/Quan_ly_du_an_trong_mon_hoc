// import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import open from 'open';
import groupRoutes from './routes/groups.js';
import path from 'path';
import { fileURLToPath } from 'url';

// dotenv.config();

// Lấy __dirname trong ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh từ thư mục dist của React
// app.use(express.static(path.join(__dirname, '../../dist')));

// Route API
app.use('/api/groups', groupRoutes);

// Xử lý tất cả các route khác bằng cách phục vụ ứng dụng React
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
// });

const PORT = process.env.PORT;
app.listen(PORT, async () => {
    console.log(`Server chạy trên port ${PORT}`);
//     try {
//         await open(`http://localhost:${PORT}`);
//         console.log(`Đã mở trình duyệt tại http://localhost:${PORT}`);
//     } catch (error) {
//         console.error('Không thể mở trình duyệt:', error);
//     }
});