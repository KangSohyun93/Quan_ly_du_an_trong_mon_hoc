import React, { useState, useEffect, useLayoutEffect } from 'react'; // Thêm useLayoutEffect
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import axios from 'axios';
import MemberInfo from './MemberInfo';
import '../css/membercompletionchart.css';

ChartJS.register(BarElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const MemberCompletionChart = ({ groupId }) => {
    const [members, setMembers] = useState([]);
    const [sprintData, setSprintData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartKey, setChartKey] = useState(0); // State mới để làm key cho Bar chart

    // Hook để lắng nghe thay đổi kích thước cửa sổ và cập nhật chartKey
    // useLayoutEffect sẽ chạy sau khi DOM được cập nhật nhưng trước khi trình duyệt paint
    useLayoutEffect(() => {
        let timeoutId = null;
        const handleResize = () => {
            // Debounce để tránh trigger quá nhiều lần khi đang kéo thả cửa sổ
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                // Chỉ cần thay đổi key là đủ để React re-render component Bar
                // Giá trị của key không quan trọng, miễn là nó thay đổi
                setChartKey(prevKey => prevKey + 1);
            }, 150); // Chờ 150ms sau khi ngừng resize rồi mới cập nhật
        };

        window.addEventListener('resize', handleResize);
        // Gọi handleResize một lần khi component mount để Chart.js có kích thước đúng ban đầu
        // nếu kích thước ban đầu không phải là kích thước mà Chart.js tự nhận diện được.
        // Tuy nhiên, thường thì responsive:true đã xử lý việc này.
        // handleResize(); // Có thể không cần thiết

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []); // Chạy một lần khi component mount và dọn dẹp khi unmount

    useEffect(() => {
        if (!groupId) {
            setLoading(false);
            setError("No Group ID provided.");
            setMembers([]);
            setSprintData({});
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`);
                const formattedMembers = response.data.members.map(member => ({
                    ...member,
                    joinDate: new Date(member.joinDate).toISOString().split('T')[0],
                }));
                setMembers(formattedMembers);
                setSprintData(response.data.sprintData);
                setChartKey(prevKey => prevKey + 1); // Thay đổi key khi có dữ liệu mới cũng tốt
            } catch (err) {
                console.error('Error fetching member data:', err);
                setError(err.response?.data?.error || 'Failed to load member data');
                setMembers([]);
                setSprintData({});
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

    const lateTasks = members.map(member =>
        sprintData[member.name]?.reduce((sum, sprint) => sum + sprint.late, 0) || 0
    );

    const data = {
        labels: members.map(member => member.name),
        datasets: [
            {
                label: 'Completed',
                data: members.map(member => member.completed),
                backgroundColor: '#4CAF50',
            },
            {
                label: 'In Progress',
                data: members.map(member => member.inProgress),
                backgroundColor: '#FFC107',
            },
            {
                label: 'To Do',
                data: members.map(member => member.notStarted),
                backgroundColor: '#D3D3D3',
            },
            {
                label: 'Late',
                data: lateTasks,
                backgroundColor: '#F44336',
            },
        ],
    };

    const yTickColors = members.map(member => member.role === 'PM' ? '#007bff' : '#4B5563');

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        // ... (các options khác giữ nguyên)
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
                text: 'Task Distribution & Contribution',
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
                        const member = members[memberIndex];
                        const datasetLabel = context.dataset.label;
                        const value = context.raw;

                        const percentage = (member.total && member.total > 0)
                            ? ((value / member.total) * 100).toFixed(1)
                            : 0;

                        if (datasetLabel === 'Completed' && member.total > 0) {
                            return `${datasetLabel}: ${value}/${member.total} (${percentage}%)`;
                        }
                        return `${datasetLabel}: ${value}`;
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
                    stepSize: 1,
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
        animation: { // Giảm thời gian animation để thấy thay đổi nhanh hơn nếu cần
            duration: 500, // Giảm từ 1000
            easing: 'easeOutCubic',
        },
    };

    return (
        <div className="completion-chart-container">
            <div className="chart-and-info">
                <div className="chart-content">
                    {/* Thêm key vào Bar component */}
                    <Bar key={chartKey} data={data} options={options} />
                </div>
                {(members.length > 0 && Object.keys(sprintData).length > 0) && (
                    <MemberInfo members={members} sprintData={sprintData} />
                )}
            </div>
        </div>
    );
};

export default MemberCompletionChart;