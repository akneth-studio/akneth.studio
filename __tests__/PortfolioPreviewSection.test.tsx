import React from 'react';
import { render, screen } from '@testing-library/react';
import PortfolioPreviewSection from '../src/components/home/PortfolioPreviewSection';
import '@testing-library/jest-dom';

describe('PortfolioPreviewSection component', () => {
  it('renders heading and portfolio items with links', () => {
    render(<PortfolioPreviewSection />);
    expect(screen.getByRole('heading', { name: /portfolio/i })).toBeInTheDocument();
    expect(screen.getByText(/szablon google sheets dla kawiarni/i)).toBeInTheDocument();
    expect(screen.getByText(/strona pisarska/i)).toBeInTheDocument();
    expect(screen.getByText(/serwis hulajnóg/i)).toBeInTheDocument();
    expect(screen.getByText(/wkrótce więcej przykładów/i)).toBeInTheDocument();

    // Check links
    expect(screen.getByRole('link', { name: /zobacz na google drive/i })).toHaveAttribute('href');
    const githubLinks = screen.getAllByRole('link', { name: /repozytorium na github/i });
    expect(githubLinks.length).toBeGreaterThan(1);
    githubLinks.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('matches snapshot', () => {
    const { container } = render(<PortfolioPreviewSection />);
    expect(container).toMatchSnapshot();
  });
});
