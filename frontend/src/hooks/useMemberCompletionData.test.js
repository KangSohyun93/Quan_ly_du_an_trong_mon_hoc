// src/hooks/useMemberCompletionData.test.js
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import useMemberCompletionData from './useMemberCompletionData';

jest.mock('axios');

describe('useMemberCompletionData', () => {
    const mockResponse = {
        data: {
            members: [{ id: 1, name: 'Alice', joinDate: '2023-10-01T00:00:00.000Z' }],
            sprintData: { /* ... */ }
        }
    };

    it('should fetch data and format joinDate correctly', async () => {
        axios.get.mockResolvedValue(mockResponse);
        const { result } = renderHook(() => useMemberCompletionData(101));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.members).toHaveLength(1);
            // Kiểm tra định dạng ngày đã được chuẩn hóa
            expect(result.current.members[0].joinDate).toBe('2023-10-01');
        });
    });
});