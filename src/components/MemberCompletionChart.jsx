import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import axios from 'axios';
import MemberInfo from './MemberInfo';
import '../css/membercompletionchart.css';

ChartJS.register(BarElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const MemberCompletionChart = ({ groupId }) => {
    const [members, setMembers] = useState([]);
    const [sprintDataForInfo, setSprintDataForInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartKey, setChartKey] = useState(0);

    useLayoutEffect(() => {
        let timeoutId = null;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setChartKey(prevKey => prevKey + 1);
            }, 150);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        if (!groupId) {
            setLoading(false);
            setError("No Group ID provided.");
            setMembers([]);
            setSprintDataForInfo({});
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // API endpoint này giờ trả về 5 trạng thái task cho mỗi member
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`);
                const formattedMembers = response.data.members.map(member => ({
                    ...member,
                    joinDate: new Date(member.joinDate).toISOString().split('T')[0],
                }));
                setMembers(formattedMembers);
                setSprintDataForInfo(response.data.sprintData); // Dữ liệu này cho MemberInfo
                setChartKey(prevKey => prevKey + 1);
            } catch (err) {
                console.error('Error fetching member data:', err);
                setError(err.response?.data?.error || 'Failed to load member data');
                setMembers([]);
                setSprintDataForInfo({});
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId]);

    if (loading) {
        return <div className="completion-chart-container loading-state">Loading member data...</div>;
    }
    if (error) {
        return <div className="completion-chart-container error-message">Error: {error}</div>;
    }
    if (members.length === 0) {
        return <div className="completion-chart-container no-data-state">No member data available for this group.</div>;
    }

    // Dữ liệu cho 5 trạng thái
    const data = {
        labels: members.map(member => member.name),
        datasets: [
            {
                label: 'Completed',
                data: members.map(member => member.completed),
                backgroundColor: '#4CAF50', // Green
            },
            {
                label: 'In Progress',
                data: members.map(member => member.inProgress),
                backgroundColor: '#FFC107', // Amber
            },
            {
                label: 'Late Completion',
                data: members.map(member => member.lateCompletion),
                backgroundColor: '#FF9800', // Orange
            },
            {
                label: 'To Do', // Trước đây là notStarted
                data: members.map(member => member.toDo),
                backgroundColor: '#D3D3D3', // Light Gray
            },
            {
                label: 'Overdue & Incomplete', // Trạng thái mới, trước là "Late" gộp chung
                data: members.map(member => member.overdueIncomplete),
                backgroundColor: '#F44336', // Red
            },
        ],
    };

    const yTickColors = members.map(member => member.role === 'PM' ? '#007bff' : '#4B5563');

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        family: 'Inter, sans-serif',
                    },
                    color: '#4B5563',
                }
            },
            title: {
                display: true,
                text: 'Member Task Status Distribution', // Đổi title
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
                titleFont: { size: 14, family: 'Inter, sans-serif', weight: 'bold' },
                bodyFont: { size: 13, family: 'Inter, sans-serif' },
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                callbacks: {
                    title: (tooltipItems) => {
                        if (tooltipItems.length > 0) {
                            const memberIndex = tooltipItems[0].dataIndex;
                            if (memberIndex >= 0 && memberIndex < members.length) {
                                return members[memberIndex].name;
                            }
                        }
                        return '';
                    },
                    label: (context) => {
                        const memberIndex = context.dataIndex;
                        if (memberIndex < 0 || memberIndex >= members.length) return '';
                        const member = members[memberIndex]; // Member hiện tại
                        const datasetLabel = context.dataset.label; // Trạng thái task
                        const value = context.raw; // Số lượng task của trạng thái đó cho member đó

                        // member.total là tổng số task được gán cho member này
                        const percentage = (member.total && member.total > 0)
                            ? ((value / member.total) * 100).toFixed(1)
                            : 0;

                        // Hiển thị: Trạng thái: value / tổng task của member (phần trăm%)
                        return `${datasetLabel}: ${value} / ${member.total} (${percentage}%)`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    precision: 0,
                    font: {
                        family: 'Inter, sans-serif',
                    },
                    color: '#4B5563',
                    stepSize: 1, // Hoặc tính toán stepSize động
                },
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Number of Tasks',
                    font: {
                        family: 'Inter, sans-serif',
                        weight: '500'
                    },
                    color: '#4B5563',
                }
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
                    color: yTickColors,
                },
            },
        },
        animation: {
            duration: 500,
            easing: 'easeOutCubic',
        },
    };

    return (
        <div className="completion-chart-container">
            <div className="chart-and-info">
                <div className="chart-content">
                    <Bar key={chartKey} data={data} options={options} />
                </div>
                {/* sprintDataForInfo là dữ liệu đã được format cho MemberInfo từ backend */}
                {(members.length > 0 && Object.keys(sprintDataForInfo).length > 0) && (
                    <MemberInfo members={members} sprintData={sprintDataForInfo} />
                )}
            </div>
        </div>
    );
};

export default MemberCompletionChart;