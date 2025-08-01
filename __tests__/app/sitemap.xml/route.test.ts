/** @jest-environment node */

// This must be the first import to polyfill the environment for Jest
import 'next/dist/server/web/globals';

import { GET } from '@/app/sitemap.xml/route';
import { NextResponse } from 'next/server';

describe('sitemap.xml route GET', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return XML sitemap with default site URL when env var is not set', async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const response = await GET();

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get('Content-Type')).toBe('application/xml');

    const text = await response.text();
    expect(text).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(text).toContain('<loc>https://akneth-studio.vercel.app</loc>');
    expect(text).toContain('<loc>https://akneth-studio.vercel.app/about</loc>');
  });

  it('should return XML sitemap with site URL from environment variable', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://testsite.example.com';

    const response = await GET();

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get('Content-Type')).toBe('application/xml');

    const text = await response.text();
    expect(text).toContain('<loc>https://testsite.example.com</loc>');
    expect(text).toContain('<loc>https://testsite.example.com/about</loc>');
  });
});
