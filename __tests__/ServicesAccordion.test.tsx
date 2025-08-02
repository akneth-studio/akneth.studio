import React from 'react';
import { render, screen } from '@testing-library/react';
import ServicesAccordion from '../src/components/services/ServicesAccordion';
import { servicesData } from '../src/data/servicesData';
import '@testing-library/jest-dom';

describe('ServicesAccordion component', () => {
  it('renders the accordion with correct categories and services', () => {
    render(<ServicesAccordion />);
    const accordion = screen.getByTestId('services-accordion');
    expect(accordion).toBeInTheDocument();

    servicesData.forEach((category) => {
      const categoryHeader = screen.getByText(category.name);
      expect(categoryHeader).toBeInTheDocument();

      category.services.forEach((service) => {
        const serviceTitle = screen.getByText(service.title);
        const serviceDescription = screen.getByText(service.description);
        expect(serviceTitle).toBeInTheDocument();
        expect(serviceDescription).toBeInTheDocument();
      });
    });
  });
});
