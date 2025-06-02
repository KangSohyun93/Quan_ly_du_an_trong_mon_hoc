// // // import React, { useEffect } from 'react'; // Bỏ useState, useEffect nếu hook quản lý
// // // import StatCard from './StatCard/StatCard';
// // // import MemberCompletionChart from './MemberCompletionChart/MemberCompletionChart';
// // // import CommitActivityChart from './CommitActivityChart/CommitActivityChart';
// // // import LOCGrowthChart from './LOCGrowthChart/LOCGrowthChart';
// // // import PeerReviewChart from './PeerReviewChart/PeerReviewChart';
// // // import TaskChart from './TaskChart/TaskChart';
// // // import LateTasksChart from './LateTasksChart/LateTasksChart'; // Component này có tên BarChart trong file gốc
// // // import SprintPerformanceChart from './SprintPerformanceChart/SprintPerformanceChart';
// // // import './dashboard.css'; // Đảm bảo đường dẫn CSS đúng

// // // import { Chart as ChartJS } from 'chart.js';
// // // import ChartDataLabels from 'chartjs-plugin-datalabels';

// // // import useDashboardCoreData from '../../hooks/useDashboardCoreData'; // Đường dẫn đúng

// // // ChartJS.register(ChartDataLabels);
// // // ChartJS.defaults.set('plugins.datalabels', {
// // //     display: false,
// // // });

// // // const Dashboard = () => {
// // //     const {
// // //         selectedGroup,
// // //         setSelectedGroup, // Giờ đây là hàm handleGroupChange
// // //         groups,
// // //         loadingGroups,
// // //         currentUserRole,
// // //         sprints,
// // //         // selectedSprintId,
// // //         setSelectedSprintId,
// // //         // loadingSprints, // Có thể dùng để hiển thị trạng thái loading cho dropdown sprint
// // //         statData,
// // //         loadingStats,
// // //         isMasterRefreshing,
// // //         refreshNonce,
// // //         handleMasterRefresh,
// // //         currentProjectId,
// // //         currentGroupId
// // //     } = useDashboardCoreData();

// // //     // useEffect(() => {
// // //     //     // Chỉ cập nhật nếu prop có giá trị và hàm setSelectedSprintId tồn tại
// // //     //     // selectedSprintId (bên trong hook) sẽ được cập nhật,
// // //     //     // và useEffect trong hook sẽ fetch lại stats.
// // //     //     if (activeSprintIdFromHeader !== undefined && setSelectedSprintId) {
// // //     //         setSelectedSprintId(activeSprintIdFromHeader);
// // //     //     }
// // //     //     // Không thêm selectedSprintId (từ hook) vào dependencies ở đây
// // //     //     // để tránh vòng lặp không cần thiết nếu setSelectedSprintId không thay đổi giá trị bên trong hook.
// // //     //     // setSelectedSprintId là hàm ổn định từ useState.
// // //     // }, [activeSprintIdFromHeader, setSelectedSprintId]);

// // //     if (loadingGroups) {
// // //         return (
// // //             <section className="dashboard-container">
// // //                 <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
// // //                     <p>Loading group list...</p>
// // //                 </div>
// // //             </section>
// // //         );
// // //     }

// // //     return (
// // //         <section className="dashboard-container">
// // //             <div className="dashboard-content">
// // //                 {/* --- DASHBOARD HEADER --- */}
// // //                 {/* <div className="dashboard-header">
// // //                     <div className="dashboard-title">
// // //                         <h1 className="project-name">{selectedGroup?.group_name || 'No Group Selected'}</h1>
// // //                         <select
// // //                             className="project-select"
// // //                             value={currentGroupId || ''}
// // //                             onChange={(e) => setSelectedGroup(e.target.value)} // Gọi hàm từ hook
// // //                             disabled={groups.length === 0 || (currentUserRole === 'Student' && groups.length <= 1)}
// // //                         >
// // //                             {groups.length === 0 ? (
// // //                                 <option value="">No groups available</option>
// // //                             ) : (
// // //                                 groups.map(group => (
// // //                                     <option key={group.group_id} value={group.group_id}>
// // //                                         {group.group_name}
// // //                                     </option>
// // //                                 ))
// // //                             )}
// // //                         </select>
// // //                     </div>
// // //                     <div className="vertical-line"></div>
// // //                     <div className="project-members">
// // //                         {avatars.map((avatar, index) => (
// // //                             <img
// // //                                 key={index} src={avatar} alt={`Avatar ${index + 1}`}
// // //                                 className="member-avatar" style={{ zIndex: index + 1 }}
// // //                             />
// // //                         ))}
// // //                     </div>
// // //                 </div> */}

