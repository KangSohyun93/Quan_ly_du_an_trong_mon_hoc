// src/hooks/useDashboardCoreData.test.js
import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import useDashboardCoreData from './useDashboardCoreData';

jest.mock('axios');

describe('useDashboardCoreData', () => {
    const mockGroupsResponse = {
        data: {
            groups: [{ group_id: 101, project_id: 201, name: 'Group A' }],
            role: 'Instructor',
        },
    };
    const mockSprintsResponse = {
        data: [{ sprint_id: 1, name: 'Sprint 1' }],
    };
    const mockStatsResponse = {
        data: { totalProjectTasks: 10 },
    };

    beforeEach(() => {
        axios.get.mockClear();
    });

    it('should fetch initial groups and role correctly', async () => {
        axios.get.mockResolvedValue(mockGroupsResponse);

        const { result } = renderHook(() => useDashboardCoreData(1, 1));

        expect(result.current.loadingGroups).toBe(true);

        await waitFor(() => {
            expect(result.current.loadingGroups).toBe(false);
            expect(result.current.groups).toEqual(mockGroupsResponse.data.groups);
            expect(result.current.currentUserRole).toBe('Instructor');
        });
    });

    it('should select the initial group from context if available', async () => {
        const multipleGroupsResponse = {
            data: {
                groups: [
                    { group_id: 101, project_id: 201, name: 'Group A' },
                    { group_id: 102, project_id: 202, name: 'Group B' }
                ],
                role: 'Instructor',
            },
        };
        axios.get.mockResolvedValueOnce(multipleGroupsResponse);

        const { result } = renderHook(() => useDashboardCoreData(1, 1, 102));

        await waitFor(() => {
            expect(result.current.selectedGroup.group_id).toBe(102);
        });
    });

    it('should fetch sprints and stats after a group is selected', async () => {
        // 1st call for groups, 2nd for sprints, 3rd for stats
        axios.get
            .mockResolvedValueOnce(mockGroupsResponse)
            .mockResolvedValueOnce(mockSprintsResponse)
            .mockResolvedValueOnce(mockStatsResponse);

        const { result } = renderHook(() => useDashboardCoreData(1, 1));

        // Chờ groups load xong và set selectedGroup
        await waitFor(() => {
            expect(result.current.selectedGroup).not.toBeNull();
        });

        // Chờ sprints và stats load
        await waitFor(() => {
            expect(result.current.sprints).toEqual(mockSprintsResponse.data);
            expect(result.current.statData).toEqual(mockStatsResponse.data);
            expect(axios.get).toHaveBeenCalledTimes(3); // Groups, Sprints, Stats
        });
    });
});