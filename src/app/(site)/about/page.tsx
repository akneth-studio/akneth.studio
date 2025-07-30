import React from 'react';

import Image from 'next/image';
import CTAButton from '@/components/CTAButton';
import AboutServicesMarquee from '@/components/AboutServicesMarquee';
import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
    title: 'O mnie',
    description: 'Dowiedz się więcej o AKNETH Studio i Katarzynie Pawłowskiej-Malesa. Oferujemy nowoczesne rozwiązania cyfrowe, które pomogą Ci w budowaniu profesjonalnego wizerunku online.',
    keywords: [
        'AKNETH Studio',
        'Katarzyna Pawłowska-Malesa',
        'o mnie',
        'usługi cyfrowe',
        'wizerunek online',
        'automatyzacja',
        'React',
        'Next.js'
    ],
    alternates: {
        canonical: `${siteUrl}/about`,
    }
};

export default function AboutPage() {
    return (
        <>
            {/* Sekcja: Nagłówek i zdjęcie */}
            <div className="d-flex row align-items-center justify-content-center py-4 px-3 about-header hero">
                <div className="col-lg-4 mb-3 mb-lg-0 text-center">
                    <Image
                        src="/img/profile.jpg" // Podmień na ścieżkę do swojego zdjęcia lub avatara AI
                        alt="Katarzyna Pawłowska-Malesa, właścicielka AKNETH Studio"
                        width={250}
                        height={250}
                        className="rounded-circle shadow mb-3 mb-lg-0"
                        style={{ objectFit: 'cover', objectPosition: 'center', verticalAlign: 'middle' }}
                        priority
                    />
                </div>
                <section className="about-hero align-content-center py-5 px-4 col-lg-8 my-auto">
                    <h1 className="mb-3">O mnie</h1>
                    <p className="lead">
                        Nazywam się <strong>Katarzyna Pawłowska-Malesa</strong> i prowadzę <strong>AKNETH Studio</strong> - jednoosobową pracownię nowoczesnych rozwiązań cyfrowych. Pomagam firmom i klientom indywidualnym w budowaniu profesjonalnego wizerunku online oraz usprawnianiu codziennej pracy biurowej.
                    </p>
                </section>
            </div>

            {/* Sekcja: Zakres usług */}
            <AboutServicesMarquee />

            <div className="hr-about hero row mx-0 my-4 justify-content-center">
                {/* Sekcja: Wartości i rozwój */}
                <section className="about-values py-5 px-4 col-md-6 mx-auto">
                    <h2 className="h4 mb-3">Wartości i rozwój</h2>
                    <p>
                        Stawiam na <strong>transparentność</strong>, <strong>dostępność</strong> i <strong>partnerską współpracę</strong>. Rozwijam się w kierunku React, Next.js i automatyzacji, by stale poszerzać ofertę i dostarczać nowoczesne rozwiązania na miarę potrzeb rynku.
                    </p>
                </section>

                <div className='col-md-1 d-none d-md-block' />

                {/* Sekcja: Kontakt */}
                <section className="about-contact py-5 px-4 col-md-5 mx-auto align-self-center text-center">
                    <h2 className="h4 mb-3">Porozmawiajmy!</h2>
                    <p>
                        Chcesz dowiedzieć się więcej lub rozpocząć współpracę?{' '}
                    </p>
                    <CTAButton
                        type='button'
                        text="Skontaktuj się ze mną"
                        variant="primary"
                        to='/contact'
                    />
                </section>
            </div>
        </>
    );
}
