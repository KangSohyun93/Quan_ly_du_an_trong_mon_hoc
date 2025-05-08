import axios from 'axios';

const token = import.meta.env.VITE_GITHUB_TOKEN; 
const headers = { Authorization: `Bearer ${token}` };

export async function getCommits(owner, repo) {
    const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`, { headers });
    return res.data.map(commit => ({
        author: commit.commit.author.name,
        date: commit.commit.author.date.slice(0, 10)
    }));
}

export async function getLOC(owner, repo) {
    const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`, { headers });
    return res.data.map(user => ({
        author: user.author.login,
        total_additions: user.weeks.reduce((sum, w) => sum + w.a, 0),
        total_deletions: user.weeks.reduce((sum, w) => sum + w.d, 0)
    }));
}