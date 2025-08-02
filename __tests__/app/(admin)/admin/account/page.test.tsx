/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Account from '@/app/(admin)/admin/account/page';

// Mock Supabase client
jest.mock('@/utils/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}));

describe('Account Page', () => {
  const mockGetUser = jest.fn();
  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the actual mock functions from the module
    const { supabase } = require('@/utils/supabase/client');
    Object.assign(mockGetUser, supabase.auth.getUser);
    Object.assign(mockUpdateUser, supabase.auth.updateUser);
    
    // Default mock implementations
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user123',
          email: 'test@example.com',
          user_metadata: {
            display_name: 'Test User'
          }
        }
      }
    });
    
    mockUpdateUser.mockResolvedValue({ error: null });
  });

  it('renders account information', async () => {
    render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Moje konto')).toBeInTheDocument();
      expect(screen.getByText('user123')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('renders correctly', async () => {
    const { container } = render(<Account />);
    
    await waitFor(() => {
      expect(screen.getByText('Moje konto')).toBeInTheDocument();
    });
    
    expect(container).toMatchSnapshot();
  });

  it('updates display name', async () => {
    render(<Account />);
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    // Fill in new display name
    const displayNameInput = screen.getByPlaceholderText('Imię i nazwisko lub pseudonim');
    fireEvent.change(displayNameInput, { target: { value: 'New Name' } });
    
    // Submit form
    const saveButton = screen.getByText('Zapisz nazwę konta');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ 
        data: { display_name: 'New Name' } 
      });
    });
  });

  it('changes email', async () => {
    render(<Account />);
    
    // Fill in new email
    const emailInput = screen.getByPlaceholderText('Podaj nowy e-mail');
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    
    // Submit form
    const changeEmailButton = screen.getByText('Zmień e-mail');
    fireEvent.click(changeEmailButton);
    
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ 
        email: 'new@example.com' 
      });
    });
  });

  it('changes password', async () => {
    render(<Account />);
    
    // Fill in password fields
    const passwordInput = screen.getByPlaceholderText('Nowe hasło');
    const confirmPasswordInput = screen.getByPlaceholderText('Powtórz nowe hasło');
    
    fireEvent.change(passwordInput, { target: { value: 'test-password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'test-password' } });
    
    // Submit form
    const changePasswordButton = screen.getByText('Zmień hasło');
    fireEvent.click(changePasswordButton);
    
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ 
        // deepcode ignore NoHardcodedPasswords/test: test file
        password: 'test-password' 
      });
    });
  });

  it('shows error when passwords do not match', async () => {
    render(<Account />);
    
    // Fill in password fields with different values
    const passwordInput = screen.getByPlaceholderText('Nowe hasło');
    const confirmPasswordInput = screen.getByPlaceholderText('Powtórz nowe hasło');
    
    fireEvent.change(passwordInput, { target: { value: 'test-password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different-test-password' } });
    
    // Submit form
    const changePasswordButton = screen.getByText('Zmień hasło');
    fireEvent.click(changePasswordButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hasła muszą być identyczne.')).toBeInTheDocument();
    });
    
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it('shows error when display name is empty', async () => {
    render(<Account />);
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
    
    // Clear the display name input
    const displayNameInput = screen.getByPlaceholderText('Imię i nazwisko lub pseudonim');
    fireEvent.change(displayNameInput, { target: { value: '' } });
    
    // Get the form and submit it
    const form = screen.getByText('Twoja nazwa konta').closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Podaj nazwę konta.')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});
