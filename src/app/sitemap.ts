import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akneth-studio.vercel.app';

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1.0
        },
        {
            url: `${siteUrl}/about`, 
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7
        },
        {
            url: `${siteUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8
        },
        {
            url: `${siteUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8
        },
        {
            url: `${siteUrl}/policies`,
            lastModified: new Date('2025-06-21'),
            changeFrequency: 'yearly',
            priority: 0.3
        },
        {
            url: `${siteUrl}/policies/privacy`,
            lastModified: new Date('2025-06-21'),
            changeFrequency: 'yearly',
            priority: 0.5
        },
        {
            url: `${siteUrl}/policies/rodo`,
            lastModified: new Date('2025-06-21'),
            changeFrequency: 'yearly',
            priority: 0.5
        },
        {
            url: `${siteUrl}/policies/terms`,
            lastModified: new Date('2025-06-21'),
            changeFrequency: 'yearly',
            priority: 0.5
        },
    ];
}