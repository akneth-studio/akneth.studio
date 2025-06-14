export default function PortfolioPreviewSection() {
  return (
    <section className="portfolio-preview container bg-light py-5 px-4">
      <h2>Portfolio</h2>
      <ul className="list-unstyled">
        <li>
          <strong>Szablon Google Sheets dla kawiarni</strong> - <a href="https://drive.google.com/drive/folders/1NySz1o6OOxVM-yWps897LPPegkeOoqLG?usp=sharing" target="_blank" rel="noopener noreferrer">zobacz na Google Drive</a>
        </li>
        <li>
          <strong>Strona pisarska</strong> - <a href="https://github.com/reisene/wilczar.writer" target="_blank" rel="noopener noreferrer">repozytorium na GitHub</a>
        </li>
        <li>
          <strong>Serwis hulajnóg (prototyp)</strong> - <a href="https://github.com/reisene/HulajDusza-serwis" target="_blank" rel="noopener noreferrer">repozytorium na GitHub</a>
        </li>
      </ul>
      <p className="mt-3">Wkrótce więcej przykładów!</p>
    </section>
  );
}
