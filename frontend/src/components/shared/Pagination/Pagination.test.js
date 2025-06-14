// src/components/shared/Pagination.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination Component', () => {
    const mockOnPageChange = jest.fn();
    const mockOnItemsPerPageChange = jest.fn();

    beforeEach(() => {
        mockOnPageChange.mockClear();
        mockOnItemsPerPageChange.mockClear();
    });

    it('renders correctly and shows correct page info', () => {
        render(
            <Pagination
                currentPage={3}
                totalPages={10}
                totalItems={95}
                itemsPerPage={10}
                onPageChange={mockOnPageChange}
                onItemsPerPageChange={mockOnItemsPerPageChange}
            />
        );

        // Check if the current page is active
        expect(screen.getByRole('button', { name: '3' })).toHaveClass('active');
        // Check total items info
        expect(screen.getByText('of 95 rows')).toBeInTheDocument();
    });

    it('calls onPageChange when a page button is clicked', async () => {
        render(
            <Pagination
                currentPage={3}
                totalPages={10}
                totalItems={95}
                itemsPerPage={10}
                onPageChange={mockOnPageChange}
                onItemsPerPageChange={mockOnItemsPerPageChange}
            />
        );

        const page5Button = screen.getByRole('button', { name: '5' });
        await userEvent.click(page5Button);

        expect(mockOnPageChange).toHaveBeenCalledWith(5);
    });

    it('calls onItemsPerPageChange when select is changed', async () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={10}
                totalItems={95}
                itemsPerPage={10}
                onPageChange={mockOnPageChange}
                onItemsPerPageChange={mockOnItemsPerPageChange}
            />
        );

        const select = screen.getByRole('combobox');
        await userEvent.selectOptions(select, '20');

        // RTL fireEvent for select change is slightly different
        expect(mockOnItemsPerPageChange).toHaveBeenCalled();
    });

    it('disables previous and first page buttons on page 1', () => {
        render(
            <Pagination
                currentPage={1} totalPages={10} totalItems={95} itemsPerPage={10}
                onPageChange={mockOnPageChange} onItemsPerPageChange={mockOnItemsPerPageChange}
            />
        );

        expect(screen.getByRole('button', { name: /«/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /‹/i })).toBeDisabled();
    });

    it('does not render if totalItems is 0', () => {
        const { container } = render(
            <Pagination
                currentPage={1} totalPages={1} totalItems={0} itemsPerPage={10}
                onPageChange={mockOnPageChange} onItemsPerPageChange={mockOnItemsPerPageChange}
            />
        );

        expect(container.firstChild).toBeNull();
    });
});