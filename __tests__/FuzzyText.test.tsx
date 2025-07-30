import React from 'react';
import { render, act } from '@testing-library/react';
import FuzzyText from '../src/components/FuzzyText';
import '@testing-library/jest-dom';

// Mockowanie niezbędnych API przeglądarki dla środowiska JSDOM
// JSDOM nie implementuje canvas, więc potrzebujemy podstawowego mocka.
const mockContext = {
  clearRect: jest.fn(),
  drawImage: jest.fn(),
  fillText: jest.fn(),
  measureText: jest.fn(() => ({
    width: 120,
    actualBoundingBoxLeft: 10,
    actualBoundingBoxRight: 110,
    actualBoundingBoxAscent: 80,
    actualBoundingBoxDescent: 20,
  })),
  translate: jest.fn(),
};

// Mockowanie getContext na prototypie canvas
Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: () => mockContext,
});

// Mockowanie document.fonts, używanego przez komponent
if (typeof document.fonts === 'undefined') {
  Object.defineProperty(document, 'fonts', {
    value: {
      ready: Promise.resolve(),
    },
  });
}

// Mockowanie requestAnimationFrame do kontrolowania pętli animacji w testach
global.requestAnimationFrame = jest.fn(() => 1);
global.cancelAnimationFrame = jest.fn();
window.getComputedStyle = jest.fn().mockReturnValue({
  fontFamily: 'sans-serif',
  fontSize: '128px', // Przykładowa wartość z clamp(), np. 8rem
});

describe('FuzzyText component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    // Czyszczenie wszystkich mocków przed każdym testem, aby zapewnić izolację
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders a canvas element', () => {
    const { container } = render(<FuzzyText>Test fuzzy text</FuzzyText>);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('initializes and starts the animation loop', async () => {
    // Używamy `act` do opakowania renderowania i aktualizacji stanu
    await act(async () => {
      render(<FuzzyText>Test</FuzzyText>);
      // Uruchamiamy wszystkie timery, aby zasymulować upływ czasu
      jest.runAllTimers();
    });

    // Sprawdzamy, czy logika rysowania została wywołana
    expect(mockContext.fillText).toHaveBeenCalled();
    // Sprawdzamy, czy pętla animacji została uruchomiona
    expect(requestAnimationFrame).toHaveBeenCalled();
  });
});
