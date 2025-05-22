// // import React, { useState, useEffect } from 'react';
// // import { Line } from 'react-chartjs-2';
// // import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale } from 'chart.js';
// // import axios from 'axios';
// // import '../css/commitactivitychart.css';

// // ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

// // const CommitActivityChart = ({ projectId }) => {
// //     const [commitData, setCommitData] = useState([]);
// //     const [selectedMember, setSelectedMember] = useState('all');
// //     const [members, setMembers] = useState([]);
// //     const [error, setError] = useState(null);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         console.log('[CommitActivityChart] projectId prop:', projectId); // LOG 1: projectId đầu vào

// //         if (!projectId) {
// //             setCommitData([]);
// //             setMembers([]);
// //             setLoading(false);
// //             return;
// //         }

// //         setLoading(true);
// //         setError(null);
// //         setCommitData([]);
// //         setMembers([]);

// //         const fetchCommits = async () => {
// //             try {
// //                 console.log(`[CommitActivityChart] Fetching commits for projectId: ${projectId}`); // LOG 2: Bắt đầu fetch
// //                 const response = await axios.get(`http://localhost:3000/api/projects/${projectId}/commits`);
// //                 const commits = response.data;
// //                 console.log('[CommitActivityChart] Commits received from backend:', commits); // LOG 3: Dữ liệu backend trả về

// //                 if (!commits || commits.length === 0) {
// //                     console.log('[CommitActivityChart] No commits found or empty array received.'); // LOG 4: Không có commit
// //                     setLoading(false);
// //                     return;
// //                 }

// //                 const uniqueMembers = [...new Set(commits.map(commit => commit.author_email))];
// //                 setMembers(uniqueMembers);
// //                 console.log('[CommitActivityChart] Unique members:', uniqueMembers); // LOG 5: Thành viên

// //                 const commitsByWeek = {};
// //                 commits.forEach(commit => {
// //                     if (selectedMember === 'all' || commit.author_email === selectedMember) {
// //                         const date = new Date(commit.date);
// //                         const dayNum = date.getUTCDay() || 7;
// //                         date.setUTCDate(date.getUTCDate() + 4 - dayNum);
// //                         const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
// //                         const weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
// //                         const week = `${date.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;

// //                         if (!commitsByWeek[week]) {
// //                             commitsByWeek[week] = { total: 0, members: {} };
// //                         }
// //                         commitsByWeek[week].total += 1;
// //                         if (selectedMember === 'all') {
// //                            commitsByWeek[week].members[commit.author_email] = (commitsByWeek[week].members[commit.author_email] || 0) + 1;
// //                         }
// //                     }
// //                 });
// //                 console.log('[CommitActivityChart] Commits grouped by week (before filtering by selectedMember):', JSON.parse(JSON.stringify(commitsByWeek))); // LOG 6

// //                 let filteredCommits = [];
// //                 if (selectedMember !== 'all') {
// //                     for (const weekKey in commitsByWeek) {
// //                         let memberCommitCountInWeek = 0;
// //                         commits.forEach(c => { // Lặp lại qua commits gốc để đếm cho member được chọn
// //                             if (c.author_email === selectedMember) {
// //                                 const date = new Date(c.date);
// //                                 const dayNum = date.getUTCDay() || 7;
// //                                 date.setUTCDate(date.getUTCDate() + 4 - dayNum);
// //                                 const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
// //                                 const weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
// //                                 if (`${date.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}` === weekKey) {
// //                                     memberCommitCountInWeek++;
// //                                 }
// //                             }
// //                         });

// //                         if (memberCommitCountInWeek > 0) {
// //                             filteredCommits.push({
// //                                 week: weekKey,
// //                                 total: memberCommitCountInWeek,
// //                                 members: { [selectedMember]: memberCommitCountInWeek }
// //                             });
// //                         }
// //                      }
// //                 } else {
// //                     filteredCommits = Object.keys(commitsByWeek).map(week => ({
// //                         week,
// //                         total: commitsByWeek[week].total,
// //                         members: commitsByWeek[week].members,
// //                     }));
// //                 }
// //                 console.log('[CommitActivityChart] Filtered commits (after considering selectedMember):', filteredCommits); // LOG 7


// //                 const formattedData = filteredCommits
// //                     .sort((a, b) => a.week.localeCompare(b.week))
// //                     .slice(-5); 
// //                 console.log('[CommitActivityChart] Formatted data for chart (last 5 weeks):', formattedData); // LOG 8

