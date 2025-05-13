import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, CategoryScale, Title, Tooltip } from 'chart.js';
import axios from 'axios';
import '../css/prsizechart.css';

ChartJS.register(BarElement, LinearScale, CategoryScale, Title, Tooltip);

const PRSizeChart = () => {
    const [prData, setPrData] = useState([]);

    useEffect(() => {
        const fetchPRData = async () => {
            try {
                const owner = import.meta.env.VITE_GITHUB_OWNER;
                const repo = import.meta.env.VITE_GITHUB_REPO;
                const token = import.meta.env.VITE_GITHUB_TOKEN;

                // Lấy danh sách PR từ GitHub API
                const prResponse = await axios.get(
                    `https://api.github.com/repos/${owner}/${repo}/pulls`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { state: 'closed', per_page: 50 },
                    }
                );
                const prs = prResponse.data;

                // Tính kích thước PR (dòng thêm + xóa)
                const prSizes = prs.map(pr => ({
                    number: `#${pr.number}`,
                    size: pr.additions + pr.deletions,
                }));

                setPrData(prSizes.slice(0, 10)); // Hiển thị 10 PR gần nhất
            } catch (error) {
                console.error('Error fetching PR data:', error);
            }
        };
        fetchPRData();
    }, []);

    const data = {
        labels: prData.map(item => item.number),
        datasets: [
            {
                label: 'Kích thước PR (dòng)',
                data: prData.map(item => item.size),
                backgroundColor: '#f59e0b',
                borderColor: '#d97706',
                borderWidth: 1,
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
                text: 'Kích thước trung bình của Pull Requests',
                font: { size: 18, family: 'Inter, sans-serif' },
                color: '#1F2937',
            },
        },
        scales: {
            x: {
                grid: { display: false },
                title: { display: true, text: 'Pull Request', font: { family: 'Inter, sans-serif' } },
            },
            y: {
                min: 0,
                ticks: { stepSize: 100 },
                grid: { borderDash: [5, 5] },
                title: { display: true, text: 'Số dòng (Thêm + Xóa)', font: { family: 'Inter, sans-serif' } },
            },
        },
    };

    return (
        <div className="prsize-chart-container">
            <Bar data={data} options={options} />
        </div>
    );
};

export default PRSizeChart;