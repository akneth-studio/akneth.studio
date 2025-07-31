import React from 'react';
import { render, screen } from '@testing-library/react';
import MessagesPreview from '../src/components/admin/MessagesPreview';
import '@testing-library/jest-dom';
import { supabase as supabaseClient } from '../src/utils/supabase/client';

// Mock the supabase client module
jest.mock('../src/utils/supabase/client');

// Create a typed mock for better autocompletion and type safety
const supabase = supabaseClient as jest.Mocked<typeof supabaseClient>;

describe('MessagesPreview component', () => {
  // Define mock functions for the chained API calls
  const mockLimit = jest.fn();
  const mockOrder = jest.fn().mockReturnValue({ limit: mockLimit });
  const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });

  beforeEach(() => {
    // Reset mocks and set the implementation for the `from` method before each test
    jest.clearAllMocks();
    supabase.from.mockReturnValue({
      select: mockSelect,
    } as any); // Use `as any` to simplify the mock chain type
  });

  it('renders messages table with data when fetch is successful', async () => {
    const mockMessages = [
      {
        id: 1,
        name: 'John Doe',
        company: 'Company A',
        email: 'john@example.com',
        subject: 'Test Subject 1',
        created_at: '2024-01-01T12:00:00Z',
        replied: true,
      },
    ];
    mockLimit.mockResolvedValue({ data: mockMessages, error: null });

    const ResolvedMessagesPreview = await MessagesPreview();
    render(ResolvedMessagesPreview);

    expect(screen.getByText('Wiadomości z formularza kontaktowego')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Company A')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test Subject 1')).toBeInTheDocument();
    expect(screen.getByText('Tak')).toBeInTheDocument();

    expect(supabase.from).toHaveBeenCalledWith('messages');
    expect(mockSelect).toHaveBeenCalledWith('id, name, company, email, subject, message, created_at, replied, reply_text');
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(mockLimit).toHaveBeenCalledWith(5);
  });

  it('renders "no messages" info when no data is returned', async () => {
    mockLimit.mockResolvedValue({ data: [], error: null });

    const ResolvedMessagesPreview = await MessagesPreview();
    render(ResolvedMessagesPreview);

    expect(screen.getByText('Wiadomości z formularza kontaktowego')).toBeInTheDocument();
    expect(screen.getByText('Brak wiadomości.')).toBeInTheDocument();
  });

  it('renders an error message when data fetching fails', async () => {
    mockLimit.mockResolvedValue({ data: null, error: { message: 'Błąd sieci' } });

    const ResolvedMessagesPreview = await MessagesPreview();
    render(ResolvedMessagesPreview);

    expect(screen.getByText(/Błąd ładowania wiadomości: Błąd sieci/i)).toBeInTheDocument();
  });
});
