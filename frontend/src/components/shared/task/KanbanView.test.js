// src/components/shared/task/KanbanView.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KanbanView from './KanbanView';
import * as apiClient from '../../../services/api-client';

// Mock dependencies
jest.mock('../../../services/api-client');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useOutletContext: jest.fn(),
}));

// Import useOutletContext sau khi đã mock
const { useOutletContext } = require('react-router-dom');

describe('KanbanView', () => {
    const mockContext = {
        activeTab: 'team-task',
        members: [{ id: 1, name: 'Current User', avatarUrl: 'avatar.png' }],
        isTeamLead: true,
        currentUserId: 1,
        projectId: 100,
        selectedSprintId: 200,
        selectedUserId: null,
    };

    const mockTasks = [
        {
            task_id: 1, title: 'Task To Do', status: 'to-do', assigned_to: 1,
            checklists: [{ checklist_id: 10, item_description: 'Subtask 1', is_completed: false }]
        },
        { task_id: 2, title: 'Task In Progress', status: 'in-progress', assigned_to: 1, checklists: [] },
    ];

    beforeEach(() => {
        useOutletContext.mockReturnValue(mockContext);
        apiClient.fetchTasks.mockResolvedValue(mockTasks);
        // Mock các hàm update/delete
        apiClient.updateChecklistItem.mockResolvedValue({ success: true });
        apiClient.updateTask.mockResolvedValue({ success: true });
        apiClient.deleteTask.mockResolvedValue({ success: true });
        window.confirm = jest.fn(() => true); // Auto-confirm prompts
    });

    it('renders tasks in their correct columns', async () => {
        render(<KanbanView sprints={[{ id: 200 }]} />);

        await waitFor(() => {
            // Tìm task trong cột "To-Do"
            const todoColumn = screen.getByText(/To-Do/i).closest('.status-block');
            expect(todoColumn).toHaveTextContent('Task To Do');

            // Tìm task trong cột "In-Progress"
            const inProgressColumn = screen.getByText(/In-Progress/i).closest('.status-block');
            expect(inProgressColumn).toHaveTextContent('Task In Progress');
        });
    });

    it('allows a team lead to delete a task', async () => {
        render(<KanbanView sprints={[{ id: 200 }]} />);

        // Tìm button xóa của task đầu tiên
        const deleteButton = await screen.findAllByRole('button', { name: /trash/i });
        await userEvent.click(deleteButton[0]);

        // Kiểm tra window.confirm và API đã được gọi
        expect(window.confirm).toHaveBeenCalledWith('Bạn có chắc muốn xóa task này không?');
        expect(apiClient.deleteTask).toHaveBeenCalledWith(1, true); // taskId: 1, isTeamLead: true
    });

    it('does not show delete button for non-team lead', async () => {
        useOutletContext.mockReturnValue({ ...mockContext, isTeamLead: false });
        render(<KanbanView sprints={[{ id: 200 }]} />);

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /trash/i })).not.toBeInTheDocument();
        });
    });
});