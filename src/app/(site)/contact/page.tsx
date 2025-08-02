import ContactFormWrapper from '../../../components/contact/ContactForm';
import Schedule from '../../../components/contact/Schedule';
import ContactInfo from '../../../components/contact/ContactInfo';

import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skontaktuj się z AKNETH Studio",
  keywords: [
    'AKNETH Studio',
    'Kontakt',
    'Harmonogram',
    'Formularz Kontaktowy'
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  }
};

export default function ContactPage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!recaptchaSiteKey) {
    return (
      <>
        <h1 className="mb-4 pt-5 text-center">Kontakt</h1>
        <div className="alert alert-danger text-center my-4" role="alert">
          Błąd konfiguracji reCAPTCHA. Skontaktuj się z administratorem strony.
        </div>
        <Schedule />
      </>
    );
  }
  return (
    <>
      <h1 className="mb-4 pt-5 text-center">Kontakt</h1>
      <div className="row">
        <section className="col-md-6 mb-4 mb-md-0 contact-info text-center align-md-start align-content-center">
          <ContactInfo />
        </section>
        <aside className="col-md-6">
          <ContactFormWrapper />
        </aside>
      </div>
      <Schedule />
    </>
  );
}
