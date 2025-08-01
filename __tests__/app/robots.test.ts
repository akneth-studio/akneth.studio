import robots from '@/app/robots';

describe('robots', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('should return a valid robots object with NEXT_PUBLIC_SITE_URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    const result = robots();

    expect(result).toEqual({
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: '/admin/'
        },
      ],
      sitemap: 'https://example.com/sitemap.xml',
    });
  });

  it('should return a valid robots object without NEXT_PUBLIC_SITE_URL', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const result = robots();

    expect(result).toEqual({
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: '/admin/'
        },
      ],
      sitemap: 'https://akneth-studio.vercel.app/sitemap.xml',
    });
  });
});
