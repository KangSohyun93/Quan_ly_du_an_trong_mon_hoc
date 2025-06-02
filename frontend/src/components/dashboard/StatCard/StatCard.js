import React from 'react';
import './statcard.css'

const StatCard = ({ title, value, background }) => (
    <div className={`statcard ${background} p-4 rounded-lg shadow-md flex-1 text-center`}>
        <h3 className="statcard-title">{title}</h3>
        <p className="statcard-value">{value}</p>
    </div>
);

export default StatCard;