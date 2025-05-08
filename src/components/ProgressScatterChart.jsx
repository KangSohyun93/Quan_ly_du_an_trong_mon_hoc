import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, PointElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import '../css/progressscatterchart.css';

ChartJS.register(PointElement, LinearScale, Title, Tooltip, CategoryScale);

const ProgressScatterChart = () => {
    const data = {
        datasets: [
            {
                label: 'Alice',
                data: [
                    { x: '2025-04-01', y: 5 },
                    { x: '2025-04-02', y: 8 },
                    { x: '2025-04-03', y: 3 },
                    { x: '2025-04-04', y: 6 },
                ],
                backgroundColor: '#FF6384',
                pointRadius: 6,
            },
            {
                label: 'Blice',
                data: [
                    { x: '2025-04-01', y: 4 },
                    { x: '2025-04-02', y: 6 },
                    { x: '2025-04-03', y: 2 },
                    { x: '2025-04-04', y: 7 },
                ],
                backgroundColor: '#36A2EB',
                pointRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
            },
            title: {
                display: true,
                text: 'Tasks Completed per Day',
                align: 'start',
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const x = context.raw.x || '';
                        const y = context.raw.y || 0;
                        return `${label} - ${x}: ${y} tasks`;
                    },
                },
            },
        },
        scales: {
            x: {
                type: 'category',
                labels: ['2025-04-01', '2025-04-02', '2025-04-03', '2025-04-04'],
                grid: {
                    display: false,
                },
            },
            y: {
                min: 0,
                max: 10,
                ticks: {
                    stepSize: 2,
                },
                grid: {
                    borderDash: [5, 5],
                },
            },
        },
    };

    return (
        <div className="scatterchart-container">
            <div className="scatterchart-wrapper">
                <Scatter data={data} options={options} />
            </div>
        </div>
    );
};

export default ProgressScatterChart;