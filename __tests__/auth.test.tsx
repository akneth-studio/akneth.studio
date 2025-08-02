import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Auth from '../src/components/admin/auth';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

// Mock supabase client
jest.mock('../src/utils/supabase/client', () => {
  return {
    supabase: {
      auth: {
        getUser: jest.fn(),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
      },
    },
  };
});

// Mock next/navigation
jest.mock('next/navigation');

import { supabase } from '../src/utils/supabase/client';
const getUserMock = supabase.auth.getUser as jest.Mock;
const useRouterMock = useRouter as jest.Mock;

describe('Auth component', () => {
  const pushMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({
      push: pushMock,
    });
  });

  it('renders children when user is authenticated', async () => {
    // Mock an authenticated user
    getUserMock.mockResolvedValue({
      data: { user: { id: '123', email: 'test@test.com' } },
      error: null,
    });

    render(
      <Auth>
        <div data-testid="child-component">Protected Content</div>
      </Auth>,
    );

    // It should stop loading
    await waitFor(() => {
      expect(screen.queryByText(/ładowanie/i)).not.toBeInTheDocument();
    });

    // It should render the children
    expect(screen.getByTestId('child-component')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();

    // It should NOT redirect
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('redirects to login when user is not authenticated', async () => {
    // Mock a non-authenticated user
    getUserMock.mockResolvedValue({ data: { user: null }, error: null });

    render(
      <Auth>
        <div data-testid="child-component">Protected Content</div>
      </Auth>,
    );

    // It should redirect
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/admin/login');
    });

    // It should NOT render the children
    expect(screen.queryByTestId('child-component')).not.toBeInTheDocument();
  });

  it('redirects to login when getUser returns an error', async () => {
    // Temporarily mock console.error to suppress the expected error message
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock an error during user fetch
    getUserMock.mockResolvedValue({
      data: { user: null },
      error: new Error('Network error'),
    });

    render(
      <Auth>
        <div data-testid="child-component">Protected Content</div>
      </Auth>,
    );

    // It should redirect
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/admin/login');
    });

    // It should NOT render the children
    expect(screen.queryByTestId('child-component')).not.toBeInTheDocument();

    // Restore the original console.error
    consoleErrorSpy.mockRestore();
  });

  it('redirects to login when getUser rejects', async () => {
    // Temporarily mock console.error to suppress the expected error message
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock a rejection during user fetch
    getUserMock.mockRejectedValue(new Error('Fetch rejected'));

    render(
      <Auth>
        <div data-testid="child-component">Protected Content</div>
      </Auth>,
    );

    // It should redirect
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/admin/login');
    });

    // It should NOT render the children
    expect(screen.queryByTestId('child-component')).not.toBeInTheDocument();

    // Restore the original console.error
    consoleErrorSpy.mockRestore();
  });
});
