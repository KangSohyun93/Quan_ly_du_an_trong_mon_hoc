// import React, { useEffect, useState } from 'react'; // Thêm useState nếu cần state cục bộ
// import { useOutletContext, useParams } from 'react-router-dom'; // Thêm useParams
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
//     const { classId: classIdFromUrl, groupId: groupIdFromUrl } = useParams(); // Lấy classId và groupId từ URL

//     // Lấy userId từ localStorage
//     // Chú ý: việc lấy trực tiếp từ localStorage trong render có thể không lý tưởng nếu giá trị thay đổi thường xuyên
//     // và component không re-render. Tuy nhiên, cho userId (thường không đổi trong 1 session) thì có thể chấp nhận được.
//     // Để an toàn hơn, có thể đặt vào state và useEffect nếu giá trị user trong localStorage có thể thay đổi động.
//     const [localStorageUserId, setLocalStorageUserId] = useState(null);
//     const [userRoleFromLocalStorage, setUserRoleFromLocalStorage] = useState(null);

//     useEffect(() => {
//         const user = JSON.parse(localStorage.getItem("user"));
//         setLocalStorageUserId(user?.id || null);
//         setUserRoleFromLocalStorage(user?.role || null);
//     }, []); // Chạy một lần khi component mount

//     // selectedSprintId từ context của Outlet (do SV_TeamDetail hoặc GV_GroupDetailOfClass cung cấp)
//     const selectedSprintIdFromContext = outletContext?.selectedSprintId;

//     const {
//         groups,
//         loadingGroups,
//         setSelectedSprintId,
//         statData,
//         loadingStats,
//         isMasterRefreshing,
//         handleMasterRefresh,
//         currentProjectId,
//         currentGroupId, // Đây là groupId của group đang được hiển thị (từ selectedGroup trong hook)
//         currentUserRole
//     } = useDashboardCoreData(
//         localStorageUserId, // Truyền userId từ localStorage
//         classIdFromUrl,     // Truyền classId từ URL params
//         groupIdFromUrl      // Truyền groupId từ URL params làm initialGroupId
//     );

//     useEffect(() => {
//         // if (setSelectedSprintId && selectedSprintIdFromContext !== undefined) {
//         //     setSelectedSprintId(selectedSprintIdFromContext);
//         // }
//         if (setSelectedSprintId) {
//             if (currentUserRole === 'Instructor' && selectedSprintIdFromContext === undefined) {
//                 // Nếu là giảng viên và không có sprintId từ context (vì TeamHeader không có selector cho GV),
//                 // mặc định là xem 'all' sprints (hoặc null, tùy API backend xử lý).
//                 // Giả sử API /stats?sprintId=all hoặc /stats?sprintId=null sẽ trả về stats toàn project.
//                 setSelectedSprintId('all'); // Hoặc null
//             } else if (selectedSprintIdFromContext !== undefined) {
//                 // Nếu có sprintId từ context (thường là student), sử dụng nó.
//                 setSelectedSprintId(selectedSprintIdFromContext);
//             }
//             // Nếu selectedSprintIdFromContext là undefined và không phải instructor,
//             // thì đợi context cập nhật (trường hợp student nhưng sprint chưa load ở parent).
//         }
//     }, [selectedSprintIdFromContext, setSelectedSprintId, currentUserRole]);

//     // Xử lý trường hợp chưa lấy được userId từ localStorage
//     if (localStorageUserId === null && !loadingGroups) { // Nếu chưa có userId nhưng không còn loading groups
//         return (
//             <section className="dashboard-container">
//                 <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
//                     <p>Identifying user...</p> {/* Hoặc thông báo lỗi nếu không thể lấy userId */}
//                 </div>
//             </section>
//         );
//     }

//     if (loadingGroups) {
//         return (
//             <section className="dashboard-container">
//                 <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
//                     <p>Loading dashboard data...</p>
//                 </div>
//             </section>
//         );
//     }

//     // currentGroupId được trả về từ useDashboardCoreData, nó là ID của group đã được chọn bên trong hook
//     // dựa trên groupIdFromUrl
//     if (!currentGroupId) {
//         const roleForMessage = currentUserRole || userRoleFromLocalStorage;
//         return (
//             <section className="dashboard-container">
//                 <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
//                     {groups.length === 0 && localStorageUserId && classIdFromUrl ? (
//                         <p>No groups seem to be associated with {roleForMessage === 'Instructor' ? 'your account' : 'this user'} in class {classIdFromUrl}.</p>
//                     ) : (
//                         <p>Could not display dashboard for the specified group. Please check the URL or group_id ({groupIdFromUrl}) for this class ({classIdFromUrl}).</p>
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
//                         />
//                         <LOCGrowthChart
//                             projectId={currentProjectId}
//                             onRefreshCommits={handleMasterRefresh}
//                             isParentRefreshing={isMasterRefreshing}
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

import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
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

// Import new components
import InstructorEvaluationButton from './InstructorEvaluation/InstructorEvaluationButton';
import InstructorEvaluationPopup from './InstructorEvaluation/InstructorEvaluationPopup';


ChartJS.register(ChartDataLabels);
ChartJS.defaults.set('plugins.datalabels', {
    display: false,
});

const Dashboard = () => {
    const outletContext = useOutletContext();
    const { classId: classIdFromUrl, groupId: groupIdFromUrl } = useParams();

    const [localStorageUserId, setLocalStorageUserId] = useState(null);
    const [userRoleFromLocalStorage, setUserRoleFromLocalStorage] = useState(null);

    // State for Instructor Evaluation Popup
    const [isEvaluationPopupOpen, setIsEvaluationPopupOpen] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setLocalStorageUserId(user?.id || null);
        setUserRoleFromLocalStorage(user?.role || null);
    }, []);

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
        currentGroupId,
        currentUserRole // This comes from useDashboardCoreData, preferred over localStorage directly
    } = useDashboardCoreData(
        localStorageUserId,
        classIdFromUrl,
        groupIdFromUrl
    );

    useEffect(() => {
        if (setSelectedSprintId) {
            // Use currentUserRole from the hook as it's more reactive
            const roleToUse = currentUserRole || userRoleFromLocalStorage;
            if (roleToUse === 'Instructor' && selectedSprintIdFromContext === undefined) {
                setSelectedSprintId('all');
            } else if (selectedSprintIdFromContext !== undefined) {
                setSelectedSprintId(selectedSprintIdFromContext);
            }
        }
    }, [selectedSprintIdFromContext, setSelectedSprintId, currentUserRole, userRoleFromLocalStorage]);


    // Determine the role to use for UI elements, prioritizing hook's value
    const displayUserRole = currentUserRole || userRoleFromLocalStorage;

    if (localStorageUserId === null && !loadingGroups) {
        return (
            <section className="dashboard-container">
                <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <p>Identifying user...</p>
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

    if (!currentGroupId) {
        const roleForMessage = displayUserRole;
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

            {/* Add Instructor Evaluation Button and Popup */}
            {currentGroupId && currentProjectId && displayUserRole && (
                <>
                    <InstructorEvaluationButton
                        onClick={() => setIsEvaluationPopupOpen(true)}
                        userRole={displayUserRole}
                    />
                    <InstructorEvaluationPopup
                        isOpen={isEvaluationPopupOpen}
                        onClose={() => setIsEvaluationPopupOpen(false)}
                        groupId={currentGroupId}
                        projectId={currentProjectId}
                        userRole={displayUserRole}
                        loggedInUserId={localStorageUserId} // The ID of the user viewing the dashboard
                    />
                </>
            )}
        </section>
    );
};

export default Dashboard;