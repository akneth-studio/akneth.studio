import React from 'react';
import { render, screen } from '@testing-library/react';
import HowWeWork from '../src/components/services/HowWeWork';
import '@testing-library/jest-dom';

describe('HowWeWork component', () => {
  it('renders the component with correct title and list items', () => {
    render(<HowWeWork />);
    const card = screen.getByTestId('how-we-work');
    expect(card).toBeInTheDocument();

    const title = screen.getByRole('heading', { level: 2, name: /Jak pracujemy\?/i });
    expect(title).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(4);

    expect(listItems[0]).toHaveTextContent('Analiza potrzeb i wycena w 24h');
    expect(listItems[1]).toHaveTextContent('Umowa jasna i przejrzysta');
    expect(listItems[2]).toHaveTextContent('Płatność po odbiorze');
    expect(listItems[3]).toHaveTextContent('Wsparcie techniczne 3 miesiące');
  });
});
