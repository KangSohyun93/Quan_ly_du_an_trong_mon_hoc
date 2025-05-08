import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import '../css/barchart.css';

ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale);

const BarChart = () => {
    const data = {
        labels: ['Alice', 'Blice', 'Clice', 'Dlice', 'Elice'],
        datasets: [
            {
                data: [15000, 30000, 20000, 35000, 10000],
                backgroundColor: ['#A3CFFA', '#A3CFFA', '#A3CFFA', '#A3CFFA', '#FFD700'],
                borderRadius: 10,
                barThickness: 40,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Tắt legend
            },
            title: {
                display: false,
                text: 'Độ năng nổ',
                align: 'start',
                font: {
                    family: "'Inter', sans-serif",
                    size: 16,
                    weight: 'bold',
                },
                color: '#000',
            },
            tooltip: {
                enabled: true, // Bật tooltip
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}`;
                    },
                },
                displayColors: true, 
                titleFont: { size: 14 },
                bodyFont: { size: 14 },
                borderColor: '#e0e0e0',
                borderWidth: 1,
                color: '#333',
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
                max: 35000,
                ticks: {
                    stepSize: 10000,
                    callback: (value) => {
                        if (value === 0) return '0';
                        return `${value / 1000}K`;
                    },
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="barchart-container">
            <div className="barchart-title">
                <p>Độ năng nổ</p>
            </div>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;