import CTAButton from "../CTAButton";

export default function HeroSection() {
  return (
    <section className="hero text-center py-4">
      <div id='lead-gradient' className='px-4 mb-4'>
        <h1>Szablony, automatyzacje i indywidualne rozwiązania<br/>
        dla firm i klientów indywidualnych.</h1><br />
        <p className='lead fs-1'>Elastyczność, uczciwość i szybka realizacja - Twoje potrzeby, mój priorytet.</p>
      </div>
      <CTAButton
        type='button'
        text="Skontaktuj się"
        variant="primary"
        to="/contact"
        size='lg'
      />
    </section>
  );
}
