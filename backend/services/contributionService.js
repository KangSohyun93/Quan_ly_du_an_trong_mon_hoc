const { User, GitContribution, Project, sequelize, Sequelize, QueryTypes } = require('../models');

const storeCommits = async (projectId, commitsToStore) => { // Giữ tên hàm
    try {
        console.log(`[ContributionService] Storing ${commitsToStore.length} commits into DB for projectId: ${projectId}`);
        for (const commit of commitsToStore) {
            let userId = null;
            let foundUser = null;

            if (commit.github_login) {
                foundUser = await User.findOne({
                    where: { github_username: commit.github_login },
                    attributes: ['user_id']
                });
                if (foundUser) {
                    userId = foundUser.user_id;
                }
            }

            if (!userId && commit.author_email && commit.author_email !== 'unknown@example.com' && !commit.author_email.includes('@users.noreply.github.com')) {
                foundUser = await User.findOne({
                    where: {
                        [Sequelize.Op.or]: [
                            { github_email: commit.author_email },
                            {
                                github_email: null,
                                email: commit.author_email
                            }
                        ]
                    },
                    attributes: ['user_id']
                });
                if (foundUser) {
                    userId = foundUser.user_id;
                }
            }

            if (userId) {
                await GitContribution.findOrCreate({
                    where: {
                        project_id: projectId,
                        commit_hash: commit.sha
                    },
                    defaults: {
                        project_id: projectId,
                        user_id: userId,
                        commit_hash: commit.sha,
                        commit_message: commit.message,
                        commit_date: new Date(commit.date),
                        lines_added: commit.lines_added || 0,
                        lines_removed: commit.lines_removed || 0,
                    }
                });
            } else {
                console.warn(`[ContributionService] Cannot map commit (SHA: ${commit.sha}, Email: ${commit.author_email}, GH Login: ${commit.github_login}) to any user for projectId ${projectId}. Commit will be skipped.`);
            }
        }
        console.log(`[ContributionService] Finished storing commits for projectId: ${projectId}`);
    } catch (error) {
        console.error(`[ContributionService] Error storing commits into DB for projectId ${projectId}:`, error.message, error);
        throw error;
    }
};

const getCommits = async (projectId) => { // Giữ tên hàm
    try {
        const commitsData = await GitContribution.findAll({
            where: { project_id: projectId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['user_id', 'username'],
                required: true
            }],
            attributes: [
                ['commit_hash', 'sha'],
                ['commit_message', 'message'],
                ['commit_date', 'date']
            ],
            order: [['commit_date', 'ASC']],
        });
        return commitsData.map(commitInstance => {
            const commit = commitInstance.toJSON();
            return {
                sha: commit.sha,
                message: commit.message,
                date: commit.date,
                user_id: commit.user.user_id,
                username: commit.user.username
            };
        });
    } catch (error) {
        console.error(`[ContributionService] Error fetching commits from DB for projectId ${projectId}:`, error.message, error);
        throw new Error('Could not fetch commits from database');
    }
};

const getProjectLOCData = async (projectId) => { // Giữ tên hàm
    console.log(`[ContributionService] Getting LOC data from DB for projectId: ${projectId}`);
    try {
        const locDataInstances = await GitContribution.findAll({
            where: { project_id: projectId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['user_id', 'username'],
                required: true
            }],
            attributes: [
                ['commit_date', 'date'],
                'lines_added',
                'lines_removed'
            ],
            order: [['commit_date', 'ASC']],
        });
        const result = locDataInstances.map(locInstance => {
            const loc = locInstance.toJSON();
            return {
                date: loc.date,
                lines_added: loc.lines_added,
                lines_removed: loc.lines_removed,
                user_id: parseInt(loc.user.user_id, 10),
                username: loc.user.username
            };
        });
        console.log(`[ContributionService] Found ${result.length} LOC entries in DB for projectId ${projectId}.`);
        return result;
    } catch (error) {
        console.error(`[ContributionService] Error fetching LOC data from DB for projectId ${projectId}:`, error.message, error);
        throw new Error('Could not fetch LOC data from database');
    }
};

/**
 * Lấy thống kê commit và LOC cho một project.
 */
async function getCommitStatsByProjectId(projectId) {
    try {
        const stats = await GitContribution.findOne({
            where: { project_id: projectId },
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('contribution_id')), 'totalCommits'],
                [sequelize.fn('SUM', sequelize.col('lines_added')), 'totalLinesAdded'],
            ],
            raw: true // Trả về plain object
        });
        return {
            totalCommits: stats?.totalCommits || 0,
            totalLinesAdded: stats?.totalLinesAdded || 0,
        };
    } catch (error) {
        console.error(`[ContributionService] Error fetching commit stats for project ${projectId}:`, error);
        throw new Error(`Could not fetch commit stats for project ${projectId}`);
    }
}

module.exports = {
    storeCommits,
    getCommits,
    getProjectLOCData,
    getCommitStatsByProjectId
};