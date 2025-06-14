// src/services/class-service.test.js
import { getInfoClass, JoinClass, CreateClass } from './class-service';

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

describe('Class Service', () => {
    beforeEach(() => {
        fetch.mockClear();
        sessionStorage.setItem('token', 'fake-token');
    });

    describe('getInfoClass', () => {
        it('should fetch class info successfully with a token', async () => {
            const mockClassData = [{ class_id: 1, name: 'Lập trình Web' }];
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockClassData,
            });

            const result = await getInfoClass();

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/class/get-info-class',
                expect.objectContaining({
                    headers: expect.objectContaining({ Authorization: 'Bearer fake-token' }),
                })
            );
            expect(result).toEqual(mockClassData);
        });

        it('should throw an error if no token is provided', async () => {
            sessionStorage.clear();
            await expect(getInfoClass()).rejects.toThrow('Không có token, yêu cầu đăng nhập');
        });
    });

    describe('JoinClass', () => {
        it('should send a join request with the correct code', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Tham gia thành công' }),
            });

            await JoinClass({ joinCode: 'ABCDE' });

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/class/join',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ code: 'ABCDE' }),
                })
            );
        });
    });

    describe('CreateClass', () => {
        it('should send a create request with form data', async () => {
            const formData = { name: 'New Class', code: 'NEW123' };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ class_id: 2, ...formData }),
            });

            await CreateClass(formData);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/class/create',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(formData),
                })
            );
        });
    });
});