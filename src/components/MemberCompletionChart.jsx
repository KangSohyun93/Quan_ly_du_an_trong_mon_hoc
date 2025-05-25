import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import axios from 'axios';
import MemberInfo from './MemberInfo';
import '../css/membercompletionchart.css';

ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale);

const MemberCompletionChart = ({ groupId = 1 }) => {
    const [members, setMembers] = useState([]);
    const [sprintData, setSprintData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`);
                // Format joinDate to YYYY-MM-DD
                const formattedMembers = response.data.members.map(member => ({
                    ...member,
                    joinDate: new Date(member.joinDate).toISOString().split('T')[0],
                }));
                setMembers(formattedMembers);
                setSprintData(response.data.sprintData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching member data:', err);
                setError(err.response?.data?.error || 'Failed to load data');
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId]);

    if (loading) {
        return <div className="completion-chart-container">Loading...</div>;
    }

    if (error) {
        return <div className="completion-chart-container">Error: {error}</div>;
    }

    const lateTasks = members.map(member =>
        sprintData[member.name]?.reduce((sum, sprint) => sum + sprint.late, 0) || 0
    );

    const data = {
        labels: members.map(member => member.name),
        datasets: [
            {
                label: 'Hoàn thành',
                data: members.map(member => member.completed),
                backgroundColor: '#4CAF50',
            },
            {
                label: 'Đang làm',
                data: members.map(member => member.inProgress),
                backgroundColor: '#FFD700',
            },
            {
                label: 'Chưa làm',
                data: members.map(member => member.notStarted),
                backgroundColor: '#D3D3D3',
            },
            {
                label: 'Trễ hạn',
                data: lateTasks,
                backgroundColor: '#FF6384',
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Phân bổ và đóng góp công việc',
                align: 'start',
                font: {
                    size: 18,
                    weight: 'bold',
                    family: 'Inter, sans-serif',
                },
                color: '#1F2937',
                padding: {
                    bottom: 20,
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#1F2937',
                borderColor: '#4B5563',
                borderWidth: 1,
                titleFont: { size: 14, family: 'Inter, sans-serif' },
                bodyFont: { size: 14, family: 'Inter, sans-serif' },
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                callbacks: {
                    label: (context) => {
                        const member = members[context.dataIndex];
                        const datasetLabel = context.dataset.label;
                        const value = context.raw;
                        if (datasetLabel === 'Hoàn thành') {
                            return `${member.name}: ${datasetLabel} ${value}/${member.total} (${((value / member.total) * 100).toFixed(1)}%)`;
                        }
                        return `${member.name}: ${datasetLabel} ${value}`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    font: {
                        family: 'Inter, sans-serif',
                    },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                stacked: true,
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: 'Inter, sans-serif',
                        size: 14,
                    },
                },
            },
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart',
        },
    };

    return (
        <div className="completion-chart-container">
            <div className="chart-and-info">
                <div className="chart-content">
                    <Bar data={data} options={options} />
                </div>
                <MemberInfo members={members} sprintData={sprintData} />
            </div>
        </div>
    );
};

export default MemberCompletionChart;