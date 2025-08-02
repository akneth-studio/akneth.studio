/** @jest-environment node */

// Mock NextRequest and NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, options) => {
    return {
      url,
      headers: new Headers(options?.headers),
      cookies: {
        toString: () => options?.headers?.cookie || '',
      },
    };
  }),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
    })),
  },
}));

import {NextRequest, NextResponse} from 'next/server';
let GET: any;

// Mock the entire @supabase/supabase-js module
jest.mock('@supabase/supabase-js', () => {
  const mockGetUser = jest.fn(() => ({ data: { user: null }, error: null })); // Default return value
  return {
    createClient: jest.fn(() => ({
      auth: {
        getUser: mockGetUser,
      },
    })),
    _mockGetUser: mockGetUser, // Export for direct access in tests
  };
});



describe('GET /api/check-admin', () => {
  let mockGetUser: jest.Mock;

  beforeAll(() => {
    // process.env.ALLOWED_ADMINS = 'admin@example.com,test@example.com';
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules(); // Reset modules to ensure re-import of route.ts
    process.env.ALLOWED_ADMINS = 'admin@example.com,test@example.com';
    // Dynamically import GET after setting the environment variable
    const routeModule = await import('@/app/api/check-admin/route');
    GET = routeModule.GET;
    // Get the mock from the mocked module
    mockGetUser = require('@supabase/supabase-js')._mockGetUser;
  });

  const createRequest = () => {
    const req = new NextRequest('http://localhost/api/check-admin');
    req.headers.set('cookie', 'sb-test-token=dummy-token');
    return req;
  };

  it('should return allowed: true for an admin user', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { email: 'admin@example.com' } },
      error: null,
    });

    const request = createRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.allowed).toBe(true);
  });

  it('should return allowed: false for a non-admin user', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { email: 'user@example.com' } },
      error: null,
    });

    const request = createRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.allowed).toBe(false);
  });

  it('should return allowed: false for a non-logged-in user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const request = createRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.allowed).toBe(false);
  });

  it('should return allowed: false when getUser returns an error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error('Auth error') });

    const request = createRequest();
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.allowed).toBe(false);
  });
});