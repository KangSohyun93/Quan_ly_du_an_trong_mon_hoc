import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, getISOWeek, startOfWeek, endOfWeek, eachWeekOfInterval, parseISO, isAfter } from 'date-fns';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa'; // Import the icon
import '../css/locgrowthchart.css';

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
);

const LOCGrowthChart = ({ projectId, onRefreshCommits, isParentRefreshing, refreshNonce }) => {
    const [weeklyLOCActivity, setWeeklyLOCActivity] = useState([]);
    const [selectedUser, setSelectedUser] = useState('all');
    const [projectUsers, setProjectUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // For initial load and user/project changes
    const [isFetchingData, setIsFetchingData] = useState(false); // For refreshNonce triggered re-fetch

    const fetchData = async (isTriggeredByRefreshNonce = false) => {
        if (!projectId) {
            setWeeklyLOCActivity([]);
            setProjectUsers([]);
            setLoading(false);
            if (isTriggeredByRefreshNonce) setIsFetchingData(false);
            return;
        }

        if (isTriggeredByRefreshNonce) setIsFetchingData(true); else setLoading(true);
        setError(null);

        if (!isTriggeredByRefreshNonce) { // Reset only if not a nonce-triggered refresh
            setWeeklyLOCActivity([]);
            setProjectUsers([]);
        }


        try {
            const response = await axios.get(`http://localhost:3000/api/projects/${projectId}/loc_summary`);
            const { locData, projectStartDate, projectEndDate } = response.data;

            if (!locData || locData.length === 0) {
                setWeeklyLOCActivity([]);
                if (!isTriggeredByRefreshNonce || projectUsers.length === 0) setProjectUsers([]);
                if (isTriggeredByRefreshNonce) setIsFetchingData(false); else setLoading(false);
                return;
            }

            if (projectUsers.length === 0 || !isTriggeredByRefreshNonce) {
                const usersInLOC = locData.reduce((acc, entry) => {
                    if (entry.user_id && !acc.find(u => u.user_id === entry.user_id)) {
                        acc.push({ user_id: entry.user_id, username: entry.username });
                    }
                    return acc;
                }, []);
                setProjectUsers(usersInLOC.sort((a, b) => a.username.localeCompare(b.username)));
            }

            // ... (rest of the data processing logic remains the same)
            const firstEntryDate = parseISO(locData[0].date);
            const lastEntryDate = parseISO(locData[locData.length - 1].date);

            const pStartDate = projectStartDate ? parseISO(projectStartDate) : firstEntryDate;
            let pEndDateEffective = projectEndDate ? parseISO(projectEndDate) : (isAfter(lastEntryDate, new Date()) ? lastEntryDate : new Date());
            if (pEndDateEffective < pStartDate) pEndDateEffective = pStartDate;

            const overallStartDate = startOfWeek(pStartDate, { weekStartsOn: 1 });
            const overallEndDate = endOfWeek(pEndDateEffective, { weekStartsOn: 1 });

            const activityByWeek = {};
            if (overallStartDate <= overallEndDate) {
                const weeksInProject = eachWeekOfInterval({ start: overallStartDate, end: overallEndDate }, { weekStartsOn: 1 });
                weeksInProject.forEach(weekDate => {
                    const weekKey = `${format(weekDate, 'yyyy')}-W${String(getISOWeek(weekDate)).padStart(2, '0')}`;
                    activityByWeek[weekKey] = {
                        total_added: 0,
                        total_removed: 0,
                        users: {},
                        startDate: format(weekDate, 'dd/MM'),
                        endDate: format(endOfWeek(weekDate, { weekStartsOn: 1 }), 'dd/MM/yyyy')
                    };
                });
            }

            const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);

            locData.forEach(entry => {
                const commitDate = parseISO(entry.date);
                const weekKey = `${format(commitDate, 'yyyy')}-W${String(getISOWeek(commitDate)).padStart(2, '0')}`;

                if (activityByWeek[weekKey]) {
                    if (!activityByWeek[weekKey].users[entry.user_id]) {
                        activityByWeek[weekKey].users[entry.user_id] = { added: 0, removed: 0, username: entry.username };
                    }
                    activityByWeek[weekKey].users[entry.user_id].added += entry.lines_added;
                    activityByWeek[weekKey].users[entry.user_id].removed += entry.lines_removed;

                    if (selectedUser === 'all' || entry.user_id === currentSelectedUserIdNum) {
                        activityByWeek[weekKey].total_added += entry.lines_added;
                        activityByWeek[weekKey].total_removed += entry.lines_removed;
                    }
                }
            });

            const formattedWeeklyActivity = Object.keys(activityByWeek)
                .map(weekKey => ({
                    week: weekKey,
                    label: `${activityByWeek[weekKey].startDate} - ${activityByWeek[weekKey].endDate.substring(0, 5)} (${activityByWeek[weekKey].endDate.substring(6)})`,
                    linesAdded: activityByWeek[weekKey].total_added,
                    linesRemoved: activityByWeek[weekKey].total_removed,
                    usersDetail: activityByWeek[weekKey].users,
                }))
                .sort((a, b) => a.week.localeCompare(b.week));

            setWeeklyLOCActivity(formattedWeeklyActivity);

        } catch (err) {
            console.error('[LOCGrowthChart] Error fetching LOC data:', err);
            setError('Could not load LOC data.');
            if (!isTriggeredByRefreshNonce) {
                setWeeklyLOCActivity([]);
                setProjectUsers([]);
            }
        } finally {
            if (isTriggeredByRefreshNonce) setIsFetchingData(false); else setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(false); // Initial fetch or when projectId/selectedUser changes
    }, [projectId, selectedUser]);

    useEffect(() => {
        if (projectId && refreshNonce > 0) { // refreshNonce > 0 ensures it's not the initial 0 value
            fetchData(true); // Re-fetch data when refreshNonce changes
        }
    }, [refreshNonce]); // Removed projectId from here as fetchData checks it


    const handleRefresh = () => {
        if (onRefreshCommits && projectId && !isParentRefreshing) {
            onRefreshCommits().catch(err => {
                console.error("[LOCGrowthChart] Error invoking onRefreshCommits:", err);
                setError("Failed to initiate data refresh. Check console.");
            });
        }
    };

    const chartDataOptionsUnchanged = () => { // Helper to wrap unchanged chartData and chartOptions
        const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);
        const selectedUserName = projectUsers.find(u => u.user_id === currentSelectedUserIdNum)?.username;

        const chartData = {
            labels: weeklyLOCActivity.map(item => item.label),
            datasets: [
                {
                    label: selectedUser === 'all' ? 'Total Lines Added' : `Lines Added by ${selectedUserName || 'User'}`,
                    data: weeklyLOCActivity.map(item => item.linesAdded),
                    borderColor: 'rgb(76, 175, 80)',
                    backgroundColor: 'rgba(76, 175, 80, 0.7)',
                    yAxisID: 'y-added',
                    tension: 0.1,
                    pointRadius: 3,
                },
                {
                    label: selectedUser === 'all' ? 'Total Lines Removed' : `Lines Removed by ${selectedUserName || 'User'}`,
                    data: weeklyLOCActivity.map(item => item.linesRemoved),
                    borderColor: 'rgb(244, 67, 54)',
                    backgroundColor: 'rgba(244, 67, 54, 0.7)',
                    yAxisID: 'y-removed',
                    tension: 0.1,
                    pointRadius: 3,
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            stacked: false,
            plugins: {
                title: { display: true, text: 'Weekly Lines of Code Changed', font: { size: 16 } },
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        title: (tooltipItems) => weeklyLOCActivity[tooltipItems[0].dataIndex]?.label || '',
                        beforeBody: (tooltipItems) => {
                            const dataIndex = tooltipItems[0].dataIndex;
                            const weekData = weeklyLOCActivity[dataIndex];
                            if (!weekData) return [];

                            if (selectedUser === 'all') {
                                return [
                                    `Total Added: ${weekData.linesAdded}`,
                                    `Total Removed: ${weekData.linesRemoved}`
                                ];
                            }
                            return [];
                        },
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) label += context.parsed.y;
                            return label;
                        },
                        afterBody: (tooltipItems) => {
                            const dataIndex = tooltipItems[0].dataIndex;
                            const weekData = weeklyLOCActivity[dataIndex];
                            if (!weekData || selectedUser !== 'all' || Object.keys(weekData.usersDetail).length === 0) {
                                return [];
                            }
                            const lines = ['\nBreakdown:'];
                            const sortedUserIds = Object.keys(weekData.usersDetail).sort((a, b) =>
                                weekData.usersDetail[a].username.localeCompare(weekData.usersDetail[b].username)
                            );
                            sortedUserIds.forEach(userIdStr => {
                                const userStats = weekData.usersDetail[userIdStr];
                                if (userStats.added > 0 || userStats.removed > 0) {
                                    lines.push(`  ${userStats.username}: +${userStats.added} / -${userStats.removed}`);
                                }
                            });
                            return lines.length > 1 ? lines : [];
                        },
                    },
                },
            },
            scales: {
                x: { title: { display: true, text: 'Week' } },
                'y-added': {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Lines Added', fontColor: 'rgb(75, 192, 100)' },
                    grid: { drawOnChartArea: true },
                    ticks: { precision: 0 },
                    min: 0,
                },
                'y-removed': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Lines Removed', fontColor: 'rgb(255, 99, 132)' },
                    grid: { drawOnChartArea: false },
                    ticks: { precision: 0 },
                    min: 0,
                },
            },
        };

        if (weeklyLOCActivity.length > 0) {
            const maxAdded = Math.max(...weeklyLOCActivity.map(item => item.linesAdded), 0);
            const maxRemoved = Math.max(...weeklyLOCActivity.map(item => item.linesRemoved), 0);
            chartOptions.scales['y-added'].ticks.stepSize = Math.max(1, Math.ceil(maxAdded / 5));
            chartOptions.scales['y-removed'].ticks.stepSize = Math.max(1, Math.ceil(maxRemoved / 5));
        }
        return { chartData, chartOptions };
    }
    const { chartData, chartOptions } = chartDataOptionsUnchanged();


    let content;
    if (loading && !isFetchingData) content = <p style={{ textAlign: 'center', padding: '20px' }}>Loading LOC data...</p>;
    else if (isParentRefreshing) content = <p style={{ textAlign: 'center', padding: '20px' }}>Refreshing LOC data from source...</p>;
    else if (isFetchingData) content = <p style={{ textAlign: 'center', padding: '20px' }}>Updating chart data...</p>;
    else if (error) content = <p className="error">{error}</p>;
    else if (weeklyLOCActivity.length === 0 && projectId) content = <p style={{ textAlign: 'center', padding: '20px' }}>No LOC data found for this project or selection.</p>;
    else if (!projectId) content = <p style={{ textAlign: 'center', padding: '20px' }}>Please select a project to view LOC activity.</p>;
    else content = <Line data={chartData} options={chartOptions} />;

    return (
        <div className="locgrowth-chart-container">
            <div className="refresh-controls-container"> {/* Using the new class from CommitActivityChart for consistency */}
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
                                padding: '8px 15px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: (isParentRefreshing || loading || isFetchingData) ? '#ccc' : '#007bff',
                                color: 'white',
                                cursor: (isParentRefreshing || loading || isFetchingData) ? 'not-allowed' : 'pointer',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
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