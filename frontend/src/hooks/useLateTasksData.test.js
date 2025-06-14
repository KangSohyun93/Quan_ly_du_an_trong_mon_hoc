// src/hooks/useLateTasksData.test.js
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import useLateTasksData from './useLateTasksData';

jest.mock('axios');

describe('useLateTasksData', () => {
    const mockResponse = {
        data: {
            members: [{ id: 1, name: 'Alice' }],
            sprintData: { 'Alice': [{ sprint: 1, late: 2 }] },
        },
    };

    it('should return loading, then data on successful fetch', async () => {
        axios.get.mockResolvedValue(mockResponse);
        const { result } = renderHook(() => useLateTasksData(101));

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.members).toEqual(mockResponse.data.members);
            expect(result.current.sprintData).toEqual(mockResponse.data.sprintData);
            expect(result.current.error).toBeNull();
        });
    });

    it('should return an error on failed fetch', async () => {
        axios.get.mockRejectedValue(new Error('API Error'));
        const { result } = renderHook(() => useLateTasksData(101));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe('Could not load late task data.');
            expect(result.current.members).toEqual([]);
            expect(result.current.sprintData).toEqual({});
        });
    });

    it('should not fetch if groupId is not provided', () => {
        const { result } = renderHook(() => useLateTasksData(null));

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('No Group ID provided.');
        expect(axios.get).not.toHaveBeenCalled();
    });
});