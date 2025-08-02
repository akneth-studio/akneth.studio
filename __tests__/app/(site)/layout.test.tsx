import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('@/components/layout/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="mock-navbar">Mock Navbar</div>;
  };
});
jest.mock('@/components/layout/Footer', () => {
  return function MockFooter() {
    return <div data-testid="mock-footer">Mock Footer</div>;
  };
});
jest.mock('@/components/layout/Banner', () => ({
  Banner: jest.fn(({ banners }) => (
    <div data-testid="mock-banner">Mock Banner: {banners.length} banners</div>
  )),
}));
jest.mock('@next/third-parties/google', () => ({
  GoogleTagManager: jest.fn(({ gtmId }) => (
    <div data-testid="mock-gtm">Mock GTM: {gtmId}</div>
  )),
}));
jest.mock("@vercel/analytics/next", () => ({
  Analytics: jest.fn(() => <div data-testid="mock-analytics">Mock Analytics</div>),
}));

// Mock fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('RootLayout (site)', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let RootLayout: typeof import('@/app/(site)/layout').default;

  const OLD_ENV = process.env;

  beforeAll(() => {
    // Suppress console.error for DOM nesting warnings
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    jest.resetModules(); // Reset module registry before each test

    // Dynamically import process and modify its env
    const processModule = jest.requireActual('process');
    process.env = { ...processModule.env, NEXT_PUBLIC_SITE_URL: 'https://test.com', NEXT_PUBLIC_GTM_ID: 'GTM-TEST' };

    // Dynamically import RootLayout after setting environment variables
    RootLayout = (await import('@/app/(site)/layout')).default;

    mockFetch.mockClear();
    // Default successful banner fetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ id: '1', message: 'Test Banner' }]),
    });
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore original environment variables
    consoleErrorSpy.mockRestore(); // Restore console.error
  });

  it('calls fetch with correct URL and renders components with data', async () => {
    const children = <p>Test Children</p>;
    const layout = await RootLayout({ children });

    await act(async () => {
      render(layout);
    });

    expect(mockFetch).toHaveBeenCalledWith('https://test.com/api/banners/public', { next: { revalidate: 3600 } });
    expect(screen.getByText('Test Children')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-gtm')).toBeInTheDocument();
    expect(screen.getByTestId('mock-analytics')).toBeInTheDocument();
    expect(screen.getByTestId('mock-banner')).toHaveTextContent('Mock Banner: 1 banners');
  });

  it('renders components with empty banner array when fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve([]),
    });

    const children = <p>Test Children</p>;
    const layout = await RootLayout({ children });

    await act(async () => {
      render(layout);
    });

    expect(mockFetch).toHaveBeenCalledWith('https://test.com/api/banners/public', { next: { revalidate: 3600 } });
    expect(screen.getByTestId('mock-banner')).toHaveTextContent('Mock Banner: 0 banners');
  });

  it('renders components with empty banner array when fetch throws an error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const children = <p>Test Children</p>;
    const layout = await RootLayout({ children });

    await act(async () => {
      render(layout);
    });

    expect(mockFetch).toHaveBeenCalledWith('https://test.com/api/banners/public', { next: { revalidate: 3600 } });
    expect(screen.getByTestId('mock-banner')).toHaveTextContent('Mock Banner: 0 banners');
  });

  it('passes correct gtmId to GoogleTagManager', async () => {
    const children = <p>Test</p>;
    const layout = await RootLayout({ children });

    await act(async () => {
      render(layout);
    });

    expect(screen.getByTestId('mock-gtm')).toHaveTextContent('Mock GTM: GTM-TEST');
  });
});