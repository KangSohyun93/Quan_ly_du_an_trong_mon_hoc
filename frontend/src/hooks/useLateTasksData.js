// src/hooks/useLateTasksData.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useLateTasksData = (groupId) => {
    const [sprintData, setSprintData] = useState({});
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!groupId) {
            setLoading(false);
            setError("No Group ID provided.");
            setMembers([]);
            setSprintData({});
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
            const { members: fetchedMembers, sprintData: fetchedSprintData } = response.data;
            setMembers(fetchedMembers || []); // Đảm bảo là mảng nếu fetchedMembers là null/undefined
            setSprintData(fetchedSprintData || {}); // Đảm bảo là object nếu fetchedSprintData là null/undefined
        } catch (err) {
            console.error('Error fetching data for LateTasksChart:', err);
            setError('Could not load late task data.');
            setMembers([]);
            setSprintData({});
        } finally {
            setLoading(false);
        }
    }, [groupId]); // fetchData sẽ được tạo lại nếu groupId thay đổi

    useEffect(() => {
        fetchData();
    }, [fetchData]); // Gọi fetchData khi nó thay đổi (tức là khi groupId thay đổi)

    return { sprintData, members, error, loading, refetchData: fetchData }; // Thêm refetchData nếu cần refresh thủ công
};

export default useLateTasksData;