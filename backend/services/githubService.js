const { Octokit } = require('@octokit/rest');
const dotenv = require('dotenv');
const { Project } = require('../models'); // Sử dụng Sequelize Model Project
const contributionService = require('./contributionService'); // Gọi service đã được chuẩn hóa

dotenv.config({ path: './.github.env' }); // Đảm bảo đường dẫn này đúng

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Đổi tên hàm này để rõ ràng hơn về việc nó fetch từ GitHub và trigger việc lưu
const fetchAndStoreCommits = async (projectId) => {
    console.log(`[GitHubService] Fetching commits for projectId: ${projectId}`);
    try {
        const project = await Project.findByPk(projectId, {
            attributes: ['github_repo_url']
        });

        if (!project || !project.github_repo_url) {
            console.error(`[GitHubService] Project ${projectId} not found or has no github_repo_url.`);
            return { success: false, message: `Project ${projectId} not found or has no github_repo_url.`, count: 0, data: [] };
        }

        const repoUrl = project.github_repo_url;
        const parts = repoUrl.split('/');
        if (parts.length < 5 || !repoUrl.startsWith('https://github.com/')) {
            console.error(`[GitHubService] Invalid repoUrl format: ${repoUrl}`);
            return { success: false, message: `Invalid repoUrl format: ${repoUrl}`, count: 0, data: [] };
        }
        const owner = parts[3];
        const repo = parts[4].replace('.git', '');

        console.log(`[GitHubService] Fetching from Owner: ${owner}, Repo: ${repo}`);

        const branchesResponse = await octokit.request('GET /repos/{owner}/{repo}/branches', {
            owner,
            repo,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' },
        });

        let allCommitsDataFromGitHub = [];
        for (const branch of branchesResponse.data) {
            console.log(`[GitHubService] Fetching commits for branch: ${branch.name}`);
            const commitsListResponse = await octokit.request('GET /repos/{owner}/{repo}/commits', {
                owner,
                repo,
                sha: branch.name,
                per_page: 100,
                headers: { 'X-GitHub-Api-Version': '2022-11-28' },
            });
            console.log(`[GitHubService] Found ${commitsListResponse.data.length} commits on branch ${branch.name}. Fetching details...`);

            for (const commitListItem of commitsListResponse.data) {
                try {
                    const detailedCommitResponse = await octokit.request('GET /repos/{owner}/{repo}/commits/{commit_sha}', {
                        owner,
                        repo,
                        commit_sha: commitListItem.sha,
                        headers: { 'X-GitHub-Api-Version': '2022-11-28' },
                    });
                    const detailedCommit = detailedCommitResponse.data;

                    // Chuẩn bị dữ liệu cho hàm contributionService.storeCommits
                    allCommitsDataFromGitHub.push({
                        sha: detailedCommit.sha,
                        message: detailedCommit.commit.message,
                        author_email: detailedCommit.commit.author?.email || 'unknown@example.com',
                        date: detailedCommit.commit.author?.date || new Date().toISOString(),
                        github_login: detailedCommit.author?.login || null,
                        lines_added: detailedCommit.stats?.additions || 0,
                        lines_removed: detailedCommit.stats?.deletions || 0,
                    });
                } catch (detailError) {
                    console.warn(`[GitHubService] Could not fetch details for commit ${commitListItem.sha}: ${detailError.message}. Storing with 0 lines changed.`);
                    allCommitsDataFromGitHub.push({
                        sha: commitListItem.sha,
                        message: commitListItem.commit.message,
                        author_email: commitListItem.commit.author?.email || 'unknown@example.com',
                        date: commitListItem.commit.author?.date || new Date().toISOString(),
                        github_login: commitListItem.author?.login || null,
                        lines_added: 0,
                        lines_removed: 0,
                    });
                }
            }
        }

        const uniqueCommitsToStore = Array.from(new Map(allCommitsDataFromGitHub.map(commit => [commit.sha, commit])).values());
        console.log(`[GitHubService] Total unique commits fetched for projectId ${projectId}: ${uniqueCommitsToStore.length}`);

        if (uniqueCommitsToStore.length > 0) {
            // Gọi hàm storeCommits từ contributionService (đã được chuẩn hóa)
            await contributionService.storeCommits(projectId, uniqueCommitsToStore);
            console.log(`[GitHubService] Initiated storing of ${uniqueCommitsToStore.length} commits for projectId ${projectId} via ContributionService.`);
        } else {
            console.log(`[GitHubService] No new commits to store for projectId ${projectId}.`);
        }

        return { success: true, message: `Successfully fetched commits.`, count: uniqueCommitsToStore.length, data: uniqueCommitsToStore };
    } catch (error) {
        let errorMessage = `Error fetching commits from GitHub for projectId ${projectId}`;
        if (error.status) {
            errorMessage = `GitHub API Error ${error.status} for projectId ${projectId}. URL: ${error.request?.url}. Message: ${error.message}`;
        } else {
            errorMessage = `${errorMessage}: ${error.message}`;
        }
        console.error(errorMessage, error);
        return { success: false, message: errorMessage, count: 0, data: [] };
    }
};

module.exports = {
    fetchAndStoreCommits, // Export tên hàm mới
};