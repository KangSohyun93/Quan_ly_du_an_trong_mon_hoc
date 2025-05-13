import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../css/contributorcontributionchart.css';

ChartJS.register(BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const ContributorContributionChart = () => {
    const [contribData, setContribData] = useState([]);

    useEffect(() => {
        const fetchContribData = async () => {
            try {
                const owner = import.meta.env.VITE_GITHUB_OWNER;
                const repo = import.meta.env.VITE_GITHUB_REPO;
                const token = import.meta.env.VITE_GITHUB_TOKEN;

                // Lấy dữ liệu contributor từ GitHub API
                const contribResponse = await axios.get(
                    `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const contributors = contribResponse.data;

                // Phân loại commit theo loại tệp (giả định dựa trên số dòng thêm/xóa)
                const contribByType = contributors.map(contrib => {
                    const author = contrib.author.login;
                    let code = 0, docs = 0, tests = 0;

                    contrib.weeks.forEach(week => {
                        code += week.a; // Dòng thêm (giả định là mã nguồn)
                        docs += Math.floor(week.a * 0.1); // 10% là tài liệu
                        tests += Math.floor(week.a * 0.2); // 20% là test
                    });

                    return { author, code, docs, tests };
                });

                setContribData(contribByType);
            } catch (error) {
                console.error('Error fetching contributor data:', error);
            }
        };
        fetchContribData();
    }, []);

    const data = {
        labels: contribData.map(item => item.author),
        datasets: [
            {
                label: 'Mã nguồn',
                data: contribData.map(item => item.code),
                backgroundColor: '#3b82f6',
            },
            {
                label: 'Tài liệu',
                data: contribData.map(item => item.docs),
                backgroundColor: '#10b981',
            },
            {
                label: 'Tests',
                data: contribData.map(item => item.tests),
                backgroundColor: '#f59e0b',
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
                text: 'Đóng góp theo loại tệp của thành viên',
                font: { size: 18, family: 'Inter, sans-serif' },
                color: '#1F2937',
            },
        },
        scales: {
            x: {
                stacked: true,
                grid: { display: false },
                title: { display: true, text: 'Thành viên', font: { family: 'Inter, sans-serif' } },
            },
            y: {
                stacked: true,
                min: 0,
                ticks: { stepSize: 1000 },
                grid: { borderDash: [5, 5] },
                title: { display: true, text: 'Số dòng', font: { family: 'Inter, sans-serif' } },
            },
        },
    };

    return (
        <div className="contributorcontribution-chart-container">
            <Bar data={data} options={options} />
        </div>
    );
};

export default ContributorContributionChart;