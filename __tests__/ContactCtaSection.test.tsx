import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactCtaSection from '../src/components/home/ContactCtaSection';
import '@testing-library/jest-dom';

describe('ContactCtaSection component', () => {
  it('renders correctly with heading and buttons', () => {
    render(<ContactCtaSection />);
    expect(screen.getByRole('heading', { name: /kontakt/i })).toBeInTheDocument();
    expect(screen.getByText(/masz pytania lub chcesz zlecić projekt/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /formularz kontaktowy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /harmonogram spotkań/i })).toBeInTheDocument();
  });

  it('opens calendar link in new tab when Harmonogram spotkań button is clicked', () => {
    window.open = jest.fn();
    render(<ContactCtaSection />);
    const calendarButton = screen.getByRole('button', { name: /harmonogram spotkań/i });
    fireEvent.click(calendarButton);
    expect(window.open).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { container } = render(<ContactCtaSection />);
    expect(container).toMatchSnapshot();
  });
});
