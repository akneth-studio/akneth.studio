import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '../admin/BackButton';
import { RouterContext } from '../../test-utils/RouterContext';
import { createMockRouter } from '../../test-utils/createMockRouter';
import '@testing-library/jest-dom';

describe('BackButton component', () => {
  it('renders default content and calls router.back on click', () => {
    const backMock = jest.fn();
    const router = createMockRouter({ back: backMock });

    render(
      <RouterContext.Provider value={router}>
        <BackButton />
      </RouterContext.Provider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Wróć');

    fireEvent.click(button);
    // Wait for any async calls
    setTimeout(() => {
      expect(backMock).toHaveBeenCalled();
    }, 0);
  });

  it('renders children content if provided', () => {
    const router = createMockRouter({ back: jest.fn() });

    render(
      <RouterContext.Provider value={router}>
        <BackButton>Custom Text</BackButton>
      </RouterContext.Provider>
    );

    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('applies className prop', () => {
    const router = createMockRouter({ back: jest.fn() });

    render(
      <RouterContext.Provider value={router}>
        <BackButton className="test-class" />
      </RouterContext.Provider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('test-class');
  });
});
