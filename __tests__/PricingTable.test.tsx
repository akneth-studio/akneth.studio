import React from 'react';
import { render, screen } from '@testing-library/react';
import PricingTable from '../src/components/services/PricingTable';
import { pricingData } from '../src/data/pricingData';
import '@testing-library/jest-dom';

describe('PricingTable component', () => {
  it('renders the pricing table with correct categories and services', () => {
    render(<PricingTable />);
    const table = screen.getByTestId('pricing-table');
    expect(table).toBeInTheDocument();

    pricingData.forEach(({ category, services }) => {
      const categoryHeader = screen.getByText(category);
      expect(categoryHeader).toBeInTheDocument();

      services.forEach(({ service, priceRange }) => {
        const serviceCell = screen.getByText(service);
        expect(serviceCell).toBeInTheDocument();

        // Use getAllByText to handle multiple identical priceRange values
        const priceCells = screen.getAllByText(priceRange);
        expect(priceCells.length).toBeGreaterThan(0);
      });
    });
  });
});
