'use client';

import { useEffect } from 'react';

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Optimize animations for low-end devices
    const optimizeForDevice = () => {
      const isLowEndDevice = () => {
        // Check for low-end device indicators
        const memory = (navigator as any).deviceMemory;
        const connection = (navigator as any).connection;
        const hardwareConcurrency = navigator.hardwareConcurrency;
        
        return (
          memory && memory < 4 || // Less than 4GB RAM
          hardwareConcurrency && hardwareConcurrency < 4 || // Less than 4 CPU cores
          connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
        );
      };

      if (isLowEndDevice()) {
        // Reduce animations for low-end devices
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
        
        // Add performance class
        document.body.classList.add('low-performance-mode');
        
        console.log('Low-end device detected: Animations optimized');
      }
    };

    // Optimize scroll performance
    const optimizeScrolling = () => {
      let ticking = false;
      
      const updateScrollPosition = () => {
        // Throttle scroll events
        if (!ticking) {
          requestAnimationFrame(() => {
            // Update scroll-dependent elements here if needed
            ticking = false;
          });
          ticking = true;
        }
      };

      // Use passive listeners for better performance
      window.addEventListener('scroll', updateScrollPosition, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', updateScrollPosition);
      };
    };

    // Optimize images loading
    const optimizeImages = () => {
      // Add loading="lazy" to images that don't have it
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });

      // Optimize image decoding
      const criticalImages = document.querySelectorAll('img[data-critical]');
      criticalImages.forEach(img => {
        (img as HTMLImageElement).decoding = 'sync';
      });
    };

    // Run optimizations
    optimizeForDevice();
    const cleanupScroll = optimizeScrolling();
    optimizeImages();

    // Cleanup
    return () => {
      cleanupScroll?.();
    };
  }, []);

  return null; // This component doesn't render anything
};

// CSS for low-performance mode
export const PerformanceStyles = `
  .low-performance-mode * {
    animation-duration: 0.1s !important;
    transition-duration: 0.1s !important;
  }
  
  .low-performance-mode .parallax-element {
    transform: none !important;
  }
  
  .low-performance-mode .complex-animation {
    display: none !important;
  }
`;