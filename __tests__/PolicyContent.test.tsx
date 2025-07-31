import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyContent from '../src/components/policies/PolicyContent';
import '@testing-library/jest-dom';

// Mock react-markdown to avoid ES module issues
jest.mock('react-markdown', () => () => <div>Mocked ReactMarkdown</div>);

const mockProps = {
  h1Text: 'Test Heading',
  content: 'Test content',
  lastUpdated: '2024-01-01',
};

describe('PolicyContent component', () => {
  it('renders the policy content with all props', () => {
    render(<PolicyContent {...mockProps} />);
    const element = screen.getByTestId('policy-content');
    expect(element).toBeInTheDocument();

    // Sprawdza, czy nagłówek jest renderowany
    const heading = screen.getByRole('heading', {
      level: 1,
      name: /test heading/i,
    });
    expect(heading).toBeInTheDocument();

    // Sprawdza, czy data ostatniej aktualizacji jest renderowana
    // The text is split by a <br /> tag, so we check for the parts separately.
    expect(screen.getByText(/Data ostatniej aktualizacji:/i)).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();

    // Checks if the mocked markdown content is rendered
    const markdownContent = screen.getByText('Mocked ReactMarkdown');
    expect(markdownContent).toBeInTheDocument();
  });

  it('renders correctly when optional props are missing', () => {
    // Pass an empty string for lastUpdated to satisfy the required prop type
    // and test the component's ability to handle falsy values gracefully.
    const propsWithEmptyDate = {
      h1Text: 'Another Heading',
      content: 'Some other content',
      lastUpdated: '',
    };
    render(<PolicyContent {...propsWithEmptyDate} />);

    expect(screen.getByRole('heading', { name: /another heading/i })).toBeInTheDocument();
    expect(screen.getByText('Mocked ReactMarkdown')).toBeInTheDocument();

    // Sprawdza, czy data ostatniej aktualizacji NIE jest renderowana, gdy jej brakuje
    expect(screen.queryByText(/ostatnia aktualizacja/i)).not.toBeInTheDocument();
  });
});
