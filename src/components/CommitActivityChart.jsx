// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     LineElement,
//     PointElement,
//     LinearScale,
//     CategoryScale,
//     Title,
//     Tooltip,
//     Legend,
//     TimeScale,
//     TimeSeriesScale
// } from 'chart.js';
// import 'chartjs-adapter-date-fns';
// import { format, getISOWeek, startOfWeek, endOfWeek, eachWeekOfInterval, parseISO, isAfter } from 'date-fns';
// import axios from 'axios';
// import '../css/commitactivitychart.css';

// ChartJS.register(
//     LineElement,
//     PointElement,
//     LinearScale,
//     CategoryScale,
//     Title,
//     Tooltip,
//     Legend,
//     TimeScale,
//     TimeSeriesScale
// );

// // THÊM onRefreshCommits VÀO PROPS
// const CommitActivityChart = ({ projectId, onRefreshCommits }) => {
//     const [weeklyActivity, setWeeklyActivity] = useState([]);
//     const [selectedUser, setSelectedUser] = useState('all');
//     const [projectUsers, setProjectUsers] = useState([]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false); // THÊM STATE REFRESHING

//     // HÀM fetchData GIỮ NGUYÊN, CHỈ CẦN ĐẢM BẢO isRefresh ĐƯỢC XỬ LÝ
//     const fetchData = async (isRefresh = false) => {
//         if (!projectId) {
//             setWeeklyActivity([]);
//             setProjectUsers([]);
//             setLoading(false);
//             if (isRefresh) setRefreshing(false);
//             return;
//         }

//         if (isRefresh) {
//             setRefreshing(true);
//         } else {
//             setLoading(true);
//         }
//         setError(null);

//         if (!isRefresh) {
//             setWeeklyActivity([]);
//             setProjectUsers([]);
//         }

//         try {
//             // API /commits đã lấy từ DB trước tiên
//             const response = await axios.get(`http://localhost:3000/api/projects/${projectId}/commits`);
//             const { commits, projectStartDate, projectEndDate } = response.data;

//             if (!commits || commits.length === 0) {
//                 console.log('[CommitActivityChart] No commits found for project.');
//                 setWeeklyActivity([]);
//                 if (!isRefresh) setProjectUsers([]);
//                 if (isRefresh) setRefreshing(false); else setLoading(false);
//                 return;
//             }

//             if (projectUsers.length === 0 || !isRefresh) {
//                 const usersInCommits = commits.reduce((acc, commit) => {
//                     if (commit.user_id && !acc.find(u => u.user_id === commit.user_id)) {
//                         acc.push({ user_id: commit.user_id, username: commit.username });
//                     }
//                     return acc;
//                 }, []);
//                 setProjectUsers(usersInCommits.sort((a, b) => a.username.localeCompare(b.username)));
//             }

//             const firstCommitDate = parseISO(commits[0].date);
//             const lastCommitDate = parseISO(commits[commits.length - 1].date);

//             const pStartDate = projectStartDate ? parseISO(projectStartDate) : firstCommitDate;
//             let pEndDateEffective;
//             if (projectEndDate) {
//                 pEndDateEffective = parseISO(projectEndDate);
//             } else {
//                 pEndDateEffective = isAfter(lastCommitDate, new Date()) ? lastCommitDate : new Date();
//             }

//             if (pEndDateEffective < pStartDate) {
//                 pEndDateEffective = pStartDate;
//             }

//             const overallStartDate = startOfWeek(pStartDate, { weekStartsOn: 1 });
//             const overallEndDate = endOfWeek(pEndDateEffective, { weekStartsOn: 1 });

//             const activityByWeek = {};
//             if (overallStartDate <= overallEndDate) {
//                 const weeksInProject = eachWeekOfInterval(
//                     { start: overallStartDate, end: overallEndDate },
//                     { weekStartsOn: 1 }
//                 );
//                 weeksInProject.forEach(weekDate => {
//                     const weekKey = `${format(weekDate, 'yyyy')}-W${String(getISOWeek(weekDate)).padStart(2, '0')}`;
//                     activityByWeek[weekKey] = {
//                         total: 0,
//                         users: {},
//                         startDate: format(weekDate, 'dd/MM'),
//                         endDate: format(endOfWeek(weekDate, { weekStartsOn: 1 }), 'dd/MM/yyyy')
//                     };
//                 });
//             }