// //                 setCommitData(formattedData);
// //                 setLoading(false);
// //             } catch (error) {
// //                 console.error('[CommitActivityChart] Error fetching commit data:', error); // LOG 9: Lỗi
// //                 setError('Không thể tải dữ liệu commit.');
// //                 setCommitData([]);
// //                 setMembers([]);
// //                 setLoading(false);
// //             }
// //         };
// //         fetchCommits();
// //     }, [projectId, selectedMember]);

// //     // ... (phần còn lại của component không đổi)
// //     const chartData = {
// //         labels: commitData.map(item => item.week),
// //         datasets: [
// //             {
// //                 label: selectedMember === 'all' ? 'Tổng số commit' : `Commit của ${selectedMember.split('@')[0]}`,
// //                 data: commitData.map(item => item.total),
// //                 borderColor: '#3b82f6',
// //                 backgroundColor: 'rgba(59, 130, 246, 0.1)',
// //                 fill: false,
// //                 tension: 0.4,
// //                 pointRadius: 4,
// //             },
// //         ],
// //     };

// //     const chartOptions = {
// //         responsive: true,
// //         maintainAspectRatio: false,
// //         plugins: {
// //             legend: { display: true, position: 'top' },
// //             title: {
// //                 display: true,
// //                 text: 'Hoạt động commit (5 tuần gần nhất)',
// //                 font: { size: 16, family: 'Inter, sans-serif' },
// //                 color: '#1F2937',
// //             },
// //             tooltip: {
// //                 enabled: true,
// //                 callbacks: {
// //                     label: (context) => {
// //                         if (!commitData[context.dataIndex]) return '';
// //                         const weekData = commitData[context.dataIndex];
// //                         const lines = [`Tổng commit trong tuần: ${weekData.total}`];
// //                         if (selectedMember === 'all' && weekData.members && Object.keys(weekData.members).length > 0) {
// //                             Object.entries(weekData.members).forEach(([email, count]) => {
// //                                 lines.push(`${email.split('@')[0]}: ${count}`);
// //                             });
// //                         } else if (selectedMember !== 'all' && weekData.members && weekData.members[selectedMember]) {
// //                              lines.push(`${selectedMember.split('@')[0]}: ${weekData.members[selectedMember]}`);
// //                         }
// //                         return lines;
// //                     },
// //                 },
// //             },
// //         },
// //         scales: {
// //             x: {
// //                 grid: { display: false },
// //                 title: { display: true, text: 'Thời gian (Tuần)', font: { family: 'Inter, sans-serif' } },
// //             },
// //             y: {
// //                 min: 0,
// //                 ticks: { 
// //                     precision: 0, 
// //                     callback: function(value) { if (Number.isInteger(value)) { return value; } },
// //                 },
// //                 grid: { borderDash: [5, 5] },
// //                 title: { display: true, text: 'Số commit', font: { family: 'Inter, sans-serif' } },
// //             },
// //         },
// //     };

// //     if (commitData.length > 0) {
// //         const maxTotal = Math.max(...commitData.map(item => item.total), 0);
// //         chartOptions.scales.y.ticks.stepSize = maxTotal > 0 && maxTotal < 5 ? 1 : Math.ceil(maxTotal / 5) || 1;
// //     }

// //     let content;
// //     if (loading) {
// //         content = <p>Đang tải dữ liệu commit...</p>;
// //     } else if (error) {
// //         content = <p className="error">{error}</p>;
// //     } else if (commitData.length === 0 && projectId) { // Chỉ hiện "không có dữ liệu" nếu đã có projectId
// //         content = <p>Không có dữ liệu commit cho lựa chọn này.</p>;
// //     } else if (!projectId) {
// //         content = <p>Vui lòng chọn một dự án để xem hoạt động commit.</p>;
// //     }
// //     else {
// //         content = <Line data={chartData} options={chartOptions} />;
// //     }

// //     return (
// //         <div className="commitactivity-chart-container">
// //             <select
// //                 value={selectedMember}
// //                 onChange={(e) => setSelectedMember(e.target.value)}
// //                 style={{ marginBottom: '10px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
// //                 disabled={loading || (members.length === 0 && selectedMember === 'all') || !projectId}
// //             >
// //                 <option value="all">Tất cả thành viên</option>
// //                 {members.map(member => (
// //                     <option key={member} value={member}>{member.split('@')[0]}</option>
// //                 ))}
// //             </select>
// //             {content}
// //         </div>
// //     );
// // };
// // export default CommitActivityChart;

