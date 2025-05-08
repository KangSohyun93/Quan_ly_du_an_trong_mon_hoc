import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Title } from 'chart.js';
import '../css/completionpiechart.css';

ChartJS.register(ArcElement, Tooltip, Title);

const CompletionPieChart = () => {
    const data = {
        labels: ['Completed', 'Incomplete'],
        datasets: [
            {
                data: [60, 40], // Ví dụ: 60% hoàn thành, 40% chưa hoàn thành
                backgroundColor: ['#4CAF50', '#FF6384'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Task Completion Rate (Sprint)',
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
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}%`;
                    },
                },
            },
        },
    };

    return (
        <div className="piechart-container">
            <div className="piechart-wrapper">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default CompletionPieChart;