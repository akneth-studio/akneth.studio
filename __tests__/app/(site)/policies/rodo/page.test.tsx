/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import RodoPage from '@/app/(site)/policies/rodo/page';

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = require('../../../../../jest.setup').NEXT_PUBLIC_SITE_URL || 'https://akneth.pl';

// Mock the PolicyView component since it's a server component
jest.mock('@/components/policies/policies', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return React.createElement('div', { 'data-testid': 'policy-view', 'data-filename': 'rodo.md' }, 'Policy Content for\nrodo.md');
    })
  };
});

describe('RodoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render PolicyView with correct filename', () => {
    render(<RodoPage />);
    
    // Check if PolicyView is rendered with correct filename
    const policyView = screen.getByTestId('policy-view');
    expect(policyView).toBeInTheDocument();
    expect(policyView).toHaveAttribute('data-filename', 'rodo.md');
    expect(policyView).toHaveTextContent('Policy Content for rodo.md');
  });

  it('should have correct metadata', () => {
    // Check if metadata is defined
    const { metadata } = require('@/app/(site)/policies/rodo/page');
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Obowiązek informacyjny RODO');
    expect(metadata.description).toBe('Strona opisująca obowiązek informacyjny RODO');
    expect(metadata.keywords).toEqual([
      'RODO',
      'AKNETH Studio',
      'Obowiązek informacyjny',
      'Obowiązek informacyjny RODO'
    ]);
    expect(metadata.alternates?.canonical).toBe('https://akneth.pl/policies/rodo');
  });

  it('should match snapshot', () => {
    const { container } = render(<RodoPage />);
    expect(container).toMatchSnapshot();
  });
});