//             const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);

//             commits.forEach(commit => {
//                 if (selectedUser === 'all' || commit.user_id === currentSelectedUserIdNum) {
//                     const commitDate = parseISO(commit.date);
//                     const weekKey = `${format(commitDate, 'yyyy')}-W${String(getISOWeek(commitDate)).padStart(2, '0')}`;
//                     if (activityByWeek[weekKey]) {
//                         activityByWeek[weekKey].total += 1;
//                         if (!activityByWeek[weekKey].users[commit.user_id]) {
//                             activityByWeek[weekKey].users[commit.user_id] = {
//                                 count: 0,
//                                 username: commit.username
//                             };
//                         }
//                         activityByWeek[weekKey].users[commit.user_id].count += 1;
//                     }
//                 }
//             });

//             const formattedWeeklyActivity = Object.keys(activityByWeek)
//                 .map(weekKey => ({
//                     week: weekKey,
//                     label: `${activityByWeek[weekKey].startDate} - ${activityByWeek[weekKey].endDate.substring(0, 5)} (${activityByWeek[weekKey].endDate.substring(6)})`,
//                     total: activityByWeek[weekKey].total,
//                     usersDetail: activityByWeek[weekKey].users,
//                 }))
//                 .sort((a, b) => a.week.localeCompare(b.week));

//             setWeeklyActivity(formattedWeeklyActivity);

//         } catch (err) {
//             console.error('[CommitActivityChart] Error fetching commit activity:', err);
//             setError('Could not load commit activity data.');
//             if (!isRefresh) {
//                 setWeeklyActivity([]);
//                 setProjectUsers([]);
//             }
//         } finally {
//             if (isRefresh) setRefreshing(false); else setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, [projectId, selectedUser]);

//     // THÊM HÀM handleRefresh
//     const handleRefresh = async () => {
//         if (onRefreshCommits && projectId) {
//             // setRefreshing(true); // fetchData sẽ set state này
//             try {
//                 await onRefreshCommits(); // Trigger backend refresh (gọi API POST .../commits/refresh)
//                 await fetchData(true);    // Fetch lại dữ liệu mới cho biểu đồ từ DB
//             } catch (err) {
//                 setError("Failed to refresh commits from source.");
//                 console.error("[CommitActivityChart] Error during manual refresh:", err);
//                 setRefreshing(false); // Đảm bảo reset nếu onRefreshCommits bị lỗi
//             }
//             // finally { // fetchData sẽ tự reset refreshing
//             //    //  setRefreshing(false);
//             // }
//         }
//     };

//     const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);
//     const datasetLabel = selectedUser === 'all'
//         ? 'Total Commits per Week'
//         : `Commits by ${projectUsers.find(u => u.user_id === currentSelectedUserIdNum)?.username || 'Selected User'} per Week`;

//     const chartData = {
//         labels: weeklyActivity.map(item => item.label),
//         datasets: [
//             {
//                 label: datasetLabel,
//                 data: weeklyActivity.map(item => item.total), // total đã được lọc theo user
//                 borderColor: '#3b82f6',
//                 backgroundColor: 'rgba(59, 130, 246, 0.1)',
//                 fill: false,
//                 tension: 0.1,
//                 pointRadius: 3,
//                 pointHoverRadius: 5,
//             },
//         ],
//     };

