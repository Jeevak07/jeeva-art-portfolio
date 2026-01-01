'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { ScrollPerformanceMonitor } from '@/utils/scrollConfig';
import { useScrollPositionRecovery } from '@/utils/errorHandling';

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const performanceMonitorRef = useRef<ScrollPerformanceMonitor | null>(null);
  const { savePosition, restorePosition } = useScrollPositionRecovery('main-scroll');

  useEffect(() => {
    try {
      // Initialize performance monitoring
      performanceMonitorRef.current = new ScrollPerformanceMonitor();
      performanceMonitorRef.current.start();

      // Save scroll position periodically
      let lastSavedPosition = 0;
      const saveInterval = setInterval(() => {
        const currentPosition = window.scrollY;
        if (Math.abs(currentPosition - lastSavedPosition) > 50) {
          savePosition(currentPosition);
          lastSavedPosition = currentPosition;
        }
      }, 1000);

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
      };
    } catch (error) {
      console.error('Error initializing scroll provider:', error);
      // Continue without smooth scrolling
    }
  }, [savePosition, restorePosition]);

  return <>{children}</>;
}