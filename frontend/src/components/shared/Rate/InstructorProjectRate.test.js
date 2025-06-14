// src/components/shared/Rate/InstructorProjectRate.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import InstructorProjectRate from './InstructorProjectRate';
import * as peerService from '../../../services/peer-assessment-service';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useOutletContext: jest.fn(),
    useParams: () => ({ groupId: '1' }),
    useNavigate: () => jest.fn(),
}));
jest.mock('../../../services/peer-assessment-service');

const { useOutletContext } = require('react-router-dom');

describe('InstructorProjectRate Component', () => {
    const mockContext = {
        members: [{ id: 10, name: 'Alice', avatarUrl: 'a.png' }],
        currentUserId: 9,
        projectId: 100,
    };

    const mockEvaluations = [
        { evaluation_id: 1, user_id: 10, score: 85, comments: 'Good progress' },
    ];

    beforeEach(() => {
        useOutletContext.mockReturnValue(mockContext);
        peerService.fetchInstructorEvaluations.mockResolvedValue(mockEvaluations);
        peerService.updateInstructorEvaluation.mockResolvedValue({ success: true });
        // Giả lập có token
        sessionStorage.setItem('token', 'fake-token');
    });

    it('fetches and displays existing evaluations', async () => {
        render(<InstructorProjectRate />, { wrapper: MemoryRouter });

        await waitFor(() => {
            // Kiểm tra tên member
            expect(screen.getByText(/Alice/i)).toBeInTheDocument();
            // Kiểm tra điểm số và comment đã có
            expect(screen.getByText('85')).toBeInTheDocument();
            expect(screen.getByText('Good progress')).toBeInTheDocument();
        });
    });

    it('allows instructor to edit, change score/comments, and submit', async () => {
        render(<InstructorProjectRate />, { wrapper: MemoryRouter });

        // Tìm và click nút Edit
        const editButton = await screen.findByRole('button', { name: /Edit/i });
        await userEvent.click(editButton);

        // Form edit hiện ra
        const scoreInput = await screen.findByDisplayValue('85');
        const commentsTextarea = await screen.findByDisplayValue('Good progress');

        // Thay đổi giá trị
        await userEvent.clear(scoreInput);
        await userEvent.type(scoreInput, '95');
        await userEvent.clear(commentsTextarea);
        await userEvent.type(commentsTextarea, 'Excellent progress!');

        // Click Confirm
        const confirmButton = screen.getByRole('button', { name: /Confirm/i });
        await userEvent.click(confirmButton);

        // Kiểm tra API update được gọi với dữ liệu mới
        await waitFor(() => {
            expect(peerService.updateInstructorEvaluation).toHaveBeenCalledWith(expect.objectContaining({
                evaluationId: 1,
                evaluationData: expect.objectContaining({
                    score: 95,
                    comments: 'Excellent progress!',
                }),
            }));
        });
    });
});