import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const TrafficChart = () => {
    const data = {
        labels: ['Google', 'Youtube', 'Instagram', 'Pinterest', 'Facebook', 'Twitter'],
        datasets: [{ label: 'Traffic', data: [0, 0, 0, 0, 0, 0], backgroundColor: 'rgba(0, 0, 0, 0.1)' }],
    };
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <Line data={data} />
        </div>
    );
};

export default TrafficChart;