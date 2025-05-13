import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import axios from 'axios';
import '../css/commitactivitychart.css';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

console.log('ENV:', import.meta.env);

const CommitActivityChart = () => {
    const [commitData, setCommitData] = useState([]);

    useEffect(() => {
        const fetchCommits = async () => {
            try {
                const owner = import.meta.env.VITE_GITHUB_OWNER;
                const repo = import.meta.env.VITE_GITHUB_REPO;
                const token = import.meta.env.VITE_GITHUB_TOKEN;

                console.log("Owner:", owner); // nên ra: your-github-username
                console.log("Repo:", repo);   // nên ra: your-repo-name
                console.log("Token:", token ? "✅ Có token" : "❌ Token bị thiếu");

                // Lấy danh sách commit từ GitHub API
                const response = await axios.get(
                    `https://api.github.com/repos/${owner}/${repo}/commits`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { per_page: 100 },
                    }
                );
                const commits = response.data;

                // Nhóm commit theo tuần
                const commitsByWeek = {};
                commits.forEach(commit => {
                    const date = new Date(commit.commit.author.date);
                    const week = `${date.getFullYear()}-W${Math.floor(date.getDate() / 7) + 1}`;
                    commitsByWeek[week] = (commitsByWeek[week] || 0) + 1;
                });

                const formattedData = Object.keys(commitsByWeek)
                    .map(week => ({ week, commits: commitsByWeek[week] }))
                    .sort((a, b) => a.week.localeCompare(b.week))
                    .slice(-5); // Lấy 5 tuần gần nhất

                setCommitData(formattedData);
            } catch (error) {
                console.error('Error fetching commit data:', error);
            }
        };
        fetchCommits();
    }, []);

    const data = {
        labels: commitData.map(item => item.week),
        datasets: [
            {
                label: 'Số commit',
                data: commitData.map(item => item.commits),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
            title: {
                display: true,
                text: 'Hoạt động commit theo thời gian',
                font: { size: 18, family: 'Inter, sans-serif' },
                color: '#1F2937',
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#1F2937',
                borderColor: '#4B5563',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                title: { display: true, text: 'Thời gian', font: { family: 'Inter, sans-serif' } },
            },
            y: {
                min: 0,
                ticks: { stepSize: 10 },
                grid: { borderDash: [5, 5] },
                title: { display: true, text: 'Số commit', font: { family: 'Inter, sans-serif' } },
            },
        },
    };

    return (
        <div className="commitactivity-chart-container">
            <Line data={data} options={options} />
        </div>
    );
};

export default CommitActivityChart;