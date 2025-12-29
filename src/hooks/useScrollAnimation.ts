'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useScrollProgress } from './useScrollProgress';
import { useAnimationFallback } from '@/utils/errorHandling';

interface ScrollAnimationOptions {
  start?: number; // Scroll progress where animation starts (0-1)
  end?: number; // Scroll progress where animation ends (0-1)
  easing?: (t: number) => number; // Custom easing function
  animationId?: string; // Unique ID for error tracking
}

export function useScrollAnimation(
  callback: (progress: number) => void,
  options: ScrollAnimationOptions = {}
) {
  const { start = 0, end = 1, easing = (t: number) => t, animationId = 'scroll-animation' } = options;
  const { progress } = useScrollProgress();
  const rafRef = useRef<number | undefined>(undefined);
  const { isFallbackMode, markAnimationFailed, isAnimationDisabled } = useAnimationFallback(animationId);

  const animateCallback = useCallback(() => {
    try {
      // Skip animation if in fallback mode or disabled
      if (isFallbackMode || isAnimationDisabled()) {
        // Call with final state
        callback(1);
        return;
      }

      // Calculate normalized progress within the specified range
      const normalizedProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)));
      
      // Apply easing
      const easedProgress = easing(normalizedProgress);
      
      // Call the animation callback
      callback(easedProgress);
    } catch (error) {
      console.warn('Scroll animation error:', error);
      markAnimationFailed(error as Error);
      // Fallback: call with current progress without easing
      callback(Math.max(0, Math.min(1, (progress - start) / (end - start))));
    }
  }, [progress, start, end, easing, callback, isFallbackMode, isAnimationDisabled, markAnimationFailed]);

  useEffect(() => {
    try {
      // Use requestAnimationFrame for smooth animations
      rafRef.current = requestAnimationFrame(animateCallback);
    } catch (error) {
      console.warn('RequestAnimationFrame error:', error);
      markAnimationFailed(error as Error);
      // Fallback: call directly
      animateCallback();
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animateCallback, markAnimationFailed]);
}

// Custom easing functions for cinematic feel
export const easingFunctions = {
  // Ease-out cubic for smooth deceleration
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  
  // Ease-in-out cubic for smooth acceleration and deceleration
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  // Custom museum easing for premium feel
  museumEasing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  
  // Gentle bounce for subtle hover effects
  gentleBounce: (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return Math.max(0, c3 * t * t * t - c1 * t * t);
  },
};