// // //                 {/* --- DASHBOARD CONTROLS --- */}
// // //                 {/* <div className="dashboard-controls">
// // //                     <div className="tab-section">
// // //                         <select
// // //                             className="sprint-select"
// // //                             value={selectedSprintId}
// // //                             onChange={(e) => setSelectedSprintId(e.target.value)}
// // //                             disabled={!sprints || sprints.length === 0}
// // //                         >
// // //                             <option value="all">All Sprints (Project)</option>
// // //                             {sprints.map(sprint => (
// // //                                 <option key={sprint.id} value={sprint.id}>
// // //                                     {sprint.name}
// // //                                 </option>
// // //                             ))}
// // //                         </select>
// // //                         <div className="vertical-line"></div>
// // //                         <div className="dashboard-btn-container">
// // //                             <i className="fa-solid fa-house"></i>
// // //                             <button className="dashboard-btn">Introduce</button>
// // //                         </div>
// // //                         <div className="dashboard-btn-container dashboard-btn-active">
// // //                             <i className="fa-solid fa-chart-line"></i>
// // //                             <button className="dashboard-btn">Dashboard</button>
// // //                         </div>
// // //                         <div className="dashboard-btn-container">
// // //                             <i className="fa-solid fa-list-check"></i>
// // //                             <button className="dashboard-btn">Team task</button>
// // //                         </div>
// // //                         <div className="dashboard-btn-container">
// // //                             <i className="fa-solid fa-list"></i>
// // //                             <button className="dashboard-btn">My task</button>
// // //                         </div>
// // //                         <div className="dashboard-btn-container">
// // //                             <i className="fa-solid fa-calendar-day"></i>
// // //                             <button className="dashboard-btn">Roadmap</button>
// // //                         </div>
// // //                         <div className="dashboard-btn-container">
// // //                             <i className="rate-icon fa-solid fa-star"></i>
// // //                             <button className="dashboard-btn">Rate</button>
// // //                         </div>
// // //                     </div>
// // //                     <div className="control-section">
// // //                         <div className="dashboard-btn-container">
// // //                             <i className="filter-icon fa-solid fa-filter"></i>
// // //                             <select name="" id="" className="filter"><option value="">Filter</option></select>
// // //                         </div>
// // //                     </div>
// // //                 </div> */}

