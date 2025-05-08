import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, CategoryScale } from 'chart.js';
import '../css/linechart.css';
import { color } from 'chart.js/helpers';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, CategoryScale);

const LineChart = () => {
    const data = {
        labels: ['01/04', '02/04', '03/04', '04/04', '05/04', '06/04', '07/04'],
        datasets: [
            {
                label: 'This month',
                data: [10, 15, 12, 25, 20, 15, 25],
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0)',
                fill: '-1',
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 1,
            },
            {
                label: 'Last month',
                data: [8, 12, 10, 15, 18, 20, 22],
                borderColor: '#aec7ed',
                borderDash: [5, 5],
                backgroundColor: '#aec7ed',
                fill: '1',
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 1.5,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                min: 0,
                max: 30,
                ticks: {
                    stepSize: 10,
                },
                grid: {
                    borderDash: [5, 5],
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <div className="linechart-header">
                <div className="linechart-title">
                    <button className="title-active">Total Active</button>
                    <button className="title-deactive">Myself</button>
                </div>
                <div className="legend-vertical-line"></div>
                <div className="linechart-legend">
                    <div className="legend-container">
                        <div className="legend-point bg-black"></div>
                        <div className="legend-label">
                            <p>This month</p>
                        </div>
                    </div>
                    <div className="legend-container">
                        <div className="legend-point bg-blue"></div>
                        <div className="legend-label">
                            <p>Last month</p>
                        </div>
                    </div>
                </div>
            </div>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;