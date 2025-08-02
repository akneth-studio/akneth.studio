/** @jest-environment node */

import { NextRequest } from 'next/server';
import { BetterStackRequest } from '@logtail/next';

// Mock modules before importing the handler
jest.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: jest.fn(() => ({})),
  },
}));

jest.mock('@upstash/ratelimit', () => {
  const _mockLimit = jest.fn();

  const MockRatelimitConstructor = jest.fn(() => ({
    limit: _mockLimit,
  }));

  MockRatelimitConstructor.slidingWindow = jest.fn(() => ({
    limit: _mockLimit,
  }));

  return {
    Ratelimit: MockRatelimitConstructor,
    _mockLimit: _mockLimit, // Export the mockLimit
  };
});

const mockInsert = jest.fn();

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: mockInsert,
    })),
  },
}));

const mockLog = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  with: jest.fn().mockReturnThis(),
};

jest.mock('@logtail/next', () => ({
  withBetterStack: (handler: any) => (req: any) => {
    (req as any).log = mockLog;
    return handler(req);
  },
}));

global.fetch = jest.fn();

import { POST } from '@/app/api/contact/route';

describe('POST /api/contact', () => {
  const validData = {
    name: 'Test User',
    company: 'Test Company',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test Message',
    recaptchaToken: 'valid-token',
    consent: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret-key';
    
    // Reset mock implementations
    mockInsert.mockResolvedValue({ error: null });
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, score: 0.9, action: 'contact_form_submit' }),
    });
    
    // Reset rate limit mock for each test
    const { _mockLimit } = require('@upstash/ratelimit');
    _mockLimit.mockResolvedValue({ success: true });
  });

  const createRequest = (body: any) => {
    const req = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '127.0.0.1',
      },
      body: JSON.stringify(body),
    });
    return req as BetterStackRequest;
  };

  it('should successfully submit the form', async () => {
    const req = createRequest(validData);
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(require('@/lib/supabaseClient').supabase.from).toHaveBeenCalledWith('messages');
    expect(mockInsert).toHaveBeenCalledTimes(1);
  });

  it('should return 429 on rate limit exceeded', async () => {
    const { _mockLimit } = require('@upstash/ratelimit');
    _mockLimit.mockResolvedValueOnce({ success: false });

    const req = createRequest(validData);
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.error).toBe('Zbyt wiele prób. Spróbuj później.');
  });

  it('should return 400 for invalid data', async () => {
    const req = createRequest({ ...validData, email: 'invalid-email' });
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Niepoprawne dane');
  });

  it('should return 400 for missing consent', async () => {
    const req = createRequest({ ...validData, consent: false });
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Brak zgody na przetwarzanie danych.');
  });

  it('should return 400 for failed reCAPTCHA', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false, score: 0.1, action: 'contact_form_submit' }),
    });

    const req = createRequest(validData);
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('reCAPTCHA failed or action mismatch');
  });

  it('should return 500 on database error', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'DB Error' } });

    const req = createRequest(validData);
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Błąd zapisu do bazy.');
  });
});