// // //                 {/* --- STATS CONTAINER --- */}
// // //                 <div className="dashboard-stats-container">
// // //                     <div className="dashboard-stats">
// // //                         <StatCard title="Total Project Tasks" value={loadingStats ? "..." : statData.totalProjectTasks} background="bg-violet" />
// // //                         <StatCard title="Selected Sprint Tasks" value={loadingStats ? "..." : statData.selectedSprintTasks} background="bg-blue" />
// // //                         <StatCard title="Tasks Completed" value={loadingStats ? "..." : statData.tasksCompleted} background="bg-violet" />
// // //                         <StatCard title="Tasks Late" value={loadingStats ? "..." : statData.tasksLate} background="bg-blue" />
// // //                         <StatCard title="Total Commits" value={loadingStats ? "..." : statData.totalCommits} background="bg-violet" />
// // //                         <StatCard title="Total LOC" value={loadingStats ? "..." : statData.totalLOC} background="bg-blue" />
// // //                     </div>
// // //                     {/* --- CHARTS GRID --- */}
// // //                     {currentGroupId && currentProjectId ? ( // Chỉ render chart khi có group/project được chọn
// // //                         <div className="dashboard-charts">
// // //                             <MemberCompletionChart groupId={currentGroupId} />
// // //                             <CommitActivityChart
// // //                                 projectId={currentProjectId}
// // //                                 onRefreshCommits={handleMasterRefresh}
// // //                                 isParentRefreshing={isMasterRefreshing}
// // //                                 refreshNonce={refreshNonce}
// // //                             />
// // //                             <LOCGrowthChart
// // //                                 projectId={currentProjectId}
// // //                                 onRefreshCommits={handleMasterRefresh}
// // //                                 isParentRefreshing={isMasterRefreshing}
// // //                                 refreshNonce={refreshNonce}
// // //                             />
// // //                             <PeerReviewChart groupId={currentGroupId} />
// // //                             <TaskChart groupId={currentGroupId} />
// // //                             <LateTasksChart groupId={currentGroupId} /> {/* Component LateTasksChart */}
// // //                             <SprintPerformanceChart groupId={currentGroupId} />
// // //                         </div>
// // //                     ) : (
// // //                         <div style={{ textAlign: 'center', padding: '50px' }}>
// // //                             <p>{!loadingGroups && groups.length > 0 ? "Select a group to view details." : "No groups available to display dashboard."}</p>
// // //                         </div>
// // //                     )}
// // //                 </div>
// // //             </div>
// // //         </section>
// // //     );
// // // };

// // // export default Dashboard;

// // // --- START OF FILE Dashboard.js ---

// // import React, { useEffect } from 'react';
// // import { useOutletContext } from 'react-router-dom'; // << 1. Import useOutletContext
// // import StatCard from './StatCard/StatCard';
// // import MemberCompletionChart from './MemberCompletionChart/MemberCompletionChart';
// // import CommitActivityChart from './CommitActivityChart/CommitActivityChart';
// // import LOCGrowthChart from './LOCGrowthChart/LOCGrowthChart';
// // import PeerReviewChart from './PeerReviewChart/PeerReviewChart';
// // import TaskChart from './TaskChart/TaskChart';
// // import LateTasksChart from './LateTasksChart/LateTasksChart';
// // import SprintPerformanceChart from './SprintPerformanceChart/SprintPerformanceChart';
// // import './dashboard.css';

// // import { Chart as ChartJS } from 'chart.js';
// // import ChartDataLabels from 'chartjs-plugin-datalabels';

// // import useDashboardCoreData from '../../hooks/useDashboardCoreData';

// // ChartJS.register(ChartDataLabels);
// // ChartJS.defaults.set('plugins.datalabels', {
// //     display: false,
// // });

// // const Dashboard = () => {
// //     const outletContext = useOutletContext(); // << 2. Lấy context từ Outlet
// //     const selectedSprintIdFromContext = outletContext?.selectedSprintId; // Lấy selectedSprintId từ context
// //     const contextUserId = outletContext?.userId;
// //     const contextClassId = outletContext?.classId;
// //     const contextGroupId = outletContext?.groupId;

// //     const {
// //         selectedGroup,
// //         // setSelectedGroup,
// //         groups,
// //         loadingGroups,
// //         // currentUserRole,
// //         // sprints, // sprints từ hook không còn cần thiết nếu TeamHeader quản lý
// //         // selectedSprintId, // Không đọc trực tiếp từ đây, sẽ dùng selectedSprintIdFromContext
// //         setSelectedSprintId, // Dùng setter này để cập nhật hook useDashboardCoreData
// //         statData,
// //         loadingStats,
// //         isMasterRefreshing,
// //         // refreshNonce,
// //         handleMasterRefresh,
// //         currentProjectId,
// //         currentGroupId
// //     } = useDashboardCoreData(contextUserId, contextClassId, contextGroupId);

