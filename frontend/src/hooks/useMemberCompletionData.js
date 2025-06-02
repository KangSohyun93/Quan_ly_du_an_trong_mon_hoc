// src/hooks/useMemberCompletionData.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useMemberCompletionData = (groupId) => {
    const [members, setMembers] = useState([]);
    const [sprintDataForInfo, setSprintDataForInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!groupId) {
            setLoading(false);
            setError("No Group ID provided.");
            setMembers([]);
            setSprintDataForInfo({});
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
            const formattedMembers = (response.data.members || []).map(member => ({
                ...member,
                joinDate: new Date(member.joinDate).toISOString().split('T')[0],
            }));
            setMembers(formattedMembers);
            setSprintDataForInfo(response.data.sprintData || {});
        } catch (err) {
            console.error('Error fetching member data for completion chart:', err);
            setError(err.response?.data?.error || 'Failed to load member data');
            setMembers([]);
            setSprintDataForInfo({});
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { members, sprintDataForInfo, loading, error, refetchData: fetchData };
};

export default useMemberCompletionData;