'use client';

import { useEffect, useState, useCallback } from 'react';
import { ScrollProgress } from '@/types';

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    progress: 0,
    direction: 'down',
    velocity: 0,
  });

  const [lastScrollY, setLastScrollY] = useState(0);

  const updateScrollProgress = useCallback(() => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? scrollY / documentHeight : 0;
    
    // Calculate direction and velocity
    const direction = scrollY > lastScrollY ? 'down' : 'up';
    const velocity = Math.abs(scrollY - lastScrollY);
    
    setScrollProgress({
      progress: Math.min(Math.max(progress, 0), 1),
      direction,
      velocity,
    });
    
    setLastScrollY(scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    // Throttled scroll handler for performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateScrollProgress]);

  return scrollProgress;
}