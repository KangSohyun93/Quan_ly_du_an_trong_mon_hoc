import React from 'react';
import '../css/recentcommits.css';

const RecentCommits = () => {
    const commits = [
        '@Alice have been commit on branch origin/feature/front-end',
        '@Alice have been commit on branch origin/feature/front-end',
        '@Alice have been commit on branch origin/feature/front-end',
        '@Alice have been commit on branch origin/feature/front-end',
    ];

    return (
        <div className="recent-commits-container">
            <div className="recent-commits-header">
                <i class="github-icon fa-brands fa-github"></i>
                <h2 className="recent-commits-title">Recent Commit</h2>
            </div>
            <div className="commits-list">
                {commits.map((commit, index) => (
                    <div key={index} className="commit-item">
                        {commit}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentCommits;