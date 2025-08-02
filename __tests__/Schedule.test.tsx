import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Schedule component', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Reset module registry before each test
    process.env = { ...OLD_ENV }; // Make a copy of the original env
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore original env
  });

  it('renders warning message when schedule URL is not available', () => {
    delete process.env.NEXT_PUBLIC_SCHEDULE_URL;
    const Schedule = require('../src/components/contact/Schedule').default; // Re-import
    render(<Schedule />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('akneth.studio@gmail.com')).toBeInTheDocument();
    expect(screen.getByText(/Harmonogram spotkań jest chwilowo niedostępny/i)).toBeInTheDocument();
  });

  it('renders iframe when schedule URL is available', () => {
    const mockScheduleUrl = 'https://example.com/schedule';
    process.env.NEXT_PUBLIC_SCHEDULE_URL = mockScheduleUrl;
    const Schedule = require('../src/components/contact/Schedule').default; // Re-import
    render(<Schedule />);
    const iframe = screen.getByTitle('Umów spotkanie');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', mockScheduleUrl);
    expect(screen.getByLabelText('Harmonogram spotkań')).toBeInTheDocument();
  });
});

