// // import React from 'react';
// // import { Bar } from 'react-chartjs-2';
// // import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
// // import '../css/taskchart.css';
// // import { color } from 'chart.js/helpers';

// // ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale);

// // const TaskChart = () => {
// //   const data = {
// //     labels: ['1', '2', '3', '4', '5'],
// //     datasets: [
// //       {
// //         data: [50, 20, 50, 40, 5],
// //         backgroundColor: ['#C7AFFF', '#A3E4D7', '#000000', '#A3CFFA', '#D6EAF8'],
// //         borderRadius: 10,
// //         barThickness: 40,
// //       },
// //     ],
// //   };

// //   const options = {
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     plugins: {
// //       legend: {
// //         display: false, // Tắt legend
// //       },
// //       title: {
// //         display: false,
// //       },
// //       tooltip: {
// //         enabled: true, // Bật tooltip
// //         callbacks: {
// //           label: (context) => {
// //             const label = context.label || '';
// //             const value = context.raw || 0;
// //             return `${label}: ${value}`;
// //           },
// //         },
// //         displayColors: true, 
// //         titleFont: { size: 14 },
// //         bodyFont: { size: 14 },
// //         borderColor: '#e0e0e0',
// //         borderWidth: 1,
// //         color: '#333',
// //       },
// //     },
// //     scales: {
// //       x: {
// //         grid: {
// //           display: false,
// //         },
// //       },
// //       y: {
// //         min: 0,
// //         max: 50,
// //         ticks: {
// //           stepSize: 10,
// //         },
// //         grid: {
// //           display: false,
// //         },
// //       },
// //     },
// //   };

// //   return (
// //     <div className="taskchart-container">
// //       <div className="taskchart-title">
// //         <p>Task done/Sprint</p>
// //       </div>
// //       <Bar data={data} options={options} />
// //     </div>
// //   );
// // };

// // export default TaskChart;

// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
// import '../css/taskchart.css';

// ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

// const TaskChart = () => {
//     const sprintData = {
//         Alice: [
//             { sprint: 1, completed: 10, total: 12, late: 2 },
//             { sprint: 2, completed: 15, total: 18, late: 1 },
//             { sprint: 3, completed: 20, total: 20, late: 0 },
//         ],
//         Blice: [
//             { sprint: 1, completed: 8, total: 10, late: 1 },
//             { sprint: 2, completed: 12, total: 15, late: 2 },
//             { sprint: 3, completed: 18, total: 25, late: 3 },
//         ],
//         Clice: [
//             { sprint: 1, completed: 5, total: 8, late: 1 },
//             { sprint: 2, completed: 10, total: 12, late: 0 },
//             { sprint: 3, completed: 15, total: 20, late: 2 },
//         ],
//         Dlice: [
//             { sprint: 1, completed: 5, total: 6, late: 0 },
//             { sprint: 2, completed: 8, total: 10, late: 1 },
//             { sprint: 3, completed: 12, total: 14, late: 1 },
//         ],
//         Elice: [
//             { sprint: 1, completed: 3, total: 5, late: 1 },
//             { sprint: 2, completed: 5, total: 7, late: 0 },
//             { sprint: 3, completed: 7, total: 8, late: 0 },
//         ],
//     };

//     const groupCompleted = [1, 2, 3].map(sprint =>
//         Object.values(sprintData).reduce((sum, member) => sum + member[sprint - 1].completed, 0)
//     );
//     const groupTotal = [1, 2, 3].map(sprint =>
//         Object.values(sprintData).reduce((sum, member) => sum + member[sprint - 1].total, 0)
//     );

//     const data = {
//         labels: ['Sprint 1', 'Sprint 2', 'Sprint 3'],
//         datasets: [
//             {
//                 label: 'Nhiệm vụ hoàn thành',
//                 data: groupCompleted,
//                 borderColor: '#4CAF50',
//                 backgroundColor: 'rgba(76, 175, 80, 0.1)',
//                 fill: false,
//                 tension: 0.4,
//                 pointRadius: 4,
//             },
//             {
//                 label: 'Tổng nhiệm vụ',
//                 data: groupTotal,
//                 borderColor: '#3b82f6',
//                 backgroundColor: 'rgba(59, 130, 246, 0.1)',
//                 fill: false,
//                 tension: 0.4,
//                 pointRadius: 4,
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: true,
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: 'Xu hướng hoàn thành nhiệm vụ',
//                 font: {
//                     size: 18,
//                     family: 'Inter, sans-serif',
//                 },
//                 color: '#1F2937',
//             },
//             tooltip: {
//                 enabled: true,
//                 backgroundColor: '#1F2937',
//                 borderColor: '#4B5563',
//                 borderWidth: 1,
//                 titleFont: { size: 14, family: 'Inter, sans-serif' },
//                 bodyFont: { size: 14, family: 'Inter, sans-serif' },
//                 callbacks: {
//                     label: (context) => {
//                         const label = context.dataset.label;
//                         const value = context.raw;
//                         return `${label}: ${value}`;
//                     },
//                 },
//             },
//         },
//         scales: {
//             x: {
//                 grid: {
//                     display: false,
//                 },
//                 title: {
//                     display: true,
//                     text: 'Sprint',
//                     font: {
//                         family: 'Inter, sans-serif',
//                     },
//                 },
//             },
//             y: {
//                 min: 0,
//                 ticks: {
//                     stepSize: 10,
//                 },
//                 grid: {
//                     borderDash: [5, 5],
//                 },
//                 title: {
//                     display: true,
//                     text: 'Số nhiệm vụ',
//                     font: {
//                         family: 'Inter, sans-serif',
//                     },
//                 },
//             },
//         },
//     };

//     return (
//         <div className="taskchart-container">
//             <Line data={data} options={options} />
//         </div>
//     );
// };

// export default TaskChart;

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import axios from 'axios';
import '../css/taskchart.css';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

const TaskChart = ({ groupId }) => {
    const [sprintData, setSprintData] = useState({});
    const [groupCompleted, setGroupCompleted] = useState([]);
    const [groupTotal, setGroupTotal] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`);
                const { sprintData: fetchedSprintData } = response.data;
                setSprintData(fetchedSprintData);

                // Lấy danh sách các sprint duy nhất
                const sprintNumbers = [
                    ...new Set(
                        Object.values(fetchedSprintData).flatMap(member =>
                            member.map(sprint => sprint.sprint)
                        )
                    ),
                ].sort((a, b) => a - b);

                // Tổng hợp dữ liệu cho từng sprint
                const completed = sprintNumbers.map(sprintNum =>
                    Object.values(fetchedSprintData).reduce((sum, member) => {
                        const sprintEntry = member.find(s => s.sprint === sprintNum);
                        return sum + (sprintEntry?.completed || 0);
                    }, 0)
                );
                const total = sprintNumbers.map(sprintNum =>
                    Object.values(fetchedSprintData).reduce((sum, member) => {
                        const sprintEntry = member.find(s => s.sprint === sprintNum);
                        return sum + (sprintEntry?.total || 0);
                    }, 0)
                );

                setGroupCompleted(completed);
                setGroupTotal(total);
                setError(null);
            } catch (err) {
                console.error('Error fetching data for TaskChart:', err);
                setError('Không thể tải dữ liệu xu hướng hoàn thành nhiệm vụ');
                setSprintData({});
                setGroupCompleted([]);
                setGroupTotal([]);
            }
        };
        fetchData();
    }, [groupId]);

    const data = {
        labels: groupCompleted.map((_, index) => `Sprint ${index + 1}`),
        datasets: [
            {
                label: 'Nhiệm vụ hoàn thành',
                data: groupCompleted,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 4,
            },
            {
                label: 'Tổng nhiệm vụ',
                data: groupTotal,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4,
                pointRadius: 4,
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
                text: 'Xu hướng hoàn thành nhiệm vụ',
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
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label;
                        const value = context.raw;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Sprint',
                    font: {
                        family: 'Inter, sans-serif',
                    },
                },
            },
            y: {
                min: 0,
                ticks: {
                    stepSize: 10,
                },
                grid: {
                    borderDash: [5, 5],
                },
                title: {
                    display: true,
                    text: 'Số nhiệm vụ',
                    font: {
                        family: 'Inter, sans-serif',
                    },
                },
            },
        },
    };

    return (
        <div className="taskchart-container">
            {error && <p className="error">{error}</p>}
            {groupCompleted.length === 0 && !error && <p>Không có dữ liệu xu hướng hoàn thành nhiệm vụ</p>}
            {groupCompleted.length > 0 && <Line data={data} options={options} />}
        </div>
    );
};

export default TaskChart;