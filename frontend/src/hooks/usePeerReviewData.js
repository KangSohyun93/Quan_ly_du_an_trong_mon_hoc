// src/hooks/usePeerReviewData.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const usePeerReviewData = (groupId) => {
    const [peerReviewData, setPeerReviewData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!groupId) {
            setPeerReviewData([]);
            setLoading(false);
            setError("Group ID is required to fetch peer reviews.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/peer-assessments`);
            setPeerReviewData(response.data || []);
        } catch (err) {
            console.error('Error fetching peer assessments:', err);
            setError('Could not load peer review data.');
            setPeerReviewData([]);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { peerReviewData, loading, error, refetchData: fetchData };
};

export default usePeerReviewData;