import React, { useState, useLayoutEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale, Legend } from 'chart.js';
import './sprintperformancechart.css';

import useSprintPerformanceData from '../../../hooks/useSprintPerformanceData'; // Đường dẫn đúng
import { generateSprintPerformanceChartConfig } from '../../../utils/generateSprintPerformanceChartConfig'; // Đường dẫn đúng

ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale, Legend);

const SprintPerformanceChart = ({ groupId }) => {
    const { processedSprints, loading, error } = useSprintPerformanceData(groupId);
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

    // Chỉ gọi generate config nếu processedSprints có dữ liệu
    const { data, options } = (processedSprints && processedSprints.length > 0)
        ? generateSprintPerformanceChartConfig(processedSprints)
        : generateSprintPerformanceChartConfig([]);


    if (loading) return <div className="sprintperformance-chart-container loading">Loading sprint performance data...</div>;
    if (error) return <div className="sprintperformance-chart-container error">{error}</div>;
    if (!processedSprints || processedSprints.length === 0) return <div className="sprintperformance-chart-container no-data">No sprint performance data available.</div>;

    return (
        <div className="sprintperformance-chart-container">
            <Bar key={chartKey} data={data} options={options} />
        </div>
    );
};

export default SprintPerformanceChart;