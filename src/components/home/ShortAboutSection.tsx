import CTAButton from "../CTAButton";

export default function ShortAboutSection() {
  return (
    <section className="about-preview container bg-light py-5 px-4">
      <h2>O mnie</h2>
      <p>
        Nazywam się Katarzyna Pawłowska-Malesa. Jestem osobą otwartą, elastyczną i nie boję się żadnych wyzwań - zarówno w życiu, jak i w pracy. Programuję, tworzę szablony i automatyzacje, a każdemu projektowi poświęcam maksimum uwagi. Wierzę, że indywidualne podejście i szczerość to podstawa dobrej współpracy.
      </p>
      <CTAButton
        type='button'
        text="Dowiedz się więcej"
        variant="outline-primary"
        to="/about"
      />
    </section>
  );
}
