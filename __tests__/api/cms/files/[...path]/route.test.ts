/** @jest-environment node */

import { GET, POST } from '@/app/api/cms/files/[...path]/route';
import { downloadCmsFile, syncFile } from '@/lib/content';

jest.mock('@/lib/content');

describe('API /api/cms/files/[...path]', () => {
  let consoleErrorMock: jest.Mock;

  beforeEach(() => {
    consoleErrorMock = jest.fn();
    jest.spyOn(global.console, 'error').mockImplementation(consoleErrorMock);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- GET Tests ---
  describe('GET', () => {
    it('should return a signed URL for a valid file path', async () => {
      const signedUrl = 'https://example.com/signed-url';
      (downloadCmsFile as jest.Mock).mockResolvedValueOnce(signedUrl);

      const request = new Request('http://localhost/api/cms/files/policies/privacy.md');
      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.signedUrl).toBe(signedUrl);
      expect(downloadCmsFile).toHaveBeenCalledWith('policies/privacy.md');
    });

    it('should return 404 if the file does not exist', async () => {
      (downloadCmsFile as jest.Mock).mockResolvedValueOnce(null);

      const request = new Request('http://localhost/api/cms/files/nonexistent.md');
      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.error).toBe('Nie udało się wygenerować linku.');
    });

    it('should return 500 on server error', async () => {
      (downloadCmsFile as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

      const request = new Request('http://localhost/api/cms/files/error.md');
      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toBe('Błąd serwera.');
    });
  });

  // --- POST Tests ---
  describe('POST', () => {
    it('should update the file successfully', async () => {
      const file = new File(['content'], 'test.md', { type: 'text/markdown' });
      const formData = new FormData();
      formData.append('file', file);

      (syncFile as jest.Mock).mockResolvedValueOnce(true);

      const request = new Request('http://localhost/api/cms/files/test.md', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe('Plik zaktualizowany pomyślnie.');
      expect(syncFile).toHaveBeenCalledWith(file, 'test.md');
    });

    it('should return 400 if no file is provided', async () => {
      const formData = new FormData(); // No file
      const request = new Request('http://localhost/api/cms/files/test.md', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe('Brak pliku w żądaniu.');
    });

    it('should return 500 if syncFile fails', async () => {
        const file = new File(['content'], 'test.md', { type: 'text/markdown' });
        const formData = new FormData();
        formData.append('file', file);
  
        (syncFile as jest.Mock).mockResolvedValueOnce(false);
  
        const request = new Request('http://localhost/api/cms/files/test.md', {
          method: 'POST',
          body: formData,
        });
  
        const response = await POST(request);
        const body = await response.json();
  
        expect(response.status).toBe(500);
        expect(body.error).toBe('Nie udało się zaktualizować pliku.');
      });
  });
});
