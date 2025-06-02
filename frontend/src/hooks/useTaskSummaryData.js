// src/hooks/useTaskSummaryData.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useTaskSummaryData = (groupId, initialSelectedSprint = 'all') => {
    const [taskSummary, setTaskSummary] = useState(null);
    const [sprintOptions, setSprintOptions] = useState([]);
    const [selectedSprint, setSelectedSprint] = useState(initialSelectedSprint);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!groupId) {
            setLoading(false);
            setError("No Group ID provided.");
            setTaskSummary(null);
            setSprintOptions([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/task-summary?sprintId=${selectedSprint}`);
            setTaskSummary(response.data.summary || null);
            // Chỉ cập nhật sprintOptions nếu là lần đầu fetch (selectedSprint='all') hoặc sprintOptions chưa có
            if (selectedSprint === 'all' || sprintOptions.length === 0) {
                setSprintOptions(response.data.sprintOptions || []);
            }
        } catch (err) {
            console.error('Error fetching data for TaskChart:', err);
            setError('Could not load task summary data.');
            setTaskSummary(null);
            // Không reset sprintOptions khi có lỗi nếu chúng đã được load trước đó
        } finally {
            setLoading(false);
        }
    }, [groupId, selectedSprint, sprintOptions.length]); // Thêm sprintOptions.length để chỉ fetch lại options khi cần

    useEffect(() => {
        fetchData();
    }, [fetchData]); // fetch lại khi groupId hoặc selectedSprint thay đổi (do fetchData phụ thuộc vào chúng)

    return { taskSummary, sprintOptions, selectedSprint, setSelectedSprint, error, loading, refetchData: fetchData };
};

export default useTaskSummaryData;