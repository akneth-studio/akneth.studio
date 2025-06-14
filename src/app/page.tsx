import React from 'react';

import HeroSection from '@/components/home/HeroSection';
import ShortAboutSection from '@/components/home/ShortAboutSection';
import ServicesPreviewSection from '@/components/home/ServicesPreviewSection';
import PortfolioPreviewSection from '@/components/home/PortfolioPreviewSection';
import ContactCtaSection from '@/components/home/ContactCtaSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Strona główna',
    description: 'Witamy na stronie głównej naszej witryny.',
    keywords: ['strona główna', 'AKNETH Studio', 'portfolio'],
    authors: [
        {
            name: 'Katarzyna Pawłowska-Malesa',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://twojadomena.pl',
        },
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://twojadomena.pl'),
};

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <ShortAboutSection />
            <div className="gy-5">
                <div className="row gymd-5 gy-0 gx-5 align-items-center">
                    <div className="col-12 col-lg-6">
                        <ServicesPreviewSection />
                    </div>
                    <div className="col-12 col-lg-6">
                        <PortfolioPreviewSection />
                    </div>
                </div>
            </div>
            <ContactCtaSection />
        </>
    );
}
