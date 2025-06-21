import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akneth-studio.vercel.app';

  const urls = [
    {
      loc: siteUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 1.0,
    },
    {
      loc: `${siteUrl}/about`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.7,
    },
    {
      loc: `${siteUrl}/services`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.8,
    },
    {
      loc: `${siteUrl}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: 0.8,
    },
    {
      loc: `${siteUrl}/policies`,
      lastmod: '2025-06-21',
      changefreq: 'yearly',
      priority: 0.3,
    },
    {
      loc: `${siteUrl}/policies/privacy`,
      lastmod: '2025-06-21',
      changefreq: 'yearly',
      priority: 0.5,
    },
    {
      loc: `${siteUrl}/policies/rodo`,
      lastmod: '2025-06-21',
      changefreq: 'yearly',
      priority: 0.5,
    },
    {
      loc: `${siteUrl}/policies/terms`,
      lastmod: '2025-06-21',
      changefreq: 'yearly',
      priority: 0.5,
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `<url>
  <loc>${url.loc}</loc>
  <lastmod>${url.lastmod}</lastmod>
  <changefreq>${url.changefreq}</changefreq>
  <priority>${url.priority}</priority>
</url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}