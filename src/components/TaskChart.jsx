import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import axios from 'axios';
import '../css/taskchart.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const TaskChart = ({ groupId }) => {
    const [taskSummary, setTaskSummary] = useState(null);
    const [sprintOptions, setSprintOptions] = useState([]);
    const [selectedSprint, setSelectedSprint] = useState('all');
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
            setTaskSummary(null);
            setSprintOptions([]);
            return;
        }
        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}/task-summary?sprintId=${selectedSprint}`);
                setTaskSummary(response.data.summary);
                if (selectedSprint === 'all' || sprintOptions.length === 0) {
                    setSprintOptions(response.data.sprintOptions);
                }
                setChartKey(prevKey => prevKey + 1);
            } catch (err) {
                console.error('Error fetching data for TaskChart:', err);
                setError('Could not load task summary data.');
                setTaskSummary(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId, selectedSprint]);

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

    const chartDataValuesOriginal = [completed, inProgress, lateCompleted, toDo, overdueIncomplete];
    const chartLabelsOriginal = ['Completed', 'In Progress', 'Late Completion', 'To Do', 'Overdue & Incomplete'];
    const backgroundColorsOriginal = [
        '#4CAF50',
        '#FFC107',
        '#FF9800',
        '#D3D3D3',
        '#F44336',
    ];

    const activeData = [];
    const activeLabels = [];
    const activeBackgroundColors = [];

    chartDataValuesOriginal.forEach((value, index) => {
        if (value > 0) {
            activeData.push(value);
            activeLabels.push(chartLabelsOriginal[index]);
            activeBackgroundColors.push(backgroundColorsOriginal[index]);
        }
    });

    const dataForChart = { // Đổi tên biến để rõ ràng hơn
        labels: activeLabels,
        datasets: [{
            label: 'Task Status', // Vẫn giữ label gốc cho dataset
            data: activeData,
            backgroundColor: activeBackgroundColors,
            borderColor: activeBackgroundColors.map(color => color.replace(')', ', 0.7)').replace('rgb', 'rgba')),
            borderWidth: 1,
            hoverOffset: 8,
        }]
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
                    // Sửa hàm filter để an toàn hơn
                    // filter: function (item, chart) {
                    //     // chart.data ở đây sẽ là dataForChart đã được lọc
                    //     // item.index sẽ là index trong activeLabels/activeData
                    //     if (chart && chart.data && chart.data.datasets && chart.data.datasets.length > 0 &&
                    //         chart.data.datasets[0].data && chart.data.datasets[0].data[item.index] !== undefined) {
                    //         return chart.data.datasets[0].data[item.index] > 0;
                    //     }
                    //     return false; // Nếu không an toàn, mặc định là không hiển thị
                    // }
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
                titleFont: { family: 'Inter, sans-serif', size: 14, weight: 'bold' },
                bodyFont: { family: 'Inter, sans-serif', size: 13 },
                titleColor: '#FFFFFF',
                bodyColor: '#FFFFFF',
                padding: 10,
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw;
                        const percentage = totalTasks > 0 ? ((value / totalTasks) * 100).toFixed(1) : 0;
                        return `${label}: ${value} / ${totalTasks} tasks (${percentage}%)`;
                    },
                },
            },
            datalabels: {
                display: (context) => {
                    // context.dataset.data ở đây là activeData
                    return context.dataset.data[context.dataIndex] > 0 && totalTasks > 0;
                },
                formatter: (value, context) => {
                    const percentage = totalTasks > 0 ? ((value / totalTasks) * 100).toFixed(0) : 0;
                    return `${percentage}%`;
                },
                color: '#ffffff',
                font: {
                    weight: 'bold',
                    size: 12,
                    family: 'Inter, sans-serif'
                },
                anchor: 'center',
                align: 'center',
                textStrokeColor: 'black',
                textStrokeWidth: 0.5,
            },
        },
        cutout: '60%',
    };
    const handleSprintChange = (event) => { // Di chuyển khai báo hàm lên trước khi sử dụng
        setSelectedSprint(event.target.value);
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
                    <Doughnut key={chartKey} data={dataForChart} options={options} />
                ) : (
                    <p className="no-data-message">No tasks found for this selection to display the chart.</p>
                )}
            </div>
        </div>
    );
};

export default TaskChart;