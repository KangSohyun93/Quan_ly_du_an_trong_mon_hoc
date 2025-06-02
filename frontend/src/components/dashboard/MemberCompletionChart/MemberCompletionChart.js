import React, { useState, useLayoutEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import MemberInfo from '../MemberInfo/MemberInfo'; // Đường dẫn tới MemberInfo
import './membercompletionchart.css';

import useMemberCompletionData from '../../../hooks/useMemberCompletionData'; // Đường dẫn đúng
import { generateMemberCompletionChartConfig } from '../../../utils/generateMemberCompletionChartConfig'; // Đường dẫn đúng

ChartJS.register(BarElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const MemberCompletionChart = ({ groupId }) => {
    const { members, sprintDataForInfo, loading, error } = useMemberCompletionData(groupId);
    const [chartKey, setChartKey] = useState(0);

    useLayoutEffect(() => {
        let timeoutId = null;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setChartKey(prevKey => prevKey + 1), 150);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    const { data, options } = generateMemberCompletionChartConfig(members);

    if (loading) return <div className="completion-chart-container loading-state">Loading member data...</div>;
    if (error) return <div className="completion-chart-container error-message">Error: {error}</div>;
    if (!members || members.length === 0) return <div className="completion-chart-container no-data-state">No member data available for this group.</div>;

    return (
        <div className="completion-chart-container">
            <div className="chart-and-info">
                <div className="chart-content">
                    <Bar key={chartKey} data={data} options={options} />
                </div>
                {(members.length > 0 && Object.keys(sprintDataForInfo).length > 0) && (
                    <MemberInfo members={members} sprintData={sprintDataForInfo} />
                )}
            </div>
        </div>
    );
};

export default MemberCompletionChart;