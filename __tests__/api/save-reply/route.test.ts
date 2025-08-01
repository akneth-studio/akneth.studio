/** @jest-environment node */

import { POST } from '@/app/api/save-reply/route';
import { NextRequest } from 'next/server';

const mockUpdate = jest.fn().mockReturnThis();
const mockEq = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      update: mockUpdate,
      eq: mockEq,
    }),
  }),
}));

describe('POST /api/save-reply', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (body) => {
    return new NextRequest('http://localhost/api/save-reply', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  it('should save the reply and return success', async () => {
    mockEq.mockResolvedValue({ error: null });

    const req = createRequest({ id: 1, reply: 'This is a reply' });
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith({ reply_text: 'This is a reply', replied: true });
    expect(mockEq).toHaveBeenCalledWith('id', 1);
  });

  it('should return an error if supabase update fails', async () => {
    const errorMessage = 'Database Error';
    mockEq.mockResolvedValue({ error: { message: errorMessage } });

    const req = createRequest({ id: 1, reply: 'This is a reply' });
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe(errorMessage);
  });
});
