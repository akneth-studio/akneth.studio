import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navbar from '../src/components/layout/Navbar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

describe('Navbar component', () => {
  it('renders without crashing', () => {
    render(<Navbar />);
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });
});
