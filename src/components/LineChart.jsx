// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, CategoryScale } from 'chart.js';
// import '../css/linechart.css';
// import { color } from 'chart.js/helpers';

// ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, CategoryScale);

// const LineChart = () => {
//     const data = {
//         labels: ['01/04', '02/04', '03/04', '04/04', '05/04', '06/04', '07/04'],
//         datasets: [
//             {
//                 label: 'This month',
//                 data: [10, 15, 12, 25, 20, 15, 25],
//                 borderColor: '#000000',
//                 backgroundColor: 'rgba(0, 0, 0)',
//                 fill: '-1',
//                 tension: 0.4,
//                 pointRadius: 0,
//                 borderWidth: 1,
//             },
//             {
//                 label: 'Last month',
//                 data: [8, 12, 10, 15, 18, 20, 22],
//                 borderColor: '#aec7ed',
//                 borderDash: [5, 5],
//                 backgroundColor: '#aec7ed',
//                 fill: '1',
//                 tension: 0.4,
//                 pointRadius: 0,
//                 borderWidth: 1.5,
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false,
//             },
//             title: {
//                 display: false,
//             },
//         },
//         scales: {
//             x: {
//                 grid: {
//                     display: false,
//                 },
//             },
//             y: {
//                 min: 0,
//                 max: 30,
//                 ticks: {
//                     stepSize: 10,
//                 },
//                 grid: {
//                     borderDash: [5, 5],
//                 },
//             },
//         },
//     };

//     return (
//         <div className="chart-container">
//             <div className="linechart-header">
//                 <div className="linechart-title">
//                     <button className="title-active">Total Active</button>
//                     <button className="title-deactive">Myself</button>
//                 </div>
//                 <div className="legend-vertical-line"></div>
//                 <div className="linechart-legend">
//                     <div className="legend-container">
//                         <div className="legend-point bg-black"></div>
//                         <div className="legend-label">
//                             <p>This month</p>
//                         </div>
//                     </div>
//                     <div className="legend-container">
//                         <div className="legend-point bg-blue"></div>
//                         <div className="legend-label">
//                             <p>Last month</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Line data={data} options={options} />
//         </div>
//     );
// };

// export default LineChart;

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, CategoryScale } from 'chart.js';
import '../css/linechart.css';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, CategoryScale);

const LineChart = () => {
    const burndownData = {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'],
        planned: [200, 160, 120, 80, 0], // Tổng nhiệm vụ của nhóm
        actual: [200, 180, 150, 100, 50],
        completion: 76, // Tính từ tổng hoàn thành của nhóm
    };

    const data = {
        labels: burndownData.labels,
        datasets: [
            {
                label: 'Kế hoạch',
                data: burndownData.planned,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 1.5,
            },
            {
                label: 'Thực tế',
                data: burndownData.actual,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: false,
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
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: `Tiến độ dự án (${burndownData.completion}% hoàn thành)`,
                font: {
                    size: 18,
                    family: 'Inter, sans-serif',
                },
                color: '#1F2937',
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#1F2937',
                borderColor: '#4B5563',
                borderWidth: 1,
                titleFont: { size: 14, family: 'Inter, sans-serif' },
                bodyFont: { size: 14, family: 'Inter, sans-serif' },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Thời gian',
                    font: {
                        family: 'Inter, sans-serif',
                    },
                },
            },
            y: {
                min: 0,
                ticks: {
                    stepSize: 50,
                },
                grid: {
                    borderDash: [5, 5],
                },
                title: {
                    display: true,
                    text: 'Số nhiệm vụ còn lại',
                    font: {
                        family: 'Inter, sans-serif',
                    },
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;