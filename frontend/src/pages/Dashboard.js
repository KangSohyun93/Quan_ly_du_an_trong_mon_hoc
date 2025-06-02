import React from 'react'; // Bỏ useState, useEffect nếu hook quản lý
import StatCard from '../components/dashboard/StatCard/StatCard';
import MemberCompletionChart from '../components/dashboard/MemberCompletionChart/MemberCompletionChart';
import CommitActivityChart from '../components/dashboard/CommitActivityChart/CommitActivityChart';
import LOCGrowthChart from '../components/dashboard/LOCGrowthChart/LOCGrowthChart';
import PeerReviewChart from '../components/dashboard/PeerReviewChart/PeerReviewChart';
import TaskChart from '../components/dashboard/TaskChart/TaskChart';
import BarChart from '../components/dashboard/LateTasksChart/LateTasksChart'; // Component này có tên BarChart trong file gốc
import SprintPerformanceChart from '../components/dashboard/SprintPerformanceChart/SprintPerformanceChart';
import './dashboard.css'; // Đảm bảo đường dẫn CSS đúng

import { Chart as ChartJS } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import useDashboardCoreData from '../hooks/useDashboardCoreData'; // Đường dẫn đúng

ChartJS.register(ChartDataLabels);
ChartJS.defaults.set('plugins.datalabels', {
    display: false,
});

const avatars = [ // Giữ lại hoặc lấy từ API/state nếu cần
    '/assets/images/classes/class1/group1/avatars/member1.svg',
    '/assets/images/classes/class1/group1/avatars/member2.svg',
    '/assets/images/classes/class1/group1/avatars/member3.svg',
];

const Dashboard = () => {
    const {
        selectedGroup,
        setSelectedGroup, // Giờ đây là hàm handleGroupChange
        groups,
        loadingGroups,
        currentUserRole,
        sprints,
        selectedSprintId,
        setSelectedSprintId,
        // loadingSprints, // Có thể dùng để hiển thị trạng thái loading cho dropdown sprint
        statData,
        loadingStats,
        isMasterRefreshing,
        refreshNonce,
        handleMasterRefresh,
        currentProjectId,
        currentGroupId
    } = useDashboardCoreData();

    if (loadingGroups) {
        return (
            <section className="dashboard-container">
                <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <p>Loading group list...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="dashboard-container">
            <div className="dashboard-content">
                {/* --- DASHBOARD HEADER --- */}
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1 className="project-name">{selectedGroup?.group_name || 'No Group Selected'}</h1>
                        <select
                            className="project-select"
                            value={currentGroupId || ''}
                            onChange={(e) => setSelectedGroup(e.target.value)} // Gọi hàm từ hook
                            disabled={groups.length === 0 || (currentUserRole === 'Student' && groups.length <= 1)}
                        >
                            {groups.length === 0 ? (
                                <option value="">No groups available</option>
                            ) : (
                                groups.map(group => (
                                    <option key={group.group_id} value={group.group_id}>
                                        {group.group_name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="vertical-line"></div>
                    <div className="project-members">
                        {avatars.map((avatar, index) => (
                            <img
                                key={index} src={avatar} alt={`Avatar ${index + 1}`}
                                className="member-avatar" style={{ zIndex: index + 1 }}
                            />
                        ))}
                    </div>
                </div>

                {/* --- DASHBOARD CONTROLS --- */}
                <div className="dashboard-controls">
                    <div className="tab-section">
                        <select
                            className="sprint-select"
                            value={selectedSprintId}
                            onChange={(e) => setSelectedSprintId(e.target.value)}
                            disabled={!sprints || sprints.length === 0}
                        >
                            <option value="all">All Sprints (Project)</option>
                            {sprints.map(sprint => (
                                <option key={sprint.id} value={sprint.id}>
                                    {sprint.name}
                                </option>
                            ))}
                        </select>
                        <div className="vertical-line"></div>
                        <div className="dashboard-btn-container">
                            <i className="fa-solid fa-house"></i>
                            <button className="dashboard-btn">Introduce</button>
                        </div>
                        <div className="dashboard-btn-container dashboard-btn-active">
                            <i className="fa-solid fa-chart-line"></i>
                            <button className="dashboard-btn">Dashboard</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i className="fa-solid fa-list-check"></i>
                            <button className="dashboard-btn">Team task</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i className="fa-solid fa-list"></i>
                            <button className="dashboard-btn">My task</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i className="fa-solid fa-calendar-day"></i>
                            <button className="dashboard-btn">Roadmap</button>
                        </div>
                        <div className="dashboard-btn-container">
                            <i className="rate-icon fa-solid fa-star"></i>
                            <button className="dashboard-btn">Rate</button>
                        </div>
                    </div>
                    <div className="control-section">
                        <div className="dashboard-btn-container">
                            <i className="filter-icon fa-solid fa-filter"></i>
                            <select name="" id="" className="filter"><option value="">Filter</option></select>
                        </div>
                    </div>
                </div>

                {/* --- STATS CONTAINER --- */}
                <div className="dashboard-stats-container">
                    <div className="dashboard-stats">
                        <StatCard title="Total Project Tasks" value={loadingStats ? "..." : statData.totalProjectTasks} background="bg-violet" />
                        <StatCard title="Selected Sprint Tasks" value={loadingStats ? "..." : statData.selectedSprintTasks} background="bg-blue" />
                        <StatCard title="Tasks Completed" value={loadingStats ? "..." : statData.tasksCompleted} background="bg-violet" />
                        <StatCard title="Tasks Late" value={loadingStats ? "..." : statData.tasksLate} background="bg-blue" />
                        <StatCard title="Total Commits" value={loadingStats ? "..." : statData.totalCommits} background="bg-violet" />
                        <StatCard title="Total LOC" value={loadingStats ? "..." : statData.totalLOC} background="bg-blue" />
                    </div>
                    {/* --- CHARTS GRID --- */}
                    {currentGroupId && currentProjectId ? ( // Chỉ render chart khi có group/project được chọn
                        <div className="dashboard-charts">
                            <MemberCompletionChart groupId={currentGroupId} />
                            <CommitActivityChart
                                projectId={currentProjectId}
                                onRefreshCommits={handleMasterRefresh}
                                isParentRefreshing={isMasterRefreshing}
                                refreshNonce={refreshNonce}
                            />
                            <LOCGrowthChart
                                projectId={currentProjectId}
                                onRefreshCommits={handleMasterRefresh}
                                isParentRefreshing={isMasterRefreshing}
                                refreshNonce={refreshNonce}
                            />
                            <PeerReviewChart groupId={currentGroupId} />
                            <TaskChart groupId={currentGroupId} />
                            <BarChart groupId={currentGroupId} /> {/* Component LateTasksChart */}
                            <SprintPerformanceChart groupId={currentGroupId} />
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <p>{!loadingGroups && groups.length > 0 ? "Select a group to view details." : "No groups available to display dashboard."}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Dashboard;