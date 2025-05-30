import React, { useState, useEffect, useLayoutEffect } from 'react'; // Thêm useLayoutEffect
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale, Legend } from 'chart.js'; // Thêm Legend
import axios from 'axios';
import '../css/sprintperformancechart.css';

ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale, Legend);

const SprintPerformanceChart = ({ groupId }) => {
    const [sprintData, setSprintData] = useState({});
    const [sprints, setSprints] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm state loading
    const [chartKey, setChartKey] = useState(0); // Để re-render chart khi cần

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
            setSprints([]);
            return;
        }
        setLoading(true); // Đặt loading khi bắt đầu fetch
        setError(null);   // Reset lỗi

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`);
                const { sprintData: fetchedSprintData } = response.data;

                if (Object.keys(fetchedSprintData).length === 0) {
                    setSprints([]); // Không có dữ liệu sprint
                    setError(null); // Không phải lỗi, chỉ là không có data
                    setLoading(false);
                    return;
                }
                setSprintData(fetchedSprintData); // Lưu sprintData nếu cần dùng ở đâu khác

                const sprintNumbers = [
                    ...new Set(
                        Object.values(fetchedSprintData).flatMap(member =>
                            member.map(sprint => sprint.sprint)
                        )
                    ),
                ].sort((a, b) => a - b);

                if (sprintNumbers.length === 0) {
                    setSprints([]);
                    setLoading(false);
                    return;
                }

                const aggregatedSprints = sprintNumbers.map(sprintNum => {
                    const sprintEntries = Object.values(fetchedSprintData)
                        .flatMap(memberSprints => memberSprints.filter(s => s.sprint === sprintNum));

                    return {
                        sprint: sprintNum,
                        completed: sprintEntries.reduce((sum, entry) => sum + entry.completed, 0),
                        late: sprintEntries.reduce((sum, entry) => sum + entry.late, 0),
                        total: sprintEntries.reduce((sum, entry) => sum + entry.total, 0),
                    };
                });

                setSprints(aggregatedSprints);
                setChartKey(k => k + 1); // Cập nhật key để re-render
            } catch (err) {
                console.error('Error fetching data for SprintPerformanceChart:', err);
                setError('Could not load sprint performance data.'); // Tiếng Anh
                setSprintData({});
                setSprints([]);
            } finally {
                setLoading(false); // Kết thúc loading dù thành công hay thất bại
            }
        };
        fetchData();
    }, [groupId]);

    if (loading) { // Hiển thị trạng thái loading
        return <div className="sprintperformance-chart-container loading">Loading sprint performance data...</div>;
    }

    if (error) { // Hiển thị lỗi
        return <div className="sprintperformance-chart-container error">{error}</div>;
    }

    if (sprints.length === 0) { // Hiển thị nếu không có dữ liệu
        return <div className="sprintperformance-chart-container no-data">No sprint performance data available.</div>;
    }

    const data = {
        labels: sprints.map((sprint) => `Sprint ${sprint.sprint}`),
        datasets: [
            {
                label: 'Completed', // Tiếng Anh
                data: sprints.map((sprint) => sprint.completed),
                backgroundColor: '#4CAF50', // Green
                borderRadius: 6, // Giảm bo góc một chút cho thẩm mỹ
            },
            {
                label: 'Late', // Tiếng Anh
                data: sprints.map((sprint) => sprint.late),
                backgroundColor: '#F44336', // Đổi thành màu đỏ
                borderRadius: 6,
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
                labels: { // Thêm style cho legend labels
                    color: '#4B5563',
                    font: {
                        family: 'Inter, sans-serif',
                    }
                }
            },
            title: {
                display: true,
                text: 'Sprint Performance Over Time', // Tiếng Anh
                font: {
                    size: 18,
                    family: 'Inter, sans-serif',
                    weight: '600' // In đậm hơn
                },
                color: '#1F2937',
                padding: { // Thêm padding cho title
                    bottom: 20
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#1F2937',
                titleColor: '#FFFFFF', // Cho title tooltip
                bodyColor: '#FFFFFF',  // Cho body tooltip
                borderColor: '#4B5563',
                borderWidth: 1,
                titleFont: { size: 14, family: 'Inter, sans-serif', weight: 'bold' },
                bodyFont: { size: 13, family: 'Inter, sans-serif' }, // Giảm size body
                padding: 10, // Thêm padding cho tooltip
                callbacks: {
                    label: (context) => {
                        // Kiểm tra sprints[context.dataIndex] tồn tại
                        const sprintDetail = sprints[context.dataIndex];
                        if (!sprintDetail) return '';

                        const label = context.dataset.label || '';
                        const value = context.raw;
                        // Hiển thị value / total tasks của sprint đó
                        return `${label}: ${value} / ${sprintDetail.total} tasks`;
                    },
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
                    text: 'Sprint', // Tiếng Anh
                    font: {
                        family: 'Inter, sans-serif',
                        weight: '500'
                    },
                    color: '#4B5563' // Màu cho title trục
                },
                ticks: { // Thêm style cho ticks trục X
                    color: '#4B5563',
                    font: {
                        family: 'Inter, sans-serif',
                    }
                }
            },
            y: {
                min: 0,
                ticks: {
                    stepSize: 5, // Điều chỉnh stepSize nếu cần, tùy theo dữ liệu
                    color: '#4B5563', // Màu cho ticks trục Y
                    font: {
                        family: 'Inter, sans-serif',
                    },
                    precision: 0 // Đảm bảo số nguyên
                },
                grid: {
                    borderDash: [4, 4], // Điều chỉnh dash
                    color: '#E5E7EB' // Màu cho grid line
                },
                title: {
                    display: true,
                    text: 'Number of Tasks', // Tiếng Anh
                    font: {
                        family: 'Inter, sans-serif',
                        weight: '500'
                    },
                    color: '#4B5563' // Màu cho title trục
                },
            },
        },
    };

    return (
        <div className="sprintperformance-chart-container">
            <Bar key={chartKey} data={data} options={options} />
        </div>
    );
};

export default SprintPerformanceChart;