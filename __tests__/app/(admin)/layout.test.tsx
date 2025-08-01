import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminLayout from '@/app/(admin)/layout';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('@/components/layout/AdminSidebar', () => {
  return function MockAdminSidebar() {
    return <div data-testid="mock-admin-sidebar">Mock Admin Sidebar</div>;
  };
});

describe('AdminLayout', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    // Suppress console.error for DOM nesting warnings
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore(); // Restore console.error
  });

  it('renders children and AdminSidebar', () => {
    render(<AdminLayout><p>Test Children</p></AdminLayout>);

    expect(screen.getByText('Test Children')).toBeInTheDocument();
    expect(screen.getByTestId('mock-admin-sidebar')).toBeInTheDocument();
  });
});