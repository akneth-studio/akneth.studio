/** @jest-environment node */

import { GET } from '@/app/api/health/route';
import { supabase as supabaseServ } from '@/lib/supabaseClientServ';
import { supabase as supabaseAuth } from '@/lib/supabaseClient';
import { NextRequest } from 'next/server';

// Mock Supabase clients
jest.mock('@/lib/supabaseClientServ', () => ({
  supabase: {
    from: jest.fn((table: string) => ({
      select: jest.fn().mockReturnThis(),
    })),
    storage: {
      from: jest.fn((bucket: string) => ({
        list: jest.fn(),
      })),
    },
  },
}));

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

describe('GET /api/health', () => {
  const healthCheckSecret = 'test-secret';
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
    process.env.HEALTH_CHECK_SECRET = healthCheckSecret;
    process.env.SUPABASE_MAIL = 'test@example.com';
    process.env.SUPABASE_PASSWORD = 'password';

    // Default successful mocks for supabaseServ.from().select()
    (supabaseServ.from as jest.Mock).mockImplementation((table: string) => ({
      select: jest.fn().mockResolvedValue({ error: null }),
    }));

    // Default successful mocks for supabaseServ.storage.from().list()
    (supabaseServ.storage.from as jest.Mock).mockImplementation((bucket: string) => ({
      list: jest.fn().mockResolvedValue({ error: null }),
    }));

    // Default successful mock for supabaseAuth.auth.signInWithPassword()
    (supabaseAuth.auth.signInWithPassword as jest.Mock).mockResolvedValue({ data: { session: {} }, error: null });
  });

  const createRequest = (auth = true) => {
    const headers = new Headers();
    if (auth) {
      headers.set('Authorization', `Bearer ${healthCheckSecret}`);
    }
    return new NextRequest('http://localhost/api/health', { headers });
  };

  it('should return 401 if unauthorized', async () => {
    const req = createRequest(false);
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return 500 if secret is not configured', async () => {
    delete process.env.HEALTH_CHECK_SECRET;
    const req = createRequest();
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.message).toBe('Endpoint not configured');
  });

  it('should return status ok if all checks pass', async () => {
    const req = createRequest();
    const response = await GET(req);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
  });

  it('should return status error if messages table check fails', async () => {
    (supabaseServ.from as jest.Mock).mockImplementation((table) => {
        if (table === 'messages') {
            return { select: jest.fn().mockResolvedValue({ error: { message: 'Messages error' } }) };
        }
        return { select: jest.fn().mockResolvedValue({ error: null }) };
    });

    const req = createRequest();
    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.status).toBe('error');
    expect(body.errors.messages).toContain('Messages error');
  });

  it('should return status error if auth check fails', async () => {
    (supabaseAuth.auth.signInWithPassword as jest.Mock).mockResolvedValue({ error: { message: 'Auth error' } });
    const req = createRequest();
    const response = await GET(req);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.status).toBe('error');
    expect(body.errors.auth).toContain('Auth error');
  });
});
