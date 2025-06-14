// src/services/api-client.test.js
import * as apiClient from './api-client';

// Mock fetch và sessionStorage
global.fetch = jest.fn();
const mockSessionStorage = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });


describe('API Client Service', () => {
    beforeEach(() => {
        fetch.mockClear();
        sessionStorage.setItem('token', 'fake-token');
    });

    describe('fetchTasks', () => {
        it('should fetch tasks successfully', async () => {
            const mockTasks = [{ id: 1, title: 'Test Task' }];
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockTasks,
            });

            const data = await apiClient.fetchTasks('all', 1, 1, null);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/tasks?mode=all&projectId=1&sprintId=1',
                expect.any(Object)
            );
            expect(data).toEqual(mockTasks);
        });

        it('should throw an error if fetch fails', async () => {
            fetch.mockResolvedValueOnce({ ok: false, status: 500 });
            await expect(apiClient.fetchTasks('all', 1, 1, null)).rejects.toThrow('Failed to fetch tasks: 500');
        });
    });

    describe('updateTask', () => {
        it('should update a task successfully', async () => {
            const mockUpdatedTask = { id: 1, title: 'Updated Task' };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockUpdatedTask,
            });

            const data = await apiClient.updateTask(1, { title: 'Updated Task' }, true);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/tasks/1',
                expect.objectContaining({
                    method: 'PATCH',
                    body: JSON.stringify({ title: 'Updated Task' }),
                    headers: expect.objectContaining({ 'X-Is-Team-Lead': 'true' })
                })
            );
            expect(data).toEqual(mockUpdatedTask);
        });
    });
});