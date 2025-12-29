// Mobile-optimized scroll configuration utilities

export interface ScrollConfig {
  duration: number;
  easing: (t: number) => number;
  smoothTouch: boolean;
  touchMultiplier: number;
  wheelMultiplier: number;
  touchInertiaMultiplier: number;
  syncTouchLerp: number;
}

// Detect device capabilities for optimal scroll configuration
export function getDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      hasTouch: false,
      supportsPassiveEvents: false,
      prefersReducedMotion: false,
    };
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)/.test(userAgent) || 
    (window.innerWidth >= 768 && window.innerWidth <= 1024);
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check for passive event support
  let supportsPassiveEvents = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        supportsPassiveEvents = true;
        return false;
      }
    });
    window.addEventListener('testPassive', () => {}, opts);
    window.removeEventListener('testPassive', () => {}, opts);
  } catch (e) {
    // Passive events not supported
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    hasTouch,
    supportsPassiveEvents,
    prefersReducedMotion,
  };
}

// Get optimized scroll configuration based on device
export function getOptimizedScrollConfig(): ScrollConfig {
  const device = getDeviceCapabilities();
  
  // Base configuration for premium feel
  const baseConfig: ScrollConfig = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 1,
    touchInertiaMultiplier: 35,
    syncTouchLerp: 0.075,
  };

  // Mobile optimizations
  if (device.isMobile) {
    return {
      ...baseConfig,
      duration: 0.8, // Faster on mobile for responsiveness
      smoothTouch: false, // Disable smooth touch for better performance
      touchMultiplier: 1.5, // Reduce sensitivity
      touchInertiaMultiplier: 25, // Reduce inertia for better control
    };
  }

  // Tablet optimizations
  if (device.isTablet) {
    return {
      ...baseConfig,
      duration: 1.0,
      smoothTouch: true, // Enable on tablets with better performance
      touchMultiplier: 1.8,
      touchInertiaMultiplier: 30,
    };
  }

  // Desktop configuration (premium experience)
  return baseConfig;
}

// Performance monitoring for scroll animations
export class ScrollPerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private isMonitoring = false;

  start() {
    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.measureFPS();
  }

  stop() {
    this.isMonitoring = false;
  }

  private measureFPS() {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Log performance warnings
      if (this.fps < 30) {
        console.warn(`Scroll performance warning: ${this.fps} FPS`);
      }
    }

    requestAnimationFrame(() => this.measureFPS());
  }

  getFPS(): number {
    return this.fps;
  }

  isPerformanceGood(): boolean {
    return this.fps >= 50; // Consider 50+ FPS as good performance
  }
}

// Throttle function for scroll event handlers
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Debounce function for resize handlers
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}