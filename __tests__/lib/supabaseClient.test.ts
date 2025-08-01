// Mock the createClient function
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('supabaseClient', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear module cache

    // Re-import polyfills after resetting modules, because jest.resetModules clears them.
    require('next/dist/server/web/globals');
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('should create supabase client with environment variables', () => {
    // Import the mocked function directly inside the test for reliability
    const { createClient: mockCreateClient } = require('@supabase/supabase-js');

    // Set environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    // Import the module after setting env vars
    const { supabase } = require('@/lib/supabaseClient');

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    );

    // The exported supabase should be the result of createClient mock
    expect(supabase).toBe(mockCreateClient.mock.results[0].value);
  });
});
