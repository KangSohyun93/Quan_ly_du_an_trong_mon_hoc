// src/hooks/useDashboardCoreData.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Giả sử bạn có fixedUserAndClassContext ở đâu đó hoặc truyền vào
const FIXED_USER_AND_CLASS_CONTEXT = { userId: 1, classId: 100001 };

const useDashboardCoreData = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState(null);

    const [sprints, setSprints] = useState([]);
    const [selectedSprintId, setSelectedSprintId] = useState('all');
    const [loadingSprints, setLoadingSprints] = useState(false);

    const [statData, setStatData] = useState({
        totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
        tasksLate: 0, totalCommits: 0, totalLOC: 0,
    });
    const [loadingStats, setLoadingStats] = useState(false);

    const [isMasterRefreshing, setIsMasterRefreshing] = useState(false);
    const [refreshNonce, setRefreshNonce] = useState(0);

    // Fetch groups and user role
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoadingGroups(true);
            setCurrentUserRole(null);
            try {
                const response = await axios.get(`http://localhost:5000/api/groups?userId=${FIXED_USER_AND_CLASS_CONTEXT.userId}&classId=${FIXED_USER_AND_CLASS_CONTEXT.classId}`);
                const fetchedGroups = response.data.groups || [];
                setCurrentUserRole(response.data.role);
                setGroups(fetchedGroups);

                if (fetchedGroups.length > 0) {
                    // Cố gắng tìm group_id === 1 làm mặc định, nếu không thì lấy group đầu tiên
                    const defaultGroup = fetchedGroups.find(g => g.group_id === 1) || fetchedGroups[0];
                    setSelectedGroup(defaultGroup);
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
        fetchInitialData();
    }, []); // Chỉ chạy một lần khi mount

    const currentGroupId = selectedGroup?.group_id;
    const currentProjectId = selectedGroup?.project_id;

    // Fetch sprints when selectedGroup (currentGroupId) changes
    useEffect(() => {
        if (currentGroupId) {
            setLoadingSprints(true);
            axios.get(`http://localhost:5000/api/groups/${currentGroupId}/sprints`)
                .then(response => {
                    const fetchedSprints = response.data || [];
                    setSprints(fetchedSprints);
                    if (fetchedSprints.length > 0) {
                        const now = new Date();
                        const currentOrUpcomingSprint =
                            fetchedSprints.find(s => new Date(s.endDate) >= now && new Date(s.startDate) <= now) ||
                            fetchedSprints.find(s => new Date(s.startDate) > now) ||
                            (fetchedSprints.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)))[0];
                        setSelectedSprintId(currentOrUpcomingSprint ? currentOrUpcomingSprint.id : 'all');
                    } else {
                        setSelectedSprintId('all');
                    }
                })
                .catch(error => {
                    console.error('Error fetching sprints:', error);
                    setSprints([]);
                    setSelectedSprintId('all');
                })
                .finally(() => setLoadingSprints(false));
        } else {
            setSprints([]);
            setSelectedSprintId('all');
            setLoadingSprints(false);
        }
    }, [currentGroupId]);

    // Fetch stats when selectedGroup (currentGroupId), selectedSprintId, or refreshNonce changes
    const fetchStats = useCallback(async () => {
        if (currentGroupId) {
            setLoadingStats(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${currentGroupId}/stats?sprintId=${selectedSprintId}`);
                setStatData(response.data || {
                    totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
                    tasksLate: 0, totalCommits: 0, totalLOC: 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
                setStatData({
                    totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
                    tasksLate: 0, totalCommits: 0, totalLOC: 0,
                });
            } finally {
                setLoadingStats(false);
            }
        } else {
            setStatData({
                totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
                tasksLate: 0, totalCommits: 0, totalLOC: 0,
            });
            setLoadingStats(false);
        }
    }, [currentGroupId, selectedSprintId]); // Không cần refreshNonce ở đây, sẽ gọi fetchStats khi nonce thay đổi

    useEffect(() => {
        fetchStats();
    }, [fetchStats, refreshNonce]); // Gọi fetchStats khi hàm thay đổi hoặc nonce thay đổi

    // Master refresh logic
    const handleMasterRefresh = useCallback(async () => {
        if (!currentProjectId) {
            console.warn("[useDashboardCoreData] No project selected, cannot refresh.");
            return;
        }
        if (isMasterRefreshing) return;

        setIsMasterRefreshing(true);
        try {
            console.log(`[useDashboardCoreData] Triggering master refresh for projectId: ${currentProjectId}`);
            await axios.post(`http://localhost:5000/api/projects/${currentProjectId}/commits/refresh`);
            console.log(`[useDashboardCoreData] Master refresh API call completed for projectId: ${currentProjectId}`);
            setRefreshNonce(prev => prev + 1); // Đây sẽ trigger useEffect gọi fetchStats
        } catch (error) {
            console.error(`[useDashboardCoreData] Failed to trigger master refresh for projectId ${currentProjectId}:`, error);
            alert("Error refreshing data from source. Please check the console."); // Có thể thay alert bằng một cơ chế thông báo tốt hơn
        } finally {
            setIsMasterRefreshing(false);
        }
    }, [currentProjectId, isMasterRefreshing]);


    const handleGroupChange = useCallback((newGroupId) => {
        const group = groups.find(g => g.group_id === Number(newGroupId));
        setSelectedGroup(group || null);
    }, [groups]);

    return {
        selectedGroup,
        setSelectedGroup: handleGroupChange, // Thay vì trả về setSelectedGroup trực tiếp
        groups,
        loadingGroups,
        currentUserRole,
        sprints,
        selectedSprintId,
        setSelectedSprintId,
        loadingSprints, // Thêm state này
        statData,
        loadingStats,
        isMasterRefreshing,
        refreshNonce,
        handleMasterRefresh,
        currentProjectId, // Trả về để các chart con sử dụng
        currentGroupId    // Trả về để các chart con sử dụng
    };
};

export default useDashboardCoreData;