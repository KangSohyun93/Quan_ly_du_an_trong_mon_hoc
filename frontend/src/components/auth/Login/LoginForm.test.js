// src/components/auth/LoginForm.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm';
import { loginUser } from '../../../services/auth-service';

// Mock the service
jest.mock('../../../services/auth-service');

// Mock a component to render for the target route
const MockHomePage = () => <div>Home Page</div>;
const MockAdminPage = () => <div>Admin Page</div>;

describe('LoginForm', () => {
    beforeEach(() => {
        loginUser.mockClear();
        localStorage.clear();
        sessionStorage.clear();
    });

    const renderComponent = () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/home" element={<MockHomePage />} />
                    <Route path="/admin/user-manager" element={<MockAdminPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('should render the login form correctly', () => {
        renderComponent();
        expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    it('should allow user to type in email and password', async () => {
        renderComponent();
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('should show error message on failed login', async () => {
        loginUser.mockRejectedValue(new Error('Invalid credentials'));
        renderComponent();

        await userEvent.type(screen.getByLabelText(/Email/i), 'wrong@user.com');
        await userEvent.type(screen.getByLabelText(/Password/i), 'wrongpass');
        await userEvent.click(screen.getByRole('button', { name: /Login/i }));

        const errorMessage = await screen.findByText('Invalid credentials');
        expect(errorMessage).toBeInTheDocument();
    });

    it('should navigate to home page on successful student login', async () => {
        const mockUser = {
            user: { id: 1, email: 'student@test.com', role: 'Student', is_active: true },
            token: 'fake-token'
        };
        loginUser.mockResolvedValue(mockUser);
        renderComponent();

        await userEvent.type(screen.getByLabelText(/Email/i), mockUser.user.email);
        await userEvent.type(screen.getByLabelText(/Password/i), 'password');
        await userEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });

        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser.user));
        expect(sessionStorage.getItem('token')).toBe(mockUser.token);
    });
});