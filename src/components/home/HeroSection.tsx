import CTAButton from "../CTAButton";

export default function HeroSection() {
  return (
    <section className="hero text-center py-5 px-4">
      <p className="lead fs-1" id='lead-gradient' style={{background: 'linear-gradient(150deg, #ffd700 0%, #ff8c00 45%, ffd700 65%) !important'}}>
        Szablony, automatyzacje i indywidualne rozwiązania dla firm i klientów indywidualnych.<br />
        Elastyczność, uczciwość i szybka realizacja - Twoje potrzeby, mój priorytet.
      </p>
      <CTAButton
        type='button'
        text="Skontaktuj się"
        variant="primary"
        to="/contact"
      />
    </section>
  );
}
