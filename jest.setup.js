// Add any global setup actions here

// Polyfill Web APIs for Jest's Node.js environment
import 'next/dist/server/web/globals';

// Import Jest DOM for custom matchers
import '@testing-library/jest-dom';

// Set dummy environment variables to prevent errors in tests that import server-side clients
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy-key-for-testing';
process.env.NEXT_PUBLIC_SITE_URL = 'https://akneth.pl';
// Mock next/navigation useRouter to avoid invariant errors in tests
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
    }),
    useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
    usePathname: jest.fn().mockReturnValue('/'),
  };
});

export const mockSignInWithPassword = jest.fn();
export const mockSignInWithOAuth = jest.fn();
export const mockOnAuthStateChange = jest.fn().mockReturnValue({
  data: {
    subscription: {
      unsubscribe: jest.fn(),
    },
  },
});
