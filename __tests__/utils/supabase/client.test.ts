import { createClient } from '@supabase/supabase-js';

// Mock the createClient function
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ // Return a mock object for the supabase client
    auth: {},
    from: jest.fn(() => ({ // Mock common methods if needed
      select: jest.fn(() => ({ data: [], error: null })),
    })),
  })),
}));

describe('Supabase Client Initialization', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear module cache before each test
    process.env = { ...OLD_ENV }; // Make a copy of the original env
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore original env after all tests
  });

  it('should initialize supabase client with correct environment variables', () => {
    // Get the mocked createClient *after* jest.resetModules()
    const { createClient: mockCreateClient } = require('@supabase/supabase-js');

    // Import the module after setting environment variables
    const { supabase } = require('@/utils/supabase/client');

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    );
    expect(supabase).toBeDefined();
  });

  it('should throw an error if NEXT_PUBLIC_SUPABASE_URL is missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    expect(() => {
      require('@/utils/supabase/client');
    }).toThrow('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  });

  it('should throw an error if NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => {
      require('@/utils/supabase/client');
    }).toThrow('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  });

  it('should throw an error if both Supabase environment variables are missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => {
      require('@/utils/supabase/client');
    }).toThrow('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  });
});
