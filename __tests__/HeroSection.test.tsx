import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from '../src/components/home/HeroSection';
import '@testing-library/jest-dom';

describe('HeroSection component', () => {
  it('renders heading, paragraph and CTA button', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/szablony, automatyzacje i indywidualne rozwiązania/i)).toBeInTheDocument();
    expect(screen.getByText(/elastyczność, uczciwość i szybka realizacja/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /skontaktuj się/i })).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<HeroSection />);
    expect(container).toMatchSnapshot();
  });
});