// // src/components/CommitActivityChart.jsx
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
//     TimeScale, // Cần thiết cho adapter
//     TimeSeriesScale // Cần thiết cho adapter
// } from 'chart.js';
// import 'chartjs-adapter-date-fns'; // Quan trọng: adapter cho việc xử lý date/time
// import { format, getISOWeek, startOfWeek, endOfWeek, eachWeekOfInterval, parseISO, isAfter } from 'date-fns';
// import axios from 'axios';
// import '../css/commitactivitychart.css'; // Đảm bảo bạn có file CSS này và import đúng

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

// const CommitActivityChart = ({ projectId, onRefreshCommits }) => {
//     const [weeklyActivity, setWeeklyActivity] = useState([]);
//     const [selectedUser, setSelectedUser] = useState('all'); // 'all' hoặc user_id (dưới dạng string từ select)
//     const [projectUsers, setProjectUsers] = useState([]); // Danh sách user có commit [{user_id, username}]
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);

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
//         // Không reset weeklyActivity và projectUsers hoàn toàn khi refresh,
//         // chỉ khi projectId thay đổi hoặc lần load đầu
//         if (!isRefresh) {
//             setWeeklyActivity([]);
//             setProjectUsers([]);
//         }
//         // Chỉ reset projectUsers nếu không phải là refresh hoặc nếu nó đang rỗng
//         // để giữ lại danh sách user trong dropdown khi refresh
//         // if (!isRefresh || projectUsers.length === 0) {
//         //     setProjectUsers([]);
//         // }

//         try {
//             const response = await axios.get(`http://localhost:3000/api/projects/${projectId}/commits`);
//             const { commits, projectStartDate, projectEndDate } = response.data;

//             if (!commits || commits.length === 0) {
//                 console.log('[CommitActivityChart] No commits found for project.');
//                 setWeeklyActivity([]);
//                 // Không reset projectUsers ở đây nếu isRefresh = true, vì danh sách users đã có thể được load từ trước
//                 if (!isRefresh) setProjectUsers([]); // Nếu không có commit, cũng không có user từ commit
//                 if (isRefresh) setRefreshing(false); else setLoading(false);
//                 return;
//             }

//             // Lấy danh sách user duy nhất từ commits để tạo dropdown
//             // commits được giả định đã sort theo ngày từ backend
//             // const usersInCommits = commits.reduce((acc, commit) => {
//             //     if (commit.user_id && !acc.find(u => u.user_id === commit.user_id)) {
//             //         acc.push({ user_id: commit.user_id, username: commit.username });
//             //     }
//             //     return acc;
//             // }, []);
//             // setProjectUsers(usersInCommits);

//             // Cập nhật projectUsers chỉ khi nó rỗng hoặc không phải là refresh
//             // để giữ danh sách user trong dropdown khi refresh dữ liệu commit
//             if (projectUsers.length === 0 || !isRefresh) {
//                 const usersInCommits = commits.reduce((acc, commit) => {
//                     if (commit.user_id && !acc.find(u => u.user_id === commit.user_id)) {
//                         acc.push({ user_id: commit.user_id, username: commit.username });
//                     }
//                     return acc;
//                 }, []);
//                 setProjectUsers(usersInCommits);
//             }

//             // Xác định phạm vi tuần của dự án
//             const firstCommitDate = parseISO(commits[0].date);
//             const lastCommitDate = parseISO(commits[commits.length - 1].date);

//             // Sử dụng projectStartDate từ DB nếu có, nếu không thì dùng ngày commit đầu tiên
//             const pStartDate = projectStartDate ? parseISO(projectStartDate) : firstCommitDate;
//             // Sử dụng projectEndDate từ DB nếu có, nếu không thì dùng ngày commit cuối cùng, hoặc ngày hiện tại nếu commit cuối < hiện tại
//             // let pEndDateEffective = projectEndDate ? parseISO(projectEndDate) : (lastCommitDate > new Date() ? lastCommitDate : new Date());

