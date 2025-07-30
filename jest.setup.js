import '@testing-library/jest-dom';

// Mock Supabase environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock next/navigation useRouter to avoid invariant errors in tests
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      pathname: '/',
      route: '/',
      query: {},
      asPath: '/',
      basePath: '',
      isFallback: false,
      isReady: true,
      isPreview: false,
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      beforePopState: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
}));
