// src/hooks/usePeerReviewData.test.js
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import usePeerReviewData from './usePeerReviewData';

jest.mock('axios');

describe('usePeerReviewData', () => {
    const mockResponse = {
        data: [{ assessment_id: 1, score: 5 }]
    };

    it('should fetch peer review data successfully', async () => {
        axios.get.mockResolvedValue(mockResponse);
        const { result } = renderHook(() => usePeerReviewData(101));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.peerReviewData).toEqual(mockResponse.data);
        });
    });

    it('should set an error message when groupId is missing', () => {
        const { result } = renderHook(() => usePeerReviewData(null));
        expect(result.current.error).toBe("Group ID is required to fetch peer reviews.");
        expect(axios.get).not.toHaveBeenCalled();
    });
});