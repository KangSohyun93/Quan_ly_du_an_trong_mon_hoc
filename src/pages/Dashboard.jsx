import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import MemberCompletionChart from '../components/MemberCompletionChart';
import LineChart from '../components/LineChart';
import CommitActivityChart from '../components/CommitActivityChart';
import LOCGrowthChart from '../components/LOCGrowthChart';
import PeerReviewChart from '../components/PeerReviewChart';
import TaskChart from '../components/TaskChart';
import BarChart from '../components/BarChart';
import SprintPerformanceChart from '../components/SprintPerformanceChart';
import '../css/dashboard.css';
import { Chart as ChartJS } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels);

ChartJS.defaults.set('plugins.datalabels', {
    display: false,
});

const avatars = [
    '/assets/images/classes/class1/group1/avatars/member1.svg',
    '/assets/images/classes/class1/group1/avatars/member2.svg',
    '/assets/images/classes/class1/group1/avatars/member3.svg',
];

const Dashboard = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [fixedUserAndClassContext] = useState({ userId: 1, classId: 100001 });

    const [isMasterRefreshing, setIsMasterRefreshing] = useState(false);
    const [refreshNonce, setRefreshNonce] = useState(0);

    useEffect(() => {
        const fetchGroups = async () => {
            setLoadingGroups(true);
            setCurrentUserRole(null);
            try {
                const response = await axios.get(`http://localhost:3000/api/groups?userId=${fixedUserAndClassContext.userId}&classId=${fixedUserAndClassContext.classId}`);

                const fetchedGroups = response.data.groups;
                setCurrentUserRole(response.data.role);
                setGroups(fetchedGroups);

                if (fetchedGroups.length > 0) {
                    const defaultGroup = fetchedGroups.find(g => g.group_id === 1);
                    if (defaultGroup) {
                        setSelectedGroup(defaultGroup);
                    } else {
                        setSelectedGroup(fetchedGroups[0]);
                    }
                } else {
                    setSelectedGroup(null);
                }
            } catch (error) {
                console.error('Error fetching groups:', error);
                setGroups([]);
                setSelectedGroup(null);
                setCurrentUserRole(null);
            }
            setLoadingGroups(false);
        };
        fetchGroups();
    }, [fixedUserAndClassContext]);

    const currentProjectId = selectedGroup?.project_id;
    const currentGroupId = selectedGroup?.group_id;

    const handleMasterRefresh = async () => {
        if (!currentProjectId) {
            console.warn("[Dashboard] No project selected, cannot refresh.");
            return;
        }
        if (isMasterRefreshing) return; // Prevent multiple calls

        setIsMasterRefreshing(true);
        try {
            console.log(`[Dashboard] Triggering master refresh for projectId: ${currentProjectId}`);
            await axios.post(`http://localhost:3000/api/projects/${currentProjectId}/commits/refresh`);
            console.log(`[Dashboard] Master refresh API call completed for projectId: ${currentProjectId}`);
            setRefreshNonce(prev => prev + 1); // Trigger re-fetch in child charts
        } catch (error) {
            console.error(`[Dashboard] Failed to trigger master refresh for projectId ${currentProjectId}:`, error);
            alert("Error refreshing data from source. Please check the console for more details.");
        } finally {
            setIsMasterRefreshing(false);
        }
    };

    if (loadingGroups) {
        return (
            <section className="dashboard-container">
                <div className="dashboard-content" style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <p>Đang tải danh sách nhóm...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="dashboard-container">
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <div className="dashboard-title">
                        <h1 className="project-name">{selectedGroup?.group_name || 'Chưa chọn nhóm'}</h1>
                        <select
                            className="project-select"
                            value={currentGroupId || ''}
                            onChange={(e) => {
                                const groupId = Number(e.target.value);
                                const group = groups.find(g => g.group_id === groupId);
                                setSelectedGroup(group);
                            }}
                            disabled={groups.length === 0 || (currentUserRole === 'Student' && groups.length <= 1)}
                        >
                            {groups.length === 0 ? (
                                <option value="">Không có nhóm nào</option>
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
                                key={index}
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className="member-avatar"
                                style={{ zIndex: index + 1 }}
                            />
                        ))}
                    </div>
                </div>
                {/* Dashboard Controls */}
                <div className="dashboard-controls">
                    <div className="tab-section">
                        <select className="sprint-select">
                            <option>Sprint 4</option>
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
                            <select name="" id="" className="filter">
                                <option value="">Filter</option>
                            </select>
                        </div>
                    </div>
                </div>


                <div className="dashboard-stats-container">
                    <div className="dashboard-stats">
                        <StatCard title="Tổng nhiệm vụ" value="190" background="bg-violet" />
                        <StatCard title="Nhiệm vụ Sprint" value="77" background="bg-blue" />
                        <StatCard title="Hoàn thành" value="153" background="bg-violet" />
                        <StatCard title="Trễ hạn" value="12" background="bg-blue" />
                        <StatCard title="Tổng Commit" value="1200" background="bg-violet" />
                        <StatCard title="Tổng LOC" value="150000" background="bg-blue" />
                    </div>
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
                        <BarChart groupId={currentGroupId} />
                        <SprintPerformanceChart groupId={currentGroupId} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;