//     const chartOptions = { /* ... giữ nguyên chartOptions ... */
//         responsive: true,
//         maintainAspectRatio: false,
//         interaction: {
//             mode: 'index',
//             intersect: false,
//         },
//         plugins: {
//             legend: {
//                 display: true,
//                 position: 'top',
//                 labels: { font: { family: 'Inter, sans-serif' } }
//             },
//             title: {
//                 display: true,
//                 text: 'Weekly Commit Activity',
//                 font: { size: 16, family: 'Inter, sans-serif', weight: 'bold' },
//                 color: '#1F2937',
//                 padding: { bottom: 15 }
//             },
//             tooltip: {
//                 enabled: true,
//                 backgroundColor: 'rgba(0,0,0,0.8)',
//                 titleFont: { family: 'Inter, sans-serif', weight: 'bold' },
//                 bodyFont: { family: 'Inter, sans-serif' },
//                 callbacks: {
//                     title: function (tooltipItems) {
//                         if (tooltipItems.length > 0) {
//                             return `Week: ${tooltipItems[0].label}`;
//                         }
//                         return '';
//                     },
//                     label: function (context) {
//                         let labelText = context.dataset.label || '';
//                         if (labelText) {
//                             labelText = labelText.replace(' per Week', '');
//                             labelText += ': ';
//                         }
//                         if (context.parsed.y !== null) {
//                             labelText += context.parsed.y;
//                         }
//                         return labelText;
//                     },
//                     afterBody: function (tooltipItems) {
//                         if (selectedUser === 'all' && weeklyActivity.length > 0 && tooltipItems.length > 0) {
//                             const dataIndex = tooltipItems[0].dataIndex;
//                             if (weeklyActivity[dataIndex]) {
//                                 const weekData = weeklyActivity[dataIndex];
//                                 const userDetailsInWeek = weekData.usersDetail;
//                                 let lines = [];
//                                 if (Object.keys(userDetailsInWeek).length > 0 && weekData.total > 0) {
//                                     lines.push("\nBreakdown:");
//                                     const sortedUserIds = Object.keys(userDetailsInWeek).sort((a, b) =>
//                                         userDetailsInWeek[a].username.localeCompare(userDetailsInWeek[b].username)
//                                     );
//                                     sortedUserIds.forEach(userIdKey => {
//                                         const userData = userDetailsInWeek[userIdKey];
//                                         if (userData.count > 0) {
//                                             lines.push(`  ${userData.username}: ${userData.count}`);
//                                         }
//                                     });
//                                 }
//                                 return lines.length > 1 ? lines : [];
//                             }
//                         }
//                         return [];
//                     }
//                 },
//             },
//         },
//         scales: {
//             x: {
//                 type: 'category',
//                 title: {
//                     display: true,
//                     text: 'Week (Start Date - End Date)',
//                     font: { family: 'Inter, sans-serif', weight: '600' },
//                 },
//                 ticks: {
//                     font: { family: 'Inter, sans-serif', size: 10 },
//                     autoSkip: true,
//                     maxRotation: 30,
//                     minRotation: 0,
//                     padding: 5,
//                 }
//             },
//             y: {
//                 min: 0,
//                 title: {
//                     display: true,
//                     text: 'Number of Commits',
//                     font: { family: 'Inter, sans-serif', weight: '600' },
//                 },
//                 ticks: {
//                     precision: 0,
//                     font: { family: 'Inter, sans-serif' },
//                 },
//                 grid: {
//                     borderDash: [3, 3],
//                     color: 'rgba(200, 200, 200, 0.3)'
//                 },
//             },
//         },
//     };

//     if (weeklyActivity.length > 0) {
//         const dataForStepSize = weeklyActivity.map(item => item.total);
//         const maxTotalCommits = Math.max(...dataForStepSize, 0);
//         let step = 1;
//         if (maxTotalCommits > 10) {
//             step = Math.ceil(maxTotalCommits / 10);
//         } else if (maxTotalCommits > 5) {
//             step = 2;
//         }
//         chartOptions.scales.y.ticks.stepSize = step || 1;
//     }

