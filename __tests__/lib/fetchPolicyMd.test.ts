import { fetchPolicyMarkDown } from '@/lib/fetchPolicyMd';
import { supabase } from '@/lib/supabaseClientServ';
import fs from 'fs/promises';

const mockDownload = jest.fn();
jest.mock('@/lib/supabaseClientServ', () => ({
    supabase: {
        storage: {
            from: jest.fn(() => ({
                download: mockDownload,
            }),
            )
        },
    },
}));

jest.mock('fs/promises');

describe('fetchPolicyMd.ts', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
        mockDownload.mockClear();
        consoleErrorSpy.mockRestore();
    });

    it('should return text from Supabase storage on success', async () => {
        const mockText = 'policy content';
        const mockData = {
            text: jest.fn().mockResolvedValue(mockText),
        };
        mockDownload.mockResolvedValue({ data: mockData, error: null });

        const result = await fetchPolicyMarkDown('privacy.md');
        expect(result).toBe(mockText);
        expect(supabase.storage.from).toHaveBeenCalledWith('cms');
        expect(mockDownload).toHaveBeenCalledWith('policies/privacy.md');
    });

    it('should throw error and fallback to local file read on Supabase error', async () => {
        const error = new Error('error');
        mockDownload.mockResolvedValue({ data: null, error });
        (fs.readFile as jest.Mock).mockResolvedValue('local content');

        const result = await fetchPolicyMarkDown('privacy.md');
        expect(fs.readFile).toHaveBeenCalled();
        expect(result).toBe('local content');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching policy markdown:', error);
    });

    it('should fallback to local file read on exception', async () => {
        mockDownload.mockRejectedValue(new Error('exception'));
        (fs.readFile as jest.Mock).mockResolvedValue('local content');

        const result = await fetchPolicyMarkDown('privacy.md');
        expect(fs.readFile).toHaveBeenCalled();
        expect(result).toBe('local content');
    });
});
