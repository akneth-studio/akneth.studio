import React from 'react';
import { render, screen } from '@testing-library/react';
import ShortAboutSection from '../src/components/home/ShortAboutSection';
import '@testing-library/jest-dom';

describe('ShortAboutSection component', () => {
  it('renders heading and short about text', () => {
    render(<ShortAboutSection />);
    // The heading text is "O mnie"
    expect(screen.getByRole('heading', { name: /o mnie/i })).toBeInTheDocument();
    // Add more specific checks if the component renders specific text or elements
  });

  it('matches snapshot', () => {
    const { container } = render(<ShortAboutSection />);
    expect(container).toMatchSnapshot();
  });
});
