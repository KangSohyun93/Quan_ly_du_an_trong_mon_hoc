import React from 'react'; // Bỏ useState, useEffect nếu hook quản lý
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, TimeScale, TimeSeriesScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { FaInfoCircle } from 'react-icons/fa';
import './commitactivitychart.css';

// Import hook và utility
import useCommitActivity from '../../../hooks/useCommitActivity'; // Điều chỉnh đường dẫn
import { generateCommitChartConfig } from '../../../utils/generateCommitChartConfig'; // Điều chỉnh đường dẫn

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, TimeScale, TimeSeriesScale);

const CommitActivityChart = ({ projectId, onRefreshCommits, isParentRefreshing, refreshNonce }) => {
    // Sử dụng custom hook
    const {
        weeklyActivity,
        projectUsers,
        selectedUser,
        setSelectedUser, // Lấy hàm setSelectedUser từ hook
        loading,
        error,
        isFetchingData
    } = useCommitActivity(projectId, 'all', refreshNonce);

    // Gọi utility để lấy config biểu đồ
    const { chartData, chartOptions } = generateCommitChartConfig(weeklyActivity, selectedUser, projectUsers);

    const handleRefresh = () => {
        if (onRefreshCommits && projectId && !isParentRefreshing) {
            onRefreshCommits().catch(err => {
                console.error("[CommitActivityChart] Error invoking onRefreshCommits:", err);
                // setError("Failed to initiate data refresh. Check console."); // setError giờ thuộc về hook
            });
        }
    };

    let content;
    if (loading && !isFetchingData) {
        content = <p style={{ textAlign: 'center', padding: '20px' }}>Loading commit activity...</p>;
    } else if (isParentRefreshing) {
        content = <p style={{ textAlign: 'center', padding: '20px' }}>Refreshing commit data from source...</p>;
    } else if (isFetchingData) {
        content = <p style={{ textAlign: 'center', padding: '20px' }}>Updating chart data...</p>;
    } else if (error) {
        content = <p className="error" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</p>;
    } else if (weeklyActivity.length === 0 && projectId) {
        content = <p style={{ textAlign: 'center', padding: '20px' }}>No commit activity found for this project or selection.</p>;
    } else if (!projectId) {
        content = <p style={{ textAlign: 'center', padding: '20px' }}>Please select a project to view commit activity.</p>;
    } else {
        content = <Line data={chartData} options={chartOptions} />;
    }

    return (
        <div className="commitactivity-chart-container">
            <div className="refresh-controls-container">
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)} // Gọi setSelectedUser từ hook
                    style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '180px' }}
                    disabled={isParentRefreshing || loading || isFetchingData || projectUsers.length === 0 || !projectId}
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

export default CommitActivityChart;