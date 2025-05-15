// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
// import '../css/sprintperformancechart.css';

// ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale);

// const SprintPerformanceChart = () => {
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

//     const sprints = [1, 2, 3].map(sprint => ({
//         sprint,
//         completed: Object.values(sprintData).reduce((sum, member) => sum + member[sprint - 1].completed, 0),
//         late: Object.values(sprintData).reduce((sum, member) => sum + member[sprint - 1].late, 0),
//         total: Object.values(sprintData).reduce((sum, member) => sum + member[sprint - 1].total, 0),
//     }));

//     const data = {
//         labels: sprints.map((sprint) => `Sprint ${sprint.sprint}`),
//         datasets: [
//             {
//                 label: 'Hoàn thành',
//                 data: sprints.map((sprint) => sprint.completed),
//                 backgroundColor: '#4CAF50',
//                 borderRadius: 8,
//             },
//             {
//                 label: 'Trễ hạn',
//                 data: sprints.map((sprint) => sprint.late),
//                 backgroundColor: '#FF6384',
//                 borderRadius: 8,
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
//                 text: 'Hiệu suất qua các sprint',
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
//                         const sprint = sprints[context.dataIndex];
//                         const label = context.dataset.label;
//                         const value = context.raw;
//                         return `${label}: ${value}/${sprint.total}`;
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
//         <div className="sprintperformance-chart-container">
//             <Bar data={data} options={options} />
//         </div>
//     );
// };

// export default SprintPerformanceChart;

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import axios from 'axios';
import '../css/sprintperformancechart.css';

ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale);

const SprintPerformanceChart = ({ groupId }) => {
    const [sprintData, setSprintData] = useState({});
    const [sprints, setSprints] = useState([]);
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
                const aggregatedSprints = sprintNumbers.map(sprintNum => {
                    const sprintEntries = Object.values(fetchedSprintData)
                        .flatMap(member => member.filter(s => s.sprint === sprintNum));

                    return {
                        sprint: sprintNum,
                        completed: sprintEntries.reduce((sum, entry) => sum + entry.completed, 0),
                        late: sprintEntries.reduce((sum, entry) => sum + entry.late, 0),
                        total: sprintEntries.reduce((sum, entry) => sum + entry.total, 0),
                    };
                });

                setSprints(aggregatedSprints);
                setError(null);
            } catch (err) {
                console.error('Error fetching data for SprintPerformanceChart:', err);
                setError('Không thể tải dữ liệu hiệu suất qua các sprint');
                setSprintData({});
                setSprints([]);
            }
        };
        fetchData();
    }, [groupId]);

    const data = {
        labels: sprints.map((sprint) => `Sprint ${sprint.sprint}`),
        datasets: [
            {
                label: 'Hoàn thành',
                data: sprints.map((sprint) => sprint.completed),
                backgroundColor: '#4CAF50',
                borderRadius: 8,
            },
            {
                label: 'Trễ hạn',
                data: sprints.map((sprint) => sprint.late),
                backgroundColor: '#FF6384',
                borderRadius: 8,
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
                text: 'Hiệu suất qua các sprint',
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
                        const sprint = sprints[context.dataIndex];
                        const label = context.dataset.label;
                        const value = context.raw;
                        return `${label}: ${value}/${sprint.total}`;
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
        <div className="sprintperformance-chart-container">
            {error && <p className="error">{error}</p>}
            {sprints.length === 0 && !error && <p>Không có dữ liệu hiệu suất sprint</p>}
            {sprints.length > 0 && <Bar data={data} options={options} />}
        </div>
    );
};

export default SprintPerformanceChart;