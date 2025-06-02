// src/hooks/useCommitActivity.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, getISOWeek, startOfWeek, endOfWeek, eachWeekOfInterval, parseISO, isAfter } from 'date-fns';

const processRawCommitData = (commits, projectStartDate, projectEndDate, currentSelectedUser) => {
    // ... (Copy toàn bộ logic xử lý commits thành activityByWeek và formattedWeeklyActivity từ fetchData)
    // ... (Đảm bảo truyền currentSelectedUser (đã parse) vào đây nếu cần lọc sớm)
    // Trả về { formattedWeeklyActivity, usersInCommits (nếu cần cho projectUsers) }
    if (!commits || commits.length === 0) {
        return { formattedWeeklyActivity: [], usersInCommits: [] };
    }

    const firstCommitDate = parseISO(commits[0].date);
    const lastCommitDate = parseISO(commits[commits.length - 1].date);

    const pStartDate = projectStartDate ? parseISO(projectStartDate) : firstCommitDate;
    let pEndDateEffective;
    if (projectEndDate) {
        pEndDateEffective = parseISO(projectEndDate);
    } else {
        pEndDateEffective = isAfter(lastCommitDate, new Date()) ? lastCommitDate : new Date();
    }
    if (pEndDateEffective < pStartDate) pEndDateEffective = pStartDate;

    const overallStartDate = startOfWeek(pStartDate, { weekStartsOn: 1 });
    const overallEndDate = endOfWeek(pEndDateEffective, { weekStartsOn: 1 });

    const activityByWeek = {};
    if (overallStartDate <= overallEndDate) {
        const weeksInProject = eachWeekOfInterval(
            { start: overallStartDate, end: overallEndDate }, { weekStartsOn: 1 }
        );
        weeksInProject.forEach(weekDate => {
            const weekKey = `${format(weekDate, 'yyyy')}-W${String(getISOWeek(weekDate)).padStart(2, '0')}`;
            activityByWeek[weekKey] = {
                total: 0, users: {},
                startDate: format(weekDate, 'dd/MM'),
                endDate: format(endOfWeek(weekDate, { weekStartsOn: 1 }), 'dd/MM/yyyy')
            };
        });
    }

    const currentSelectedUserIdNum = currentSelectedUser === 'all' ? null : parseInt(currentSelectedUser, 10);

    commits.forEach(commit => {
        if (currentSelectedUser === 'all' || commit.user_id === currentSelectedUserIdNum) {
            const commitDate = parseISO(commit.date);
            const weekKey = `${format(commitDate, 'yyyy')}-W${String(getISOWeek(commitDate)).padStart(2, '0')}`;
            if (activityByWeek[weekKey]) {
                activityByWeek[weekKey].total += 1;
                if (!activityByWeek[weekKey].users[commit.user_id]) {
                    activityByWeek[weekKey].users[commit.user_id] = { count: 0, username: commit.username };
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

    const usersInCommits = commits.reduce((acc, commit) => {
        if (commit.user_id && !acc.find(u => u.user_id === commit.user_id)) {
            acc.push({ user_id: commit.user_id, username: commit.username });
        }
        return acc;
    }, []).sort((a, b) => a.username.localeCompare(b.username));

    return { formattedWeeklyActivity, usersInCommits };
};


const useCommitActivity = (projectId, initialSelectedUser = 'all', refreshNonce) => {
    const [weeklyActivity, setWeeklyActivity] = useState([]);
    const [selectedUser, setSelectedUser] = useState(initialSelectedUser); // State cho user được chọn
    const [projectUsers, setProjectUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const fetchDataInternal = useCallback(async (isTriggeredByRefreshNonce = false) => {
        if (!projectId) {
            setWeeklyActivity([]);
            // Không reset projectUsers nếu là refreshNonce và đã có users, để dropdown không bị trống
            if (!isTriggeredByRefreshNonce || projectUsers.length === 0) setProjectUsers([]);
            setLoading(false);
            if (isTriggeredByRefreshNonce) setIsFetchingData(false);
            return;
        }

        if (isTriggeredByRefreshNonce) setIsFetchingData(true); else setLoading(true);
        setError(null);
        if (!isTriggeredByRefreshNonce) { // Chỉ reset activity khi không phải là refresh do nonce
            setWeeklyActivity([]);
        }


        try {
            const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/commits`);
            const { commits, projectStartDate, projectEndDate } = response.data;

            if (!commits || commits.length === 0) {
                setWeeklyActivity([]);
                if (!isTriggeredByRefreshNonce || projectUsers.length === 0) setProjectUsers([]);
                if (isTriggeredByRefreshNonce) setIsFetchingData(false); else setLoading(false);
                return;
            }

            // Xử lý dữ liệu
            const { formattedWeeklyActivity, usersInCommits } = processRawCommitData(commits, projectStartDate, projectEndDate, selectedUser);
            setWeeklyActivity(formattedWeeklyActivity);

            // Cập nhật projectUsers chỉ khi cần (lần đầu hoặc không phải refresh nonce)
            if (projectUsers.length === 0 || !isTriggeredByRefreshNonce) {
                setProjectUsers(usersInCommits);
            }

        } catch (err) {
            console.error('[useCommitActivity] Error fetching commit activity:', err);
            setError('Could not load commit activity data.');
            if (!isTriggeredByRefreshNonce) {
                setWeeklyActivity([]);
                setProjectUsers([]);
            }
        } finally {
            if (isTriggeredByRefreshNonce) setIsFetchingData(false); else setLoading(false);
        }
    }, [projectId, selectedUser, projectUsers.length]); // Thêm projectUsers.length để cập nhật nếu nó rỗng

    useEffect(() => {
        fetchDataInternal(false); // Fetch khi projectId hoặc selectedUser thay đổi
    }, [projectId, selectedUser, fetchDataInternal]);

    useEffect(() => {
        if (projectId && refreshNonce > 0) {
            fetchDataInternal(true); // Re-fetch khi refreshNonce thay đổi
        }
    }, [projectId, refreshNonce, fetchDataInternal]);

    return { weeklyActivity, projectUsers, selectedUser, setSelectedUser, loading, error, isFetchingData };
};

export default useCommitActivity;