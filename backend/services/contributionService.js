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

                    // console.log(`[Service] Commit SHA: ${detailedCommit.sha.substring(0,7)}, Stats:`, JSON.stringify(detailedCommit.stats, null, 2));

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