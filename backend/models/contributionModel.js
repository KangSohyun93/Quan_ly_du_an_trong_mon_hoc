// import pool from '../db.js';

// export const storeCommits = async (projectId, commitsToStore) => { // Đổi tên tham số cho rõ ràng
//     const connection = await pool.getConnection();
//     try {
//         console.log(`[Model] Storing ${commitsToStore.length} commits for projectId: ${projectId}`);
//         for (const commit of commitsToStore) { // Sử dụng commitsToStore
//             let userId = null;

//             // 1. Ưu tiên tìm bằng github_login (nếu có)
//             if (commit.github_login) {
//                 const [userByGitHubLogin] = await connection.query(
//                     'SELECT user_id FROM Users WHERE github_username = ?',
//                     [commit.github_login]
//                 );
//                 if (userByGitHubLogin.length > 0) {
//                     userId = userByGitHubLogin[0].user_id;
//                 }
//             }

//             // 2. Nếu không tìm thấy bằng github_login, thử tìm bằng author_email (ưu tiên github_email, rồi đến email)
//             if (!userId && commit.author_email && commit.author_email !== 'unknown@example.com' && !commit.author_email.includes('@users.noreply.github.com')) {
//                 const [userByEmail] = await connection.query(
//                     'SELECT user_id FROM Users WHERE github_email = ? OR (github_email IS NULL AND email = ?)',
//                     [commit.author_email, commit.author_email]
//                 );
//                 if (userByEmail.length > 0) {
//                     userId = userByEmail[0].user_id;
//                 }
//             }

//             if (userId) {
//                 await connection.query(
//                     'INSERT IGNORE INTO GitContributions (project_id, user_id, commit_hash, commit_message, commit_date, lines_added, lines_removed) VALUES (?, ?, ?, ?, ?, ?, ?)',
//                     [
//                         projectId,
//                         userId,
//                         commit.sha,
//                         commit.message,
//                         commit.date,
//                         0,
//                         0,
//                     ]
//                 );
//             } else {
//                 console.warn(`[Model] Không thể map commit (SHA: ${commit.sha}, Email: ${commit.author_email}, GH Login: ${commit.github_login}, AuthorName: ${commit.author_name}) vào user nào cho projectId ${projectId}. Commit này sẽ bị bỏ qua.`);
//             }
//         }
//     } catch (error) {
//         console.error(`[Model] Lỗi khi lưu commit cho projectId ${projectId}:`, error.message);
//     } finally {
//         connection.release();
//     }
// };

// export const getCommits = async (projectId) => {
//     const connection = await pool.getConnection();
//     console.log(`[Model] Getting commits from DB for projectId: ${projectId}`);
//     try {
//         // Sửa đổi câu SQL:
//         // - Lấy u.user_id và u.username.
//         // - Sắp xếp theo commit_date ASC (tăng dần) để frontend dễ dàng xác định commit đầu tiên/cuối cùng.
//         const [rows] = await connection.query(
//             `SELECT gc.commit_hash AS sha, gc.commit_message AS message, 
//                     gc.commit_date AS date,
//                     u.user_id,
//                     u.username  -- Lấy tên thật/username từ bảng Users
//              FROM GitContributions gc
//              JOIN Users u ON gc.user_id = u.user_id
//              WHERE gc.project_id = ?
//              ORDER BY gc.commit_date ASC`, // Sắp xếp ASC để frontend xử lý phạm vi ngày dễ hơn
//             [projectId]
//         );

//         console.log(`[Model] Found ${rows.length} commits in DB for projectId ${projectId}.`);
//         // Sửa đổi dữ liệu trả về: bao gồm user_id và username
//         return rows.map(row => ({
//             sha: row.sha,
//             message: row.message,
//             date: row.date,
//             user_id: row.user_id,    // Thêm user_id
//             username: row.username   // Thêm username
//         }));
//     } catch (error) {
//         console.error(`[Model] Lỗi khi lấy commit từ DB cho projectId ${projectId}:`, error.message);
//         throw new Error('Không thể lấy commit từ database');
//     } finally {
//         connection.release();
//     }
// };

