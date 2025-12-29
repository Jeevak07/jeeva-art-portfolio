// Test setup for vitest
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock requestAnimationFrame for testing
global.requestAnimationFrame = vi.fn((cb) => {
  return setTimeout(cb, 16) as unknown as number; // Simulate 60fps
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id as unknown as NodeJS.Timeout);
});

// Mock performance.now for consistent timing in tests
Object.defineProperty(global, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
  },
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    // Immediately trigger intersection for testing
    setTimeout(() => {
      callback([{ isIntersecting: true } as IntersectionObserverEntry], this as any);
    }, 0);
  }
  
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds = [];
} as any;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo and scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
window.scrollTo = vi.fn();