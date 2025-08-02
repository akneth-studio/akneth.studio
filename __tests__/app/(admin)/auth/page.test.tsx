/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AuthCallback from '@/app/(admin)/auth/page';

jest.mock('next/navigation', () => {
  const replaceMock = jest.fn();
  const notFoundMock = jest.fn();
  return {
    useRouter: () => ({
      replace: replaceMock,
    }),
    notFound: notFoundMock,
  };
});

jest.mock('@/utils/supabase/client', () => {
  return {
    supabase: {
      auth: {
        getUser: jest.fn(),
      },
    },
  };
});

global.fetch = jest.fn();

describe('AuthCallback Page', () => {
  let mockReplace: jest.Mock;
  let mockNotFound: jest.Mock;
  let mockGetUser: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    const nextNavigation = require('next/navigation');
    mockReplace = nextNavigation.useRouter().replace;
    mockNotFound = nextNavigation.notFound;

    const { supabase } = require('@/utils/supabase/client');
    mockGetUser = supabase.auth.getUser;

    // Default mocks
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user123' } } });
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ allowed: true }),
    });
  });

  it('renders loading text', () => {
    render(<AuthCallback />);
    expect(screen.getByText('Logowanie...')).toBeInTheDocument();
  });

  it('calls notFound when getUser resolves with no user data', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: undefined } });

    render(<AuthCallback />);

    await waitFor(() => {
      expect(mockNotFound).toHaveBeenCalled();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('calls notFound when getUser returns null user', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    render(<AuthCallback />);

    await waitFor(() => {
      expect(mockNotFound).toHaveBeenCalled();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('calls notFound when check-admin API returns not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<AuthCallback />);

    await waitFor(() => {
      expect(mockNotFound).toHaveBeenCalled();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('calls notFound when check-admin API returns allowed false', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ allowed: false }),
    });

    render(<AuthCallback />);

    await waitFor(() => {
      expect(mockNotFound).toHaveBeenCalled();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects to /admin when allowed', async () => {
    render(<AuthCallback />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/admin');
    });
    expect(mockNotFound).not.toHaveBeenCalled();
  });
});
