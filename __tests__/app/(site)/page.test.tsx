/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/(site)/page';
import HeroSection from '@/components/home/HeroSection';
import ShortAboutSection from '@/components/home/ShortAboutSection';
import ServicesPreviewSection from '@/components/home/ServicesPreviewSection';
import PortfolioPreviewSection from '@/components/home/PortfolioPreviewSection';
import ContactCtaSection from '@/components/home/ContactCtaSection';

// Mock the components
jest.mock('@/components/home/HeroSection', () => {
  return jest.fn(() => <div data-testid="hero-section">Hero Section</div>);
});

jest.mock('@/components/home/ShortAboutSection', () => {
  return jest.fn(() => <div data-testid="short-about-section">Short About Section</div>);
});

jest.mock('@/components/home/ServicesPreviewSection', () => {
  return jest.fn(() => <div data-testid="services-preview-section">Services Preview Section</div>);
});

jest.mock('@/components/home/PortfolioPreviewSection', () => {
  return jest.fn(() => <div data-testid="portfolio-preview-section">Portfolio Preview Section</div>);
});

jest.mock('@/components/home/ContactCtaSection', () => {
  return jest.fn(() => <div data-testid="contact-cta-section">Contact CTA Section</div>);
});

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = require('../../../jest.setup').NEXT_PUBLIC_SITE_URL || 'https://akneth.pl';

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all sections correctly', () => {
    render(<HomePage />);
    
    // Check if all sections are rendered
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('short-about-section')).toBeInTheDocument();
    expect(screen.getByTestId('services-preview-section')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-preview-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact-cta-section')).toBeInTheDocument();
  });

  it('should render the correct layout structure', () => {
    render(<HomePage />);
    
    // Check if the main container exists
    const container = screen.getByTestId('hero-section').parentElement?.parentElement;
    expect(container).toBeInTheDocument();
    
    // Check if the row structure exists (it should have gy-5 class based on the component)
    const row = screen.getByTestId('services-preview-section').parentElement?.parentElement?.parentElement;
    expect(row).toBeInTheDocument();
    expect(row).toHaveClass('gy-5');
    
    // Check if the columns exist
    const servicesColumn = screen.getByTestId('services-preview-section').parentElement;
    expect(servicesColumn).toBeInTheDocument();
    expect(servicesColumn).toHaveClass('col-12', 'col-lg-6');
    
    const portfolioColumn = screen.getByTestId('portfolio-preview-section').parentElement;
    expect(portfolioColumn).toBeInTheDocument();
    expect(portfolioColumn).toHaveClass('col-12', 'col-lg-6');
  });

  it('should have correct metadata', () => {
    // Check if metadata is defined
    const { metadata } = require('@/app/(site)/page');
    expect(metadata).toBeDefined();
    expect(metadata.title).toEqual({
      default: 'Strona główna',
      template: '% | AKNETH Studio',
    });
    expect(metadata.description).toBe('Witamy na stronie głównej naszej witryny.');
    expect(metadata.keywords).toEqual(['strona główna', 'AKNETH Studio', 'portfolio']);
    expect(metadata.alternates?.canonical).toBe('https://akneth.pl');
  });

  it('should match snapshot', () => {
    const { container } = render(<HomePage />);
    expect(container).toMatchSnapshot();
  });
});
