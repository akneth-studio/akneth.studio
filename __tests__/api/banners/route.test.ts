/** @jest-environment node */

import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PATCH, DELETE } from '@/app/api/banners/route';
import { createClient } from '@supabase/supabase-js';

// Mock the entire @supabase/supabase-js module
jest.mock('@supabase/supabase-js', () => {
  const mockSelect = jest.fn();
  const mockOrder = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();
  const mockEq = jest.fn();
  const mockDelete = jest.fn();

  const mockFrom = jest.fn(() => ({
    select: mockSelect.mockImplementation(() => ({
      order: mockOrder.mockReturnThis(),
    })),
    insert: mockInsert.mockImplementation(() => ({
      eq: mockEq.mockReturnThis(),
    })),
    update: mockUpdate.mockImplementation(() => ({
      eq: mockEq.mockReturnThis(),
    })),
    delete: mockDelete.mockImplementation(() => ({
      eq: mockEq.mockReturnThis(),
    })),
  }));

  return {
    createClient: jest.fn((supabaseUrl, supabaseKey) => ({
      from: mockFrom,
    })),
  };
});

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_key';

describe('API /api/banners', () => {
  let mockSelect: jest.Mock;
  let mockOrder: jest.Mock;
  let mockInsert: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockEq: jest.Mock;
  let mockDelete: jest.Mock;
  let mockFrom: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
    // Re-initialize mocks from the mocked module to ensure they are fresh for each test
    const { createClient: mockedCreateClient } = require('@supabase/supabase-js');
    const supabase = mockedCreateClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    mockFrom = supabase.from as jest.Mock;
    mockSelect = mockFrom('banners').select as jest.Mock;
    mockOrder = mockFrom('banners').select().order as jest.Mock;
    mockInsert = mockFrom('banners').insert as jest.Mock;
    mockUpdate = mockFrom('banners').update as jest.Mock;
    mockEq = mockFrom('banners').update().eq as jest.Mock; // This will be the same mock for insert and delete eq
    mockDelete = mockFrom('banners').delete as jest.Mock;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // Helper function to create a mock NextRequest
  const createMockRequest = (method: string, body?: any) => {
    return new NextRequest(`http://localhost/api/banners`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  describe('GET /api/banners', () => {
    it('should return banners data on success', async () => {
      const mockData = [{ id: 1, mode: 'test' }];
      mockOrder.mockResolvedValueOnce({ data: mockData, error: null });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockData);
      expect(createClient).toHaveBeenCalledWith('http://localhost', 'test_key');
      expect(mockFrom).toHaveBeenCalledWith('banners');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith("date_start", { ascending: false });
    });

    it('should return 500 on database error', async () => {
      const mockError = { message: 'DB Error' };
      mockOrder.mockResolvedValueOnce({ data: null, error: mockError });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch banners' });
    });
  });

  describe('POST /api/banners', () => {
    it('should return 201 on successful insertion', async () => {
      const newBanner = { mode: 'new', announce_from: '2024-01-01', date_start: '2024-01-01', date_end: '2024-12-31', visible: true };
      mockInsert.mockResolvedValueOnce({ error: null });

      const request = createMockRequest('POST', newBanner);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual({ success: true });
      expect(createClient).toHaveBeenCalledWith('http://localhost', 'test_key');
      expect(mockFrom).toHaveBeenCalledWith('banners');
      expect(mockInsert).toHaveBeenCalledWith(newBanner);
    });

    it('should return 500 on database error', async () => {
      const newBanner = { mode: 'new', announce_from: '2024-01-01', date_start: '2024-01-01', date_end: '2024-12-31', visible: true };
      const mockError = { message: 'DB Error' };
      mockInsert.mockResolvedValueOnce({ error: mockError });

      const request = createMockRequest('POST', newBanner);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: mockError });
    });
  });

  describe('PATCH /api/banners', () => {
    it('should return 200 on successful update', async () => {
      const updatedBanner = { id: 1, mode: 'updated' };
      mockEq.mockResolvedValueOnce({ error: null });

      const request = createMockRequest('PATCH', updatedBanner);
      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(createClient).toHaveBeenCalledWith('http://localhost', 'test_key');
      expect(mockFrom).toHaveBeenCalledWith('banners');
      expect(mockUpdate).toHaveBeenCalledWith({ mode: 'updated' });
      expect(mockEq).toHaveBeenCalledWith('id', 1);
    });

    it('should return 500 on database error', async () => {
      const updatedBanner = { id: 1, mode: 'updated' };
      const mockError = { message: 'DB Error' };
      mockEq.mockResolvedValueOnce({ error: mockError });

      const request = createMockRequest('PATCH', updatedBanner);
      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: mockError });
    });
  });

  describe('DELETE /api/banners', () => {
    it('should return 200 on successful deletion', async () => {
      const bannerToDelete = { id: 1 };
      mockEq.mockResolvedValueOnce({ error: null });

      const request = createMockRequest('DELETE', bannerToDelete);
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(createClient).toHaveBeenCalledWith('http://localhost', 'test_key');
      expect(mockFrom).toHaveBeenCalledWith('banners');
      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockEq).toHaveBeenCalledWith('id', 1);
    });

    it('should return 500 on database error', async () => {
      const bannerToDelete = { id: 1 };
      const mockError = { message: 'DB Error' };
      mockEq.mockResolvedValueOnce({ error: mockError });

      const request = createMockRequest('DELETE', bannerToDelete);
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: mockError });
    });
  });
});