//             let pEndDateEffective;
//             if (projectEndDate) {
//                 pEndDateEffective = parseISO(projectEndDate);
//             } else {
//                 // Nếu không có projectEndDate, lấy ngày commit cuối hoặc ngày hiện tại (ngày nào muộn hơn)
//                 pEndDateEffective = isAfter(lastCommitDate, new Date()) ? lastCommitDate : new Date();
//             }

//             // Đảm bảo ngày kết thúc không sớm hơn ngày bắt đầu
//             if (pEndDateEffective < pStartDate) {
//                 pEndDateEffective = pStartDate;
//             }

//             const overallStartDate = startOfWeek(pStartDate, { weekStartsOn: 1 }); // Tuần bắt đầu từ Thứ Hai (Monday)
//             const overallEndDate = endOfWeek(pEndDateEffective, { weekStartsOn: 1 });

//             const activityByWeek = {};
//             if (overallStartDate <= overallEndDate) { // Chỉ tạo tuần nếu khoảng thời gian hợp lệ
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
//                 // Chuyển selectedUser (string) thành number để so sánh với commit.user_id (number)
//                 // const selectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);
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
//             // setWeeklyActivity([]);
//             // Giữ lại projectUsers nếu có để dropdown không bị mất khi có lỗi fetch data
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

//     const handleRefresh = async () => {
//         if (onRefreshCommits && projectId) {
//             setRefreshing(true);
//             try {
//                 await onRefreshCommits(); // Trigger backend refresh
//                 await fetchData(true);    // Fetch data mới cho biểu đồ
//             } catch (err) {
//                 setError("Failed to refresh commits from source.");
//                 console.error("[CommitActivityChart] Error during manual refresh:", err);
//             } finally {
//                 setRefreshing(false);
//             }
//         }
//         // else {
//         //     console.warn("[CommitActivityChart] onRefreshCommits prop not provided or no projectId.");
//         // }
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
//                 // selectedUser === 'all'
//                 //     ? 'Total Commits per Week'
//                 //     : `Commits by ${projectUsers.find(u => u.user_id === parseInt(selectedUser))?.username || 'Selected User'} per Week`,
//                 data: weeklyActivity.map(item => {
//                     // item.total),
//                     if (selectedUser === 'all') {
//                         return item.total;
//                     }
//                     // Nếu một user cụ thể được chọn, lấy số commit của user đó trong tuần
//                     // item.usersDetail[currentSelectedUserIdNum] có thể undefined nếu user đó ko commit trong tuần này
//                     return item.usersDetail[currentSelectedUserIdNum]?.count || 0;
//                 }),
//                 borderColor: '#3b82f6',
//                 backgroundColor: 'rgba(59, 130, 246, 0.1)',
//                 fill: false,
//                 tension: 0.1,
//                 pointRadius: 3,
//                 pointHoverRadius: 5,
//             },
//         ],
//     };

//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         interaction: { // Cải thiện tương tác tooltip
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
//                         let label = context.dataset.label || '';
//                         if (label) {
//                             label = label.replace(' per Week', '');
//                             label += ': ';
//                         }
//                         if (context.parsed.y !== null) {
//                             label += context.parsed.y;
//                         }
//                         return label;
//                     },
//                     afterBody: function (tooltipItems) {
//                         // if (selectedUser === 'all' && weeklyActivity.length > 0) {
//                         //     const dataIndex = tooltipItems[0]?.dataIndex;
//                         //     if (dataIndex !== undefined && weeklyActivity[dataIndex]) {
//                         //         const weekData = weeklyActivity[dataIndex];
//                         //         const userDetails = weekData.usersDetail;
//                         //         let lines = [];
//                         //         for (const userId in userDetails) {
//                         //             if (userDetails[userId].count > 0) { // Chỉ hiển thị user có commit
//                         //                 lines.push(`  ${userDetails[userId].username}: ${userDetails[userId].count}`);
//                         //             }
//                         //         }
//                         //         if (lines.length > 0) return ["\nBreakdown:", ...lines];
//                         //     }
//                         // }
//                         if (weeklyActivity.length > 0 && tooltipItems.length > 0) {
//                             const dataIndex = tooltipItems[0].dataIndex;
//                             if (weeklyActivity[dataIndex]) {
//                                 const weekData = weeklyActivity[dataIndex];
//                                 const userDetails = weekData.usersDetail; // usersDetail có key là user_id (number)
//                                 let lines = [];

