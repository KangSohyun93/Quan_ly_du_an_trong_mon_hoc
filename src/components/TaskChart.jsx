import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
import '../css/taskchart.css';
import { color } from 'chart.js/helpers';

ChartJS.register(BarElement, LinearScale, Title, Tooltip, CategoryScale);

const TaskChart = () => {
  const data = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        data: [50, 20, 50, 40, 5],
        backgroundColor: ['#C7AFFF', '#A3E4D7', '#000000', '#A3CFFA', '#D6EAF8'],
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
        max: 50,
        ticks: {
          stepSize: 10,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="taskchart-container">
      <div className="taskchart-title">
        <p>Task done/Sprint</p>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TaskChart;