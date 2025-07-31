import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../src/components/layout/Footer';

describe('Footer component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });
});