//                                 if (selectedUser === 'all') { // Chỉ hiện breakdown nếu đang xem All Members
//                                     lines.push("\nBreakdown:");
//                                     Object.keys(userDetails).forEach(userIdKey => { // userIdKey là string
//                                         const userData = userDetails[userIdKey]; // userData là { count, username }
//                                         if (userData.count > 0) {
//                                             lines.push(`  ${userData.username}: ${userData.count}`);
//                                         }
//                                     });
//                                     // Nếu không có breakdown cụ thể (ví dụ, tuần đó không có commit nào), không hiển thị "Breakdown:" rỗng
//                                     if (lines.length === 1 && weekData.total === 0) return [];
//                                     if (lines.length > 1) return lines;


//                                 } else { // Nếu một user cụ thể được chọn, không cần breakdown nữa vì dòng chính đã là của user đó
//                                     // const selectedUserDetails = userDetails[currentSelectedUserIdNum];
//                                     // if (selectedUserDetails && selectedUserDetails.count > 0) {
//                                     //     lines.push(`  ${selectedUserDetails.username}: ${selectedUserDetails.count}`);
//                                     //      return lines;
//                                     // }
//                                 }
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
//                     autoSkip: true, // Tự động bỏ qua label nếu quá dày
//                     maxRotation: 30, // Xoay nhẹ nếu cần
//                     minRotation: 0,
//                     padding: 5,
//                     // maxTicksLimit: 12 // Giới hạn số lượng tick, tùy chỉnh theo độ rộng biểu đồ
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
//                     // stepSize được tính động bên dưới
//                 },
//                 grid: {
//                     borderDash: [3, 3], // Nét đứt cho grid
//                     color: 'rgba(200, 200, 200, 0.3)'
//                 },
//             },
//         },
//     };

//     // Tính toán stepSize cho trục Y một cách linh hoạt
//     if (weeklyActivity.length > 0) {
//         const dataForStepSize = weeklyActivity.map(item => {
//             if (selectedUser === 'all') return item.total;
//             return item.usersDetail[currentSelectedUserIdNum]?.count || 0;
//         });
//         const maxTotalCommits = Math.max(...dataForStepSize, 0);
//         // const maxTotalCommits = Math.max(...weeklyActivity.map(item => item.total), 0);
//         let step = 1;
//         if (maxTotalCommits > 10) {
//             step = Math.ceil(maxTotalCommits / 10); // Chia thành khoảng 10 đoạn
//         } else if (maxTotalCommits > 5) {
//             step = 2;
//         }
//         chartOptions.scales.y.ticks.stepSize = step || 1;
//     }


//     let content;
//     if (loading) {
//         content = <p style={{ textAlign: 'center', padding: '20px' }}>Loading commit activity...</p>;
//     } else if (refreshing) {
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
//                 {projectId && onRefreshCommits && (
//                     <button
//                         onClick={handleRefresh}
//                         disabled={loading || refreshing}
//                         style={{
//                             padding: '8px 15px',
//                             borderRadius: '4px',
//                             border: 'none',
//                             backgroundColor: (loading || refreshing) ? '#ccc' : '#007bff',
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
//             {content}
//         </div>
//     );
// };

// export default CommitActivityChart;

// src/components/CommitActivityChart.jsx
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

