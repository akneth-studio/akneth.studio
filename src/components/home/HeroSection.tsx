import CTAButton from "../CTAButton";

export default function HeroSection() {
  return (
    <section className="hero text-center py-5 px-4">
      <p className="lead lead-gradient fs-1">
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
