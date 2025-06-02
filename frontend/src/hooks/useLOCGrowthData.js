import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, getISOWeek, startOfWeek, endOfWeek, eachWeekOfInterval, parseISO, isAfter } from 'date-fns';

const processRawLOCData = (locData, projectStartDate, projectEndDate, currentSelectedUser) => {
    if (!locData || locData.length === 0) {
        return { formattedWeeklyActivity: [], usersInLOC: [] };
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
                total_added: 0, total_removed: 0, users: {},
                startDate: format(weekDate, 'dd/MM'),
                endDate: format(endOfWeek(weekDate, { weekStartsOn: 1 }), 'dd/MM/yyyy')
            };
        });
    }

    const currentSelectedUserIdNum = currentSelectedUser === 'all' ? null : parseInt(currentSelectedUser, 10);

    locData.forEach(entry => {
        const commitDate = parseISO(entry.date);
        const weekKey = `${format(commitDate, 'yyyy')}-W${String(getISOWeek(commitDate)).padStart(2, '0')}`;

        if (activityByWeek[weekKey]) {
            if (!activityByWeek[weekKey].users[entry.user_id]) {
                activityByWeek[weekKey].users[entry.user_id] = { added: 0, removed: 0, username: entry.username };
            }
            activityByWeek[weekKey].users[entry.user_id].added += entry.lines_added;
            activityByWeek[weekKey].users[entry.user_id].removed += entry.lines_removed;

            if (currentSelectedUser === 'all' || entry.user_id === currentSelectedUserIdNum) {
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

    const usersInLOC = locData.reduce((acc, entry) => {
        if (entry.user_id && !acc.find(u => u.user_id === entry.user_id)) {
            acc.push({ user_id: entry.user_id, username: entry.username });
        }
        return acc;
    }, []).sort((a, b) => a.username.localeCompare(b.username));

    return { formattedWeeklyActivity, usersInLOC };
};


const useLOCGrowthData = (projectId, initialSelectedUser = 'all', refreshNonce) => {
    const [weeklyLOCActivity, setWeeklyLOCActivity] = useState([]);
    const [selectedUser, setSelectedUser] = useState(initialSelectedUser);
    const [projectUsers, setProjectUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const fetchDataInternal = useCallback(async (isTriggeredByRefreshNonce = false) => {
        if (!projectId) {
            setWeeklyLOCActivity([]);
            if (!isTriggeredByRefreshNonce || projectUsers.length === 0) setProjectUsers([]);
            setLoading(false);
            if (isTriggeredByRefreshNonce) setIsFetchingData(false);
            return;
        }

        if (isTriggeredByRefreshNonce) setIsFetchingData(true); else setLoading(true);
        setError(null);
        if (!isTriggeredByRefreshNonce) {
            setWeeklyLOCActivity([]);
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/loc_summary`);
            const { locData, projectStartDate, projectEndDate } = response.data;

            if (!locData || locData.length === 0) {
                setWeeklyLOCActivity([]);
                if (!isTriggeredByRefreshNonce || projectUsers.length === 0) setProjectUsers([]);
                if (isTriggeredByRefreshNonce) setIsFetchingData(false); else setLoading(false);
                return;
            }

            const { formattedWeeklyActivity, usersInLOC } = processRawLOCData(locData, projectStartDate, projectEndDate, selectedUser);
            setWeeklyLOCActivity(formattedWeeklyActivity);

            if (projectUsers.length === 0 || !isTriggeredByRefreshNonce) {
                setProjectUsers(usersInLOC);
            }

        } catch (err) {
            console.error('[useLOCGrowthData] Error fetching LOC data:', err);
            setError('Could not load LOC data.');
            if (!isTriggeredByRefreshNonce) {
                setWeeklyLOCActivity([]);
                setProjectUsers([]);
            }
        } finally {
            if (isTriggeredByRefreshNonce) setIsFetchingData(false); else setLoading(false);
        }
    }, [projectId, selectedUser, projectUsers.length]);

    useEffect(() => {
        fetchDataInternal(false);
    }, [projectId, selectedUser, fetchDataInternal]);

    useEffect(() => {
        if (projectId && refreshNonce > 0) {
            fetchDataInternal(true);
        }
    }, [projectId, refreshNonce, fetchDataInternal]);

    return { weeklyLOCActivity, projectUsers, selectedUser, setSelectedUser, loading, error, isFetchingData };
};

export default useLOCGrowthData;