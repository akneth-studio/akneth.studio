/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/app/(admin)/admin/page';

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = require('../../../../jest.setup').NEXT_PUBLIC_SITE_URL || 'https://akneth.pl';

// Mock the CTAButton component
jest.mock('@/components/CTAButton', () => {
  return {
    __esModule: true,
    default: jest.fn(({ text, to }) => {
      return React.createElement('button', { 'data-testid': 'cta-button', 'data-text': text, 'data-to': to }, text);
    })
  };
});

// Mock the Summary component
jest.mock('@/components/admin/Summary', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return React.createElement('div', { 'data-testid': 'summary-component' }, 'Summary Component');
    })
  };
});

// Mock Supabase client
jest.mock('@/utils/supabase/client', () => {
  return {
    supabase: {
      auth: {
        getUser: jest.fn(),
      },
    },
  };
});

describe('Admin Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation
    const { supabase } = require('@/utils/supabase/client');
    supabase.auth.getUser.mockReset();
  });

  it('should render login prompt when user is not authenticated', async () => {
    // Mock unauthenticated user
    const { supabase } = require('@/utils/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    render(<Dashboard />);
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        const hasText = (node: Element | null) => node !== null && node.textContent === 'Witaj, Użytkowniku!';
        const elementHasText = hasText(element);
        const childrenDontHaveText = Array.from(element?.children || []).every(child => !hasText(child));
        return elementHasText && childrenDontHaveText;
      })).toBeInTheDocument();
    });
    
    expect(screen.getByText('Dostęp tylko po zalogowaniu.')).toBeInTheDocument();
    
    // Check if login button is rendered
    const loginButtons = screen.getAllByTestId('cta-button');
    expect(loginButtons[0]).toBeInTheDocument();
    expect(loginButtons[0]).toHaveAttribute('data-text', 'Zaloguj się');
    expect(loginButtons[0]).toHaveAttribute('data-to', '/admin/login');
  });

  it('should render admin panel when user is authenticated', async () => {
    // Mock authenticated user
    const mockUser = {
      id: 'user123',
      user_metadata: {
        display_name: 'Admin User'
      }
    };
    
    const { supabase } = require('@/utils/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

    render(<Dashboard />);
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(screen.getByText('PANEL ADMINA')).toBeInTheDocument();
    });
    
    expect(screen.getByText((content, element) => {
      const hasText = (node: Element | null) => node !== null && node.textContent === 'Witaj, Admin User!';
      const elementHasText = hasText(element);
      const childrenDontHaveText = Array.from(element?.children || []).every(child => !hasText(child));
      return elementHasText && childrenDontHaveText;
    })).toBeInTheDocument();
    expect(screen.getByText('Jesteś zalogowany jako admin.')).toBeInTheDocument();
    expect(screen.getByTestId('summary-component')).toBeInTheDocument();
  });

  it('should render with default name when display_name is not available', async () => {
    // Mock authenticated user without display_name
    const mockUser = {
      id: 'user123',
      user_metadata: {}
    };
    
    const { supabase } = require('@/utils/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

    render(<Dashboard />);
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        const hasText = (node: Element | null) => node !== null && node.textContent === 'Witaj, Użytkowniku!';
        const elementHasText = hasText(element);
        const childrenDontHaveText = Array.from(element?.children || []).every(child => !hasText(child));
        return elementHasText && childrenDontHaveText;
      })).toBeInTheDocument();
    });
  });

  it('should match snapshot when user is not authenticated', async () => {
    const { supabase } = require('@/utils/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    const { container } = render(<Dashboard />);
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        const hasText = (node: Element | null) => node !== null && node.textContent === 'Witaj, Użytkowniku!';
        const elementHasText = hasText(element);
        const childrenDontHaveText = Array.from(element?.children || []).every(child => !hasText(child));
        return elementHasText && childrenDontHaveText;
      })).toBeInTheDocument();
    });
    
    expect(container).toMatchSnapshot();
  });
});