// //     // << 3. useEffect để đồng bộ sprint từ context vào useDashboardCoreData
// //     useEffect(() => {
// //         // Chỉ cập nhật nếu setSelectedSprintId tồn tại (hook đã khởi tạo)
// //         // selectedSprintIdFromContext có thể là null (ví dụ: instructor view hoặc chưa chọn sprint)
// //         // useDashboardCoreData sẽ xử lý việc selectedSprintId là null (ví dụ: fetch stats tổng quan)
// //         if (setSelectedSprintId) {
// //             setSelectedSprintId(selectedSprintIdFromContext);
// //         }
// //     }, [selectedSprintIdFromContext, setSelectedSprintId]);


// //     if (loadingGroups && !selectedGroup) { // Điều kiện loading chính xác hơn
// //         return (
// //             <section className="dashboard-container">
// //                 <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
// //                     <p>Loading group data...</p>
// //                 </div>
// //             </section>
// //         );
// //     }

// //     // Nếu không có group nào được chọn (ví dụ sau khi load xong groups nhưng không có group nào)
// //     // hoặc không có currentGroupId (trường hợp selectedGroup là null)
// //     // thì hiển thị thông báo.
// //     // Tuy nhiên, useDashboardCoreData đã có logic chọn group mặc định.
// //     // Nếu currentGroupId là null sau khi loadingGroups xong, thì có thể là không có group nào.
// //     if (!loadingGroups && !currentGroupId && groups.length === 0) {
// //         return (
// //             <section className="dashboard-container">
// //                 <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
// //                     <p>No groups available to display dashboard.</p>
// //                 </div>
// //             </section>
// //         )
// //     }


// //     return (
// //         <section className="dashboard-container">
// //             <div className="dashboard-content">
// //                 {/* Phần DASHBOARD HEADER và DASHBOARD CONTROLS đã được comment lại, giữ nguyên */}
// //                 {/* ... */}

// //                 {/* --- STATS CONTAINER --- */}
// //                 <div className="dashboard-stats-container">
// //                     <div className="dashboard-stats">
// //                         <StatCard title="Total Project Tasks" value={loadingStats ? "..." : statData.totalProjectTasks} background="bg-violet" />
// //                         <StatCard title="Selected Sprint Tasks" value={loadingStats ? "..." : statData.selectedSprintTasks} background="bg-blue" />
// //                         <StatCard title="Tasks Completed" value={loadingStats ? "..." : statData.tasksCompleted} background="bg-violet" />
// //                         <StatCard title="Tasks Late" value={loadingStats ? "..." : statData.tasksLate} background="bg-blue" />
// //                         <StatCard title="Total Commits" value={loadingStats ? "..." : statData.totalCommits} background="bg-violet" />
// //                         <StatCard title="Total LOC" value={loadingStats ? "..." : statData.totalLOC} background="bg-blue" />
// //                     </div>
// //                     {/* --- CHARTS GRID --- */}
// //                     {currentGroupId && currentProjectId ? (
// //                         <div className="dashboard-charts">
// //                             <MemberCompletionChart groupId={currentGroupId} />
// //                             <CommitActivityChart
// //                                 projectId={currentProjectId}
// //                                 onRefreshCommits={handleMasterRefresh}
// //                                 isParentRefreshing={isMasterRefreshing}
// //                                 // refreshNonce={refreshNonce}
// //                             />
// //                             <LOCGrowthChart
// //                                 projectId={currentProjectId}
// //                                 onRefreshCommits={handleMasterRefresh}
// //                                 isParentRefreshing={isMasterRefreshing}
// //                                 // refreshNonce={refreshNonce}
// //                             />
// //                             <PeerReviewChart groupId={currentGroupId} />
// //                             <TaskChart groupId={currentGroupId} /* sprintId={selectedSprintIdFromContext} */ /> 
// //                             <LateTasksChart groupId={currentGroupId} /> 
// //                             <SprintPerformanceChart groupId={currentGroupId} />
// //                         </div>
// //                     ) : (
// //                         !loadingGroups && ( // Chỉ hiển thị thông báo này nếu không còn loading groups
// //                             <div style={{ textAlign: 'center', padding: '50px' }}>
// //                                 <p>Select a group to view dashboard details.</p>
// //                             </div>
// //                         )
// //                     )}
// //                 </div>
// //             </div>
// //         </section>
// //     );
// // };

