// src/services/profile-service.test.js
import { fetchUserProfile, updateUserProfile, changePassword } from './profile-service';

// Mock fetch và storage
global.fetch = jest.fn();
const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
Object.defineProperty(window, 'sessionStorage', { value: mockLocalStorage }); // Dùng chung mock cho cả hai

describe('Profile Service', () => {
    const mockUser = { id: 123, name: 'Test User' };
    const mockToken = 'fake-token';

    beforeEach(() => {
        fetch.mockClear();
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', mockToken);
    });

    describe('fetchUserProfile', () => {
        it('should fetch user profile successfully', async () => {
            fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUser });
            const profile = await fetchUserProfile();
            expect(fetch).toHaveBeenCalledWith(`http://localhost:5000/api/user/profile/${mockUser.id}`, expect.any(Object));
            expect(profile).toEqual(mockUser);
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile with FormData', async () => {
            const formData = new FormData();
            formData.append('name', 'New Name');
            fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ user: { ...mockUser, name: 'New Name' } }) });

            const updatedUser = await updateUserProfile(formData);

            expect(fetch).toHaveBeenCalledWith(`http://localhost:5000/api/user/profile/${mockUser.id}`, expect.objectContaining({
                method: 'PUT',
                body: formData,
            }));
            expect(updatedUser.name).toBe('New Name');
        });
    });

    describe('changePassword', () => {
        it('should send password change request', async () => {
            const passwordData = { oldPassword: '123', newPassword: '456' };
            fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Success' }) });

            await changePassword(passwordData);

            expect(fetch).toHaveBeenCalledWith(`http://localhost:5000/api/user/${mockUser.id}/change-password`, expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(passwordData),
            }));
        });
    });
});