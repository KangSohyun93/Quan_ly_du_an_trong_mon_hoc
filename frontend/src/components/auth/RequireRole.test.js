// src/components/auth/RequireRole.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireRole from './RequireRole';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const MockProtectedComponent = () => <div>Protected Content</div>;
const MockLoginPage = () => <div>Login Page</div>;

describe('RequireRole', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        mockNavigate.mockClear();
        jest.useFakeTimers(); // Dùng timer giả để điều khiển setTimeout
    });

    afterEach(() => {
        jest.useRealTimers(); // Trả lại timer thật
    });

    it('should render children if user has the correct role', () => {
        const adminUser = { id: 1, role: 'Admin' };
        localStorage.setItem('user', JSON.stringify(adminUser));

        render(
            <RequireRole role="Admin">
                <MockProtectedComponent />
            </RequireRole>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should show access denied and redirect if user has the wrong role', () => {
        const studentUser = { id: 2, role: 'Student' };
        localStorage.setItem('user', JSON.stringify(studentUser));

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/admin" element={
                        <RequireRole role="Admin">
                            <MockProtectedComponent />
                        </RequireRole>
                    } />
                    <Route path="/login" element={<MockLoginPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/403 - Không có quyền truy cập/i)).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

        // Tiến nhanh thời gian để kiểm tra redirect
        jest.advanceTimersByTime(3000);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('should show access denied and redirect if there is no user', () => {
        render(
            <RequireRole role="Admin">
                <MockProtectedComponent />
            </RequireRole>
        );

        expect(screen.getByText(/403 - Không có quyền truy cập/i)).toBeInTheDocument();

        jest.advanceTimersByTime(3000);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});