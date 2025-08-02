/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '@/app/(admin)/admin/dashboard/page';

// Mock the Auth component
jest.mock('@/components/admin/auth', () => {
  return {
    __esModule: true,
    default: jest.fn(({ children }) => {
      return React.createElement('div', { 'data-testid': 'auth-wrapper' }, children);
    })
  };
});

// Mock the MessagesPreview component
jest.mock('@/components/admin/MessagesPreview', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return React.createElement('div', { 'data-testid': 'messages-preview' }, 'Messages Preview Component');
    })
  };
});

// Mock the Summary component
jest.mock('@/components/admin/Summary', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return React.createElement('div', { 'data-testid': 'summary' }, 'Summary Component');
    })
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard page with all components', async () => {
    const DashboardComponent = await Dashboard();
    render(DashboardComponent);

    // Check if the main heading is rendered
    expect(screen.getByText('DASHBOARD')).toBeInTheDocument();

    // Check if Auth wrapper is rendered
    expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();

    // Check if Summary component is rendered
    expect(screen.getByTestId('summary')).toBeInTheDocument();

    // Check if MessagesPreview component is rendered
    expect(screen.getByTestId('messages-preview')).toBeInTheDocument();
  });

  it('renders components in the correct order', async () => {
    const DashboardComponent = await Dashboard();
    render(DashboardComponent);

    const elements = screen.getByTestId('auth-wrapper').children;
    
    // Check that h1 comes first
    expect(elements[0].tagName).toBe('H1');
    expect(elements[0]).toHaveTextContent('DASHBOARD');
    
    // Check that Summary comes second
    expect(elements[1]).toHaveTextContent('Summary Component');
    
    // Check that MessagesPreview comes third
    expect(elements[2]).toHaveTextContent('Messages Preview Component');
  });
  
  it('matches snapshot', async () => {
    const DashboardComponent = await Dashboard();
    const { container } = render(DashboardComponent);
    expect(container).toMatchSnapshot();
  });
});
