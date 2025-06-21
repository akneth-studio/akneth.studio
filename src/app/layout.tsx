import '@/styles/main.scss';
import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Poppins } from 'next/font/google';
import { GoogleTagManager } from '@next/third-parties/google';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twojadomena.pl'; // XXX Zmien na realny URL: .env.local, .env.development, .env.production

const poppins = Poppins({
  subsets: ['latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#82b0d1' },
    { media: '(prefers-color-scheme: dark)', color: '#0b7285' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'AKNETH Studio Katarzyna Pawłowska-Malesa',
    template: '%s | AKNETH Studio',
  },
  description: 'Portfolio i strona wizytówkowa AKNETH Studio - zarządzanie treściami, formularz kontaktowy, Consent Manager, polityki prywatności.',
  alternates: {
    canonical: siteUrl,
    languages: {
      'pl': siteUrl,
      /* TODO Uncomment if you want to support multiple languages
      'en': `${siteUrl}/en`,
      'de': `${siteUrl}/de`,*/
    },
    /* TODO Uncomment if you want to support RSS/Atom feeds
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`, // TODO: Add RSS feed if needed
      'application/atom+xml': `${siteUrl}/atom.xml`, // TODO: Add Atom feed if needed
    },*/
    /* TODO Uncomment if you want to support multiple locales
    locales: {
      'pl': siteUrl,
      'en': `${siteUrl}/en`,
      'de': `${siteUrl}/de`,
    },
    */
  },

  icons: [
    {
      url: '/favicon.ico',
      type: 'image/x-icon',
      rel: 'icon',
    },
    {
      url: '/favicon.svg',
      type: 'image/svg+xml',
      rel: 'icon',
      sizes: 'any',
    },
    {
      url: '/favicon-16x16.png',
      type: 'image/png',
      rel: 'icon',
      sizes: '16x16',
    },
    {
      url: '/favicon-32x32.png',
      type: 'image/png',
      rel: 'icon',
      sizes: '32x32',
    },
    {
      url: '/favicon-96x96.png',
      type: 'image/png',
      rel: 'icon',
      sizes: '96x96',
    },
    {
      url: '/android-chrome-192x192.png',
      type: 'image/png',
      rel: 'icon',
      sizes: '192x192',
    },
    {
      url: '/android-chrome-512x512.png',
      type: 'image/png',
      rel: 'icon',
      sizes: '512x512',
    },
    {
      url: '/apple-touch-icon.png',
      type: 'image/png',
      sizes: '180x180',
      rel: 'apple-touch-icon',
    },
  ],
  appleWebApp: {
    capable: true,
    title: 'AKNETH Studio Katarzyna Pawłowska-Malesa',
    statusBarStyle: 'black-translucent',
  },
  manifest: '/manifest.webmanifest',
  appLinks: {
    web: {
      url: siteUrl,
      should_fallback: true,
    },
  },
  applicationName: 'AKNETH Studio',
  creator: 'Katarzyna Pawłowska-Malesa',
  publisher: 'Katarzyna Pawłowska-Malesa',
  keywords: [
    'AKNETH Studio',
    'Katarzyna Pawłowska-Malesa',
    'portfolio',
    'strona wizytówkowa',
    'zarządzanie treściami',
    'formularz kontaktowy',
    'Consent Manager',
    'polityki prywatności',
  ],
  authors: [
    {
      name: 'Katarzyna Pawłowska-Malesa',
      // url: 'https://katarzynapawlowska.pl', //TODO: Replace with actual author URL
    },
    {
      name: 'AKNETH Studio',
      url: siteUrl,
    },
  /* TODO Uncomment if you want to add more authors
    {
      name: 'Inny Autor',
      url: 'https://innyautor.pl',
    },*/
  ],
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: {
      default: 'AKNETH Studio Katarzyna Pawłowska-Malesa',
      template: '%s | AKNETH Studio',
    },
    description: 'Portfolio i strona wizytówkowa AKNETH Studio - zarządzanie treściami, formularz kontaktowy, Consent Manager, polityki prywatności.',
    url: siteUrl,
    siteName: 'AKNETH Studio',
    images: [
      {
        url: '/img/og-image.png',
        width: 1200,
        height: 628,
        alt: 'AKNETH Studio Katarzyna Pawłowska-Malesa logo',
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AKNETH Studio Katarzyna Pawłowska-Malesa',
    description: 'Portfolio i strona wizytówkowa AKNETH Studio - zarządzanie treściami, formularz kontaktowy, Consent Manager, polityki prywatności.',
    images: [
      {
        url: '/img/og-image.png',
        width: 1200,
        height: 628,
        alt: 'AKNETH Studio Katarzyna Pawłowska-Malesa logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <meta name="google-adsense-client" content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT || "ca-pub-1234567890123456"} />
        <link rel="canonical" href={siteUrl} />
      </head>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''} />
      <body className={poppins.className}>
        <Navbar />
        <main className="container-xxl">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
