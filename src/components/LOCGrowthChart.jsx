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
import '../css/locgrowthchart.css'; // Tạo file CSS này nếu cần tùy chỉnh

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
);

const LOCGrowthChart = ({ projectId, onRefreshCommits }) => { // onRefreshCommits có thể không cần ở đây nếu refresh chung
    const [weeklyLOCActivity, setWeeklyLOCActivity] = useState([]);
    const [selectedUser, setSelectedUser] = useState('all'); // 'all' hoặc user_id (string)
    const [projectUsers, setProjectUsers] = useState([]); // [{user_id, username}]
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Thêm state refreshing

    const fetchData = async (isRefresh = false) => {
        if (!projectId) {
            setWeeklyLOCActivity([]);
            setProjectUsers([]);
            setLoading(false);
            if (isRefresh) setRefreshing(false);
            return;
        }

        if (isRefresh) setRefreshing(true); else setLoading(true);
        setError(null);
        if (!isRefresh) {
            setWeeklyLOCActivity([]);
            setProjectUsers([]);
        }

        try {
            const response = await axios.get(`http://localhost:3000/api/projects/${projectId}/loc_summary`);
            const { locData, projectStartDate, projectEndDate } = response.data;

            if (!locData || locData.length === 0) {
                setWeeklyLOCActivity([]);
                if (!isRefresh) setProjectUsers([]);
                if (isRefresh) setRefreshing(false); else setLoading(false);
                return;
            }

            if (projectUsers.length === 0 || !isRefresh) {
                const usersInLOC = locData.reduce((acc, entry) => {
                    if (entry.user_id && !acc.find(u => u.user_id === entry.user_id)) {
                        acc.push({ user_id: entry.user_id, username: entry.username });
                    }
                    return acc;
                }, []);
                setProjectUsers(usersInLOC.sort((a, b) => a.username.localeCompare(b.username)));
            }

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
                        users: {}, // { userId (number): { added: 0, removed: 0, username: '' } }
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
                    // Luôn cập nhật chi tiết user cho tooltip breakdown
                    if (!activityByWeek[weekKey].users[entry.user_id]) {
                        activityByWeek[weekKey].users[entry.user_id] = { added: 0, removed: 0, username: entry.username };
                    }
                    activityByWeek[weekKey].users[entry.user_id].added += entry.lines_added;
                    activityByWeek[weekKey].users[entry.user_id].removed += entry.lines_removed;

                    // Cập nhật tổng nếu user được chọn hoặc 'all'
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
            if (!isRefresh) {
                setWeeklyLOCActivity([]);
                setProjectUsers([]);
            }
        } finally {
            if (isRefresh) setRefreshing(false); else setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [projectId, selectedUser]);

    const handleRefresh = async () => {
        if (projectId) { // Giả sử việc refresh data LOC cũng được trigger bởi onRefreshCommits từ parent
            setRefreshing(true);
            try {
                if (onRefreshCommits) { // Nếu có hàm refresh chung từ parent
                    await onRefreshCommits(); // Trigger backend refresh (commit + LOC)
                } else { // Nếu không, tự gọi API refresh (cần endpoint riêng cho LOC hoặc dùng chung)
                    await axios.post(`http://localhost:3000/api/projects/${projectId}/commits/refresh`);
                }
                await fetchData(true); // Fetch data mới cho biểu đồ
            } catch (err) {
                setError("Failed to refresh LOC data from source.");
                console.error("[LOCGrowthChart] Error during manual refresh:", err);
            } finally {
                setRefreshing(false);
            }
        }
    };

    const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);
    const selectedUserName = projectUsers.find(u => u.user_id === currentSelectedUserIdNum)?.username;

    const chartData = {
        labels: weeklyLOCActivity.map(item => item.label),
        datasets: [
            {
                label: selectedUser === 'all' ? 'Total Lines Added' : `Lines Added by ${selectedUserName || 'User'}`,
                data: weeklyLOCActivity.map(item => item.linesAdded),
                borderColor: 'rgb(75, 192, 100)', // Greenish
                backgroundColor: 'rgba(75, 192, 100, 0.5)',
                yAxisID: 'y-added',
                tension: 0.1,
                pointRadius: 3,
            },
            {
                label: selectedUser === 'all' ? 'Total Lines Removed' : `Lines Removed by ${selectedUserName || 'User'}`,
                data: weeklyLOCActivity.map(item => item.linesRemoved),
                borderColor: 'rgb(255, 99, 132)', // Reddish
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
                        // For specific user, their name is in dataset label, values are specific to them
                        return [];
                    },
                    label: (context) => { // context is for one dataset point
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
                            if (userStats.added > 0 || userStats.removed > 0) { // Only show users with changes
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
                grid: { drawOnChartArea: true }, // Main grid lines
                ticks: { precision: 0 },
                min: 0,
            },
            'y-removed': {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Lines Removed', fontColor: 'rgb(255, 99, 132)' },
                grid: { drawOnChartArea: false }, // No grid lines for the second Y axis to avoid clutter
                ticks: { precision: 0 },
                min: 0,
            },
        },
    };

    // Dynamic stepSize for Y axes
    if (weeklyLOCActivity.length > 0) {
        const maxAdded = Math.max(...weeklyLOCActivity.map(item => item.linesAdded), 0);
        const maxRemoved = Math.max(...weeklyLOCActivity.map(item => item.linesRemoved), 0);
        chartOptions.scales['y-added'].ticks.stepSize = Math.max(1, Math.ceil(maxAdded / 5)); // Adjust for better scaling
        chartOptions.scales['y-removed'].ticks.stepSize = Math.max(1, Math.ceil(maxRemoved / 5));
    }


    let content;
    if (loading) content = <p>Loading LOC data...</p>;
    else if (refreshing) content = <p>Refreshing LOC data from source...</p>;
    else if (error) content = <p className="error">{error}</p>;
    else if (weeklyLOCActivity.length === 0 && projectId) content = <p>No LOC data found for this project or selection.</p>;
    else if (!projectId) content = <p>Please select a project to view LOC activity.</p>;
    else content = <Line data={chartData} options={chartOptions} />;

    return (
        <div className="locgrowth-chart-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    disabled={loading || refreshing || projectUsers.length === 0 || !projectId}
                    style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="all">All Members</option>
                    {projectUsers.map(user => (
                        <option key={user.user_id} value={String(user.user_id)}>{user.username}</option>
                    ))}
                </select>
                {projectId && ( // Nút refresh, sử dụng hàm handleRefresh
                    <button
                        onClick={handleRefresh}
                        disabled={loading || refreshing}
                        style={{
                            padding: '8px 15px', borderRadius: '4px', border: 'none',
                            backgroundColor: (loading || refreshing) ? '#ccc' : '#007bff',
                            color: 'white', cursor: (loading || refreshing) ? 'not-allowed' : 'pointer'
                        }}
                        title="Refresh LOC data from source"
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                )}
            </div>
            <div style={{ height: '400px' }}> {/* Đảm bảo biểu đồ có không gian để hiển thị */}
                {content}
            </div>
        </div>
    );
};

export default LOCGrowthChart;