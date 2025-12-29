/**
 * Mobile optimization utilities for the Sketch Museum Portfolio
 * Provides touch-friendly interactions, performance optimizations, and responsive behavior
 */

import { useEffect, useState, useCallback } from 'react';

// Viewport detection hook
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        isMobile: width <= 480,
        isTablet: width > 480 && width <= 768,
        isDesktop: width > 768,
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport;
};

// Touch gesture detection
export const useTouchGestures = (element: HTMLElement | null) => {
  const [touchState, setTouchState] = useState({
    isTouch: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  useEffect(() => {
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setTouchState({
        isTouch: true,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchState.isTouch) return;
      
      const touch = e.touches[0];
      setTouchState(prev => ({
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
      }));
    };

    const handleTouchEnd = () => {
      setTouchState(prev => ({ ...prev, isTouch: false }));
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [element, touchState.isTouch]);

  return touchState;
};

// Performance optimization for mobile
export const usePerformanceOptimization = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Detect low-performance devices
    const checkPerformance = () => {
      const connection = (navigator as any).connection;
      const memory = (performance as any).memory;
      
      // Check for slow connection
      const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' ||
        connection.downlink < 1
      );
      
      // Check for low memory
      const isLowMemory = memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8;
      
      // Check for older devices (rough heuristic)
      const isOlderDevice = navigator.hardwareConcurrency <= 2;
      
      setIsLowPerformance(isSlowConnection || isLowMemory || isOlderDevice);
    };

    checkPerformance();
  }, []);

  return { isLowPerformance };
};

// Touch target size validation
export const validateTouchTarget = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // Minimum touch target size in pixels
  
  return rect.width >= minSize && rect.height >= minSize;
};

// Scroll performance optimization
export const useOptimizedScroll = (callback: (scrollY: number) => void) => {
  const [ticking, setTicking] = useState(false);

  const handleScroll = useCallback(() => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback(window.scrollY);
        setTicking(false);
      });
      setTicking(true);
    }
  }, [callback, ticking]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
};

// Image lazy loading optimization
export const useImageLazyLoading = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: '50px' }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [element, threshold]);

  return { isIntersecting, setElement };
};

// Mobile-specific animation preferences
export const useMobileAnimationPreferences = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const viewport = useViewport();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    prefersReducedMotion,
    shouldReduceAnimations: prefersReducedMotion || viewport.isMobile,
  };
};

// Gesture-friendly scroll behavior
export const enableMobileFriendlyScroll = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Prevent zoom on double tap for iOS
    let lastTouchEnd = 0;
    
    const preventZoom = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', preventZoom, { passive: false });

    // Improve scroll performance on mobile
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-overflow-scrolling: touch;
        -webkit-tap-highlight-color: transparent;
      }
      
      body {
        touch-action: pan-y;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('touchend', preventZoom);
      document.head.removeChild(style);
    };
  }, []);
};

// Mobile-optimized intersection observer
export const useMobileIntersectionObserver = (
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const viewport = useViewport();

  useEffect(() => {
    if (!element) return;

    // Adjust thresholds for mobile devices
    const mobileOptions = {
      threshold: viewport.isMobile ? 0.1 : 0.2,
      rootMargin: viewport.isMobile ? '20px' : '50px',
      ...options,
    };

    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      mobileOptions
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [element, callback, viewport.isMobile, options]);

  return setElement;
};