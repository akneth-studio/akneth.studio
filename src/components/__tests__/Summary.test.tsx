import React from 'react';
import { render, screen } from '@testing-library/react';
import Summary from '../admin/Summary';

describe('Summary component', () => {
  it('renders iframe with correct title and src', () => {
    render(<Summary />);
    const iframe = screen.getByTitle('betterstack');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('width', '100%');
    expect(iframe).toHaveAttribute('height', '925');
    // src attribute depends on env variable, so just check it exists
    expect(iframe).toHaveAttribute('src');
  });
});
