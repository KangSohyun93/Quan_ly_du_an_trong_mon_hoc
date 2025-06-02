import React, { useState, useLayoutEffect } from 'react'; // Bỏ useEffect
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import nếu bạn dùng plugin này
import './taskchart.css';

import useTaskSummaryData from '../../../hooks/useTaskSummaryData'; // Đường dẫn đúng
import { generateTaskChartConfig } from '../../../utils/generateTaskChartConfig'; // Đường dẫn đúng

ChartJS.register(ArcElement, Tooltip, Legend, Title);
// ChartJS.register(ChartDataLabels); // Register plugin nếu dùng

const TaskChart = ({ groupId }) => {
    const {
        taskSummary,
        sprintOptions,
        selectedSprint,
        setSelectedSprint,
        error,
        loading
    } = useTaskSummaryData(groupId, 'all');

    const [chartKey, setChartKey] = useState(0);

    useLayoutEffect(() => {
        let timeoutId = null;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setChartKey(prevKey => prevKey + 1), 150);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    // Gọi generateTaskChartConfig, truyền taskSummary.
    // totalTasks cũng được trả về từ utility function.
    const { dataForChart, options, totalTasks } = generateTaskChartConfig(taskSummary);

    if (loading) return <div className="taskchart-container loading">Loading task data...</div>;
    if (error) return <div className="taskchart-container error-message">{error}</div>;
    // Không cần kiểm tra !taskSummary nữa vì generateTaskChartConfig đã xử lý trường hợp null/undefined

    return (
        <div className="taskchart-container">
            <div className="taskchart-header">
                <h3 className="taskchart-title">Task Status Overview</h3>
                <select value={selectedSprint} onChange={(e) => setSelectedSprint(e.target.value)} className="sprint-select-taskchart">
                    <option value="all">All Sprints (Project)</option>
                    {sprintOptions.map(sprint => (
                        <option key={sprint.id} value={sprint.id}>
                            {sprint.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="taskchart-content">
                {totalTasks > 0 && dataForChart.datasets.length > 0 && dataForChart.datasets[0].data.length > 0 ? (
                    <Doughnut key={chartKey} data={dataForChart} options={options} />
                ) : (
                    <p className="no-data-message">No tasks found for this selection to display the chart.</p>
                )}
            </div>
        </div>
    );
};

export default TaskChart;