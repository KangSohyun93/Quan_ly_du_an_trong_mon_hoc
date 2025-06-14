// src/hooks/useTaskSummaryData.test.js
import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import useTaskSummaryData from './useTaskSummaryData';

jest.mock('axios');

describe('useTaskSummaryData', () => {
    const mockResponseAll = {
        data: {
            summary: { completed: 10, inProgress: 5 },
            sprintOptions: [{ id: 1, name: 'Sprint 1' }, { id: 2, name: 'Sprint 2' }]
        }
    };
    const mockResponseSprint1 = {
        data: {
            summary: { completed: 4, inProgress: 1 },
            sprintOptions: [{ id: 1, name: 'Sprint 1' }, { id: 2, name: 'Sprint 2' }]
        }
    };

    it('should fetch initial data for "all" sprints', async () => {
        axios.get.mockResolvedValue(mockResponseAll);
        const { result } = renderHook(() => useTaskSummaryData(101));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('sprintId=all'));
            expect(result.current.taskSummary.completed).toBe(10);
            expect(result.current.sprintOptions).toHaveLength(2);
        });
    });

    it('should refetch data when selectedSprint changes', async () => {
        axios.get.mockResolvedValueOnce(mockResponseAll).mockResolvedValueOnce(mockResponseSprint1);
        const { result } = renderHook(() => useTaskSummaryData(101));

        // Chờ lần fetch đầu tiên hoàn tất
        await waitFor(() => expect(result.current.taskSummary.completed).toBe(10));

        // Thay đổi sprint được chọn
        act(() => {
            result.current.setSelectedSprint(1);
        });

        // Chờ lần fetch thứ hai hoàn tất với dữ liệu mới
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('sprintId=1'));
            expect(result.current.taskSummary.completed).toBe(4);
            // sprintOptions không nên bị reset
            expect(result.current.sprintOptions).toHaveLength(2);
        });
    });
});