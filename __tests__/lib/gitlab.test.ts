global.fetch = jest.fn();

describe('gitlab.ts', () => {
  const OLD_ENV = process.env;

  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return false if GITLAB_ACCESS_TOKEN or GITLAB_PROJECT_ID is missing', async () => {
    delete process.env.GITLAB_ACCESS_TOKEN;
    delete process.env.GITLAB_PROJECT_ID;

    const { commitFileToGitLab } = await import('@/lib/gitlab');
    const result = await commitFileToGitLab('path', new ArrayBuffer(1), 'message');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Brak konfiguracji GitLab (GITLAB_ACCESS_TOKEN lub GITLAB_PROJECT_ID). Pomijam commit.');
    expect(result).toBe(false);
  });

  it('should return true on successful commit', async () => {
    process.env.GITLAB_ACCESS_TOKEN = 'token';
    process.env.GITLAB_PROJECT_ID = '123';

    const { commitFileToGitLab } = await import('@/lib/gitlab');

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });

    const result = await commitFileToGitLab('path', new ArrayBuffer(1), 'message');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://gitlab.com/api/v4/projects/123/repository/files/'),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': 'token',
        }),
        body: expect.stringContaining('"commit_message":"message"'),
      })
    );
  });

  it('should return false and log error on API error', async () => {
    process.env.GITLAB_ACCESS_TOKEN = 'token';
    process.env.GITLAB_PROJECT_ID = '123';

    const { commitFileToGitLab } = await import('@/lib/gitlab');

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => 'Bad Request',
    });

    const result = await commitFileToGitLab('path', new ArrayBuffer(1), 'message');
    expect(global.fetch).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return false and log error on fetch exception', async () => {
    process.env.GITLAB_ACCESS_TOKEN = 'token';
    process.env.GITLAB_PROJECT_ID = '123';

    const { commitFileToGitLab } = await import('@/lib/gitlab');

    (global.fetch as jest.Mock).mockImplementation(() => {
      throw new Error('network error');
    });

    const result = await commitFileToGitLab('path', new ArrayBuffer(1), 'message');
    expect(global.fetch).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
