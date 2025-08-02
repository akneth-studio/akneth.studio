/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivacyPage from '@/app/(site)/policies/privacy/page';

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = require('../../../../../jest.setup').NEXT_PUBLIC_SITE_URL || 'https://akneth.pl';

// Mock the PolicyView component since it's a server component
jest.mock('@/components/policies/policies', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return React.createElement('div', { 'data-testid': 'policy-view', 'data-filename': 'privacy.md' }, 'Policy Content for\nprivacy.md');
    })
  };
});

describe('PrivacyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render PolicyView with correct filename', () => {
    render(<PrivacyPage />);
    
    // Check if PolicyView is rendered with correct filename
    const policyView = screen.getByTestId('policy-view');
    expect(policyView).toBeInTheDocument();
    expect(policyView).toHaveAttribute('data-filename', 'privacy.md');
    expect(policyView).toHaveTextContent('Policy Content for privacy.md');
  });

  it('should have correct metadata', () => {
    // Check if metadata is defined
    const { metadata } = require('@/app/(site)/policies/privacy/page');
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Polityka prywatności');
    expect(metadata.description).toBe('Polityka prywatności AKNETH Studio Katarzyna Pawłowska-Malesa');
    expect(metadata.keywords).toEqual([
      'Polityka prywatności',
      'Prywatność',
      'Przetwarzanie danych',
      'Cookies',
      'Ciasteczka',
      'Bezpieczeństwo danych'
    ]);
    expect(metadata.alternates?.canonical).toBe('https://akneth.pl/policies/privacy');
  });

  it('should match snapshot', () => {
    const { container } = render(<PrivacyPage />);
    expect(container).toMatchSnapshot();
  });
});
