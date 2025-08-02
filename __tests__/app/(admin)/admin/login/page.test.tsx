/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLogin from '@/app/(admin)/admin/login/page';

const { mockSignInWithPassword, mockSignInWithOAuth, mockOnAuthStateChange } = require('../../../../../jest.setup');

jest.mock('@/utils/supabase/client', () => {
    const { mockSignInWithPassword, mockSignInWithOAuth, mockOnAuthStateChange } = require('../../../../../jest.setup');
    return {
        supabase: {
            auth: {
            signInWithPassword: mockSignInWithPassword,
            signInWithOAuth: mockSignInWithOAuth,
            onAuthStateChange: mockOnAuthStateChange,
            },
        },
    };
});

jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    }),
    notFound: jest.fn(),
  };
});



const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('AdminLogin Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    +    sessionStorageMock.clear();
    mockSignInWithPassword.mockResolvedValue({ data: null, error: null });
    mockSignInWithOAuth.mockResolvedValue({ data: null, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    });
    // Ensure router.push is a jest.fn() to avoid errors
    const nextNavigation = require('next/navigation');
    if (nextNavigation.useRouter) {
      const router = nextNavigation.useRouter();
      if (!router.push) {
        router.push = jest.fn();
      }
    }
    
  });

  it('renders login form elements', () => {
    render(<AdminLogin />);
    expect(screen.getByText('Logowanie do panelu admina')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Hasło')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zaloguj się' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zaloguj przez Google' })).toBeInTheDocument();
  });

  it('allows typing in email and password inputs', () => {
    render(<AdminLogin />);
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Hasło');
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(emailInput).toHaveValue('user@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls signInWithPassword on form submit', async () => {
    render(<AdminLogin />);
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Hasło');
    const submitButton = screen.getByRole('button', { name: 'Zaloguj się' });
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });

  it('clears failed attempts on successful login', async () => {
    sessionStorageMock.setItem('loginFailedAttempts', '1');
    render(<AdminLogin />);
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Hasło');
    const submitButton = screen.getByRole('button', { name: 'Zaloguj się' });
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(sessionStorageMock.getItem('loginFailedAttempts')).toBeNull();
    });
  });

  it('shows error message on login failure', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: 'Invalid credentials' },
    });
    render(<AdminLogin />);
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Hasło');
    const submitButton = screen.getByRole('button', { name: 'Zaloguj się' });
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('increments failed attempts on login failure', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: 'Invalid credentials' },
    });
    render(<AdminLogin />);
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Hasło');
    const submitButton = screen.getByRole('button', { name: 'Zaloguj się' });
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(sessionStorageMock.getItem('loginFailedAttempts')).toBe('1');
    });
  });

  it('calls notFound when failed attempts reach max', async () => {
    sessionStorageMock.setItem('loginFailedAttempts', '1');
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: 'Invalid credentials' },
    });
    render(<AdminLogin />);
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Hasło');
    const submitButton = screen.getByRole('button', { name: 'Zaloguj się' });
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      const { notFound } = require('next/navigation');
      expect(notFound).toHaveBeenCalled();
    });
  });

  it('calls notFound on mount when failed attempts at max', () => {
    sessionStorageMock.setItem('loginFailedAttempts', '2');
    render(<AdminLogin />);
    const { notFound } = require('next/navigation');
    expect(notFound).toHaveBeenCalled();
  });

  it('initiates Google login on button click', async () => {
    render(<AdminLogin />);
    const googleButton = screen.getByRole('button', { name: 'Zaloguj przez Google' });
    fireEvent.click(googleButton);
    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth',
        },
      });
    });
  });

  it('shows error message on Google login failure', async () => {
    mockSignInWithOAuth.mockResolvedValueOnce({
      error: { message: 'Google login failed' },
    });
    render(<AdminLogin />);
    const googleButton = screen.getByRole('button', { name: 'Zaloguj przez Google' });
    fireEvent.click(googleButton);
    await waitFor(() => {
      expect(screen.getByText('Google login failed')).toBeInTheDocument();
    });
  });

  it('increments failed attempts on Google login failure', async () => {
    mockSignInWithOAuth.mockResolvedValueOnce({
      error: { message: 'Google login failed' },
    });
    render(<AdminLogin />);
    const googleButton = screen.getByRole('button', { name: 'Zaloguj przez Google' });
    fireEvent.click(googleButton);
    await waitFor(() => {
      expect(sessionStorageMock.getItem('loginFailedAttempts')).toBe('1');
    });
  });

  it('matches snapshot', () => {
    const { container } = render(<AdminLogin />);
    expect(container).toMatchSnapshot();
  });
});
