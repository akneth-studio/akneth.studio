import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '../src/components/admin/BackButton';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => {
  return {
    useRouter: jest.fn(() => ({
      back: jest.fn(),
    })),
  };
});

describe('BackButton component', () => {
  it('renders default content and calls router.back on click', () => {
    const { useRouter } = require('next/navigation');
    const backMock = jest.fn();
    useRouter.mockReturnValue({ back: backMock });

    render(<BackButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Wróć');

    fireEvent.click(button);
    expect(backMock).toHaveBeenCalledTimes(1);
  });

  it('renders children content if provided', () => {
    render(<BackButton>Custom Text</BackButton>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('applies className prop', () => {
    render(<BackButton className="test-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('test-class');
  });
});
