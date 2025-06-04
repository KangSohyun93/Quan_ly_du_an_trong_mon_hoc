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