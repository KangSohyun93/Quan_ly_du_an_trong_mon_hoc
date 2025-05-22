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

//             // (Tùy chọn nâng cao) 3. Nếu vẫn không tìm thấy, và bạn có cơ chế "unclaimed commits"
//             // hoặc muốn cố gắng map dựa trên author_name, có thể thêm logic ở đây.
//             // Hiện tại, nếu không map được, sẽ bỏ qua.

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

// // Hàm getCommits không cần thay đổi cấu trúc, nhưng có thể bạn muốn trả về cả github_login nếu cần ở frontend
// export const getCommits = async (projectId) => {
//     const connection = await pool.getConnection();
//     console.log(`[Model] Getting commits from DB for projectId: ${projectId}`);
//     try {
//         const [rows] = await connection.query(
//             `SELECT gc.commit_hash AS sha, gc.commit_message AS message, 
//                     u.email AS author_system_email,  -- Email trong hệ thống của user
//                     u.github_username AS author_github_username, -- GitHub username của user trong hệ thống
//                     gc.commit_date AS date
//              FROM GitContributions gc
//              JOIN Users u ON gc.user_id = u.user_id
//              WHERE gc.project_id = ?
//              ORDER BY gc.commit_date DESC`,
//             [projectId]
//         );
//         // Trong hàm này, author_email thực sự từ commit gốc không được lưu trực tiếp vào GitContributions
//         // mà chúng ta join để lấy email/github_username từ bảng Users đã được map.
//         // Nếu bạn muốn hiển thị email gốc của commit (kể cả no-reply) ở frontend, bạn cần lưu nó vào GitContributions.
//         // Hiện tại, frontend CommitActivityChart đang hiển thị email từ bảng Users (sau khi join).

//         // Để làm cho CommitActivityChart hiện email gốc (kể cả no-reply), ta cần sửa lại:
//         // 1. Lưu author_email gốc vào bảng GitContributions
//         // 2. SELECT nó ra trong câu query này
//         // 3. Sử dụng nó trong CommitActivityChart
//         // Tuy nhiên, với mục đích phân tích, việc map tới user hệ thống là quan trọng hơn.
//         // Frontend CommitActivityChart hiện tại đã có dropdown theo email của User trong hệ thống,
//         // nên việc join với bảng Users để lấy email (hoặc github_username) là hợp lý.

//         console.log(`[Model] Found ${rows.length} commits in DB for projectId ${projectId}.`);
//         return rows.map(row => ({ // Điều chỉnh dữ liệu trả về để CommitActivityChart vẫn dùng được author_email
//             sha: row.sha,
//             message: row.message,
//             author_email: row.author_github_username || row.author_system_email, // Ưu tiên github username, nếu không thì email hệ thống
//             date: row.date
//         }));
//     } catch (error) {
//         console.error(`[Model] Lỗi khi lấy commit từ DB cho projectId ${projectId}:`, error.message);
//         throw new Error('Không thể lấy commit từ database');
//     } finally {
//         connection.release();
//     }
// };

import pool from '../db.js';

export const storeCommits = async (projectId, commitsToStore) => { // Đổi tên tham số cho rõ ràng
    const connection = await pool.getConnection();
    try {
        console.log(`[Model] Storing ${commitsToStore.length} commits for projectId: ${projectId}`);
        for (const commit of commitsToStore) { // Sử dụng commitsToStore
            let userId = null;

            // 1. Ưu tiên tìm bằng github_login (nếu có)
            if (commit.github_login) {
                const [userByGitHubLogin] = await connection.query(
                    'SELECT user_id FROM Users WHERE github_username = ?',
                    [commit.github_login]
                );
                if (userByGitHubLogin.length > 0) {
                    userId = userByGitHubLogin[0].user_id;
                }
            }

            // 2. Nếu không tìm thấy bằng github_login, thử tìm bằng author_email (ưu tiên github_email, rồi đến email)
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
                        0,
                        0,
                    ]
                );
            } else {
                console.warn(`[Model] Không thể map commit (SHA: ${commit.sha}, Email: ${commit.author_email}, GH Login: ${commit.github_login}, AuthorName: ${commit.author_name}) vào user nào cho projectId ${projectId}. Commit này sẽ bị bỏ qua.`);
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
    console.log(`[Model] Getting commits from DB for projectId: ${projectId}`);
    try {
        // Sửa đổi câu SQL:
        // - Lấy u.user_id và u.username.
        // - Sắp xếp theo commit_date ASC (tăng dần) để frontend dễ dàng xác định commit đầu tiên/cuối cùng.
        const [rows] = await connection.query(
            `SELECT gc.commit_hash AS sha, gc.commit_message AS message, 
                    gc.commit_date AS date,
                    u.user_id,
                    u.username  -- Lấy tên thật/username từ bảng Users
             FROM GitContributions gc
             JOIN Users u ON gc.user_id = u.user_id
             WHERE gc.project_id = ?
             ORDER BY gc.commit_date ASC`, // Sắp xếp ASC để frontend xử lý phạm vi ngày dễ hơn
            [projectId]
        );

        console.log(`[Model] Found ${rows.length} commits in DB for projectId ${projectId}.`);
        // Sửa đổi dữ liệu trả về: bao gồm user_id và username
        return rows.map(row => ({
            sha: row.sha,
            message: row.message,
            date: row.date,
            user_id: row.user_id,    // Thêm user_id
            username: row.username   // Thêm username
        }));
    } catch (error) {
        console.error(`[Model] Lỗi khi lấy commit từ DB cho projectId ${projectId}:`, error.message);
        throw new Error('Không thể lấy commit từ database');
    } finally {
        connection.release();
    }
};