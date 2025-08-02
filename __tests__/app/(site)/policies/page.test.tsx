/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import PoliciesPage from '@/app/(site)/policies/page';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock react-icons
jest.mock('react-icons/lia', () => ({
  LiaAngleDoubleRightSolid: () => <span data-testid="arrow-icon">→</span>,
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = require('../../../../jest.setup').NEXT_PUBLIC_SITE_URL || 'https://akneth.pl';

describe('PoliciesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all policy cards', () => {
    render(<PoliciesPage />);
    
    // Check if all policy cards are rendered
    expect(screen.getByText('Polityka prywatności')).toBeInTheDocument();
    expect(screen.getByText('Jak przetwarzamy i chronimy Twoje dane osobowe.')).toBeInTheDocument();
    
    expect(screen.getByText('RODO')).toBeInTheDocument();
    expect(screen.getByText('Informacje o przetwarzaniu danych zgodnie z RODO.')).toBeInTheDocument();
    
    expect(screen.getByText('Regulamin')).toBeInTheDocument();
    expect(screen.getByText('Warunki korzystania z serwisu i usług AKNETH Studio.')).toBeInTheDocument();
    
    // Check if all links are present
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/policies/privacy');
    expect(links[1]).toHaveAttribute('href', '/policies/rodo');
    expect(links[2]).toHaveAttribute('href', '/policies/terms');
  });

  it('should render the correct layout structure', () => {
    render(<PoliciesPage />);
    
    // Check if the main container exists
    const container = screen.getByText('Polityki i regulaminy').parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('policiesSection');
    
    // Check if the heading exists
    const heading = screen.getByText('Polityki i regulaminy');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveClass('heading');
    
    // Check if the policies list exists
    const policiesList = screen.getByText('Polityka prywatności').parentElement?.parentElement?.parentElement;
    expect(policiesList).toBeInTheDocument();
    expect(policiesList).toHaveClass('policiesList');
  });

  it('should have correct metadata', () => {
    // Check if metadata is defined
    const { metadata } = require('@/app/(site)/policies/page');
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Polityki i regulaminy');
    expect(metadata.description).toBe('Zbiór Polityk i regulaminów AKNETH Studio');
    expect(metadata.keywords).toEqual([
      'Polityka prywatności',
      'Regulamin',
      'RODO',
      'AKNETH Studio'
    ]);
    expect(metadata.alternates?.canonical).toBe('https://akneth.pl/policies');
  });

  it('should match snapshot', () => {
    const { container } = render(<PoliciesPage />);
    expect(container).toMatchSnapshot();
  });
});
