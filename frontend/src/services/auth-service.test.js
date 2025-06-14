// src/services/auth-service.test.js
import { loginUser, registerUser } from './auth-service';

// Mock global.fetch
global.fetch = jest.fn();

describe('Auth Service', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    // Test loginUser
    describe('loginUser', () => {
        it('should return user data on successful login', async () => {
            const mockUserData = { token: 'fake-token', user: { id: 1, email: 'test@example.com' } };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockUserData,
            });

            const result = await loginUser({ email: 'test@example.com', password: 'password' });

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/login', expect.any(Object));
            expect(result).toEqual(mockUserData);
        });

        it('should throw an error on failed login', async () => {
            const mockError = { message: 'Invalid credentials' };
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => mockError,
            });

            await expect(loginUser({ email: 'test@example.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');
        });
    });

    // Test registerUser
    describe('registerUser', () => {
        it('should return a success message on successful registration', async () => {
            const mockSuccess = { message: 'Đăng ký thành công' };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockSuccess,
            });

            const newUser = { email: 'new@example.com', password: 'password', username: 'newuser', role: 'Student' };
            const result = await registerUser(newUser);

            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/auth/register', expect.any(Object));
            expect(result).toEqual(mockSuccess);
        });
    });
});