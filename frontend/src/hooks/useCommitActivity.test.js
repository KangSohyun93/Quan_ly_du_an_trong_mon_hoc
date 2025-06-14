// src/hooks/useCommitActivity.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import useCommitActivity from './useCommitActivity';

// Mock axios
jest.mock('axios');

const mockApiResponse = {
    data: {
        commits: [
            { user_id: 1, username: 'dev1', date: '2023-10-10T10:00:00Z' },
            { user_id: 2, username: 'dev2', date: '2023-10-11T11:00:00Z' },
            { user_id: 1, username: 'dev1', date: '2023-10-17T12:00:00Z' },
        ],
        projectStartDate: '2023-10-01T00:00:00Z',
        projectEndDate: '2023-10-31T00:00:00Z',
    }
};

describe('useCommitActivity', () => {
    beforeEach(() => {
        axios.get.mockClear();
    });

    it('should handle loading, success states correctly', async () => {
        axios.get.mockResolvedValue(mockApiResponse);

        const { result } = renderHook(() => useCommitActivity(1));

        // Initial state
        expect(result.current.loading).toBe(true);
        expect(result.current.weeklyActivity).toEqual([]);

        // Wait for the hook to finish fetching and processing
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Success state
        expect(result.current.weeklyActivity).not.toEqual([]);
        expect(result.current.weeklyActivity.length).toBeGreaterThan(0);
        expect(result.current.projectUsers).toEqual([
            { user_id: 1, username: 'dev1' },
            { user_id: 2, username: 'dev2' },
        ]);
    });

    it('should handle error state', async () => {
        axios.get.mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => useCommitActivity(1));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe('Could not load commit activity data.');
        });

        expect(result.current.weeklyActivity).toEqual([]);
        expect(result.current.projectUsers).toEqual([]);
    });

    it('should refetch when selectedUser changes', async () => {
        axios.get.mockResolvedValue(mockApiResponse);
        const { result, rerender } = renderHook(
            ({ projectId, user }) => useCommitActivity(projectId, user),
            { initialProps: { projectId: 1, user: 'all' } }
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
        });

        // Change selected user
        act(() => {
            result.current.setSelectedUser('1'); // Gọi hàm setter
        });

        // Wait for the re-fetch to be called
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(2);
        });
    });

    it('should refetch when refreshNonce changes', async () => {
        axios.get.mockResolvedValue(mockApiResponse);

        // renderHook for the first time
        const { rerender } = renderHook(
            ({ nonce }) => useCommitActivity(1, 'all', nonce),
            { initialProps: { nonce: 0 } }
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
        });

        // Rerender with a new nonce
        rerender({ nonce: 1 });

        await waitFor(() => {
            // fetchDataInternal(false) on mount + fetchDataInternal(true) on nonce change
            expect(axios.get).toHaveBeenCalledTimes(2);
        });
    });
});