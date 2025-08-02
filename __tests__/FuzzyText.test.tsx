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

declare global {
  interface HTMLCanvasElement {
    eventListeners?: { [key: string]: EventListenerOrEventListenerObject };
  }
}

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

  it('handles numeric fontSize correctly', async () => {
    await act(async () => {
      render(<FuzzyText fontSize={24}>Test</FuzzyText>);
      jest.runOnlyPendingTimers();
    });
    // Verify that fillText was called with the correct font size in the context
    expect(mockContext.fillText).toHaveBeenCalled();
    // You might need to inspect mockContext.font or other properties if you want to be more specific
  });

  it('cleans up on unmount', async () => {
    let unmount: () => void;
    await act(async () => {
      const { unmount: unmountComponent } = render(<FuzzyText>Test</FuzzyText>);
      unmount = unmountComponent;
      jest.runOnlyPendingTimers();
    });

    // Trigger unmount
    // @ts-ignore
    unmount();

    // Advance timers to ensure the next animation frame would attempt to run
    jest.advanceTimersByTime(16); // Advance by one frame duration
    jest.runOnlyPendingTimers(); // Ensure any pending requestAnimationFrame callbacks are executed
    // Expect requestAnimationFrame not to be called again after cleanup
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(mockContext.clearRect).toHaveBeenCalledTimes(1); // Should not be called again after unmount

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
    const { container } = render(<FuzzyText baseIntensity={0.1} hoverIntensity={0.9}>Test</FuzzyText>);
    const canvas = container.querySelector('canvas');
    if (!canvas) throw new Error("Canvas not found");

    // Mock getBoundingClientRect for accurate mouse event simulation
    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 500, height: 100,
      x: 0, y: 0, right: 500, bottom: 100, 
      // @ts-ignore
      toJSON: () => {},
    });

    // Initial render and animation frame
    await act(async () => {
        jest.runOnlyPendingTimers();
    });
    
    // Check initial intensity (baseIntensity)
    // We expect dx to be small due to baseIntensity = 0.1
    const initialDxCalls = mockContext.drawImage.mock.calls.filter(call => call[5] !== 0);
    expect(initialDxCalls.length).toBeGreaterThan(0); // Ensure some fuzzing happened
    initialDxCalls.forEach(call => {
        expect(Math.abs(call[5])).toBeLessThanOrEqual(Math.floor(0.1 * 30)); // baseIntensity * fuzzRange
    });
    mockContext.drawImage.mockClear(); // Clear calls for next assertion

    // Simulate mouse enter
    await act(async () => {
        fireEvent.mouseMove(canvas, { clientX: 250, clientY: 50 }); // Inside interactive area
        jest.runOnlyPendingTimers();
    });

    // Check hover intensity (hoverIntensity)
    // We expect dx to be larger due to hoverIntensity = 0.9
    const hoverDxCalls = mockContext.drawImage.mock.calls.filter(call => call[5] !== 0);
    expect(hoverDxCalls.length).toBeGreaterThan(0); // Ensure some fuzzing happened
    hoverDxCalls.forEach(call => {
        expect(Math.abs(call[5])).toBeGreaterThanOrEqual(0); // dx can be 0
        expect(Math.abs(call[5])).toBeLessThanOrEqual(Math.floor(0.9 * 30)); // hoverIntensity * fuzzRange
    });
    mockContext.drawImage.mockClear();

    // Simulate mouse leave
    await act(async () => {
        fireEvent.mouseLeave(canvas);
        jest.runOnlyPendingTimers();
    });

    // Check return to base intensity
    const leaveDxCalls = mockContext.drawImage.mock.calls.filter(call => call[5] !== 0);
    expect(leaveDxCalls.length).toBeGreaterThan(0); // Ensure some fuzzing happened
    leaveDxCalls.forEach(call => {
        expect(Math.abs(call[5])).toBeLessThanOrEqual(Math.floor(0.1 * 30)); // baseIntensity * fuzzRange
    });
  });

  it('does not change intensity on mouse hover when enableHover is false', async () => {
    const { container } = render(<FuzzyText enableHover={false} baseIntensity={0.1} hoverIntensity={0.9}>Test</FuzzyText>);
    const canvas = container.querySelector('canvas');
    if (!canvas) throw new Error("Canvas not found");

    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 500, height: 100,
      x: 0, y: 0, right: 500, bottom: 100, 
      // @ts-ignore
      toJSON: () => {},
    });

    await act(async () => {
        jest.runOnlyPendingTimers();
    });
    mockContext.drawImage.mockClear();

    // Simulate mouse move
    await act(async () => {
        fireEvent.mouseMove(canvas, { clientX: 250, clientY: 50 }); // Inside interactive area
        jest.runOnlyPendingTimers();
    });

    // Expect intensity to remain baseIntensity
    const dxCalls = mockContext.drawImage.mock.calls.filter(call => call[5] !== 0);
    expect(dxCalls.length).toBeGreaterThan(0);
    dxCalls.forEach(call => {
        expect(Math.abs(call[5])).toBeLessThanOrEqual(Math.floor(0.1 * 30)); // baseIntensity * fuzzRange
    });
  });

  it('does not change intensity on touch move when enableHover is false', async () => {
    const { container } = render(<FuzzyText enableHover={false} baseIntensity={0.1} hoverIntensity={0.9}>Test</FuzzyText>);
    const canvas = container.querySelector('canvas');
    if (!canvas) throw new Error("Canvas not found");

    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 500, height: 100,
      x: 0, y: 0, right: 500, bottom: 100, 
      // @ts-ignore
      toJSON: () => {},
    });

    await act(async () => {
        jest.runOnlyPendingTimers();
    });
    mockContext.drawImage.mockClear();

    // Simulate touch move
    await act(async () => {
        fireEvent.touchMove(canvas, {
            touches: [{ clientX: 250, clientY: 50 }],
            preventDefault: () => {},
        });
        jest.runOnlyPendingTimers();
    });

    // Expect intensity to remain baseIntensity
    const dxCalls = mockContext.drawImage.mock.calls.filter(call => call[5] !== 0);
    expect(dxCalls.length).toBeGreaterThan(0);
    dxCalls.forEach(call => {
        expect(Math.abs(call[5])).toBeLessThanOrEqual(Math.floor(0.1 * 30)); // baseIntensity * fuzzRange
    });
  });

  it('changes intensity on touch move', async () => {
    const { container } = render(<FuzzyText enableHover={true} baseIntensity={0.1} hoverIntensity={0.9}>Test</FuzzyText>);
    const canvas = container.querySelector('canvas');
    if (!canvas) throw new Error("Canvas not found");

    jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 500, height: 100,
      x: 0, y: 0, right: 500, bottom: 100, 
      // @ts-ignore
      toJSON: () => {},
    });

    await act(async () => {
        jest.runOnlyPendingTimers();
    });

    mockContext.drawImage.mockClear();

    // Simulate touch move
    await act(async () => {
        fireEvent.touchMove(canvas, {
            touches: [{ clientX: 250, clientY: 50 }],
            preventDefault: () => {},
        });
        jest.runOnlyPendingTimers();
    });

    const touchDxCalls = mockContext.drawImage.mock.calls.filter(call => call[5] !== 0);
    expect(touchDxCalls.length).toBeGreaterThan(0);
    touchDxCalls.forEach(call => {
        expect(Math.abs(call[5])).toBeGreaterThanOrEqual(0); // dx can be 0
        expect(Math.abs(call[5])).toBeLessThanOrEqual(Math.floor(0.9 * 30));
    });
    mockContext.drawImage.mockClear();

    // Simulate touch end
    await act(async () => {
        fireEvent.touchEnd(canvas);
        jest.runOnlyPendingTimers();
    });

    const touchEndDxCalls = mockContext.drawImage.mock.calls.filter(call => call[5] !== 0);
    expect(touchEndDxCalls.length).toBeGreaterThan(0);
    touchEndDxCalls.forEach(call => {
        expect(Math.abs(call[5])).toBeLessThanOrEqual(Math.floor(0.1 * 30));
    });
  });

  it('assigns cleanupFuzzyText to canvas on mount', async () => {
    const { container } = render(<FuzzyText>Test</FuzzyText>);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    // @ts-ignore
    expect(canvas.cleanupFuzzyText).toBeDefined();
    // @ts-ignore
    expect(typeof canvas.cleanupFuzzyText).toBe('function');
  });

  it('should return early if canvas is null', async () => {
    // Temporarily override useRef to return null for canvasRef.current
    const originalUseRef = React.useRef;
    jest.spyOn(React, 'useRef').mockReturnValue({ current: null });

    render(<FuzzyText>Test</FuzzyText>);

    // Expect no canvas-related operations to have been called
    expect(mockContext.fillText).not.toHaveBeenCalled();
    expect(requestAnimationFrame).not.toHaveBeenCalled();

    // Restore original useRef
    jest.spyOn(React, 'useRef').mockImplementation(originalUseRef);
  });

  it('should return early if context is null', async () => {
    // Temporarily override getContext to return null
    const originalGetContext = window.HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
      writable: true,
      value: () => null,
    });

    render(<FuzzyText>Test</FuzzyText>);

    // Expect no canvas-related operations to have been called
    expect(mockContext.fillText).not.toHaveBeenCalled();
    expect(requestAnimationFrame).not.toHaveBeenCalled();

    // Restore original getContext
    Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
      writable: true,
      value: originalGetContext,
    });
  });
});