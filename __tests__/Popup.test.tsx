import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Popup from '../src/components/Popup';
import { AppRouterContextProvider } from '../test-utils/AppRouterContext';
import '@testing-library/jest-dom';

describe('Popup component', () => {
  const onCloseMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders success type with message and calls onClose when close button clicked', () => {
    render(
      <AppRouterContextProvider>
        <Popup show={true} onClose={onCloseMock} message="Success message" type="success" />
      </AppRouterContextProvider>
    );
    expect(screen.getByText('Informacja')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zamknij/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /zamknij/i }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('renders error type with message', () => {
    render(
      <AppRouterContextProvider>
        <Popup show={true} onClose={onCloseMock} message="Error message" type="error" />
      </AppRouterContextProvider>
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('does not render when show is false', () => {
    render(
      <AppRouterContextProvider>
        <Popup show={false} onClose={onCloseMock} message="Hidden message" />
      </AppRouterContextProvider>
    );
    expect(screen.queryByText('Hidden message')).not.toBeInTheDocument();
  });
});
