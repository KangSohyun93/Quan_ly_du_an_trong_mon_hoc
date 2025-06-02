// src/hooks/useSprintPerformanceData.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const processSprintPerformanceData = (fetchedSprintData) => {
    if (Object.keys(fetchedSprintData || {}).length === 0) {
        return [];
    }
    const sprintNumbers = [
        ...new Set(
            Object.values(fetchedSprintData).flatMap(member =>
                member.map(sprint => sprint.sprint)
            )
        ),
    ].sort((a, b) => a - b);

    if (sprintNumbers.length === 0) return [];

    return sprintNumbers.map(sprintNum => {
        const sprintEntries = Object.values(fetchedSprintData)
            .flatMap(memberSprints => memberSprints.filter(s => s.sprint === sprintNum));
        return {
            sprint: sprintNum,
            completed: sprintEntries.reduce((sum, entry) => sum + (entry.completed || 0), 0),
            late: sprintEntries.reduce((sum, entry) => sum + (entry.late || 0), 0),
            total: sprintEntries.reduce((sum, entry) => sum + (entry.total || 0), 0),
        };
    });
};


const useSprintPerformanceData = (groupId) => {
    // sprintDataRaw từ API, không phải sprintData đã được xử lý cho chart
    const [sprintApiResponseData, setSprintApiResponseData] = useState({});
    const [processedSprints, setProcessedSprints] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!groupId) {
            setLoading(false);
            setError("No Group ID provided.");
            setProcessedSprints([]);
            setSprintApiResponseData({});
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
            const { sprintData: fetchedSprintData } = response.data;
            setSprintApiResponseData(fetchedSprintData || {}); // Lưu dữ liệu gốc từ API nếu cần

            const aggregatedSprints = processSprintPerformanceData(fetchedSprintData);
            setProcessedSprints(aggregatedSprints);

        } catch (err) {
            console.error('Error fetching data for SprintPerformanceChart:', err);
            setError('Could not load sprint performance data.');
            setSprintApiResponseData({});
            setProcessedSprints([]);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { processedSprints, loading, error, refetchData: fetchData }; // Chỉ trả về processedSprints
};

export default useSprintPerformanceData;