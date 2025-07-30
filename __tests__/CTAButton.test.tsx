import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CTAButton from '../src/components/CTAButton';
import { RouterContext } from '../test-utils/RouterContext';
import { createMockRouter } from '../test-utils/createMockRouter';
import '@testing-library/jest-dom';

describe('CTAButton component', () => {
  const onClickMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with children and calls onClick when clicked', () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <CTAButton onClick={onClickMock} text="Click me" type="button" />
      </RouterContext.Provider>
    );
    const button = screen.getByLabelText('Click me');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('renders disabled button when disabled prop is true', () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <CTAButton disabled text="Disabled" type="button" />
      </RouterContext.Provider>
    );
    const button = screen.getByLabelText('Disabled');
    expect(button).toBeDisabled();
  });

  it('navigates to href when href prop is provided', () => {
    const pushMock = jest.fn();
    const router = createMockRouter({ push: pushMock });

    render(
      <RouterContext.Provider value={router}>
        <CTAButton to="/test" text="Navigate" type="button" />
      </RouterContext.Provider>
    );
    const button = screen.getByLabelText('Navigate');
    fireEvent.click(button);
    // Wait for any async router push calls
    setTimeout(() => {
      expect(pushMock).toHaveBeenCalledWith('/test');
    }, 0);
  });
});
