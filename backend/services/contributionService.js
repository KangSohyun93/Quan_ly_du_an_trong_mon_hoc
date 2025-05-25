// import { Octokit } from '@octokit/rest';
// import dotenv from 'dotenv';
// import pool from '../db.js';
// import { storeCommits } from '../models/contributionModel.js';

// dotenv.config({ path: './.github.env' }); // Đảm bảo đường dẫn này đúng

// const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// export const fetchAndStoreCommits = async (projectId) => {
//     console.log(`[Service] Fetching commits for projectId: ${projectId}`); // LOG B1
//     try {
//         const connection = await pool.getConnection();
//         const [rows] = await connection.query(
//             'SELECT github_repo_url FROM Projects WHERE project_id = ?',
//             [projectId]
//         );
//         connection.release();

//         if (!rows[0]?.github_repo_url) {
//             console.error(`[Service] Không tìm thấy github_repo_url cho project ${projectId}`); // LOG B2
//             // Không ném lỗi ở đây nữa để hàm initializeCommits không dừng hẳn nếu một project lỗi
//             // throw new Error(`Không tìm thấy github_repo_url cho project ${projectId}`);
//             return []; // Trả về mảng rỗng nếu không có URL
//         }

//         const repoUrl = rows[0].github_repo_url;
//         console.log(`[Service] Repo URL for projectId ${projectId}: ${repoUrl}`); // LOG B3

//         // Kiểm tra định dạng URL đơn giản
//         if (!repoUrl.startsWith('https://github.com/')) {
//             console.error(`[Service] Định dạng repoUrl không hợp lệ: ${repoUrl}`);
//             return [];
//         }

//         const parts = repoUrl.split('/');
//         if (parts.length < 5) {
//             console.error(`[Service] Không thể parse owner/repo từ URL: ${repoUrl}`);
//             return [];
//         }
//         const owner = parts[3];
//         const repo = parts[4].replace('.git', ''); // Loại bỏ .git nếu có

//         console.log(`[Service] Owner: ${owner}, Repo: ${repo}`); // LOG B4

//         if (!owner || !repo) {
//             console.error(`[Service] Owner hoặc Repo không hợp lệ sau khi parse từ URL: ${repoUrl}`);
//             return [];
//         }

//         console.log(`[Service] Requesting branches for ${owner}/${repo}`); // LOG B5
//         const branchesResponse = await octokit.request('GET /repos/{owner}/{repo}/branches', {
//             owner,
//             repo,
//             headers: { 'X-GitHub-Api-Version': '2022-11-28' },
//         });
//         console.log(`[Service] Branches received for ${owner}/${repo}:`, branchesResponse.data.length > 0 ? `${branchesResponse.data.length} branches` : "No branches"); // LOG B6

//         let allCommitsData = [];
//         for (const branch of branchesResponse.data) {
//             console.log(`[Service] Fetching commits for branch: ${branch.name}`); // LOG B7
//             const commitsResponse = await octokit.request('GET /repos/{owner}/{repo}/commits', {
//                 owner,
//                 repo,
//                 sha: branch.name,
//                 per_page: 100, // Tăng số lượng commit mỗi trang nếu cần
//                 headers: { 'X-GitHub-Api-Version': '2022-11-28' },
//             });
//             console.log(`[Service] Commits for branch ${branch.name}:`, commitsResponse.data.length); // LOG B8

//             const commitsFromBranch = commitsResponse.data.map(commit => ({
//                 sha: commit.sha,
//                 message: commit.commit.message,
//                 author_email: commit.commit.author?.email || 'unknown@example.com', // Xử lý author email có thể null
//                 author_name: commit.commit.author?.name || 'Unknown Author',
//                 date: commit.commit.author?.date || new Date().toISOString(), // Xử lý author date có thể null
//                 github_login: commit.author?.login || null,
//                 github_id: commit.author?.id || null,
//             }));

//             allCommitsData = [...allCommitsData, ...commitsFromBranch];
//         }

//         // Loại bỏ các commit trùng lặp dựa trên SHA
//         const uniqueCommits = Array.from(new Map(allCommitsData.map(commit => [commit.sha, commit])).values());
//         console.log(`[Service] Total unique commits fetched for projectId ${projectId}: ${uniqueCommits.length}`); // LOG B9
//         uniqueCommits.forEach(c => console.log(`  Commit SHA: ${c.sha}, Email: ${c.author_email}, GH Login: ${c.github_login}, GH ID: ${c.github_id}`));

//         if (uniqueCommits.length > 0) {
//             await storeCommits(projectId, uniqueCommits);
//             console.log(`[Service] Stored ${uniqueCommits.length} commits for projectId ${projectId}`); // LOG B10
//         } else {
//             console.log(`[Service] No commits to store for projectId ${projectId}.`);
//         }

