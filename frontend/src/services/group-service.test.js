// src/services/group-service.test.js
import { fetchGroupData } from './group-service';

// Mock fetch
global.fetch = jest.fn();

describe('Group Service', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('should fetch group data successfully', async () => {
        const mockData = {
            groupInfo: { name: 'Nhóm A' },
            members: [{ id: 1, name: 'Alice' }]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await fetchGroupData({ classId: 101, groupId: 202 });

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/group/202/introduce?classId=101',
            expect.any(Object)
        );
        expect(result).toEqual(mockData);
    });

    it('should throw an error on failed fetch', async () => {
        const mockError = { message: 'Nhóm không tồn tại' };
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => mockError,
        });

        await expect(fetchGroupData({ classId: 101, groupId: 999 })).rejects.toThrow('Nhóm không tồn tại');
    });
});