// // export default Dashboard;
// // // --- END OF FILE Dashboard.js ---

// // --- START OF FILE Dashboard.js ---
// import React, { useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import StatCard from './StatCard/StatCard';
// import MemberCompletionChart from './MemberCompletionChart/MemberCompletionChart';
// import CommitActivityChart from './CommitActivityChart/CommitActivityChart';
// import LOCGrowthChart from './LOCGrowthChart/LOCGrowthChart';
// import PeerReviewChart from './PeerReviewChart/PeerReviewChart';
// import TaskChart from './TaskChart/TaskChart';
// import LateTasksChart from './LateTasksChart/LateTasksChart';
// import SprintPerformanceChart from './SprintPerformanceChart/SprintPerformanceChart';
// import './dashboard.css';

// import { Chart as ChartJS } from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// import useDashboardCoreData from '../../hooks/useDashboardCoreData';

// ChartJS.register(ChartDataLabels);
// ChartJS.defaults.set('plugins.datalabels', {
//     display: false,
// });

// const Dashboard = () => {
//     const outletContext = useOutletContext();
//     const selectedSprintIdFromContext = outletContext?.selectedSprintId;
//     const contextUserId = outletContext?.userId;
//     const contextClassId = outletContext?.classId;
//     const contextGroupIdFromUrl = outletContext?.groupId;

//     const {
//         // selectedGroup, // Không cần trực tiếp sử dụng ở đây
//         groups,
//         loadingGroups,
//         // currentUserRole, // Không cần trực tiếp sử dụng ở đây
//         // sprints, // Không cần trực tiếp sử dụng ở đây
//         setSelectedSprintId,
//         statData,
//         loadingStats,
//         isMasterRefreshing, // Được lấy từ hook
//         // refreshNonce, // Được quản lý nội bộ bởi hook, không cần trực tiếp ở đây
//         handleMasterRefresh,
//         currentProjectId,
//         currentGroupId
//     } = useDashboardCoreData(contextUserId, contextClassId, contextGroupIdFromUrl);

//     useEffect(() => {
//         if (setSelectedSprintId && selectedSprintIdFromContext !== undefined) {
//             setSelectedSprintId(selectedSprintIdFromContext);
//         }
//     }, [selectedSprintIdFromContext, setSelectedSprintId]);

//     if (loadingGroups) {
//         return (
//             <section className="dashboard-container">
//                 <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
//                     <p>Loading dashboard data...</p>
//                 </div>
//             </section>
//         );
//     }

//     if (!currentGroupId) {
//         return (
//             <section className="dashboard-container">
//                 <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
//                     {groups.length === 0 ? (
//                         <p>No groups available for this user in this class.</p>
//                     ) : (
//                         <p>Could not determine the current group. Please check the URL or group membership.</p>
//                     )}
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section className="dashboard-container">
//             <div className="dashboard-content">
//                 <div className="dashboard-stats-container">
//                     <div className="dashboard-stats">
//                         <StatCard title="Total Project Tasks" value={loadingStats ? "..." : statData.totalProjectTasks} background="bg-violet" />
//                         <StatCard title="Selected Sprint Tasks" value={loadingStats ? "..." : statData.selectedSprintTasks} background="bg-blue" />
//                         <StatCard title="Tasks Completed" value={loadingStats ? "..." : statData.tasksCompleted} background="bg-violet" />
//                         <StatCard title="Tasks Late" value={loadingStats ? "..." : statData.tasksLate} background="bg-blue" />
//                         <StatCard title="Total Commits" value={loadingStats ? "..." : statData.totalCommits} background="bg-violet" />
//                         <StatCard title="Total LOC" value={loadingStats ? "..." : statData.totalLOC} background="bg-blue" />
//                     </div>
//                     <div className="dashboard-charts">
//                         <MemberCompletionChart groupId={currentGroupId} />
//                         <CommitActivityChart
//                             projectId={currentProjectId}
//                             onRefreshCommits={handleMasterRefresh}
//                             isParentRefreshing={isMasterRefreshing}
//                         // refreshNonce không cần truyền trực tiếp nếu CommitActivityChart không dùng
//                         />
//                         <LOCGrowthChart
//                             projectId={currentProjectId}
//                             onRefreshCommits={handleMasterRefresh}
//                             isParentRefreshing={isMasterRefreshing}
//                         // refreshNonce không cần truyền trực tiếp
//                         />
//                         <PeerReviewChart groupId={currentGroupId} />
//                         <TaskChart groupId={currentGroupId} />
//                         <LateTasksChart groupId={currentGroupId} />
//                         <SprintPerformanceChart groupId={currentGroupId} />
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Dashboard;
// // --- END OF FILE Dashboard.js ---

