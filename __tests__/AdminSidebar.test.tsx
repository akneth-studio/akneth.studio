import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AdminSidebar from '../src/components/layout/AdminSidebar';
import '@testing-library/jest-dom';

jest.mock('../src/utils/supabase/client', () => {
  return {
    supabase: {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-id',
              user_metadata: { display_name: 'Test User' },
            },
          },
        }),
        onAuthStateChange: jest.fn().mockReturnValue({
          subscription: { unsubscribe: jest.fn() },
        }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation((cb) => cb({ count: 0, error: null })),
    },
  };
});

describe('AdminSidebar component', () => {
  it('renders and updates user state without act warnings', async () => {
    await act(async () => {
      render(<AdminSidebar />);
    });

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
