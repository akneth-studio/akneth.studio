import CTAButton from "../CTAButton";

export default function ServicesPreviewSection() {
  return (
    <section className="services-preview bg-light py-5 px-4">
      <div className="container">
        <h2>Usługi</h2>
        <ul className="list-unstyled">
          <li><strong>Szablony Google</strong> - projektowanie funkcjonalnych arkuszy dla firm i osób prywatnych.</li>
          <li><strong>Automatyzacje</strong> - usprawnianie codziennej pracy dzięki prostym, praktycznym rozwiązaniom.</li>
        </ul>
        <CTAButton
          type='button'
          text="Zobacz pełną ofertę"
          variant="outline-primary"
          to="/services"
        />
      </div>
    </section>
  );
}
