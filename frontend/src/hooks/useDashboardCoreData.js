import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useDashboardCoreData = (userId, classId, initialGroupIdFromContext) => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState(null);

    const [sprints, setSprints] = useState([]);
    const [selectedSprintId, setSelectedSprintId] = useState(null);
    const [loadingSprints, setLoadingSprints] = useState(false);

    const [statData, setStatData] = useState({
        totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
        tasksLate: 0, totalCommits: 0, totalLOC: 0,
    });
    const [loadingStats, setLoadingStats] = useState(false);

    const [isMasterRefreshing, setIsMasterRefreshing] = useState(false);
    const [refreshNonce, setRefreshNonce] = useState(0);

    useEffect(() => {
        // Kiểm tra nếu các ID cần thiết không được cung cấp
        if (!userId || !classId) {
            setLoadingGroups(false);
            setGroups([]);
            setSelectedGroup(null);
            setCurrentUserRole(null);
            console.warn("[useDashboardCoreData] userId or classId is missing. Dashboard data might be incomplete.");
            // Không return ở đây nữa để cho phép component Dashboard xử lý việc thiếu ID nếu cần
            // Tuy nhiên, nếu thiếu thì API call sẽ thất bại hoặc không được gọi.
        }

        let isMounted = true;
        const fetchInitialData = async () => {
            // Chỉ fetch nếu có userId và classId
            if (!userId || !classId) {
                setLoadingGroups(false); // Đảm bảo loading kết thúc
                return;
            }

            if (!isMounted) return;
            setLoadingGroups(true);
            setGroups([]);
            setSelectedGroup(null);
            setCurrentUserRole(null);

            try {
                const response = await axios.get(`http://localhost:5000/api/groups?userId=${userId}&classId=${classId}`);
                if (!isMounted) return;

                const fetchedGroups = response.data.groups || [];
                const role = response.data.role;

                setGroups(fetchedGroups);
                setCurrentUserRole(role);

                if (fetchedGroups.length > 0) {
                    let groupToSelect = null;
                    if (initialGroupIdFromContext) {
                        groupToSelect = fetchedGroups.find(g => g.group_id === Number(initialGroupIdFromContext));
                        if (!groupToSelect) {
                            console.warn(`[useDashboardCoreData] Initial group ID ${initialGroupIdFromContext} not found in fetched groups. Selecting first available group.`);
                            console.warn(`[useDashboardCoreData] Instructor view: Initial group ID ${initialGroupIdFromContext} provided via URL was not found in the list of groups fetched for instructor ${userId} in class ${classId}. This might indicate a permission issue or incorrect group ID for this context.`);
                            groupToSelect = fetchedGroups[0];
                        }
                    } else if (fetchedGroups.length > 0) {
                        // groupToSelect = fetchedGroups[0];
                        console.log("[useDashboardCoreData] No initialGroupIdFromContext, selected first available group.");
                    }
                    setSelectedGroup(groupToSelect);
                } else {
                    console.warn(`[useDashboardCoreData] Instructor view: No groups fetched for instructor ${userId} in class ${classId}.`);
                    setSelectedGroup(null);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching groups:', error);
                    setGroups([]);
                    setSelectedGroup(null);
                    setCurrentUserRole(null);
                }
            } finally {
                if (isMounted) {
                    setLoadingGroups(false);
                }
            }
        };

        fetchInitialData();
        return () => { isMounted = false; };

    }, [userId, classId, initialGroupIdFromContext]);

    const currentGroupId = selectedGroup?.group_id;
    const currentProjectId = selectedGroup?.project_id;

    useEffect(() => {
        if (currentGroupId) {
            setLoadingSprints(true);
            axios.get(`http://localhost:5000/api/groups/${currentGroupId}/sprints`)
                .then(response => {
                    const fetchedSprints = response.data || [];
                    setSprints(fetchedSprints);
                })
                .catch(error => {
                    console.error('Error fetching sprints:', error);
                    setSprints([]);
                })
                .finally(() => setLoadingSprints(false));
        } else {
            setSprints([]);
            setLoadingSprints(false);
        }
    }, [currentGroupId]);

    const fetchStats = useCallback(async () => {
        if (currentGroupId && selectedSprintId !== undefined) {
            setLoadingStats(true);
            try {
                const sprintParam = selectedSprintId === null ? 'all' : selectedSprintId;
                // const response = await axios.get(`http://localhost:5000/api/groups/${currentGroupId}/stats?sprintId=${selectedSprintId}`);
                // setStatData(response.data || {
                //     totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
                //     tasksLate: 0, totalCommits: 0, totalLOC: 0,
                // });
                const response = await axios.get(`http://localhost:5000/api/groups/${currentGroupId}/stats?sprintId=${sprintParam}`);
                setStatData(response.data || {
                    totalProjectTasks: 0, selectedSprintTasks: 0, tasksCompleted: 0,
                    tasksLate: 0, totalCommits: 0, totalLOC: 0,
                });
            } catch (error) {
                console.error(`Error fetching stats for group ${currentGroupId} with sprint ${selectedSprintId}:`, error);
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
    }, [currentGroupId, selectedSprintId]);

    useEffect(() => {
        if (selectedSprintId !== undefined && currentGroupId) {
             fetchStats();
        } else if (selectedSprintId === undefined && currentGroupId) {
        
        }
    }, [fetchStats, refreshNonce]);

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
            setRefreshNonce(prev => prev + 1);
        } catch (error) {
            console.error(`[useDashboardCoreData] Failed to trigger master refresh for projectId ${currentProjectId}:`, error);
            alert("Error refreshing data from source. Please check the console.");
        } finally {
            setIsMasterRefreshing(false);
        }
    }, [currentProjectId, isMasterRefreshing]);

    return {
        selectedGroup,
        groups,
        loadingGroups,
        currentUserRole,
        sprints,
        selectedSprintId,
        setSelectedSprintId,
        loadingSprints,
        statData,
        loadingStats,
        isMasterRefreshing,
        refreshNonce,
        handleMasterRefresh,
        currentProjectId,
        currentGroupId
    };
};

export default useDashboardCoreData;
// --- END OF FILE useDashboardCoreData.js ---