//         return uniqueCommits; // Trả về commits đã fetch được
//     } catch (error) {
//         // Bắt lỗi cụ thể từ Octokit
//         if (error.status === 404) {
//             console.error(`[Service] GitHub API Error 404 (Not Found) for projectId ${projectId}. Repo URL: ${error.request?.url}. Check if repo exists and token has access.`);
//         } else if (error.status === 401) {
//             console.error(`[Service] GitHub API Error 401 (Unauthorized) for projectId ${projectId}. Check GITHUB_TOKEN.`);
//         } else if (error.status === 403) {
//             console.error(`[Service] GitHub API Error 403 (Forbidden) for projectId ${projectId}. Rate limit exceeded or insufficient permissions. URL: ${error.request?.url}`);
//         }
//         else {
//             console.error(`[Service] Error fetching commits for projectId ${projectId}: ${error.message}`);
//         }
//         // Không ném lỗi ở đây nữa, thay vào đó trả về mảng rỗng
//         // để `initializeCommits` có thể tiếp tục với các project khác.
//         // throw new Error('Không thể lấy commit từ GitHub');
//         return []; // Trả về mảng rỗng khi có lỗi
//     }
// };

import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import pool from '../db.js';
import { storeCommits } from '../models/contributionModel.js';

dotenv.config({ path: './.github.env' });

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export const fetchAndStoreCommits = async (projectId) => {
    console.log(`[Service] Fetching commits for projectId: ${projectId}`);
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT github_repo_url FROM Projects WHERE project_id = ?',
            [projectId]
        );
        connection.release();

        if (!rows[0]?.github_repo_url) {
            console.error(`[Service] Không tìm thấy github_repo_url cho project ${projectId}`);
            return [];
        }

        const repoUrl = rows[0].github_repo_url;
        const parts = repoUrl.split('/');
        if (parts.length < 5 || !repoUrl.startsWith('https://github.com/')) {
            console.error(`[Service] Định dạng repoUrl không hợp lệ hoặc không parse được owner/repo: ${repoUrl}`);
            return [];
        }
        const owner = parts[3];
        const repo = parts[4].replace('.git', '');

        console.log(`[Service] Owner: ${owner}, Repo: ${repo}`);

        const branchesResponse = await octokit.request('GET /repos/{owner}/{repo}/branches', {
            owner,
            repo,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' },
        });

        let allCommitsData = [];
        for (const branch of branchesResponse.data) {
            console.log(`[Service] Fetching commits for branch: ${branch.name}`);
            // Lấy danh sách commit SHA cho nhánh
            const commitsListResponse = await octokit.request('GET /repos/{owner}/{repo}/commits', {
                owner,
                repo,
                sha: branch.name,
                per_page: 100, // Giới hạn số commit lấy về, có thể cần phân trang nếu nhiều hơn
                headers: { 'X-GitHub-Api-Version': '2022-11-28' },
            });
            console.log(`[Service] Found ${commitsListResponse.data.length} commits on branch ${branch.name}. Fetching details...`);

            for (const commitListItem of commitsListResponse.data) {
                try {
                    // Gọi API chi tiết cho từng commit để lấy stats (lines added/removed)
                    const detailedCommitResponse = await octokit.request('GET /repos/{owner}/{repo}/commits/{commit_sha}', {
                        owner,
                        repo,
                        commit_sha: commitListItem.sha,
                        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
                    });
                    const detailedCommit = detailedCommitResponse.data;

                    allCommitsData.push({
                        sha: detailedCommit.sha,
                        message: detailedCommit.commit.message,
                        author_email: detailedCommit.commit.author?.email || 'unknown@example.com',
                        author_name: detailedCommit.commit.author?.name || 'Unknown Author',
                        date: detailedCommit.commit.author?.date || new Date().toISOString(),
                        github_login: detailedCommit.author?.login || null,
                        github_id: detailedCommit.author?.id || null,
                        lines_added: detailedCommit.stats?.additions || 0, // Lấy lines_added từ stats
                        lines_removed: detailedCommit.stats?.deletions || 0, // Lấy lines_removed từ stats
                    });
                } catch (detailError) {
                    console.warn(`[Service] Could not fetch details for commit ${commitListItem.sha}: ${detailError.message}. Storing with 0 lines changed.`);
                    // Fallback nếu không lấy được chi tiết commit (ví dụ commit không có parent)
                    allCommitsData.push({
                        sha: commitListItem.sha,
                        message: commitListItem.commit.message,
                        author_email: commitListItem.commit.author?.email || 'unknown@example.com',
                        author_name: commitListItem.commit.author?.name || 'Unknown Author',
                        date: commitListItem.commit.author?.date || new Date().toISOString(),
                        github_login: commitListItem.author?.login || null,
                        github_id: commitListItem.author?.id || null,
                        lines_added: 0,
                        lines_removed: 0,
                    });
                }
            }
        }

        const uniqueCommits = Array.from(new Map(allCommitsData.map(commit => [commit.sha, commit])).values());
        console.log(`[Service] Total unique commits fetched for projectId ${projectId}: ${uniqueCommits.length}`);

        if (uniqueCommits.length > 0) {
            // Hàm storeCommits trong contributionModel.js cần được cập nhật để nhận lines_added, lines_removed
            await storeCommits(projectId, uniqueCommits);
            console.log(`[Service] Stored ${uniqueCommits.length} commits for projectId ${projectId}`);
        } else {
            console.log(`[Service] No commits to store for projectId ${projectId}.`);
        }

        return uniqueCommits;
    } catch (error) {
        if (error.status) { // Octokit error
            console.error(`[Service] GitHub API Error ${error.status} for projectId ${projectId}. URL: ${error.request?.url}. Message: ${error.message}`);
        } else {
            console.error(`[Service] Error fetching commits for projectId ${projectId}: ${error.message}`);
        }
        return [];
    }
};