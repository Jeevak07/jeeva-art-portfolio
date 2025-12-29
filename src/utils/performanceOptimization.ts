/**
 * Advanced performance optimization utilities for the Sketch Museum Portfolio
 * Implements lazy loading, memory management, and animation performance optimization
 */

import { useEffect, useState, useCallback, useRef } from 'react';

// Image lazy loading with progressive enhancement
export class ImageLazyLoader {
  private observer: IntersectionObserver | null = null;
  private imageCache = new Map<string, HTMLImageElement>();
  private loadingQueue = new Set<string>();
  private maxCacheSize = 50; // Maximum number of cached images

  constructor() {
    this.initializeObserver();
  }

  private initializeObserver() {
    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer?.unobserve(img);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
      }
    );
  }

  private async loadImage(img: HTMLImageElement) {
    if (!img || !img.dataset) {
      console.warn('Invalid image element passed to loadImage');
      return;
    }
    
    const src = img.dataset.src;
    if (!src || this.loadingQueue.has(src)) return;

    this.loadingQueue.add(src);

    try {
      // Check cache first
      let cachedImage = this.imageCache.get(src);
      
      if (!cachedImage) {
        // Create new image and preload
        cachedImage = new Image();
        cachedImage.src = src;
        
        await new Promise((resolve, reject) => {
          cachedImage!.onload = resolve;
          cachedImage!.onerror = reject;
        });

        // Add to cache with size management
        this.addToCache(src, cachedImage);
      }

      // Apply loaded image
      img.src = src;
      img.classList.add('loaded');
      
    } catch (error) {
      console.warn('Failed to load image:', src, error);
      img.classList.add('error');
    } finally {
      this.loadingQueue.delete(src);
    }
  }

  private addToCache(src: string, image: HTMLImageElement) {
    // Remove oldest entries if cache is full
    if (this.imageCache.size >= this.maxCacheSize) {
      const firstKey = this.imageCache.keys().next().value;
      if (firstKey) {
        this.imageCache.delete(firstKey);
      }
    }
    
    this.imageCache.set(src, image);
  }

  public observe(img: HTMLImageElement) {
    if (this.observer && img && img.dataset && img.dataset.src) {
      this.observer.observe(img);
    }
  }

  public unobserve(img: HTMLImageElement) {
    if (this.observer) {
      this.observer.unobserve(img);
    }
  }

  public clearCache() {
    this.imageCache.clear();
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.clearCache();
    this.loadingQueue.clear();
  }
}

// Memory management for image resources
export class ImageMemoryManager {
  private static instance: ImageMemoryManager;
  private imageRefs = new WeakMap<HTMLImageElement, string>();
  private memoryThreshold = 100 * 1024 * 1024; // 100MB threshold

  static getInstance(): ImageMemoryManager {
    if (!ImageMemoryManager.instance) {
      ImageMemoryManager.instance = new ImageMemoryManager();
    }
    return ImageMemoryManager.instance;
  }

  public trackImage(img: HTMLImageElement, src: string) {
    this.imageRefs.set(img, src);
  }

  public untrackImage(img: HTMLImageElement) {
    this.imageRefs.delete(img);
  }

  public async checkMemoryUsage(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const usedMemory = memInfo.usedJSHeapSize;
      
      if (usedMemory > this.memoryThreshold) {
        await this.cleanupUnusedImages();
        return true;
      }
    }
    return false;
  }

  private async cleanupUnusedImages() {
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }

    // Clear unused image elements
    const images = document.querySelectorAll('img[src]');
    images.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight + 1000 && 
                       rect.bottom > -1000;
      
      if (!isVisible && (img as HTMLImageElement).src.startsWith('blob:')) {
        URL.revokeObjectURL((img as HTMLImageElement).src);
        img.removeAttribute('src');
      }
    });
  }
}

// Animation performance optimizer
export class AnimationPerformanceOptimizer {
  private frameRate = 60;
  private lastFrameTime = 0;
  private frameCount = 0;
  private isMonitoring = false;
  private performanceCallbacks: Array<(fps: number) => void> = [];

  public startMonitoring() {
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.measurePerformance();
  }

  public stopMonitoring() {
    this.isMonitoring = false;
  }

  private measurePerformance() {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    if (currentTime - this.lastFrameTime >= 1000) {
      this.frameRate = Math.round((this.frameCount * 1000) / (currentTime - this.lastFrameTime));
      this.frameCount = 0;
      this.lastFrameTime = currentTime;

      // Notify callbacks
      this.performanceCallbacks.forEach(callback => callback(this.frameRate));

      // Auto-optimize if performance is poor
      if (this.frameRate < 30) {
        this.applyPerformanceOptimizations();
      }
    }

    requestAnimationFrame(() => this.measurePerformance());
  }

