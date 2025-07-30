import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CTAButton from '../src/components/CTAButton';
import '@testing-library/jest-dom';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('CTAButton component', () => {
  const onClickMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with children and calls onClick when clicked', () => {
    render(
      <CTAButton onClick={onClickMock} text="Click me" type="button" />
    );
    const button = screen.getByLabelText('Click me');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('renders disabled button when disabled prop is true', () => {
    render(
      <CTAButton disabled text="Disabled" type="button" />
    );
    const button = screen.getByLabelText('Disabled');
    expect(button).toBeDisabled();
  });

  it('navigates to href when href prop is provided', async () => {
    render(
      <CTAButton to="/test" text="Navigate" type="button" />
    );
    const button = screen.getByLabelText('Navigate');
    fireEvent.click(button);
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/test');
    });
  });
});
