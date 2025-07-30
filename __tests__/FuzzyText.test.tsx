import React from 'react';
import { render, act } from '@testing-library/react';
import FuzzyText from '../src/components/FuzzyText';
import '@testing-library/jest-dom';

// Mocking necessary browser APIs for JSDOM environment
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

Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: () => mockContext,
});

if (typeof document.fonts === 'undefined') {
  Object.defineProperty(document, 'fonts', {
    value: {
      ready: Promise.resolve(),
    },
  });
}

beforeAll(() => {
  jest.useFakeTimers();
  jest.spyOn(global, 'requestAnimationFrame').mockImplementation((cb) => {
    return setTimeout(cb, 0);
  });
  global.cancelAnimationFrame = jest.fn();
  jest.spyOn(global, 'setTimeout');
  window.getComputedStyle = jest.fn().mockReturnValue({
    fontFamily: 'sans-serif',
    fontSize: '128px',
  });
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('FuzzyText component', () => {
  it('renders a canvas element', () => {
    const { container } = render(<FuzzyText>Test fuzzy text</FuzzyText>);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('initializes and starts the animation loop', async () => {
    await act(async () => {
      render(<FuzzyText>Test</FuzzyText>);
      jest.runAllTimers();
    });

    expect(mockContext.fillText).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalled();
  });
});
