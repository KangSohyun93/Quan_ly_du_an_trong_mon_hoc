// src/components/auth/RequireAuth.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RequireAuth from './RequireAuth';

// Mock useNavigate để theo dõi việc chuyển hướng
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockSessionStorage = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

const ProtectedChild = () => <div>Nội dung được bảo vệ</div>;

describe('RequireAuth Component', () => {
    beforeEach(() => {
        sessionStorage.clear();
        mockNavigate.mockClear();
        jest.useFakeTimers(); // Dùng timer giả để kiểm soát setTimeout
    });

    afterEach(() => {
        jest.useRealTimers(); // Khôi phục timer thật
    });

    it('should render children if token exists', () => {
        sessionStorage.setItem('token', 'valid-token');
        render(<RequireAuth><ProtectedChild /></RequireAuth>, { wrapper: MemoryRouter });

        expect(screen.getByText('Nội dung được bảo vệ')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should show message and redirect to login if token does not exist', () => {
        render(<RequireAuth><ProtectedChild /></RequireAuth>, { wrapper: MemoryRouter });

        // Nội dung con không được render
        expect(screen.queryByText('Nội dung được bảo vệ')).not.toBeInTheDocument();
        // Hiển thị thông báo chờ
        expect(screen.getByText('Bạn chưa đăng nhập. Đang chuyển hướng...')).toBeInTheDocument();

        // Tua nhanh thời gian qua 2 giây
        jest.advanceTimersByTime(2000);

        // Kiểm tra đã gọi chuyển hướng
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});