import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyContent from '../src/components/policies/PolicyContent';
import '@testing-library/jest-dom';

// Mock next/link for testing purposes
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a href={href}>{children}</a>;
  };
});

const mockProps = {
  h1Text: 'Test Heading',
  content: `
This is some test content.
Here is an [internal link](/internal-page).
And here is an [external link](https://example.com).
  `,
  lastUpdated: '2024-01-01',
};

describe('PolicyContent component', () => {
  it('renders the policy content with all props and creates a snapshot', () => {
    const { container } = render(<PolicyContent {...mockProps} />);

    // Snapshot test
    expect(container).toMatchSnapshot();

    // Check for heading
    const heading = screen.getByRole('heading', {
      level: 1,
      name: /test heading/i,
    });
    expect(heading).toBeInTheDocument();

    // Check for last updated date
    // The text is split by a <br /> tag, so we check for the parts separately.
    expect(screen.getByText(/Data ostatniej aktualizacji:/i)).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();

    // Check for markdown content
    expect(screen.getByText(/This is some test content./i)).toBeInTheDocument();
  });

  it('renders internal links correctly', () => {
    render(<PolicyContent {...mockProps} />);
    const internalLink = screen.getByText('internal link');
    expect(internalLink).toBeInTheDocument();
    expect(internalLink).toHaveAttribute('href', '/internal-page');
    // It should not have target="_blank"
    expect(internalLink).not.toHaveAttribute('target', '_blank');
  });

  it('renders external links correctly', () => {
    render(<PolicyContent {...mockProps} />);
    const externalLink = screen.getByText('external link');
    expect(externalLink).toBeInTheDocument();
    expect(externalLink).toHaveAttribute('href', 'https://example.com');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders correctly when optional props are missing', () => {
    // Pass an empty string for lastUpdated to satisfy the required prop type
    // and test the component's ability to handle falsy values gracefully.
    const propsWithEmptyDate = {
      h1Text: 'Another Heading',
      content: 'Some other content without links.',
      lastUpdated: '',
    };
    render(<PolicyContent {...propsWithEmptyDate} />);

    expect(screen.getByRole('heading', { name: /another heading/i })).toBeInTheDocument();
    expect(screen.getByText(/some other content without links./i)).toBeInTheDocument();

    // Check that the last updated date is NOT rendered
    expect(screen.queryByText(/ostatnia aktualizacja/i)).not.toBeInTheDocument();
  });
});
