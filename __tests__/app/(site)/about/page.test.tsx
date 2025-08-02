/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/(site)/about/page';
import AboutServicesMarquee from '@/components/AboutServicesMarquee';
import CTAButton from '@/components/CTAButton';

// Mock the components
jest.mock('@/components/AboutServicesMarquee', () => {
  return jest.fn(() => <div data-testid="about-services-marquee">About Services Marquee</div>);
});

jest.mock('@/components/CTAButton', () => {
  return jest.fn(() => <div data-testid="cta-button">CTA Button</div>);
});

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = require('../../../../jest.setup').NEXT_PUBLIC_SITE_URL || 'https://akneth.pl';

describe('AboutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all sections correctly', () => {
    render(<AboutPage />);
    
    // Check if all sections are rendered
    expect(screen.getByTestId('about-services-marquee')).toBeInTheDocument();
    expect(screen.getByTestId('cta-button')).toBeInTheDocument();
  });

  it('should render the correct layout structure', () => {
    render(<AboutPage />);
    
    // Check if the main container exists
    const container = screen.getByTestId('about-services-marquee').parentElement?.parentElement;
    expect(container).toBeInTheDocument();
    
    // Check if the header section exists
    const headerSection = screen.getByText('O mnie').closest('section');
    expect(headerSection).toBeInTheDocument();
    expect(headerSection).toHaveClass('about-hero');
    
    // Check if the values section exists
    const valuesSection = screen.getByText('Wartości i rozwój').closest('section');
    expect(valuesSection).toBeInTheDocument();
    expect(valuesSection).toHaveClass('about-values');
    
    // Check if the contact section exists
    const contactSection = screen.getByText('Porozmawiajmy!').closest('section');
    expect(contactSection).toBeInTheDocument();
    expect(contactSection).toHaveClass('about-contact');
  });

  it('should have correct metadata', () => {
    // Check if metadata is defined
    const { metadata } = require('@/app/(site)/about/page');
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('O mnie');
    expect(metadata.description).toBe('Dowiedz się więcej o AKNETH Studio i Katarzynie Pawłowskiej-Malesa. Oferujemy nowoczesne rozwiązania cyfrowe, które pomogą Ci w budowaniu profesjonalnego wizerunku online.');
    expect(metadata.keywords).toEqual([
      'AKNETH Studio',
      'Katarzyna Pawłowska-Malesa',
      'o mnie',
      'usługi cyfrowe',
      'wizerunek online',
      'automatyzacja',
      'React',
      'Next.js'
    ]);
    expect(metadata.alternates?.canonical).toBe('https://akneth.pl/about');
  });

  it('should match snapshot', () => {
    const { container } = render(<AboutPage />);
    expect(container).toMatchSnapshot();
  });
});