//     let content;
//     if (loading) {
//         content = <p style={{ textAlign: 'center', padding: '20px' }}>Loading commit activity...</p>;
//     } else if (refreshing) { // THÊM TRẠNG THÁI REFRESHING
//         content = <p style={{ textAlign: 'center', padding: '20px' }}>Refreshing commit data from source...</p>;
//     } else if (error) {
//         content = <p className="error" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</p>;
//     } else if (weeklyActivity.length === 0 && projectId) {
//         content = <p style={{ textAlign: 'center', padding: '20px' }}>No commit activity found for this project or selection.</p>;
//     } else if (!projectId) {
//         content = <p style={{ textAlign: 'center', padding: '20px' }}>Please select a project to view commit activity.</p>;
//     } else {
//         content = <Line data={chartData} options={chartOptions} />;
//     }

//     return (
//         <div className="commitactivity-chart-container">
//             {/* THÊM NÚT REFRESH DATA */}
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
//                 <select
//                     value={selectedUser}
//                     onChange={(e) => setSelectedUser(e.target.value)}
//                     style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '180px' }}
//                     disabled={loading || refreshing || projectUsers.length === 0 || !projectId}
//                 >
//                     <option value="all">All Members</option>
//                     {projectUsers.map(user => (
//                         <option key={user.user_id} value={String(user.user_id)}>{user.username}</option>
//                     ))}
//                 </select>
//                 {/* Nút Refresh Data */}
//                 {projectId && onRefreshCommits && ( // Chỉ hiển thị nếu có projectId và onRefreshCommits
//                     <button
//                         onClick={handleRefresh}
//                         disabled={loading || refreshing}
//                         style={{
//                             padding: '8px 15px',
//                             borderRadius: '4px',
//                             border: 'none',
//                             backgroundColor: (loading || refreshing) ? '#ccc' : '#007bff', // Màu khác khi disable
//                             color: 'white',
//                             cursor: (loading || refreshing) ? 'not-allowed' : 'pointer',
//                             fontWeight: '500'
//                         }}
//                         title="Refresh commit data from GitHub"
//                     >
//                         {refreshing ? 'Refreshing...' : 'Refresh Data'}
//                     </button>
//                 )}
//             </div>
//             <div style={{ height: '400px' }}>
//                 {content}
//             </div>
//         </div>
//     );
// };

// export default CommitActivityChart;
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
    TimeScale,
    TimeSeriesScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, getISOWeek, startOfWeek, endOfWeek, eachWeekOfInterval, parseISO, isAfter } from 'date-fns';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa'; // Import the icon
import '../css/commitactivitychart.css';

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    TimeSeriesScale
);

