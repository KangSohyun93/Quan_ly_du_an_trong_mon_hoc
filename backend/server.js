// import dotenv from 'dotenv';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import open from 'open';
import groupRoutes from './routes/groups.js';
import commitRoutes from './routes/commits.js';
import { fetchAndStoreCommits } from './services/contributionService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

dotenv.config({ path: './.env' });
dotenv.config({ path: './.github.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh từ thư mục dist của React
// app.use(express.static(path.join(__dirname, '../../dist')));

// Route API
app.use('/api/groups', groupRoutes);
app.use('/api/projects', commitRoutes);

const initializeCommits = async () => {
    console.log('[Server] Initializing commits for all projects...'); // LOG S1
    try {
        const connection = await pool.getConnection();
        const [projects] = await connection.query('SELECT project_id, github_repo_url FROM Projects'); // Lấy cả github_repo_url để log
        connection.release();

        if (!projects || projects.length === 0) {
            console.log('[Server] No projects found in the database to initialize commits for.'); // LOG S2
            return;
        }

        console.log(`[Server] Found ${projects.length} projects to process.`); // LOG S3

        for (const project of projects) {
            console.log(`[Server] Processing project_id: ${project.project_id}, github_repo_url: ${project.github_repo_url}`); // LOG S4
            // Dòng này gọi hàm để fetch từ GitHub và lưu vào DB
            const fetchedCommits = await fetchAndStoreCommits(project.project_id); // Lưu kết quả trả về
            if (fetchedCommits && fetchedCommits.length > 0) {
                console.log(`[Server] Successfully fetched and initiated storing of ${fetchedCommits.length} commits for project ${project.project_id}`); // LOG S5
            } else if (fetchedCommits) { // fetchedCommits là mảng rỗng
                console.log(`[Server] No new commits fetched or an issue occurred while fetching for project ${project.project_id}. Check service logs.`); // LOG S6
            }
            // Không cần log "Commits updated..." ở đây nữa vì service đã log chi tiết hơn
        }
        console.log('[Server] Finished initializing commits.'); // LOG S7
    } catch (error) {
        // Lỗi này thường là lỗi kết nối DB hoặc query SELECT project_id
        console.error('[Server] Critical error during commit initialization:', error); // LOG S8
    }
};

// initializeCommits(); 

const PORT = process.env.PORT;
app.listen(PORT, async () => {
    console.log(`Server chạy trên port ${PORT}`);
});