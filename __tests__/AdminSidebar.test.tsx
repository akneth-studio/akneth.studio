import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the supabase client
jest.mock('@/utils/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: {
          subscription: { unsubscribe: jest.fn() },
        },
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          then: jest.fn(),
        })),
      })),
    })),
  },
}));

// Get a typed reference to the mocked functions
const mockGetUser = supabase.auth.getUser as jest.Mock;
const mockSignOut = supabase.auth.signOut as jest.Mock;
const mockFrom = supabase.from as jest.Mock;

describe('AdminSidebar component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Default mock implementation for successful user fetch
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-id',
          user_metadata: { display_name: 'Test User' },
        },
      },
    });

    // Default mock implementation for unread messages count
    const mockThen = jest.fn(async (callback) => callback({ count: 5, error: null }));
    const mockEq = jest.fn(() => ({ then: mockThen }));
    const mockSelect = jest.fn(() => ({ eq: mockEq }));
    mockFrom.mockImplementation(() => ({ select: mockSelect }));
  });

  it('renders all navigation links with correct href attributes', async () => {
    await act(async () => {
      render(<AdminSidebar />);
    });

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/admin');
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/admin/dashboard');
    expect(screen.getByText('Contact Form').closest('a')).toHaveAttribute('href', '/admin/messages');
    expect(screen.getByText('Treści').closest('a')).toHaveAttribute('href', '/admin/content');
    expect(screen.getByText('Bannery').closest('a')).toHaveAttribute('href', '/admin/vacation');
  });

  it('displays the user name and unread messages count', async () => {
    await act(async () => {
      render(<AdminSidebar />);
    });

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Unread count badge
  });

  it('calls signOut and redirects on logout button click', async () => {
    await act(async () => {
      render(<AdminSidebar />);
    });

    const dropdownToggle = screen.getByText('Test User');
    await act(async () => {
      fireEvent.click(dropdownToggle);
    });

    const logoutButton = await screen.findByText('Wyloguj się');
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/admin/login');
  });

  it('redirects to account page on account button click', async () => {
    await act(async () => {
      render(<AdminSidebar />);
    });

    const dropdownToggle = screen.getByText('Test User');
    await act(async () => {
      fireEvent.click(dropdownToggle);
    });

    const accountButton = await screen.findByText('Konto');
    await act(async () => {
      fireEvent.click(accountButton);
    });

    expect(mockPush).toHaveBeenCalledWith('/admin/account');
  });

  it('shows login button when user is not authenticated', async () => {
    // Mock that no user is returned
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await act(async () => {
      render(<AdminSidebar />);
    });

    expect(screen.getByText('Zaloguj się')).toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('handles error when fetching unread messages count', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockThen = jest.fn(async (callback) => callback({ count: null, error: new Error('Fetch error') }));
    const mockEq = jest.fn(() => ({ then: mockThen }));
    const mockSelect = jest.fn(() => ({ eq: mockEq }));
    mockFrom.mockImplementation(() => ({ select: mockSelect }));

    await act(async () => {
      render(<AdminSidebar />);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching unread messages:', expect.any(Error));
    expect(screen.queryByText('5')).not.toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});