  private applyPerformanceOptimizations() {
    if (typeof window === 'undefined') return;
    
    // Reduce animation complexity
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
    document.documentElement.style.setProperty('--transition-duration', '0.2s');
    
    // Disable expensive effects
    const style = document.createElement('style');
    style.id = 'performance-optimizations';
    style.textContent = `
      .performance-optimized * {
        will-change: auto !important;
        transform: translateZ(0) !important;
      }
      
      .performance-optimized *::before,
      .performance-optimized *::after {
        display: none !important;
      }
      
      .performance-optimized * {
        box-shadow: none !important;
        filter: none !important;
      }
    `;
    
    if (!document.getElementById('performance-optimizations')) {
      document.head.appendChild(style);
      document.body.classList.add('performance-optimized');
    }
  }

  public onPerformanceChange(callback: (fps: number) => void) {
    this.performanceCallbacks.push(callback);
  }

  public getCurrentFPS(): number {
    return this.frameRate;
  }

  public isPerformanceGood(): boolean {
    return this.frameRate >= 50;
  }
}

// React hooks for performance optimization

export const useImageLazyLoading = () => {
  const lazyLoader = useRef<ImageLazyLoader | null>(null);

  useEffect(() => {
    lazyLoader.current = new ImageLazyLoader();
    
    return () => {
      lazyLoader.current?.destroy();
    };
  }, []);

  const observeImage = useCallback((img: HTMLImageElement) => {
    lazyLoader.current?.observe(img);
  }, []);

  const unobserveImage = useCallback((img: HTMLImageElement) => {
    lazyLoader.current?.unobserve(img);
  }, []);

  return { observeImage, unobserveImage };
};

export const useMemoryManagement = () => {
  const memoryManager = useRef(ImageMemoryManager.getInstance());

  const trackImage = useCallback((img: HTMLImageElement, src: string) => {
    memoryManager.current.trackImage(img, src);
  }, []);

  const untrackImage = useCallback((img: HTMLImageElement) => {
    memoryManager.current.untrackImage(img);
  }, []);

  const checkMemory = useCallback(async () => {
    return await memoryManager.current.checkMemoryUsage();
  }, []);

  return { trackImage, untrackImage, checkMemory };
};

export const useAnimationPerformance = () => {
  const [fps, setFps] = useState(60);
  const [isOptimized, setIsOptimized] = useState(false);
  const optimizer = useRef<AnimationPerformanceOptimizer | null>(null);

  useEffect(() => {
    optimizer.current = new AnimationPerformanceOptimizer();
    
    optimizer.current.onPerformanceChange((currentFps) => {
      setFps(currentFps);
      setIsOptimized(currentFps < 30);
    });

    optimizer.current.startMonitoring();

    return () => {
      optimizer.current?.stopMonitoring();
    };
  }, []);

  return { fps, isOptimized, isPerformanceGood: fps >= 50 };
};

// Build optimization utilities
export const getBuildOptimizations = () => {
  return {
    // Image optimization settings
    images: {
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    
    // Bundle optimization
    experimental: {
      optimizeCss: true,
      optimizePackageImports: ['framer-motion', 'gsap', 'lenis', 'styled-components'],
      turbo: {
        rules: {
          '*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js',
          },
        },
      },
    },
    
    // Compiler optimizations
    compiler: {
      styledComponents: {
        displayName: process.env.NODE_ENV === 'development',
        ssr: true,
        minify: true,
      },
      removeConsole: process.env.NODE_ENV === 'production',
    },
    
    // Performance optimizations
    poweredByHeader: false,
    compress: true,
    generateEtags: false,
    
    // Webpack optimizations
    webpack: (config: any) => {
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Optimize chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          animations: {
            test: /[\\/]node_modules[\\/](framer-motion|gsap|lenis)[\\/]/,
            name: 'animations',
            chunks: 'all',
          },
        },
      };
      
      return config;
    },
  };
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    isOptimized: false,
  });

  useEffect(() => {
    const startTime = performance.now();
    
    // Monitor FPS
    const { fps, isOptimized } = useAnimationPerformance();
    
    // Monitor memory usage
    const checkMemory = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        return memInfo.usedJSHeapSize / (1024 * 1024); // Convert to MB
      }
      return 0;
    };

    const updateMetrics = () => {
      setMetrics({
        fps,
        memoryUsage: checkMemory(),
        loadTime: performance.now() - startTime,
        isOptimized,
      });
    };

    const interval = setInterval(updateMetrics, 1000);
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  return metrics;
};