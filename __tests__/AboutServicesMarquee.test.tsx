import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutServicesMarquee from '../src/components/AboutServicesMarquee';
import '@testing-library/jest-dom';

describe('AboutServicesMarquee component', () => {
  it('renders without crashing and displays key content', () => {
    render(<AboutServicesMarquee />);
    // Check for some expected text or elements in the marquee
    expect(screen.getByText(/zakres usług/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /zobacz pełną ofertę/i })).toBeInTheDocument();
  });
});
