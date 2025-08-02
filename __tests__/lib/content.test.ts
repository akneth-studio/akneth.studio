import { listCmsFiles, downloadCmsFile, syncFile, CmsFile } from '@/lib/content';
import { supabase } from '@/lib/supabaseClientServ';
import { commitFileToGitLab } from '@/lib/gitlab';

const mockList = jest.fn();
const mockCreateSignedUrl = jest.fn();
const mockUpload = jest.fn();

jest.mock('@/lib/supabaseClientServ', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        list: mockList,
        createSignedUrl: mockCreateSignedUrl,
        upload: mockUpload,
      })),
    },
  },
}));

jest.mock('@/lib/gitlab', () => ({
  commitFileToGitLab: jest.fn(),
}));

describe('content.ts', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockList.mockClear();
    mockCreateSignedUrl.mockClear();
    mockUpload.mockClear();
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('listCmsFiles', () => {
    it('should return list of files', async () => {
      const mockFiles = [
        { id: '1', name: 'file1.txt' },
        { id: '2', name: 'file2.txt' },
      ];
      mockList.mockResolvedValue({ data: mockFiles, error: null });

      const files = await listCmsFiles();
      const expected = [
        { id: '1', name: 'file1.txt', path: 'file1.txt' },
        { id: '2', name: 'file2.txt', path: 'file2.txt' },
      ];
      expect(files).toEqual(expected);
      expect(supabase.storage.from).toHaveBeenCalledWith('cms');
      expect(mockList).toHaveBeenCalledWith('', { limit: 1000 });
    });

    it('should throw error on list failure', async () => {
      const error = new Error('list error');
      mockList.mockResolvedValue({ data: null, error });

      await expect(listCmsFiles()).rejects.toThrow(error);
    });

    it('should recursively list files in subdirectories', async () => { // First call - lists the root directory
      mockList.mockResolvedValueOnce({
        data: [{ name: 'folder' }, { id: 'file1-id', name: 'file1.txt' }],
        error: null,
      });
      // Second call - lists the subdirectory
      mockList.mockResolvedValueOnce({
        data: [{ id: 'file2-id', name: 'file2.txt' }],
        error: null,
      });

      const files = await listCmsFiles();

      const expected = [
        { id: 'file1-id', name: 'file1.txt', path: 'file1.txt' },
        { id: 'file2-id', name: 'file2.txt', path: 'folder/file2.txt' },
      ];
      expect(files).toEqual(expect.arrayContaining(expected));
      expect(files).toHaveLength(expected.length);
      expect(mockList).toHaveBeenCalledTimes(2);
      expect(mockList).toHaveBeenCalledWith('', { limit: 1000 });
      expect(mockList).toHaveBeenCalledWith('folder', { limit: 1000 });
    });
  });

  describe('downloadCmsFile', () => {
    it('should return signed URL on success', async () => {
      const signedUrl = 'http://signed.url';
      mockCreateSignedUrl.mockResolvedValue({
        data: { signedUrl },
        error: null,
      });

      const url = await downloadCmsFile('path/to/file');
      expect(url).toBe(signedUrl);
    });

    it('should return null on error', async () => {
      mockCreateSignedUrl.mockResolvedValue({
        data: null,
        error: new Error('error'),
      });

      const url = await downloadCmsFile('path/to/file');
      expect(url).toBeNull();
    });
  });

  describe('syncFile', () => {
    const mockFile = {
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(10)),
      type: 'text/plain',
      name: 'test.txt',
    } as unknown as File;

    it('should return true on successful sync', async () => {
      (commitFileToGitLab as jest.Mock).mockResolvedValue(true);
      mockUpload.mockResolvedValue({ error: null });

      const result = await syncFile(mockFile, 'path/to/file');
      expect(commitFileToGitLab).toHaveBeenCalled();
      expect(mockUpload).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if commit to GitLab fails', async () => {
      (commitFileToGitLab as jest.Mock).mockResolvedValue(false);

      const result = await syncFile(mockFile, 'path/to/file');
      expect(commitFileToGitLab).toHaveBeenCalled();
      expect(mockUpload).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if upload to Supabase fails after a successful GitLab commit', async () => {
      (commitFileToGitLab as jest.Mock).mockResolvedValue(true);
      const error = new Error('upload error');
      mockUpload.mockResolvedValue({ error });

      const result = await syncFile(mockFile, 'path/to/file');
      expect(commitFileToGitLab).toHaveBeenCalled();
      expect(mockUpload).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false on unexpected error', async () => {
      (commitFileToGitLab as jest.Mock).mockImplementation(() => {
        throw new Error('unexpected');
      });

      const result = await syncFile(mockFile, 'path/to/file');
      expect(result).toBe(false);
    });
  });
});
