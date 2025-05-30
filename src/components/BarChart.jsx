import React, { useState, useEffect, useLayoutEffect } from 'react'; // Thêm useLayoutEffect
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale, Legend } from 'chart.js'; // Thêm Legend
import axios from 'axios';
import '../css/barchart.css';

ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale, Legend);

const BarChart = ({ groupId }) => {
    const [sprintData, setSprintData] = useState({});
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm state loading
    const [chartKey, setChartKey] = useState(0); // Để re-render

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
        if (!groupId) { // Xử lý trường hợp groupId không có
            setLoading(false);
            setError("No Group ID provided.");
            setMembers([]);
            return;
        }
        setLoading(true); // Đặt loading khi bắt đầu fetch
        setError(null); // Reset lỗi

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`);
                const { members: fetchedMembers, sprintData: fetchedSprintData } = response.data;
                setMembers(fetchedMembers);
                setSprintData(fetchedSprintData);
                setChartKey(k => k + 1); // Cập nhật key để re-render
            } catch (err) {
                console.error('Error fetching data for BarChart:', err);
                setError('Could not load late task data.'); // Tiếng Anh
                setMembers([]);
                setSprintData({});
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };
        fetchData();
    }, [groupId]);

    if (loading) { // Hiển thị trạng thái loading
        return <div className="barchart-container loading">Loading late task data...</div>;
    }

    if (error) { // Hiển thị lỗi
        return <div className="barchart-container error">{error}</div>;
    }

    if (members.length === 0) { // Hiển thị nếu không có dữ liệu
        return <div className="barchart-container no-data">No late task data available for members.</div>;
    }

    const lateTasks = members.map(member =>
        sprintData[member.name]?.reduce((sum, sprint) => sum + sprint.late, 0) || 0
    );

    const data = {
        labels: members.map((member) => member.name),
        datasets: [
            {
                label: 'Late Tasks', // Tiếng Anh
                data: lateTasks,
                backgroundColor: '#F44336', // Đổi thành màu đỏ
                borderRadius: 6,
                barThickness: 30, // Có thể điều chỉnh hoặc để tự động
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#4B5563',
                    font: {
                        family: 'Inter, sans-serif',
                    }
                }
            },
            title: {
                display: true,
                text: 'Late Tasks by Member', // Tiếng Anh
                font: {
                    size: 18,
                    family: 'Inter, sans-serif',
                    weight: '600'
                },
                color: '#1F2937',
                padding: {
                    bottom: 20
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#1F2937',
                titleColor: '#FFFFFF',
                bodyColor: '#FFFFFF',
                borderColor: '#4B5563',
                borderWidth: 1,
                titleFont: { size: 14, family: 'Inter, sans-serif', weight: 'bold' },
                bodyFont: { size: 13, family: 'Inter, sans-serif' },
                padding: 10,
                callbacks: {
                    title: (tooltipItems) => { // Hiển thị tên member trong title tooltip
                        if (tooltipItems.length > 0) {
                            return tooltipItems[0].label;
                        }
                        return '';
                    },
                    label: (context) => { // Label chính cho số lượng trễ
                        const late = context.raw;
                        return `Total Late: ${late}`;
                    },
                    afterBody: (tooltipItems) => { // Hiển thị chi tiết từng sprint trong afterBody
                        const dataIndex = tooltipItems[0].dataIndex;
                        const member = members[dataIndex];
                        if (!member || !sprintData[member.name]) return [];

                        const details = sprintData[member.name].map(sprint => {
                            if (sprint.late > 0) { // Chỉ hiển thị sprint có task trễ
                                return `  Sprint ${sprint.sprint}: ${sprint.late} late`;
                            }
                            return null;
                        }).filter(detail => detail !== null); // Lọc bỏ các sprint không có task trễ

                        if (details.length > 0) {
                            return ["\nDetails by Sprint:", ...details];
                        }
                        return [];
                    }
                },
            },
            // datalabels: { display: false }, // Bỏ nếu đã đặt global
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Member', // Tiếng Anh
                    font: {
                        family: 'Inter, sans-serif',
                        weight: '500'
                    },
                    color: '#4B5563'
                },
                ticks: {
                    color: '#4B5563',
                    font: {
                        family: 'Inter, sans-serif',
                    }
                }
            },
            y: {
                min: 0,
                ticks: {
                    stepSize: 1, // Giữ nguyên stepSize 1 vì đây là số task
                    color: '#4B5563',
                    font: {
                        family: 'Inter, sans-serif',
                    },
                    precision: 0
                },
                grid: {
                    borderDash: [4, 4],
                    color: '#E5E7EB'
                },
                title: {
                    display: true,
                    text: 'Number of Late Tasks', // Tiếng Anh
                    font: {
                        family: 'Inter, sans-serif',
                        weight: '500'
                    },
                    color: '#4B5563'
                },
            },
        },
    };

    return (
        <div className="barchart-container">
            <Bar key={chartKey} data={data} options={options} />
        </div>
    );
};

export default BarChart;