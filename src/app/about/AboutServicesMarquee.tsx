'use client';

import Image from 'next/image';
import CTAButton from '@/components/CTAButton';
import styles from '@/styles/AboutServicesMarquee.module.scss';

const iconsRow1 = [
    { src: '/icons/icons8-nextjs.svg', alt: 'Next.js' },
    { src: '/icons/react-logo.png', alt: 'React' },
    { src: '/icons/bootstrap-logo.svg', alt: 'Bootstrap' },
    { src: '/icons/icons8-sass-96.png', alt: 'SASS' },
];
const iconsRow2 = [
    { src: '/icons/icons8-office-365.svg', alt: 'Microsoft Office' },
    { src: '/icons/googleworkspace.svg', alt: 'Google Workspace' },
    { src: '/icons/icons8-javascript.svg', alt: 'JavaScript' },
    { src: '/icons/icons8-typescript.svg', alt: 'TypeScript' },
];

export default function AboutServicesMarquee() {
    return (
        <section className="about-services py-5 px-4">
            <div className="row align-items-center">
                {/* Tekst po lewej */}
                <div className="col-md-7 my-auto">
                    <h2 className="h4 mb-3">Zakres usług</h2>
                    <ul>
                        <li>Nowoczesne, dostępne strony internetowe (Next.js, React, TypeScript, Bootstrap, SCSS)</li>
                        <li>Szablony dokumentów w pakietach Office i Google Workspace (gotowe i na zamówienie)</li>
                        <li>Copywriting – teksty na strony, materiały informacyjne, treści SEO</li>
                        <li>Automatyzacje i integracje w Google Sheets</li>
                        <li>Szkolenia online z narzędzi biurowych i pracy zdalnej</li>
                        <li>Audyty dostępności (WCAG), wdrożenia RODO, własny Consent Manager</li>
                    </ul>
                    <CTAButton
                        type='button'
                        text="Zobacz pełną ofertę"
                        variant="outline-primary"
                        to="/services"
                    />
                </div>
                {/* Dwa rzędy marquee po prawej */}
                <div
                    className="col-md-5 d-flex flex-column justify-content-center align-items-center"
                    style={{ height: '320px' }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '32px',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            userSelect: 'none',
                        }}
                    >
                        {/* Rząd 1 */}
                        <div className={styles.scroll}>
                            {[...iconsRow1, ...iconsRow1].map((icon, idx) => (
                                <div key={idx} style={{ margin: '0 1.5rem', flex: '0 0 auto' }}>
                                    <Image
                                        src={icon.src}
                                        alt={icon.alt}
                                        width={100}
                                        height={100}
                                        style={{ height: '100px', width: 'auto', display: 'block' }}
                                        draggable={false}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Rząd 2 */}
                        <div className={styles.scrollReverse}>
                            {[...iconsRow2, ...iconsRow2].map((icon, idx) => (
                                <div key={idx} style={{ margin: '0 1.5rem', flex: '0 0 auto' }}>
                                    <Image
                                        src={icon.src}
                                        alt={icon.alt}
                                        height={100}
                                        width={100}
                                        style={{ height: '100px', width: 'auto', display: 'block' }}
                                        draggable={false}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
