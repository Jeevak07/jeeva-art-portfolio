'use client';

import React, { useEffect, useState } from 'react';
import { 
  usePerformanceOptimization, 
  enableMobileFriendlyScroll
} from '@/utils/mobileOptimization';
import { AnimationPerformanceOptimizer } from '@/utils/performanceOptimization';

interface MobilePerformanceOptimizerProps {
  children: React.ReactNode;
}

export const MobilePerformanceOptimizer: React.FC<MobilePerformanceOptimizerProps> = ({
  children
}) => {
  const { isLowPerformance } = usePerformanceOptimization();
  const [optimizationsApplied, setOptimizationsApplied] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Enable mobile-friendly scroll behavior
    enableMobileFriendlyScroll();

    // Initialize performance monitoring
    const performanceOptimizer = new AnimationPerformanceOptimizer();
    performanceOptimizer.startMonitoring();

    // Apply performance optimizations for low-performance devices
    if (isLowPerformance) {
      // Enhanced performance optimizations
      const style = document.createElement('style');
      style.id = 'mobile-performance-optimizations';
      style.textContent = `
        /* Simplified animations for low-performance devices */
        .performance-optimized * {
          animation-duration: 0.2s !important;
          transition-duration: 0.2s !important;
          will-change: auto !important;
        }
        
        /* Disable complex effects */
        .performance-optimized *::before,
        .performance-optimized *::after {
          display: none !important;
        }
        
        /* Reduce blur and filter effects */
        .performance-optimized [style*="blur"],
        .performance-optimized [style*="filter"] {
          filter: none !important;
          backdrop-filter: none !important;
        }
        
        /* Simplify shadows and gradients */
        .performance-optimized * {
          box-shadow: none !important;
          text-shadow: none !important;
          background-image: none !important;
        }
        
        /* Optimize transforms for GPU acceleration */
        .performance-optimized * {
          transform: translateZ(0) !important;
          backface-visibility: hidden !important;
        }
        
        /* Reduce image quality on low performance */
        .performance-optimized img {
          image-rendering: optimizeSpeed !important;
        }
        
        /* Disable hover effects on touch devices */
        @media (hover: none) {
          .performance-optimized *:hover {
            transform: none !important;
            box-shadow: none !important;
            filter: none !important;
          }
        }
        
        /* Optimize scroll performance */
        .performance-optimized {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: auto !important;
        }
      `;
      
      if (!document.getElementById('mobile-performance-optimizations')) {
        document.head.appendChild(style);
        document.body.classList.add('performance-optimized');
      }

      // Set flag to indicate optimizations are applied
      setOptimizationsApplied(true);

      return () => {
        const existingStyle = document.getElementById('mobile-performance-optimizations');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
        document.body.classList.remove('performance-optimized');
        performanceOptimizer.stopMonitoring();
      };
    }

    return () => {
      performanceOptimizer.stopMonitoring();
    };
  }, [isLowPerformance]);

  // Apply viewport meta tag optimizations
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
      );
    }

    // Add mobile-specific meta tags for better performance
    const metaTags = [
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-tap-highlight', content: 'no' },
    ];

    const createdTags: HTMLMetaElement[] = [];

    metaTags.forEach(({ name, content }) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
        createdTags.push(meta);
      }
    });

    return () => {
      createdTags.forEach(tag => {
        if (document.head.contains(tag)) {
          document.head.removeChild(tag);
        }
      });
    };
  }, []);

  // Optimize image loading for mobile with enhanced lazy loading
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Add loading="lazy" for better performance
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        
        // Add decoding="async" for better performance
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }

        // Add fetchpriority for above-the-fold images
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          img.setAttribute('fetchpriority', 'high');
        }
      });
    };

    optimizeImages();

    // Re-optimize when new images are added
    const observer = new MutationObserver(() => {
      optimizeImages();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [children]);

  // Memory cleanup on page visibility change
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // Page is hidden, perform memory cleanup
        if (window.gc) {
          window.gc();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <>
      {children}
      {/* Performance indicator for development */}
      {process.env.NODE_ENV === 'development' && optimizationsApplied && (
        <div
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            background: 'rgba(255, 165, 0, 0.9)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontFamily: 'monospace',
            zIndex: 9999,
            pointerEvents: 'none',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          🚀 Performance Mode Active
        </div>
      )}
    </>
  );
};

export default MobilePerformanceOptimizer;