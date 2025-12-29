'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { getOptimizedScrollConfig, ScrollPerformanceMonitor } from '@/utils/scrollConfig';
import { useScrollPositionRecovery } from '@/utils/errorHandling';

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const performanceMonitorRef = useRef<ScrollPerformanceMonitor | null>(null);
  const { savePosition, restorePosition } = useScrollPositionRecovery('main-scroll');

  useEffect(() => {
    try {
      // Get device-optimized configuration
      const scrollConfig = getOptimizedScrollConfig();
      
      // Initialize performance monitoring
      performanceMonitorRef.current = new ScrollPerformanceMonitor();
      performanceMonitorRef.current.start();

      // Initialize Lenis with optimized configuration
      lenisRef.current = new Lenis({
        duration: scrollConfig.duration,
        easing: scrollConfig.easing,
        wheelMultiplier: scrollConfig.wheelMultiplier,
        infinite: false,
        autoResize: true,
      });

      // Save scroll position periodically
      let lastSavedPosition = 0;
      const saveInterval = setInterval(() => {
        const currentPosition = window.scrollY;
        if (Math.abs(currentPosition - lastSavedPosition) > 50) {
          savePosition(currentPosition);
          lastSavedPosition = currentPosition;
        }
      }, 1000);

      // Animation frame loop for smooth scrolling with error handling
      function raf(time: number) {
        try {
          lenisRef.current?.raf(time);
          requestAnimationFrame(raf);
        } catch (error) {
          console.warn('Lenis animation frame error:', error);
          // Fallback: continue without Lenis
          requestAnimationFrame(raf);
        }
      }
      requestAnimationFrame(raf);

      // Restore scroll position on page load
      const savedPosition = restorePosition();
      if (savedPosition > 0) {
        setTimeout(() => {
          window.scrollTo({
            top: savedPosition,
            behavior: 'smooth'
          });
        }, 100);
      }

      // Cleanup on unmount
      return () => {
        clearInterval(saveInterval);
        performanceMonitorRef.current?.stop();
        lenisRef.current?.destroy();
      };
    } catch (error) {
      console.error('Error initializing Lenis provider:', error);
      // Continue without smooth scrolling
    }
  }, [savePosition, restorePosition]);

  return <>{children}</>;
}