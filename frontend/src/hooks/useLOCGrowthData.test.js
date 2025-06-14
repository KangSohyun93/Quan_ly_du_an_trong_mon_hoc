// src/hooks/useLOCGrowthData.test.js
import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import useLOCGrowthData from './useLOCGrowthData';

// Mock axios
jest.mock('axios');

const mockApiResponse = {
    data: {
        locData: [
            { user_id: 1, username: 'dev1', date: '2023-10-10T10:00:00Z', lines_added: 100, lines_removed: 20 },
            { user_id: 2, username: 'dev2', date: '2023-10-11T11:00:00Z', lines_added: 50, lines_removed: 10 },
        ],
        projectStartDate: '2023-10-01T00:00:00Z',
    }
};

describe('useLOCGrowthData Hook', () => {
    beforeEach(() => {
        axios.get.mockClear();
    });

    it('should be in loading state initially and then fetch data successfully', async () => {
        axios.get.mockResolvedValue(mockApiResponse);

        const { result } = renderHook(() => useLOCGrowthData(1));

        // 1. Initial state
        expect(result.current.loading).toBe(true);
        expect(result.current.weeklyLOCActivity).toEqual([]);
        expect(result.current.projectUsers).toEqual([]);

        // 2. Wait for fetch and processing to complete
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // 3. Success state
        expect(result.current.weeklyLOCActivity.length).toBeGreaterThan(0);
        expect(result.current.weeklyLOCActivity[0].linesAdded).toBe(150); // Tổng của dev1 và dev2
        expect(result.current.projectUsers).toEqual([
            { user_id: 1, username: 'dev1' },
            { user_id: 2, username: 'dev2' },
        ]);
        expect(result.current.error).toBeNull();
    });

    it('should handle API errors correctly', async () => {
        axios.get.mockRejectedValue(new Error('Network Failure'));

        const { result } = renderHook(() => useLOCGrowthData(1));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe('Could not load LOC data.');
            expect(result.current.weeklyLOCActivity).toEqual([]);
            expect(result.current.projectUsers).toEqual([]);
        });
    });

    it('should not fetch data if projectId is not provided', () => {
        const { result } = renderHook(() => useLOCGrowthData(null));

        expect(result.current.loading).toBe(false);
        expect(axios.get).not.toHaveBeenCalled();
        expect(result.current.weeklyLOCActivity).toEqual([]);
    });

    it('should refetch when the selected user changes', async () => {
        axios.get.mockResolvedValue(mockApiResponse);
        const { result } = renderHook(() => useLOCGrowthData(1));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
        });

        act(() => {
            result.current.setSelectedUser('1'); // Thay đổi user
        });

        // Đợi hook chạy lại và gọi API lần nữa
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(2);
        });
    });
});