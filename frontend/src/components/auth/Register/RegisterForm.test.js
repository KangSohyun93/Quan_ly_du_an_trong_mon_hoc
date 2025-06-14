// src/components/auth/RegisterForm.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';
import { registerUser } from '../../../services/auth-service';

jest.mock('../../../services/auth-service');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('RegisterForm', () => {
    beforeEach(() => {
        registerUser.mockClear();
        mockNavigate.mockClear();
    });

    const renderComponent = () => {
        render(<RegisterForm />, { wrapper: MemoryRouter });
    };

    it('shows an error if passwords do not match', async () => {
        renderComponent();
        await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
        await userEvent.type(screen.getByLabelText('Username'), 'tester');
        await userEvent.selectOptions(screen.getByLabelText('Role'), 'Student');
        await userEvent.type(screen.getByLabelText('Password'), 'password123');
        await userEvent.type(screen.getByLabelText('Confirm Password'), 'password456');

        await userEvent.click(screen.getByRole('button', { name: /Register/i }));

        expect(await screen.findByText('Mật khẩu không khớp.')).toBeInTheDocument();
        expect(registerUser).not.toHaveBeenCalled();
    });

    it('calls registerUser and navigates on successful registration', async () => {
        registerUser.mockResolvedValue({ success: true });
        renderComponent();

        await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
        await userEvent.type(screen.getByLabelText('Username'), 'tester');
        await userEvent.selectOptions(screen.getByLabelText('Role'), 'Student');
        await userEvent.type(screen.getByLabelText('Password'), 'password123');
        await userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');

        await userEvent.click(screen.getByRole('button', { name: /Register/i }));

        expect(registerUser).toHaveBeenCalledWith({
            email: 'test@test.com',
            username: 'tester',
            password: 'password123',
            role: 'Student',
        });

        // Đợi registerUser hoàn thành
        await screen.findByRole('button', { name: /Register/i });
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});