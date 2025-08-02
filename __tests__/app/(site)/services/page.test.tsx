/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import ServicesPage from '@/app/(site)/services/page';
import ServicesAccordion from '@/components/services/ServicesAccordion';
import PricingTable from '@/components/services/PricingTable';
import HowWeWork from '@/components/services/HowWeWork';
import CTAButton from '@/components/CTAButton';

// Mock the components
jest.mock('@/components/services/ServicesAccordion', () => {
  return jest.fn(() => <div data-testid="services-accordion">Services Accordion</div>);
});

jest.mock('@/components/services/PricingTable', () => {
  return jest.fn(() => <div data-testid="pricing-table">Pricing Table</div>);
});

jest.mock('@/components/services/HowWeWork', () => {
  return jest.fn(() => <div data-testid="how-we-work">How We Work</div>);
});

jest.mock('@/components/CTAButton', () => {
  return jest.fn(() => <div data-testid="cta-button">CTA Button</div>);
});

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = require('../../../../jest.setup').NEXT_PUBLIC_SITE_URL || 'https://akneth.pl';

describe('ServicesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all sections correctly', () => {
    render(<ServicesPage />);
    
    // Check if all sections are rendered
    expect(screen.getByTestId('services-accordion')).toBeInTheDocument();
    expect(screen.getByTestId('pricing-table')).toBeInTheDocument();
    expect(screen.getByTestId('how-we-work')).toBeInTheDocument();
    expect(screen.getByTestId('cta-button')).toBeInTheDocument();
  });

  it('should render the correct layout structure', () => {
    render(<ServicesPage />);
    
    // Check if the main container exists
    const container = screen.getByTestId('services-accordion').parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('container');
    
    // Check if the heading exists
    const heading = screen.getByText('Nasze Usługi');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('should have correct metadata', () => {
    // Check if metadata is defined
    const { metadata } = require('@/app/(site)/services/page');
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Usługi');
    expect(metadata.description).toBe('Oferta AKNETH Studio: strony internetowe, sklepy online, automatyzacje i szkolenia. Sprawdź nasze ceny i proces współpracy.');
    expect(metadata.keywords).toEqual([
      'Usługi',
      'Cennik',
      'automatyzacje',
      'szkolenia',
      'proces współpracy'
    ]);
    expect(metadata.alternates?.canonical).toBe('https://akneth.pl/services');
  });

  it('should match snapshot', () => {
    const { container } = render(<ServicesPage />);
    expect(container).toMatchSnapshot();
  });
});
