import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { FaInfoCircle } from 'react-icons/fa';
import './locgrowthchart.css'; // Đảm bảo file CSS này tồn tại hoặc import từ global

import useLOCGrowthData from '../../../hooks/useLOCGrowthData'; // Đường dẫn đúng
import { generateLOCGrowthChartConfig } from '../../../utils/generateLOCGrowthChartConfig'; // Đường dẫn đúng

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const LOCGrowthChart = ({ projectId, onRefreshCommits, isParentRefreshing, refreshNonce }) => {
    const {
        weeklyLOCActivity,
        projectUsers,
        selectedUser,
        setSelectedUser,
        loading,
        error,
        isFetchingData
    } = useLOCGrowthData(projectId, 'all', refreshNonce);

    const { chartData, chartOptions } = generateLOCGrowthChartConfig(weeklyLOCActivity, selectedUser, projectUsers);

    const handleRefresh = () => {
        if (onRefreshCommits && projectId && !isParentRefreshing) {
            onRefreshCommits().catch(err => {
                console.error("[LOCGrowthChart] Error invoking onRefreshCommits:", err);
            });
        }
    };

    let content;
    if (loading && !isFetchingData) content = <p style={{ textAlign: 'center', padding: '20px' }}>Loading LOC data...</p>;
    else if (isParentRefreshing) content = <p style={{ textAlign: 'center', padding: '20px' }}>Refreshing LOC data from source...</p>;
    else if (isFetchingData) content = <p style={{ textAlign: 'center', padding: '20px' }}>Updating chart data...</p>;
    else if (error) content = <p className="error" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</p>;
    else if (weeklyLOCActivity.length === 0 && projectId) content = <p style={{ textAlign: 'center', padding: '20px' }}>No LOC data found for this project or selection.</p>;
    else if (!projectId) content = <p style={{ textAlign: 'center', padding: '20px' }}>Please select a project to view LOC activity.</p>;
    else content = <Line data={chartData} options={chartOptions} />;

    return (
        <div className="locgrowth-chart-container">
            <div className="refresh-controls-container">
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    disabled={isParentRefreshing || loading || isFetchingData || projectUsers.length === 0 || !projectId}
                    style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '180px' }}
                >
                    <option value="all">All Members</option>
                    {projectUsers.map(user => (
                        <option key={user.user_id} value={String(user.user_id)}>{user.username}</option>
                    ))}
                </select>
                {projectId && onRefreshCommits && (
                    <div className="refresh-button-group">
                        <button
                            onClick={handleRefresh}
                            disabled={isParentRefreshing || loading || isFetchingData || !projectId}
                            style={{
                                padding: '8px 15px', borderRadius: '4px', border: 'none',
                                backgroundColor: (isParentRefreshing || loading || isFetchingData) ? '#ccc' : '#007bff',
                                color: 'white', cursor: (isParentRefreshing || loading || isFetchingData) ? 'not-allowed' : 'pointer',
                                fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            className={isParentRefreshing ? 'is-parent-refreshing' : ''}
                        >
                            {isParentRefreshing && <span className="spinner" />}
                            {isParentRefreshing ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                        <FaInfoCircle
                            className="info-icon"
                            title="Clicking this will refresh data for both Commit Activity and LOC Growth charts from the source."
                        />
                    </div>
                )}
            </div>
            <div style={{ height: '400px' }}>
                {content}
            </div>
        </div>
    );
};

export default LOCGrowthChart;