const CommitActivityChart = ({ projectId, onRefreshCommits }) => {
    const [weeklyActivity, setWeeklyActivity] = useState([]);
    const [selectedUser, setSelectedUser] = useState('all'); // 'all' hoặc user_id (dưới dạng string từ select)
    const [projectUsers, setProjectUsers] = useState([]); // Danh sách user có commit [{user_id, username}]
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async (isRefresh = false) => {
        if (!projectId) {
            setWeeklyActivity([]);
            setProjectUsers([]);
            setLoading(false);
            if (isRefresh) setRefreshing(false);
            return;
        }

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        if (!isRefresh) {
            setWeeklyActivity([]);
            setProjectUsers([]);
        }

        try {
            // API sẽ trả về commits với user_id và username nhờ thay đổi ở contributionModel.js
            const response = await axios.get(`http://localhost:3000/api/projects/${projectId}/commits`);
            const { commits, projectStartDate, projectEndDate } = response.data;

            if (!commits || commits.length === 0) {
                console.log('[CommitActivityChart] No commits found for project.');
                setWeeklyActivity([]);
                if (!isRefresh) setProjectUsers([]);
                if (isRefresh) setRefreshing(false); else setLoading(false);
                return;
            }

            // Cập nhật projectUsers (danh sách user cho dropdown)
            // commits bây giờ chứa { sha, message, date, user_id, username }
            if (projectUsers.length === 0 || !isRefresh) {
                const usersInCommits = commits.reduce((acc, commit) => {
                    if (commit.user_id && !acc.find(u => u.user_id === commit.user_id)) {
                        // commit.username là tên thật/username từ DB
                        acc.push({ user_id: commit.user_id, username: commit.username });
                    }
                    return acc;
                }, []);
                // Sắp xếp user theo tên cho dropdown
                setProjectUsers(usersInCommits.sort((a, b) => a.username.localeCompare(b.username)));
            }

            // Xác định phạm vi tuần của dự án
            // Do backend sắp xếp commits ASC theo ngày, commits[0] là commit sớm nhất
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
                        total: 0, // Tổng số commit trong tuần (cho user đang chọn, hoặc tất cả nếu selectedUser='all')
                        users: {}, // Chi tiết commit của từng user trong tuần (key là user_id dạng số)
                        startDate: format(weekDate, 'dd/MM'),
                        endDate: format(endOfWeek(weekDate, { weekStartsOn: 1 }), 'dd/MM/yyyy')
                    };
                });
            }

            const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);

            commits.forEach(commit => {
                // Lọc commit theo user đã chọn (nếu có)
                if (selectedUser === 'all' || commit.user_id === currentSelectedUserIdNum) {
                    const commitDate = parseISO(commit.date);
                    const weekKey = `${format(commitDate, 'yyyy')}-W${String(getISOWeek(commitDate)).padStart(2, '0')}`;

                    if (activityByWeek[weekKey]) {
                        activityByWeek[weekKey].total += 1; // Tăng tổng số commit cho tuần (của user đang chọn, hoặc tổng nếu 'all')

                        // Lưu chi tiết commit của user (commit.user_id là số, commit.username là tên)
                        // Dùng cho tooltip breakdown khi selectedUser='all'
                        if (!activityByWeek[weekKey].users[commit.user_id]) { // key là user_id (số)
                            activityByWeek[weekKey].users[commit.user_id] = {
                                count: 0,
                                username: commit.username // Lưu username để dùng trong tooltip
                            };
                        }
                        activityByWeek[weekKey].users[commit.user_id].count += 1;
                    }
                }
            });

            // Nếu selectedUser là 'all', chúng ta cần đảm bảo users object chứa tất cả đóng góp
            // để tooltip có thể hiển thị breakdown.
            // Đoạn code trên đã xử lý điều này: nếu selectedUser='all', vòng lặp duyệt qua tất cả commits.
            // Nếu selectedUser cụ thể, users object sẽ chỉ chứa thông tin user đó,
            // nhưng tooltip breakdown chỉ kích hoạt khi selectedUser='all'.

            const formattedWeeklyActivity = Object.keys(activityByWeek)
                .map(weekKey => ({
                    week: weekKey,
                    label: `${activityByWeek[weekKey].startDate} - ${activityByWeek[weekKey].endDate.substring(0, 5)} (${activityByWeek[weekKey].endDate.substring(6)})`,
                    total: activityByWeek[weekKey].total, // total này đã được lọc theo selectedUser
                    usersDetail: activityByWeek[weekKey].users, // usersDetail chứa { userId: { count, username } }
                }))
                .sort((a, b) => a.week.localeCompare(b.week));

            setWeeklyActivity(formattedWeeklyActivity);

        } catch (err) {
            console.error('[CommitActivityChart] Error fetching commit activity:', err);
            setError('Could not load commit activity data.');
            if (!isRefresh) {
                setWeeklyActivity([]);
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
        if (onRefreshCommits && projectId) {
            // fetchData sẽ được gọi lại sau khi onRefreshCommits hoàn tất và lấy dữ liệu mới
            // setRefreshing(true); // fetchData sẽ set refreshing
            try {
                await onRefreshCommits();
                await fetchData(true);
            } catch (err) {
                setError("Failed to refresh commits from source.");
                console.error("[CommitActivityChart] Error during manual refresh:", err);
                setRefreshing(false); // Đảm bảo reset refreshing nếu có lỗi ở onRefreshCommits
            }
            // finally { // fetchData sẽ tự reset refreshing
            //     setRefreshing(false);
            // }
        }
    };

    const currentSelectedUserIdNum = selectedUser === 'all' ? null : parseInt(selectedUser, 10);
    const datasetLabel = selectedUser === 'all'
        ? 'Total Commits per Week'
        : `Commits by ${projectUsers.find(u => u.user_id === currentSelectedUserIdNum)?.username || 'Selected User'} per Week`;

    const chartData = {
        labels: weeklyActivity.map(item => item.label),
        datasets: [
            {
                label: datasetLabel,
                data: weeklyActivity.map(item => {
                    // item.total đã phản ánh số commit của user được chọn, hoặc tổng số commit nếu 'all' được chọn.
                    // Hoặc có thể dùng item.usersDetail nếu muốn rõ ràng hơn khi một user cụ thể được chọn:
                    if (selectedUser === 'all') {
                        return item.total;
                    }
                    // Nếu một user cụ thể được chọn, item.total cũng chính là count của user đó.
                    // Hoặc item.usersDetail[currentSelectedUserIdNum]?.count || 0;
                    return item.total;
                }),
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
                    label: function (context) { // Dòng chính của tooltip
                        let labelText = context.dataset.label || '';
                        if (labelText) {
                            labelText = labelText.replace(' per Week', ''); // "Total Commits" or "Commits by UserX"
                            labelText += ': ';
                        }
                        if (context.parsed.y !== null) {
                            labelText += context.parsed.y; // Số commit (tổng hoặc của user)
                        }
                        return labelText;
                    },
                    afterBody: function (tooltipItems) { // Phần breakdown chi tiết
                        // selectedUser và weeklyActivity lấy từ scope của component
                        if (selectedUser === 'all' && weeklyActivity.length > 0 && tooltipItems.length > 0) {
                            const dataIndex = tooltipItems[0].dataIndex;
                            if (weeklyActivity[dataIndex]) {
                                const weekData = weeklyActivity[dataIndex];
                                const userDetailsInWeek = weekData.usersDetail; // { userIdAsNumber: { count, username } }
                                let lines = [];

                                if (Object.keys(userDetailsInWeek).length > 0 && weekData.total > 0) {
                                    lines.push("\nBreakdown:"); // Thêm dòng mới cho dễ đọc
                                    // Sắp xếp user theo tên hoặc số commit trước khi hiển thị (tùy chọn)
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
                                // Trả về lines nếu có nội dung breakdown, ngược lại mảng rỗng
                                return lines.length > 1 ? lines : [];
                            }
                        }
                        return []; // Không có breakdown nếu một user cụ thể được chọn
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
        const dataForStepSize = weeklyActivity.map(item => item.total); // item.total đã được lọc
        const maxTotalCommits = Math.max(...dataForStepSize, 0);
        let step = 1;
        if (maxTotalCommits > 10) {
            step = Math.ceil(maxTotalCommits / 10);
        } else if (maxTotalCommits > 5) {
            step = 2;
        }
        chartOptions.scales.y.ticks.stepSize = step || 1;
    }

    let content;
    if (loading) {
        content = <p style={{ textAlign: 'center', padding: '20px' }}>Loading commit activity...</p>;
    } else if (refreshing) {
        content = <p style={{ textAlign: 'center', padding: '20px' }}>Refreshing commit data from source...</p>;
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <select
                    value={selectedUser} // Giá trị là 'all' hoặc user_id (string)
                    onChange={(e) => setSelectedUser(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '180px' }}
                    disabled={loading || refreshing || projectUsers.length === 0 || !projectId}
                >
                    <option value="all">All Members</option>
                    {/* projectUsers là [{ user_id, username }] */}
                    {projectUsers.map(user => (
                        <option key={user.user_id} value={String(user.user_id)}>{user.username}</option>
                    ))}
                </select>
                {projectId && onRefreshCommits && (
                    <button
                        onClick={handleRefresh}
                        disabled={loading || refreshing}
                        style={{
                            padding: '8px 15px',
                            borderRadius: '4px',
                            border: 'none',
                            backgroundColor: (loading || refreshing) ? '#ccc' : '#007bff',
                            color: 'white',
                            cursor: (loading || refreshing) ? 'not-allowed' : 'pointer',
                            fontWeight: '500'
                        }}
                        title="Refresh commit data from GitHub"
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

export default CommitActivityChart;