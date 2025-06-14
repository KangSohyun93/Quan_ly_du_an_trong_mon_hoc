// src/components/shared/Rate/ProjectRate.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProjectRate from './ProjectRate';
import * as peerService from '../../../services/peer-assessment-service';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useOutletContext: jest.fn(),
    useParams: () => ({ groupId: '1' }),
}));
jest.mock('../../../services/peer-assessment-service');

const { useOutletContext } = require('react-router-dom');

describe('ProjectRate Component', () => {
    const mockContext = {
        members: [
            { id: 10, name: 'Alice', avatarUrl: 'a.png' },
            { id: 11, name: 'Bob', avatarUrl: 'b.png' },
        ],
        currentUserId: 9,
        projectId: 100,
    };

    const mockAssessments = [
        { assessment_id: 1, assessee_id: 10, quality_score: 4, note: 'Good work' },
    ];
    const mockTaskStats = [
        { id: 10, done: 5, total: 8, delayed: 1, inProgress: 2, toDo: 0 },
        { id: 11, done: 6, total: 6, delayed: 0, inProgress: 0, toDo: 0 },
    ];

    beforeEach(() => {
        useOutletContext.mockReturnValue(mockContext);
        peerService.fetchPeerAssessments.mockResolvedValue(mockAssessments);
        peerService.fetchMemberTaskStats.mockResolvedValue(mockTaskStats);
        peerService.updatePeerAssessment.mockResolvedValue({ success: true });
    });

    it('fetches and displays member data and existing assessments', async () => {
        render(<ProjectRate />, { wrapper: MemoryRouter });

        // Chờ data load xong
        await waitFor(() => {
            // Kiểm tra tên member được hiển thị
            expect(screen.getByText(/Alice/i)).toBeInTheDocument();
            // Kiểm tra task stats được hiển thị
            expect(screen.getByText('TASK DONE: 5/8')).toBeInTheDocument();
            // Kiểm tra ghi chú đã có được hiển thị
            expect(screen.getByText('Good work')).toBeInTheDocument();
        });
    });

    it('allows user to edit, change, and submit an assessment', async () => {
        render(<ProjectRate />, { wrapper: MemoryRouter });

        // Tìm nút edit của Alice
        const editButtons = await screen.findAllByRole('button', { name: /Edit/i });
        await userEvent.click(editButtons[0]);

        // Sau khi click edit, form sẽ hiện ra
        const noteTextarea = await screen.findByPlaceholderText(/Enter your note here/i);
        await userEvent.clear(noteTextarea);
        await userEvent.type(noteTextarea, 'Updated note');

        // Click vào sao thứ 5 của mục Quality
        const qualityStars = noteTextarea.closest('.projectrate-task-item').querySelectorAll('.projectrate-rating-row')[3].querySelectorAll('.projectrate-star');
        await userEvent.click(qualityStars[4]); // star 5

        // Click confirm
        const confirmButton = screen.getByRole('button', { name: /Confirm/i });
        await userEvent.click(confirmButton);

        // Kiểm tra API update đã được gọi với data mới
        await waitFor(() => {
            expect(peerService.updatePeerAssessment).toHaveBeenCalledWith(expect.objectContaining({
                assessmentId: 1,
                assessmentData: expect.objectContaining({
                    quality_score: 5,
                    note: 'Updated note',
                }),
            }));
        });
    });
});