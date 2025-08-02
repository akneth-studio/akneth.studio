/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MessageDetail from '@/app/(admin)/admin/messages/[id]/page';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

// Mock the notFound function from next/navigation
jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}));

// Mock the ReplyForm component
jest.mock('@/components/admin/replyForm', () => ({
    __esModule: true,
    default: ({ msg }: { msg: any }) => (
        <div data-testid="mock-reply-form">Mock Reply Form for {msg.id}</div>
    ),
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
    const mockSingle = jest.fn();
    const mockEq = jest.fn(() => ({
        single: mockSingle,
    }));
    const mockSelect = jest.fn(() => ({
        eq: mockEq,
    }));
    const mockUpdateSingle = jest.fn();
    const mockUpdateEq = jest.fn(() => ({
        single: mockUpdateSingle,
    }));
    const mockUpdate = jest.fn(() => ({
        eq: mockUpdateEq,
    }));
    const mockFrom = jest.fn(() => ({
        select: mockSelect,
        update: mockUpdate,
    }));

    return {
        createClient: jest.fn(() => ({
            from: mockFrom,
        })),
        __esModule: true,
        _mockSingle: mockSingle,
        _mockEq: mockEq,
        _mockSelect: mockSelect,
        _mockUpdate: mockUpdate,
        _mockFrom: mockFrom,
        _mockUpdateEq: mockUpdateEq,
        _mockUpdateSingle: mockUpdateSingle,
    };
});

const mockMessage = {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message.',
    created_at: '2023-01-01T12:00:00Z',
    replied: false,
    is_read: false,
};

describe('MessageDetail', () => {
    let mockSingle: jest.Mock;
    let mockEq: jest.Mock;
    let mockSelect: jest.Mock;
    let mockUpdate: jest.Mock;
    let mockFrom: jest.Mock;
    let mockUpdateEq: jest.Mock;
    let mockUpdateSingle: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        const supabaseMock = require('@supabase/supabase-js');
        mockSingle = supabaseMock._mockSingle;
        mockEq = supabaseMock._mockEq;
        mockSelect = supabaseMock._mockSelect;
        mockUpdate = supabaseMock._mockUpdate;
        mockFrom = supabaseMock._mockFrom;
        mockUpdateEq = supabaseMock._mockUpdateEq;
        mockUpdateSingle = supabaseMock._mockUpdateSingle;

        // Default successful fetch
        mockSingle.mockResolvedValue({ data: mockMessage, error: null });
        mockUpdateSingle.mockResolvedValue({ data: null, error: null });
    });

    it('renders message details and matches snapshot when message is fetched successfully', async () => {
        const { asFragment } = render(await MessageDetail({ params: Promise.resolve({ id: mockMessage.id }) }));
        await waitFor(() => {
            expect(screen.getByTestId('mock-reply-form')).toBeInTheDocument();
        });
        expect(asFragment()).toMatchSnapshot();
        expect(mockFrom).toHaveBeenCalledWith('messages');
        expect(mockSelect).toHaveBeenCalledWith('*');
        expect(mockEq).toHaveBeenCalledWith('id', mockMessage.id);
        expect(mockSingle).toHaveBeenCalled();
        expect(screen.getByText(`Mock Reply Form for ${mockMessage.id}`)).toBeInTheDocument();
    });

    it('calls notFound when message is not found', async () => {
        mockSingle.mockResolvedValue({ data: null, error: { message: 'Not found' } });
        render(await MessageDetail({ params: Promise.resolve({ id: 'non-existent-id' }) }));
        await waitFor(() => {
            expect(notFound).toHaveBeenCalled();
        });
    });

    it('marks message as read if it is not already read', async () => {
        const unreadMessage = { ...mockMessage, is_read: false };
        mockSingle.mockResolvedValueOnce({ data: unreadMessage, error: null });
        mockUpdateSingle.mockResolvedValueOnce({ data: null, error: null }); // Mock the update call

        render(await MessageDetail({ params: Promise.resolve({ id: unreadMessage.id }) }));

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
            expect(mockUpdateEq).toHaveBeenCalledWith('id', unreadMessage.id);
            expect(mockUpdateSingle).toHaveBeenCalled();
        });
    });

    it('does not mark message as read if it is already read', async () => {
        const readMessage = { ...mockMessage, is_read: true };
        mockSingle.mockResolvedValueOnce({ data: readMessage, error: null });

        render(await MessageDetail({ params: Promise.resolve({ id: readMessage.id }) }));

        await waitFor(() => {
            expect(mockUpdate).not.toHaveBeenCalled();
        });
    });
});