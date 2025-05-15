// // import React from 'react';
// // import { Bar } from 'react-chartjs-2';
// // import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
// // import '../css/barchart.css';

// // ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale);

// // const BarChart = () => {
// //     const data = {
// //         labels: ['Alice', 'Blice', 'Clice', 'Dlice', 'Elice'],
// //         datasets: [
// //             {
// //                 data: [15000, 30000, 20000, 35000, 10000],
// //                 backgroundColor: ['#A3CFFA', '#A3CFFA', '#A3CFFA', '#A3CFFA', '#FFD700'],
// //                 borderRadius: 10,
// //                 barThickness: 40,
// //             },
// //         ],
// //     };

// //     const options = {
// //         responsive: true,
// //         maintainAspectRatio: false,
// //         plugins: {
// //             legend: {
// //                 display: false, // Tắt legend
// //             },
// //             title: {
// //                 display: false,
// //                 text: 'Độ năng nổ',
// //                 align: 'start',
// //                 font: {
// //                     family: "'Inter', sans-serif",
// //                     size: 16,
// //                     weight: 'bold',
// //                 },
// //                 color: '#000',
// //             },
// //             tooltip: {
// //                 enabled: true, // Bật tooltip
// //                 callbacks: {
// //                     label: (context) => {
// //                         const label = context.label || '';
// //                         const value = context.raw || 0;
// //                         return `${label}: ${value}`;
// //                     },
// //                 },
// //                 displayColors: true, 
// //                 titleFont: { size: 14 },
// //                 bodyFont: { size: 14 },
// //                 borderColor: '#e0e0e0',
// //                 borderWidth: 1,
// //                 color: '#333',
// //             },
// //         },
// //         scales: {
// //             x: {
// //                 grid: {
// //                     display: false,
// //                 },
// //             },
// //             y: {
// //                 min: 0,
// //                 max: 35000,
// //                 ticks: {
// //                     stepSize: 10000,
// //                     callback: (value) => {
// //                         if (value === 0) return '0';
// //                         return `${value / 1000}K`;
// //                     },
// //                 },
// //                 grid: {
// //                     display: false,
// //                 },
// //             },
// //         },
// //     };

// //     return (
// //         <div className="barchart-container">
// //             <div className="barchart-title">
// //                 <p>Độ năng nổ</p>
// //             </div>
// //             <Bar data={data} options={options} />
// //         </div>
// //     );
// // };

// // export default BarChart;

// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
// import '../css/barchart.css';

// ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale);

// const BarChart = () => {
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

//     const members = [
//         { name: 'Alice' },
//         { name: 'Blice' },
//         { name: 'Clice' },
//         { name: 'Dlice' },
//         { name: 'Elice' },
//     ];

//     const lateTasks = members.map(member =>
//         sprintData[member.name].reduce((sum, sprint) => sum + sprint.late, 0)
//     );

//     const data = {
//         labels: members.map((member) => member.name),
//         datasets: [
//             {
//                 label: 'Nhiệm vụ trễ hạn',
//                 data: lateTasks,
//                 backgroundColor: '#FF6384',
//                 borderRadius: 8,
//                 barThickness: 30,
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
//                 text: 'Tỷ lệ nhiệm vụ trễ hạn',
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
//                         const member = members[context.dataIndex];
//                         const late = context.raw;
//                         const details = sprintData[member.name].map(sprint => `Sprint ${sprint.sprint}: ${sprint.late}`);
//                         return [`Tổng trễ: ${late}`, ...details];
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
//                     text: 'Thành viên',
//                     font: {
//                         family: 'Inter, sans-serif',
//                     },
//                 },
//             },
//             y: {
//                 min: 0,
//                 ticks: {
//                     stepSize: 1,
//                 },
//                 grid: {
//                     borderDash: [5, 5],
//                 },
//                 title: {
//                     display: true,
//                     text: 'Số nhiệm vụ trễ',
//                     font: {
//                         family: 'Inter, sans-serif',
//                     },
//                 },
//             },
//         },
//     };

//     return (
//         <div className="barchart-container">
//             <Bar data={data} options={options} />
//         </div>
//     );
// };

// export default BarChart;

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import axios from 'axios';
import '../css/barchart.css';

ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale);

const BarChart = ({ groupId }) => {
    const [sprintData, setSprintData] = useState({});
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`);
                const { members: fetchedMembers, sprintData: fetchedSprintData } = response.data;
                setMembers(fetchedMembers);
                setSprintData(fetchedSprintData);
                setError(null);
            } catch (err) {
                console.error('Error fetching data for BarChart:', err);
                setError('Không thể tải dữ liệu tỷ lệ nhiệm vụ trễ hạn');
                setMembers([]);
                setSprintData({});
            }
        };
        fetchData();
    }, [groupId]);

    const lateTasks = members.map(member =>
        sprintData[member.name]?.reduce((sum, sprint) => sum + sprint.late, 0) || 0
    );

    const data = {
        labels: members.map((member) => member.name),
        datasets: [
            {
                label: 'Nhiệm vụ trễ hạn',
                data: lateTasks,
                backgroundColor: '#FF6384',
                borderRadius: 8,
                barThickness: 30,
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
                text: 'Tỷ lệ nhiệm vụ trễ hạn',
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
                        const member = members[context.dataIndex];
                        const late = context.raw;
                        const details = sprintData[member.name]?.map(sprint => `Sprint ${sprint.sprint}: ${sprint.late}`) || [];
                        return [`Tổng trễ: ${late}`, ...details];
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
                    text: 'Thành viên',
                    font: {
                        family: 'Inter, sans-serif',
                    },
                },
            },
            y: {
                min: 0,
                ticks: {
                    stepSize: 1,
                },
                grid: {
                    borderDash: [5, 5],
                },
                title: {
                    display: true,
                    text: 'Số nhiệm vụ trễ',
                    font: {
                        family: 'Inter, sans-serif',
                    },
                },
            },
        },
    };

    return (
        <div className="barchart-container">
            {error && <p className="error">{error}</p>}
            {members.length === 0 && !error && <p>Không có dữ liệu tỷ lệ nhiệm vụ trễ hạn</p>}
            {members.length > 0 && <Bar data={data} options={options} />}
        </div>
    );
};

export default BarChart;