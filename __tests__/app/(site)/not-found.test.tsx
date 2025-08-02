import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '@/app/(site)/not-found';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('next/image', () => {
  return function MockImage(props: any) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  };
});
jest.mock('next/link', () => {
  return function MockLink(props: any) {
    return <a {...props}>{props.children}</a>;
  };
});
jest.mock('@/components/FuzzyText', () => {
  return function MockFuzzyText(props: any) {
    return <div data-testid="mock-fuzzy-text">{props.children}</div>;
  };
});
jest.mock('@/components/CTAButton', () => {
  return function MockCTAButton(props: any) {
    return <button data-testid="mock-cta-button" {...props}>{props.text}</button>;
  };
});

describe('NotFound (site)', () => {
  it('renders the 404 page with correct content', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Taka strona nie istnieje.')).toBeInTheDocument();
    expect(screen.getByText('Wróć do strony głównej')).toBeInTheDocument();
    expect(screen.getByAltText('404 - Strona nie znaleziona')).toBeInTheDocument();

    // Check if CTAButton has correct link
    expect(screen.getByTestId('mock-cta-button')).toHaveAttribute('to', '/');

    // Check if Link has correct link
    expect(screen.getByText('strony głównej')).toHaveAttribute('href', '/');
  });
});
