import React from 'react';
import { render, screen } from '@testing-library/react';
import ServicesPreviewSection from '../src/components/home/ServicesPreviewSection';
import '@testing-library/jest-dom';

describe('ServicesPreviewSection component', () => {
  it('renders heading and service previews', () => {
    render(<ServicesPreviewSection />);
    expect(screen.getByRole('heading', { name: /usługi/i })).toBeInTheDocument();
    // Add more specific checks if the component renders specific service items or text
  });

  it('matches snapshot', () => {
    const { container } = render(<ServicesPreviewSection />);
    expect(container).toMatchSnapshot();
  });
});