// --- START OF FILE Dashboard.js ---
import React, { useEffect, useState } from 'react'; // Thêm useState nếu cần state cục bộ
import { useOutletContext, useParams } from 'react-router-dom'; // Thêm useParams
import StatCard from './StatCard/StatCard';
import MemberCompletionChart from './MemberCompletionChart/MemberCompletionChart';
import CommitActivityChart from './CommitActivityChart/CommitActivityChart';
import LOCGrowthChart from './LOCGrowthChart/LOCGrowthChart';
import PeerReviewChart from './PeerReviewChart/PeerReviewChart';
import TaskChart from './TaskChart/TaskChart';
import LateTasksChart from './LateTasksChart/LateTasksChart';
import SprintPerformanceChart from './SprintPerformanceChart/SprintPerformanceChart';
import './dashboard.css';

import { Chart as ChartJS } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import useDashboardCoreData from '../../hooks/useDashboardCoreData';

ChartJS.register(ChartDataLabels);
ChartJS.defaults.set('plugins.datalabels', {
    display: false,
});

const Dashboard = () => {
    const outletContext = useOutletContext();
    const { classId: classIdFromUrl, groupId: groupIdFromUrl } = useParams(); // Lấy classId và groupId từ URL

    // Lấy userId từ localStorage
    // Chú ý: việc lấy trực tiếp từ localStorage trong render có thể không lý tưởng nếu giá trị thay đổi thường xuyên
    // và component không re-render. Tuy nhiên, cho userId (thường không đổi trong 1 session) thì có thể chấp nhận được.
    // Để an toàn hơn, có thể đặt vào state và useEffect nếu giá trị user trong localStorage có thể thay đổi động.
    const [localStorageUserId, setLocalStorageUserId] = useState(null);
    const [userRoleFromLocalStorage, setUserRoleFromLocalStorage] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setLocalStorageUserId(user?.id || null);
        setUserRoleFromLocalStorage(user?.role || null);
    }, []); // Chạy một lần khi component mount

    // selectedSprintId từ context của Outlet (do SV_TeamDetail hoặc GV_GroupDetailOfClass cung cấp)
    const selectedSprintIdFromContext = outletContext?.selectedSprintId;

    const {
        groups,
        loadingGroups,
        setSelectedSprintId,
        statData,
        loadingStats,
        isMasterRefreshing,
        handleMasterRefresh,
        currentProjectId,
        currentGroupId, // Đây là groupId của group đang được hiển thị (từ selectedGroup trong hook)
        currentUserRole
    } = useDashboardCoreData(
        localStorageUserId, // Truyền userId từ localStorage
        classIdFromUrl,     // Truyền classId từ URL params
        groupIdFromUrl      // Truyền groupId từ URL params làm initialGroupId
    );

    useEffect(() => {
        // if (setSelectedSprintId && selectedSprintIdFromContext !== undefined) {
        //     setSelectedSprintId(selectedSprintIdFromContext);
        // }
        if (setSelectedSprintId) {
            if (currentUserRole === 'Instructor' && selectedSprintIdFromContext === undefined) {
                // Nếu là giảng viên và không có sprintId từ context (vì TeamHeader không có selector cho GV),
                // mặc định là xem 'all' sprints (hoặc null, tùy API backend xử lý).
                // Giả sử API /stats?sprintId=all hoặc /stats?sprintId=null sẽ trả về stats toàn project.
                setSelectedSprintId('all'); // Hoặc null
            } else if (selectedSprintIdFromContext !== undefined) {
                // Nếu có sprintId từ context (thường là student), sử dụng nó.
                setSelectedSprintId(selectedSprintIdFromContext);
            }
            // Nếu selectedSprintIdFromContext là undefined và không phải instructor,
            // thì đợi context cập nhật (trường hợp student nhưng sprint chưa load ở parent).
        }
    }, [selectedSprintIdFromContext, setSelectedSprintId, currentUserRole]);

    // Xử lý trường hợp chưa lấy được userId từ localStorage
    if (localStorageUserId === null && !loadingGroups) { // Nếu chưa có userId nhưng không còn loading groups
        return (
            <section className="dashboard-container">
                <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <p>Identifying user...</p> {/* Hoặc thông báo lỗi nếu không thể lấy userId */}
                </div>
            </section>
        );
    }

    if (loadingGroups) {
        return (
            <section className="dashboard-container">
                <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <p>Loading dashboard data...</p>
                </div>
            </section>
        );
    }

    // currentGroupId được trả về từ useDashboardCoreData, nó là ID của group đã được chọn bên trong hook
    // dựa trên groupIdFromUrl
    if (!currentGroupId) {
        const roleForMessage = currentUserRole || userRoleFromLocalStorage;
        return (
            <section className="dashboard-container">
                <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    {groups.length === 0 && localStorageUserId && classIdFromUrl ? (
                        <p>No groups seem to be associated with {roleForMessage === 'Instructor' ? 'your account' : 'this user'} in class {classIdFromUrl}.</p>
                    ) : (
                        <p>Could not display dashboard for the specified group. Please check the URL or group_id ({groupIdFromUrl}) for this class ({classIdFromUrl}).</p>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className="dashboard-container">
            <div className="dashboard-content">
                <div className="dashboard-stats-container">
                    <div className="dashboard-stats">
                        <StatCard title="Total Project Tasks" value={loadingStats ? "..." : statData.totalProjectTasks} background="bg-violet" />
                        <StatCard title="Selected Sprint Tasks" value={loadingStats ? "..." : statData.selectedSprintTasks} background="bg-blue" />
                        <StatCard title="Tasks Completed" value={loadingStats ? "..." : statData.tasksCompleted} background="bg-violet" />
                        <StatCard title="Tasks Late" value={loadingStats ? "..." : statData.tasksLate} background="bg-blue" />
                        <StatCard title="Total Commits" value={loadingStats ? "..." : statData.totalCommits} background="bg-violet" />
                        <StatCard title="Total LOC" value={loadingStats ? "..." : statData.totalLOC} background="bg-blue" />
                    </div>
                    <div className="dashboard-charts">
                        <MemberCompletionChart groupId={currentGroupId} />
                        <CommitActivityChart
                            projectId={currentProjectId}
                            onRefreshCommits={handleMasterRefresh}
                            isParentRefreshing={isMasterRefreshing}
                        />
                        <LOCGrowthChart
                            projectId={currentProjectId}
                            onRefreshCommits={handleMasterRefresh}
                            isParentRefreshing={isMasterRefreshing}
                        />
                        <PeerReviewChart groupId={currentGroupId} />
                        <TaskChart groupId={currentGroupId} />
                        <LateTasksChart groupId={currentGroupId} />
                        <SprintPerformanceChart groupId={currentGroupId} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
// --- END OF FILE Dashboard.js ---