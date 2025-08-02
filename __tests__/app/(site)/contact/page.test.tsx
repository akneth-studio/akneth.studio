/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import ContactPage from '@/app/(site)/contact/page';
import ContactFormWrapper from '@/components/contact/ContactForm';
import Schedule from '@/components/contact/Schedule';
import ContactInfo from '@/components/contact/ContactInfo';

// Mock the components
jest.mock('@/components/contact/ContactForm', () => {
  return jest.fn(() => <div data-testid="contact-form">Contact Form</div>);
});

jest.mock('@/components/contact/Schedule', () => {
  return jest.fn(() => <div data-testid="schedule">Schedule</div>);
});

jest.mock('@/components/contact/ContactInfo', () => {
  return jest.fn(() => <div data-testid="contact-info">Contact Info</div>);
});

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = require('../../../../jest.setup').NEXT_PUBLIC_SITE_URL || 'https://akneth.pl';
process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-recaptcha-key';

describe('ContactPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all sections correctly when reCAPTCHA key is present', () => {
    render(<ContactPage />);
    
    // Check if all sections are rendered
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('schedule')).toBeInTheDocument();
    
    // Check if the heading exists
    expect(screen.getByText('Kontakt')).toBeInTheDocument();
  });

  it('should render error message when reCAPTCHA key is missing', () => {
    // Temporarily remove the reCAPTCHA key
    const originalKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    render(<ContactPage />);
    
    // Check if error message is displayed
    expect(screen.getByText('Błąd konfiguracji reCAPTCHA. Skontaktuj się z administratorem strony.')).toBeInTheDocument();
    expect(screen.getByTestId('schedule')).toBeInTheDocument();
    
    // Restore the reCAPTCHA key
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = originalKey;
  });

  it('should render the correct layout structure', () => {
    render(<ContactPage />);
    
    // Check if the main container exists (using the heading as reference)
    const heading = screen.getByText('Kontakt');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
    
    // Check if the row structure exists
    const row = screen.getByTestId('contact-info').parentElement?.parentElement;
    expect(row).toBeInTheDocument();
    expect(row).toHaveClass('row');
    
    // Check if the columns exist
    const contactInfoColumn = screen.getByTestId('contact-info').parentElement;
    expect(contactInfoColumn).toBeInTheDocument();
    expect(contactInfoColumn).toHaveClass('col-md-6');
    
    const contactFormColumn = screen.getByTestId('contact-form').parentElement;
    expect(contactFormColumn).toBeInTheDocument();
    expect(contactFormColumn).toHaveClass('col-md-6');
  });

  it('should have correct metadata', () => {
    // Check if metadata is defined
    const { metadata } = require('@/app/(site)/contact/page');
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Kontakt');
    expect(metadata.description).toBe('Skontaktuj się z AKNETH Studio');
    expect(metadata.keywords).toEqual([
      'AKNETH Studio',
      'Kontakt',
      'Harmonogram',
      'Formularz Kontaktowy'
    ]);
    expect(metadata.alternates?.canonical).toBe('https://akneth.pl/contact');
  });

  it('should match snapshot', () => {
    const { container } = render(<ContactPage />);
    expect(container).toMatchSnapshot();
  });
});
