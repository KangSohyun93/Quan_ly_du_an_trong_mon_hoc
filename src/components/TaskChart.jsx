import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import axios from 'axios';
import '../css/taskchart.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TaskChart = ({ groupId }) => {
    const [taskSummary, setTaskSummary] = useState(null);
    const [sprintOptions, setSprintOptions] = useState([]);
    const [selectedSprint, setSelectedSprint] = useState('all'); // 'all' hoặc sprint_id
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
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
        if (!groupId) {
            setLoading(false);
            setError("No Group ID provided.");
            return;
        }
        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}/task-summary?sprintId=${selectedSprint}`);
                setTaskSummary(response.data.summary);
                // Chỉ cập nhật sprintOptions một lần hoặc khi nó rỗng
                if (sprintOptions.length === 0 || selectedSprint === 'all') {
                     setSprintOptions(response.data.sprintOptions);
                }
                setChartKey(prevKey => prevKey + 1); // Re-render chart
            } catch (err) {
                console.error('Error fetching data for TaskChart:', err);
                setError('Could not load task summary data.');
                setTaskSummary(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId, selectedSprint]); // Thêm sprintOptions vào dependencies nếu muốn nó cập nhật khi sprintOptions thay đổi từ API (thường không cần)

    const handleSprintChange = (event) => {
        setSelectedSprint(event.target.value);
    };

    if (loading) {
        return <div className="taskchart-container loading">Loading task data...</div>;
    }
    if (error) {
        return <div className="taskchart-container error-message">{error}</div>;
    }
    if (!taskSummary) {
        return <div className="taskchart-container no-data">No task data available for this selection.</div>;
    }

    const { completed, inProgress, toDo, lateCompleted, overdueIncomplete } = taskSummary;
    const totalTasks = completed + inProgress + toDo + lateCompleted + overdueIncomplete;

    const chartDataValues = [completed, inProgress, lateCompleted, toDo, overdueIncomplete];
    const chartLabels = ['Completed', 'In Progress', 'Late Completion', 'To Do', 'Overdue & Incomplete'];
    const backgroundColors = [
        '#4CAF50', // Green - Completed
        '#FFC107', // Amber - In Progress
        '#FF9800', // Orange - Late Completion
        '#D3D3D3', // Light Gray - To Do
        '#F44336', // Red - Overdue & Incomplete
    ];

    const data = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Task Status',
                data: chartDataValues,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace(')', ', 0.7)').replace('rgb', 'rgba')), // Slightly darker border
                borderWidth: 1,
                hoverOffset: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: { family: 'Inter, sans-serif', size: 12 },
                    color: '#4B5563',
                },
            },
            title: {
                display: true,
                text: 'Task Completion Status',
                font: { size: 18, family: 'Inter, sans-serif', weight: '600' },
                color: '#1F2937',
                padding: { bottom: 15 }
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#1F2937',
                titleFont: { family: 'Inter, sans-serif', size: 14 },
                bodyFont: { family: 'Inter, sans-serif', size: 13 },
                titleColor: '#FFFFFF',
                bodyColor: '#FFFFFF',
                padding: 10,
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const percentage = totalTasks > 0 ? ((value / totalTasks) * 100).toFixed(1) : 0;
                        return `${label}: ${value} task(s) (${percentage}%)`;
                    },
                },
            },
            datalabels: { // Cấu hình cho chartjs-plugin-datalabels
                display: totalTasks > 0 ? 'auto' : false, // Chỉ hiển thị nếu có data
                formatter: (value, context) => {
                    if (value === 0) return ''; // Không hiển thị % cho phần 0
                    const percentage = totalTasks > 0 ? ((value / totalTasks) * 100).toFixed(0) : 0;
                    return `${percentage}%`;
                },
                color: '#ffffff',
                font: {
                    weight: 'bold',
                    size: 12,
                    family: 'Inter, sans-serif'
                },
                anchor: 'center', // 'end', 'start', 'center'
                align: 'center', // 'top', 'bottom', 'middle', 'start', 'end', 'center'
                textStrokeColor: 'black',
                textStrokeWidth: 0.5,
                // offset: 8, // Khoảng cách từ tâm (nếu anchor là center)
            },
        },
        cutout: '60%', // Làm cho nó thành doughnut chart
    };

    return (
        <div className="taskchart-container">
            <div className="taskchart-header">
                <h3 className="taskchart-title">Task Status Overview</h3>
                <select value={selectedSprint} onChange={handleSprintChange} className="sprint-select-taskchart">
                    <option value="all">All Sprints (Project)</option>
                    {sprintOptions.map(sprint => (
                        <option key={sprint.id} value={sprint.id}>
                            {sprint.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="taskchart-content">
                {totalTasks > 0 ? (
                    <Doughnut key={chartKey} data={data} options={options} />
                ) : (
                    <p className="no-data-message">No tasks found for this selection to display the chart.</p>
                )}
            </div>
        </div>
    );
};

export default TaskChart;