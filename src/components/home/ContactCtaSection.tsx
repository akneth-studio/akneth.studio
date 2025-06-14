'use client'

import CTAButton from "../CTAButton";

const calendar = process.env.NEXT_PUBLIC_CALENDAR;

export default function ContactCtaSection() {
  return (
    <section className="contact-cta text-center bg-light py-5 px-4">
      <h2>Kontakt</h2>
      <p>
        Masz pytania lub chcesz zlecić projekt? <br />
        Umów się na bezpłatną konsultację lub napisz przez formularz kontaktowy.
      </p>
      <div className="d-flex justify-content-center gap-3 mt-3">
        <CTAButton
          type='button'
          text="Formularz kontaktowy"
          variant="primary"
          to="/contact"
        />
        <CTAButton
          type='button'
          text="Harmonogram spotkań"
          variant="outline-primary"
          onClick={() => window.open(calendar, "_blank")}
        />
      </div>
    </section>
  );
}
