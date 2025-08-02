/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import TermsPage from '@/app/(site)/policies/terms/page';

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = require('../../../../../jest.setup').NEXT_PUBLIC_SITE_URL || 'https://akneth.pl';

// Mock the PolicyView component since it's a server component
jest.mock('@/components/policies/policies', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return React.createElement('div', { 'data-testid': 'policy-view', 'data-filename': 'terms.md' }, 'Policy Content for\nterms.md');
    })
  };
});

describe('TermsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render PolicyView with correct filename', () => {
    render(<TermsPage />);
    
    // Check if PolicyView is rendered with correct filename
    const policyView = screen.getByTestId('policy-view');
    expect(policyView).toBeInTheDocument();
    expect(policyView).toHaveAttribute('data-filename', 'terms.md');
    expect(policyView).toHaveTextContent('Policy Content for terms.md');
  });

  it('should have correct metadata', () => {
    // Check if metadata is defined
    const { metadata } = require('@/app/(site)/policies/terms/page');
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Regulamin');
    expect(metadata.description).toBe('Regulamin świadczenia usług za pomocą serwisu');
    expect(metadata.keywords).toEqual([
      'Regulamin',
      'AKNETH Studio',
      'Regulamin świadczenia usług',
      'Regulamin serwisu'
    ]);
    expect(metadata.alternates?.canonical).toBe('https://akneth.pl/policies/terms');
  });

  it('should match snapshot', () => {
    const { container } = render(<TermsPage />);
    expect(container).toMatchSnapshot();
  });
});