import pool from '../db.js';

export const storeCommits = async (projectId, commitsToStore) => {
    const connection = await pool.getConnection();
    try {
        console.log(`[Model] Storing ${commitsToStore.length} commits for projectId: ${projectId}`);
        for (const commit of commitsToStore) {
            let userId = null;

            if (commit.github_login) {
                const [userByGitHubLogin] = await connection.query(
                    'SELECT user_id FROM Users WHERE github_username = ?',
                    [commit.github_login]
                );
                if (userByGitHubLogin.length > 0) {
                    userId = userByGitHubLogin[0].user_id;
                }
            }

            if (!userId && commit.author_email && commit.author_email !== 'unknown@example.com' && !commit.author_email.includes('@users.noreply.github.com')) {
                const [userByEmail] = await connection.query(
                    'SELECT user_id FROM Users WHERE github_email = ? OR (github_email IS NULL AND email = ?)',
                    [commit.author_email, commit.author_email]
                );
                if (userByEmail.length > 0) {
                    userId = userByEmail[0].user_id;
                }
            }

            if (userId) {
                await connection.query(
                    'INSERT IGNORE INTO GitContributions (project_id, user_id, commit_hash, commit_message, commit_date, lines_added, lines_removed) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        projectId,
                        userId,
                        commit.sha,
                        commit.message,
                        commit.date,
                        commit.lines_added || 0,    // Sử dụng lines_added từ commit data
                        commit.lines_removed || 0,  // Sử dụng lines_removed từ commit data
                    ]
                );
            } else {
                console.warn(`[Model] Không thể map commit (SHA: ${commit.sha}, Email: ${commit.author_email}, GH Login: ${commit.github_login}) vào user nào cho projectId ${projectId}. Commit này sẽ bị bỏ qua.`);
            }
        }
    } catch (error) {
        console.error(`[Model] Lỗi khi lưu commit cho projectId ${projectId}:`, error.message);
    } finally {
        connection.release();
    }
};

export const getCommits = async (projectId) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(
            `SELECT gc.commit_hash AS sha, gc.commit_message AS message, 
                    gc.commit_date AS date,
                    u.user_id,
                    u.username
             FROM GitContributions gc
             JOIN Users u ON gc.user_id = u.user_id
             WHERE gc.project_id = ?
             ORDER BY gc.commit_date ASC`,
            [projectId]
        );
        return rows.map(row => ({
            sha: row.sha,
            message: row.message,
            date: row.date,
            user_id: row.user_id,
            username: row.username
        }));
    } catch (error) {
        console.error(`[Model] Lỗi khi lấy commit từ DB cho projectId ${projectId}:`, error.message);
        throw new Error('Không thể lấy commit từ database');
    } finally {
        connection.release();
    }
};

// Hàm mới để lấy dữ liệu LOC
export const getProjectLOCData = async (projectId) => {
    const connection = await pool.getConnection();
    console.log(`[Model] Getting LOC data from DB for projectId: ${projectId}`);
    try {
        const [rows] = await connection.query(
            `SELECT 
                gc.commit_date AS date,
                gc.lines_added,
                gc.lines_removed,
                u.user_id,
                u.username
             FROM GitContributions gc
             JOIN Users u ON gc.user_id = u.user_id
             WHERE gc.project_id = ?
             ORDER BY gc.commit_date ASC`, // Sắp xếp ASC để xử lý phạm vi ngày ở frontend
            [projectId]
        );
        console.log(`[Model] Found ${rows.length} LOC entries in DB for projectId ${projectId}.`);
        return rows.map(row => ({ // Đảm bảo user_id là number nếu cần
            date: row.date,
            lines_added: row.lines_added,
            lines_removed: row.lines_removed,
            user_id: parseInt(row.user_id, 10),
            username: row.username
        }));
    } catch (error) {
        console.error(`[Model] Lỗi khi lấy LOC data từ DB cho projectId ${projectId}:`, error.message);
        throw new Error('Không thể lấy dữ liệu LOC từ database');
    } finally {
        connection.release();
    }
};