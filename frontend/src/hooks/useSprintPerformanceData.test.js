// src/hooks/useSprintPerformanceData.test.js
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import useSprintPerformanceData from './useSprintPerformanceData';

jest.mock('axios');

describe('useSprintPerformanceData', () => {
    const mockApiResponse = {
        data: {
            sprintData: {
                'Alice': [{ sprint: 1, completed: 5, late: 1, total: 6 }],
                'Bob': [{ sprint: 1, completed: 4, late: 0, total: 4 }],
            },
        },
    };

    it('should fetch and process sprint performance data correctly', async () => {
        axios.get.mockResolvedValue(mockApiResponse);
        const { result } = renderHook(() => useSprintPerformanceData(101));

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            // Logic xử lý sẽ gộp dữ liệu của Alice và Bob
            // sprint 1: completed = 5+4=9, late = 1+0=1, total = 6+4=10
            expect(result.current.processedSprints).toEqual([
                { sprint: 1, completed: 9, late: 1, total: 10 },
            ]);
        });
    });

    it('should handle API error', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));
        const { result } = renderHook(() => useSprintPerformanceData(101));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe('Could not load sprint performance data.');
            expect(result.current.processedSprints).toEqual([]);
        });
    });
});