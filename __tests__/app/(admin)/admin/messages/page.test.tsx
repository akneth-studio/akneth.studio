/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MessagesList from '@/app/(admin)/admin/messages/page';
import { createClient } from '@supabase/supabase-js';

// Mock the Auth component
jest.mock('@/components/admin/auth', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
    const mockOrder = jest.fn();
    const mockSelect = jest.fn(() => ({
        order: mockOrder,
    }));
    const mockInMethod = jest.fn(); // This will be the 'in' method
    const mockUpdate = jest.fn((args) => ({
        in: mockInMethod, // Directly assign the mockInMethod
    }));
    const mockFrom = jest.fn(() => ({
        select: mockSelect,
        update: mockUpdate,
    }));

    return {
        createClient: jest.fn(() => ({
            from: mockFrom,
        })),
        __esModule: true, // Important for default exports
        _mockOrder: mockOrder,
        _mockUpdate: mockUpdate,
        _mockIn: mockInMethod, // Export the actual 'in' method mock
    };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => {
        return <a href={href}>{children}</a>;
    };
});

const mockMessages = [
    {
        id: '1',
        name: 'John Doe',
        company: 'ABC Corp',
        email: 'john@example.com',
        subject: 'Inquiry 1',
        created_at: '2023-01-01T10:00:00Z',
        replied: false,
        is_read: false,
    },
    {
        id: '2',
        name: 'Jane Smith',
        company: null,
        email: 'jane@example.com',
        subject: 'Inquiry 2',
        created_at: '2023-01-02T11:00:00Z',
        replied: true,
        is_read: true,
    },
    {
        id: '3',
        name: null,
        company: null,
        email: null,
        subject: null,
        created_at: '2023-01-03T12:00:00Z',
        replied: false,
        is_read: false,
    },
];

describe('MessagesList', () => {
    let mockOrder: jest.Mock;
    let mockUpdate: jest.Mock;
    let mockIn: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        // Assign the mocks from the jest.mock scope to the test scope
        const supabaseMock = require('@supabase/supabase-js');
        mockOrder = supabaseMock._mockOrder;
        mockUpdate = supabaseMock._mockUpdate;
        mockIn = supabaseMock._mockIn;

        // Default mock for initial fetch
        mockOrder.mockResolvedValue({ data: mockMessages, error: null });
        // Ensure mockIn returns a promise for the update chain
        mockIn.mockImplementation((column, values) => Promise.resolve({ data: [], error: null }));
    });

    it('renders correctly and matches snapshot', async () => {
        const { asFragment } = render(<MessagesList />);
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders "Brak wiadomości" when no messages are fetched', async () => {
        mockOrder.mockResolvedValueOnce({ data: [], error: null });
        render(<MessagesList />);
        await waitFor(() => {
            expect(screen.getByText('Brak wiadomości.')).toBeInTheDocument();
        });
    });

    it('renders messages correctly after successful fetch', async () => {
        render(<MessagesList />);
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('ABC Corp')).toBeInTheDocument();
            expect(screen.getByText('john@example.com')).toBeInTheDocument();
            expect(screen.getByText('Inquiry 1')).toBeInTheDocument();
            expect(screen.getByText('Tak')).toBeInTheDocument(); // Replied: true
            expect(screen.getAllByText('Nie')).toHaveLength(2); // Replied: false
            expect(screen.getAllByText('—')).toHaveLength(5); // For null values
        });
        expect(screen.getAllByRole('link', { name: 'Podgląd / Odpowiedz' })).toHaveLength(mockMessages.length);
    });

    it('displays an error message if fetching messages fails', async () => {
        mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'Fetch error' } });
        render(<MessagesList />);
        await waitFor(() => {
            expect(screen.getByText('Brak wiadomości.')).toBeInTheDocument(); // Component shows "Brak wiadomości" on error too
        });
    });

    it('allows selecting and deselecting messages', async () => {
        render(<MessagesList />);
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const checkbox1 = screen.getByTestId('message-checkbox-1');
        const checkbox2 = screen.getByTestId('message-checkbox-2');

        fireEvent.click(checkbox1);
        expect(checkbox1).toBeChecked();
        expect(screen.getByText('Oznacz jako przeczytane')).toBeEnabled();

        fireEvent.click(checkbox2);
        expect(checkbox2).toBeChecked();

        fireEvent.click(checkbox1);
        expect(checkbox1).not.toBeChecked();
        expect(screen.getByText('Oznacz jako przeczytane')).toBeEnabled(); // Still enabled as checkbox2 is checked
    });

    it('disables "Oznacz jako przeczytane" button when no messages are selected', async () => {
        render(<MessagesList />);
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        expect(screen.getByText('Oznacz jako przeczytane')).toBeDisabled();

        fireEvent.click(screen.getByTestId('message-checkbox-1'));
        expect(screen.getByText('Oznacz jako przeczytane')).toBeEnabled();

        fireEvent.click(screen.getByTestId('message-checkbox-1'));
        expect(screen.getByText('Oznacz jako przeczytane')).toBeDisabled();
    });

    it('marks selected messages as read and refreshes the list', async () => {
        render(<MessagesList />);
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const checkbox1 = screen.getByTestId('message-checkbox-1');
        fireEvent.click(checkbox1);

        // Mock the update and re-fetch
        mockUpdate.mockImplementationOnce((args) => {
            expect(args).toEqual({ is_read: true });
            return { in: mockIn.mockImplementationOnce((column, ids) => {
                expect(column).toEqual('id');
                expect(ids).toEqual(['1']);
                return Promise.resolve({ data: [], error: null });
            })};
        });

        mockOrder.mockResolvedValueOnce({
            data: [
                { ...mockMessages[0], is_read: true },
                mockMessages[1],
                mockMessages[2],
            ],
            error: null,
        });

        fireEvent.click(screen.getByText('Oznacz jako przeczytane'));

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
            expect(mockIn).toHaveBeenCalledWith('id', ['1']);
            expect(mockOrder).toHaveBeenCalledTimes(2); // Initial fetch + re-fetch
            expect(checkbox1).not.toBeChecked(); // Verify checkbox is unchecked after action
        });
        expect(screen.getByText('Oznacz jako przeczytane')).toBeDisabled(); // Button should be disabled after action
    });

    it('handles error when marking messages as read', async () => {
        render(<MessagesList />);
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const checkbox1 = screen.getByTestId('message-checkbox-1');
        fireEvent.click(checkbox1);

        mockUpdate.mockImplementationOnce((args) => {
            expect(args).toEqual({ is_read: true });
            return { in: mockIn.mockImplementationOnce((column, ids) => {
                expect(column).toEqual('id');
                expect(ids).toEqual(['1']);
                return Promise.resolve({ data: null, error: { message: 'Update error' } });
            })};
        });

        fireEvent.click(screen.getByText('Oznacz jako przeczytane'));

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
            expect(mockIn).toHaveBeenCalledWith('id', ['1']);
            // The component doesn't explicitly show an error for update,
            // but it should not change the state of the messages or clear selection.
            expect(checkbox1).toBeChecked(); // Should still be checked if update failed
        });
    });
});