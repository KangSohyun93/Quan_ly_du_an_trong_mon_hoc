// src/services/user-service.test.js
import { fetchAllUser, updateUser, createUser } from './user-service';

// Mock fetch
global.fetch = jest.fn();

describe('User Service', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    describe('fetchAllUser', () => {
        it('should fetch all users successfully', async () => {
            const mockUsers = [{ id: 1, name: 'User A' }, { id: 2, name: 'User B' }];
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockUsers,
            });

            // Lưu ý: Code gốc có truyền body vào GET request, điều này không chuẩn.
            // Test này sẽ bỏ qua `credentials` vì nó không được sử dụng trong GET.
            const result = await fetchAllUser();

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/user/all', expect.any(Object));
            expect(result).toEqual(mockUsers);
        });
    });

    describe('updateUser', () => {
        it('should send a PUT request to update a user', async () => {
            const userId = 123;
            const userData = { name: 'Updated Name', email: 'updated@test.com' };
            const mockResponse = { id: userId, ...userData };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await updateUser(userId, userData);

            expect(fetch).toHaveBeenCalledWith(
                `http://localhost:5000/api/user/${userId}`,
                expect.objectContaining({
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                })
            );
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error on failed update', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Cập nhật thất bại' }),
            });
            await expect(updateUser(123, {})).rejects.toThrow('Cập nhật thông tin người dùng thất bại');
        });
    });

    describe('createUser', () => {
        it('should send a POST request to create a user', async () => {
            const userData = { name: 'New User', email: 'new@test.com' };
            fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 456, ...userData }) });

            await createUser(userData);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/user',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(userData),
                })
            );
        });
    });
});