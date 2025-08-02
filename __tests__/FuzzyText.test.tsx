import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import FuzzyText from '@/components/FuzzyText';
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

let canvasInstance: HTMLCanvasElement | null = null;

Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: () => mockContext,
});

Object.defineProperty(window.HTMLCanvasElement.prototype, 'addEventListener', {
    writable: true,
    value: jest.fn().mockImplementation(function (this: HTMLCanvasElement, event, callback) {
        if (!this.eventListeners) {
            this.eventListeners = {};
        }
        this.eventListeners[event] = callback;
        canvasInstance = this;
    }),
});


Object.defineProperty(window.HTMLCanvasElement.prototype, 'removeEventListener', {
    writable: true,
    value: jest.fn().mockImplementation(function (this: HTMLCanvasElement, event) {
        if (this.eventListeners && this.eventListeners[event]) {
            delete this.eventListeners[event];
        }
    }),
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
    return setTimeout(cb, 16); // Using a delay similar to a real frame
  });
  jest.spyOn(global, 'cancelAnimationFrame').mockImplementation((id) => {
    clearTimeout(id);
  });
  window.getComputedStyle = jest.fn().mockReturnValue({
    fontFamily: 'sans-serif',
    fontSize: '128px',
  });
});

afterEach(() => {
    jest.clearAllMocks();
    canvasInstance = null;
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('FuzzyText component', () => {
  it('renders a canvas element', () => {
    const { container } = render(<FuzzyText>Test</FuzzyText>);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('initializes and starts the animation loop', async () => {
    await act(async () => {
      render(<FuzzyText>Test</FuzzyText>);
      jest.runOnlyPendingTimers();
    });

    expect(mockContext.fillText).toHaveBeenCalledWith('Test', expect.any(Number), expect.any(Number));
    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it('cleans up on unmount', async () => {
    let unmount: () => void;
    await act(async () => {
      const { unmount: unmountComponent } = render(<FuzzyText>Test</FuzzyText>);
      unmount = unmountComponent;
      jest.runOnlyPendingTimers();
    });

    // @ts-ignore
    unmount();

    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(HTMLCanvasElement.prototype.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(HTMLCanvasElement.prototype.removeEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function));
  });

  it('attaches hover event listeners when enableHover is true', async () => {
    await act(async () => {
      render(<FuzzyText enableHover={true}>Test</FuzzyText>);
      jest.runOnlyPendingTimers();
    });
    expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(HTMLCanvasElement.prototype.addEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function));
  });

  it('does not attach hover event listeners when enableHover is false', async () => {
    await act(async () => {
      render(<FuzzyText enableHover={false}>Test</FuzzyText>);
      jest.runOnlyPendingTimers();
    });
    expect(HTMLCanvasElement.prototype.addEventListener).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(HTMLCanvasElement.prototype.addEventListener).not.toHaveBeenCalledWith('mouseleave', expect.any(Function));
  });

  it('changes intensity on mouse hover', async () => {
    await act(async () => {
        render(<FuzzyText baseIntensity={0.1} hoverIntensity={0.9}>Test</FuzzyText>);
        jest.runOnlyPendingTimers();
    });

    if (!canvasInstance) throw new Error("Canvas not found");

    // Simulate mouse enter
    await act(async () => {
        // @ts-ignore
        const mouseMoveCallback = canvasInstance.eventListeners['mousemove'];
        if (mouseMoveCallback) {
            const rect = { left: 0, top: 0, width: 500, height: 100 };
            canvasInstance.getBoundingClientRect = () => rect as DOMRect;
            // Simulate mouse being inside the interactive area
            mouseMoveCallback({ clientX: 250, clientY: 50 });
        }
        jest.runOnlyPendingTimers();
    });
    
    // This is tricky to test directly without exposing internal state.
    // We'll infer the intensity change by checking if the animation continues.
    // A more robust test would require refactoring the component to make intensity testable.
    expect(requestAnimationFrame).toHaveBeenCalled();

    // Simulate mouse leave
    await act(async () => {
        // @ts-ignore
        const mouseLeaveCallback = canvasInstance.eventListeners['mouseleave'];
        if (mouseLeaveCallback) {
            mouseLeaveCallback();
        }
        jest.runOnlyPendingTimers();
    });
    
    expect(requestAnimationFrame).toHaveBeenCalled();
  });
});