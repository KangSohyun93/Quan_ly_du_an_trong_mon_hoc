import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import MemberInfo from './MemberInfo';
import '../css/membercompletionchart.css';

ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale);

const MemberCompletionChart = () => {
    const members = [
        { name: 'Alice', completed: 45, total: 50, role: 'PM', avatar: 'https://i.pravatar.cc/150?img=1', joinDate: '2025-01-01', workDays: 90 },
        { name: 'Blice', completed: 38, total: 50, role: 'Member', avatar: 'https://i.pravatar.cc/150?img=2', joinDate: '2025-01-15', workDays: 75 },
        { name: 'Clice', completed: 30, total: 40, role: 'Member', avatar: 'https://i.pravatar.cc/150?img=3', joinDate: '2025-02-01', workDays: 60 },
        { name: 'Dlice', completed: 25, total: 30, role: 'Member', avatar: 'https://i.pravatar.cc/150?img=4', joinDate: '2025-02-15', workDays: 45 },
        { name: 'Elice', completed: 15, total: 20, role: 'Member', avatar: 'https://i.pravatar.cc/150?img=5', joinDate: '2025-03-01', workDays: 30 },
    ];

    const sprintData = {
        Alice: [
            { sprint: 1, completed: 10, total: 12, late: 2 },
            { sprint: 2, completed: 15, total: 18, late: 1 },
            { sprint: 3, completed: 20, total: 20, late: 0 },
        ],
        Blice: [
            { sprint: 1, completed: 8, total: 10, late: 1 },
            { sprint: 2, completed: 12, total: 15, late: 2 },
            { sprint: 3, completed: 18, total: 25, late: 3 },
        ],
        Clice: [
            { sprint: 1, completed: 5, total: 8, late: 1 },
            { sprint: 2, completed: 10, total: 12, late: 0 },
            { sprint: 3, completed: 15, total: 20, late: 2 },
        ],
        Dlice: [
            { sprint: 1, completed: 5, total: 6, late: 0 },
            { sprint: 2, completed: 8, total: 10, late: 1 },
            { sprint: 3, completed: 12, total: 14, late: 1 },
        ],
        Elice: [
            { sprint: 1, completed: 3, total: 5, late: 1 },
            { sprint: 2, completed: 5, total: 7, late: 0 },
            { sprint: 3, completed: 7, total: 8, late: 0 },
        ],
    };

    const data = {
        labels: members.map((member) => member.name),
        datasets: [
            {
                label: 'Completion Rate (%)',
                data: members.map((member) => (member.completed / member.total) * 100),
                backgroundColor: ['#FF6384', '#FFD700', '#4CAF50', '#36A2EB', '#9966FF'], // Màu sắc từ hình
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 30, // Tăng độ rộng của thanh
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Task Completion Rate per Member (Entire Project)',
                align: 'start',
                font: {
                    size: 18,
                    weight: 'bold',
                    family: 'Inter, sans-serif',
                },
                color: '#1F2937',
                padding: {
                    bottom: 20,
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#1F2937',
                borderColor: '#4B5563',
                borderWidth: 1,
                titleFont: { size: 14, family: 'Inter, sans-serif' },
                bodyFont: { size: 14, family: 'Inter, sans-serif' },
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                callbacks: {
                    label: (context) => {
                        const member = members[context.dataIndex];
                        const percentage = context.raw.toFixed(1);
                        return `${member.name}: ${percentage}% (${member.completed}/${member.total} tasks)`;
                    },
                },
            },
        },
        scales: {
            x: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                    callback: (value) => `${value}%`,
                    font: {
                        family: 'Inter, sans-serif',
                    },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: 'Inter, sans-serif',
                        size: 14,
                    },
                },
            },
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart',
        },
    };

    return (
        <div className="completion-chart-container">
            <div className="chart-and-info">
                <div className="chart-content">
                    <Bar data={data} options={options} />
                </div>
                <MemberInfo members={members} sprintData={sprintData} />
            </div>
        </div>
    );
};

export default MemberCompletionChart;