const CommitActivityChart = ({ projectId, onRefreshCommits, isParentRefreshing, refreshNonce }) => {
    const [weeklyActivity, setWeeklyActivity] = useState([]);
    const [selectedUser, setSelectedUser] = useState('all');
    const [projectUsers, setProjectUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // For initial load and user/project changes
    const [isFetchingData, setIsFetchingData] = useState(false); // For refreshNonce triggered re-fetch

    const fetchData = async (isTriggeredByRefreshNonce = false) => {
        if (!projectId) {
            setWeeklyActivity([]);
            setProjectUsers([]);
            setLoading(false);
            if (isTriggeredByRefreshNonce) setIsFetchingData(false);
            return;
        }

        if (isTriggeredByRefreshNonce) {
            setIsFetchingData(true);
        } else {
            setLoading(true);
        }
        setError(null);

        if (!isTriggeredByRefreshNonce) { // Reset only if not a nonce-triggered refresh (to keep UI smoother)
            setWeeklyActivity([]);
            setProjectUsers([]);
        }

        try {
            const response = await axios.get(`http://localhost:3000/api/projects/${projectId}/commits`);
            const { commits, projectStartDate, projectEndDate } = response.data;

            if (!commits || commits.length === 0) {
                setWeeklyActivity([]);
                // Don't clear projectUsers on refresh if they already exist, to keep filter populated
                if (!isTriggeredByRefreshNonce || projectUsers.length === 0) setProjectUsers([]);
                if (isTriggeredByRefreshNonce) setIsFetchingData(false); else setLoading(false);
                return;
            }

            // Populate project users only if not already populated or not a nonce-triggered refresh
            if (projectUsers.length === 0 || !isTriggeredByRefreshNonce) {
                const usersInCommits = commits.reduce((acc, commit) => {
                    if (commit.user_id && !acc.find(u => u.user_id === commit.user_id)) {
                        acc.push({ user_id: commit.user_id, username: commit.username });
                    }
                    return acc;
                }, []);
                setProjectUsers(usersInCommits.sort((a, b) => a.username.localeCompare(b.username)));
            }

            // ... (rest of the data processing logic remains the same)
            const firstCommitDate = parseISO(commits[0].date);
            const lastCommitDate = parseISO(commits[commits.length - 1].date);

            const pStartDate = projectStartDate ? parseISO(projectStartDate) : firstCommitDate;
            let pEndDateEffective;
            if (projectEndDate) {
                pEndDateEffective = parseISO(projectEndDate);
            } else {
                pEndDateEffective = isAfter(lastCommitDate, new Date()) ? lastCommitDate : new Date();
            }

            if (pEndDateEffective < pStartDate) {
                pEndDateEffective = pStartDate;
            }

            const overallStartDate = startOfWeek(pStartDate, { weekStartsOn: 1 });
            const overallEndDate = endOfWeek(pEndDateEffective, { weekStartsOn: 1 });

            const activityByWeek = {};
            if (overallStartDate <= overallEndDate) {
                const weeksInProject = eachWeekOfInterval(
                    { start: overallStartDate, end: overallEndDate },
                    { weekStartsOn: 1 }
                );
                weeksInProject.forEach(weekDate => {
                    const weekKey = `${format(weekDate, 'yyyy')}-W${String(getISOWeek(weekDate)).padStart(2, '0')}`;
                    activityByWeek[weekKey] = {
                        total: 0,
                        users: {},
                        startDate: format(weekDate, 'dd/MM'),
                        endDate: format(endOfWeek(weekDate, { weekStartsOn: 1 }), 'dd/MM/yyyy')
                    };
                });
            }

            const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);

            commits.forEach(commit => {
                if (selectedUser === 'all' || commit.user_id === currentSelectedUserIdNum) {
                    const commitDate = parseISO(commit.date);
                    const weekKey = `${format(commitDate, 'yyyy')}-W${String(getISOWeek(commitDate)).padStart(2, '0')}`;
                    if (activityByWeek[weekKey]) {
                        activityByWeek[weekKey].total += 1;
                        if (!activityByWeek[weekKey].users[commit.user_id]) {
                            activityByWeek[weekKey].users[commit.user_id] = {
                                count: 0,
                                username: commit.username
                            };
                        }
                        activityByWeek[weekKey].users[commit.user_id].count += 1;
                    }
                }
            });

            const formattedWeeklyActivity = Object.keys(activityByWeek)
                .map(weekKey => ({
                    week: weekKey,
                    label: `${activityByWeek[weekKey].startDate} - ${activityByWeek[weekKey].endDate.substring(0, 5)} (${activityByWeek[weekKey].endDate.substring(6)})`,
                    total: activityByWeek[weekKey].total,
                    usersDetail: activityByWeek[weekKey].users,
                }))
                .sort((a, b) => a.week.localeCompare(b.week));

            setWeeklyActivity(formattedWeeklyActivity);

        } catch (err) {
            console.error('[CommitActivityChart] Error fetching commit activity:', err);
            setError('Could not load commit activity data.');
            // Don't clear data on error if it's a refresh, keep stale data
            if (!isTriggeredByRefreshNonce) {
                setWeeklyActivity([]);
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
                console.error("[CommitActivityChart] Error invoking onRefreshCommits:", err);
                setError("Failed to initiate data refresh. Check console.");
            });
        }
    };

    const chartDataOptionsUnchanged = () => { // Helper to wrap unchanged chartData and chartOptions
        const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);
        const datasetLabel = selectedUser === 'all'
            ? 'Total Commits per Week'
            : `Commits by ${projectUsers.find(u => u.user_id === currentSelectedUserIdNum)?.username || 'Selected User'} per Week`;

        const chartData = {
            labels: weeklyActivity.map(item => item.label),
            datasets: [
                {
                    label: datasetLabel,
                    data: weeklyActivity.map(item => item.total),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: false,
                    tension: 0.1,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: { font: { family: 'Inter, sans-serif' } }
                },
                title: {
                    display: true,
                    text: 'Weekly Commit Activity',
                    font: { size: 16, family: 'Inter, sans-serif', weight: 'bold' },
                    color: '#1F2937',
                    padding: { bottom: 15 }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { family: 'Inter, sans-serif', weight: 'bold' },
                    bodyFont: { family: 'Inter, sans-serif' },
                    callbacks: {
                        title: function (tooltipItems) {
                            if (tooltipItems.length > 0) {
                                return `Week: ${tooltipItems[0].label}`;
                            }
                            return '';
                        },
                        label: function (context) {
                            let labelText = context.dataset.label || '';
                            if (labelText) {
                                labelText = labelText.replace(' per Week', '');
                                labelText += ': ';
                            }
                            if (context.parsed.y !== null) {
                                labelText += context.parsed.y;
                            }
                            return labelText;
                        },
                        afterBody: function (tooltipItems) {
                            if (selectedUser === 'all' && weeklyActivity.length > 0 && tooltipItems.length > 0) {
                                const dataIndex = tooltipItems[0].dataIndex;
                                if (weeklyActivity[dataIndex]) {
                                    const weekData = weeklyActivity[dataIndex];
                                    const userDetailsInWeek = weekData.usersDetail;
                                    let lines = [];
                                    if (Object.keys(userDetailsInWeek).length > 0 && weekData.total > 0) {
                                        lines.push("\nBreakdown:");
                                        const sortedUserIds = Object.keys(userDetailsInWeek).sort((a, b) =>
                                            userDetailsInWeek[a].username.localeCompare(userDetailsInWeek[b].username)
                                        );
                                        sortedUserIds.forEach(userIdKey => {
                                            const userData = userDetailsInWeek[userIdKey];
                                            if (userData.count > 0) {
                                                lines.push(`  ${userData.username}: ${userData.count}`);
                                            }
                                        });
                                    }
                                    return lines.length > 1 ? lines : [];
                                }
                            }
                            return [];
                        }
                    },
                },
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Week (Start Date - End Date)',
                        font: { family: 'Inter, sans-serif', weight: '600' },
                    },
                    ticks: {
                        font: { family: 'Inter, sans-serif', size: 10 },
                        autoSkip: true,
                        maxRotation: 30,
                        minRotation: 0,
                        padding: 5,
                    }
                },
                y: {
                    min: 0,
                    title: {
                        display: true,
                        text: 'Number of Commits',
                        font: { family: 'Inter, sans-serif', weight: '600' },
                    },
                    ticks: {
                        precision: 0,
                        font: { family: 'Inter, sans-serif' },
                    },
                    grid: {
                        borderDash: [3, 3],
                        color: 'rgba(200, 200, 200, 0.3)'
                    },
                },
            },
        };

        if (weeklyActivity.length > 0) {
            const dataForStepSize = weeklyActivity.map(item => item.total);
            const maxTotalCommits = Math.max(...dataForStepSize, 0);
            let step = 1;
            if (maxTotalCommits > 10) {
                step = Math.ceil(maxTotalCommits / 10);
            } else if (maxTotalCommits > 5) {
                step = 2;
            }
            chartOptions.scales.y.ticks.stepSize = step || 1;
        }
        return { chartData, chartOptions };
    }
    const { chartData, chartOptions } = chartDataOptionsUnchanged();


    let content;
    if (loading && !isFetchingData) { // Initial loading
        content = <p style={{ textAlign: 'center', padding: '20px' }}>Loading commit activity...</p>;
    } else if (isParentRefreshing) { // Parent is refreshing from source
        content = <p style={{ textAlign: 'center', padding: '20px' }}>Refreshing commit data from source...</p>;
    } else if (isFetchingData) { // Chart is re-fetching data after nonce update
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
                    onChange={(e) => setSelectedUser(e.target.value)}
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

export default CommitActivityChart;