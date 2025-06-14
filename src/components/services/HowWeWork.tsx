'use client'

import { Card } from 'react-bootstrap';

/**
 * Sekcja opisująca proces współpracy (Jak pracujemy)
 * @returns {JSX.Element}
 */
export default function HowWeWork() {
  return (
    <Card className="mb-5 border-primary" data-testid="how-we-work">
      <Card.Body>
        <Card.Title as="h2" className="h4 mb-4">Jak pracujemy?</Card.Title>
        <ul className="list-unstyled row">
          {[
            'Analiza potrzeb i wycena w 24h',
            'Umowa jasna i przejrzysta',
            'Płatność po odbiorze',
            'Wsparcie techniczne 3 miesiące'
          ].map((item, index) => (
            <li key={index} className="col-md-6 mb-3 d-flex">
              <span className="badge bg-primary me-2">{index + 1}</span>
              {item}
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
}
