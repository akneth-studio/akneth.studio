/** @jest-environment node */

const mockGte = jest.fn();
const mockLte = jest.fn();
const mockEq = jest.fn(() => ({
  lte: mockLte,
}));
const mockSelect = jest.fn(() => ({
  eq: mockEq,
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: mockSelect,
    }),
  }),
}));

import { GET } from '@/app/api/banners/public/route';

describe('GET /api/banners/public', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockGte.mockReset();
    mockLte.mockReset();
    mockEq.mockClear();
    mockSelect.mockClear();
    // Setup a default chain for lte -> gte
    mockLte.mockReturnValue({ gte: mockGte });
  });

  it('should return active banners', async () => {
    const mockBanners = [{ id: 1, name: 'Test Banner' }];
    mockGte.mockResolvedValueOnce({ data: mockBanners, error: null });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockBanners);
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('visible', true);
    expect(mockLte).toHaveBeenCalledWith('announce_from', expect.any(String));
    expect(mockGte).toHaveBeenCalledWith('date_end', expect.any(String));
  });

  it('should return an empty array when no banners are active', async () => {
    mockGte.mockResolvedValueOnce({ data: [], error: null });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });

  it('should return a 500 error on database error', async () => {
    const errorMessage = 'Database error';
    mockGte.mockResolvedValueOnce({ data: null, error: { message: errorMessage } });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe(errorMessage);
  });
});