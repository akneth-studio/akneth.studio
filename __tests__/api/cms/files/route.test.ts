/** @jest-environment node */

import { GET } from '@/app/api/cms/files/route';
import { listCmsFiles } from '@/lib/content';
import { NextResponse } from 'next/server';

jest.mock('@/lib/content');

describe('GET /api/cms/files', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should return a list of files', async () => {
    const mockFiles = [{ name: 'file1.md', path: 'content/file1.md' }];
    (listCmsFiles as jest.Mock).mockResolvedValueOnce(mockFiles);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockFiles);
    expect(listCmsFiles).toHaveBeenCalledTimes(1);
  });

  it('should return a 500 error on failure', async () => {
    const errorMessage = 'Failed to fetch files';
    (listCmsFiles as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Nie udało się pobrać listy plików.');
  });
});
