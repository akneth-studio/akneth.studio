import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('GTM component', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules to re-evaluate process.env on each import
    jest.resetModules();
    process.env = { ...originalEnv };
    // Clear the DOM to ensure a clean state for each test
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Restore original env and unmount components
    process.env = originalEnv;
    cleanup();
  });

  it('does nothing if GTM_ID is not provided', () => {
    // Ensure the environment variable is not set
    delete process.env.NEXT_PUBLIC_GTM_ID;

    // Dynamically import the component to use the modified environment
    const React = require('react');
    const GTM = require('../src/components/GTM').default;
    const { render } = require('@testing-library/react/pure');
    render(<GTM />);

    // Check that no script or noscript tags were added
    const script = document.querySelector('script[src*="googletagmanager.com"]');
    expect(script).not.toBeInTheDocument();
  });

  it('appends and cleans up GTM scripts when GTM_ID is provided', () => {
    const GTM_ID = 'GTM-TEST123';
    process.env.NEXT_PUBLIC_GTM_ID = GTM_ID;

    const React = require('react');
    const GTM = require('../src/components/GTM').default;
    const { render } = require('@testing-library/react/pure');
    const { unmount } = render(<GTM />);

    // Check for the script in the head and noscript in the body
    const script = document.head.querySelector('script');
    expect(script).toHaveAttribute('src', `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
    const noscript = document.body.querySelector('noscript');
    expect(noscript?.innerHTML).toContain(`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`);

    // Unmount the component to trigger cleanup
    unmount();
    expect(document.head.querySelector('script')).not.toBeInTheDocument();
    expect(document.body.querySelector('noscript')).not.toBeInTheDocument();
  });
});
