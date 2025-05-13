import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import axios from 'axios';
import '../css/locgrowthchart.css';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

const LOCGrowthChart = () => {
    const [locData, setLocData] = useState([]);

    useEffect(() => {
        const fetchLOCData = async () => {
            try {
                const owner = import.meta.env.VITE_GITHUB_OWNER;
                const repo = import.meta.env.VITE_GITHUB_REPO;
                const token = import.meta.env.VITE_GITHUB_TOKEN;

                // Lấy danh sách commit từ GitHub API
                const commitsResponse = await axios.get(
                    `https://api.github.com/repos/${owner}/${repo}/commits`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { per_page: 100 }, // Lấy 100 commit đầu tiên
                    }
                );
                const commits = commitsResponse.data;

                // Lấy LOC tại các commit (mỗi tuần lấy một commit)
                const locByWeek = [];
                const weeks = [...new Set(commits.map(c => {
                    const date = new Date(c.commit.author.date);
                    return `${date.getFullYear()}-W${Math.floor(date.getDate() / 7) + 1}`;
                }))].slice(0, 5); // Lấy 5 tuần gần nhất

                for (const week of weeks) {
                    const commit = commits.find(c => {
                        const date = new Date(c.commit.author.date);
                        return `${date.getFullYear()}-W${Math.floor(date.getDate() / 7) + 1}` === week;
                    });
                    if (commit) {
                        // Gọi API codetabs.com để tính LOC tại commit cụ thể
                        const locResponse = await axios.get(
                            `https://api.codetabs.com/v1/loc?github=${owner}/${repo}&branch=${commit.sha}`,
                            { params: { branch: commit.sha } }
                        );
                        const totalLOC = locResponse.data.reduce((sum, lang) => sum + lang.linesOfCode, 0);
                        locByWeek.push({ week, loc: totalLOC });
                    }
                }

                setLocData(locByWeek);
            } catch (error) {
                console.error('Error fetching LOC data:', error);
            }
        };
        fetchLOCData();
    }, []);

    const data = {
        labels: locData.map(item => item.week),
        datasets: [
            {
                label: 'Tổng LOC',
                data: locData.map(item => item.loc),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
                text: 'Tăng trưởng Lines of Code theo thời gian',
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
                ticks: { stepSize: 1000 },
                grid: { borderDash: [5, 5] },
                title: { display: true, text: 'Tổng LOC', font: { family: 'Inter, sans-serif' } },
            },
        },
    };

    return (
        <div className="locgrowth-chart-container">
            <Line data={data} options={options} />
        </div>
    );
};

export default LOCGrowthChart;