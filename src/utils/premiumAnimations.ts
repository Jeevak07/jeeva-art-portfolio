// Premium animation configurations for museum experience

export interface PremiumEasing {
  museum: string;
  cinematic: string;
  gentle: string;
  elegant: string;
}

export interface AnimationTimings {
  instant: number;
  fast: number;
  normal: number;
  slow: number;
  cinematic: number;
}

// Premium easing curves for museum-quality animations
export const premiumEasing: PremiumEasing = {
  // Main museum easing - sophisticated and calm
  museum: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  
  // Cinematic easing for scroll-driven animations
  cinematic: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  
  // Gentle easing for hover interactions
  gentle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  
  // Elegant easing for section transitions
  elegant: 'cubic-bezier(0.23, 1, 0.32, 1)'
};

// Refined animation timings
export const animationTimings: AnimationTimings = {
  instant: 0.15,
  fast: 0.3,
  normal: 0.6,
  slow: 0.8,
  cinematic: 1.2
};

// Scroll-driven animation configuration
export interface ScrollAnimationConfig {
  threshold: number;
  rootMargin: string;
  staggerDelay: number;
  revealDistance: number;
  parallaxIntensity: number;
}

export const scrollAnimationConfig: ScrollAnimationConfig = {
  threshold: 0.1,
  rootMargin: '100px',
  staggerDelay: 0.1,
  revealDistance: 30,
  parallaxIntensity: 0.5
};

// Premium hover interaction configurations
export interface HoverConfig {
  scale: number;
  duration: number;
  easing: string;
  shadowIntensity: number;
}

export const hoverConfigs = {
  gentle: {
    scale: 1.03,
    duration: animationTimings.normal,
    easing: premiumEasing.gentle,
    shadowIntensity: 0.15
  } as HoverConfig,
  
  subtle: {
    scale: 1.05,
    duration: animationTimings.slow,
    easing: premiumEasing.museum,
    shadowIntensity: 0.2
  } as HoverConfig,
  
  premium: {
    scale: 1.07,
    duration: animationTimings.cinematic,
    easing: premiumEasing.elegant,
    shadowIntensity: 0.25
  } as HoverConfig
};

// Section transition configurations
export interface SectionTransitionConfig {
  duration: number;
  easing: string;
  parallaxOffset: number;
  fadeDistance: number;
}

export const sectionTransitions: Record<string, SectionTransitionConfig> = {
  hero: {
    duration: animationTimings.cinematic,
    easing: premiumEasing.cinematic,
    parallaxOffset: 0.3,
    fadeDistance: 100
  },
  
  gallery: {
    duration: animationTimings.slow,
    easing: premiumEasing.museum,
    parallaxOffset: 0.2,
    fadeDistance: 80
  },
  
  process: {
    duration: animationTimings.normal,
    easing: premiumEasing.elegant,
    parallaxOffset: 0.15,
    fadeDistance: 60
  },
  
  commission: {
    duration: animationTimings.slow,
    easing: premiumEasing.gentle,
    parallaxOffset: 0.1,
    fadeDistance: 50
  }
};

// Image reveal animation configurations
export interface ImageRevealConfig {
  type: 'clip' | 'fade' | 'slide';
  direction: 'top' | 'bottom' | 'left' | 'right';
  duration: number;
  easing: string;
  stagger: number;
}

export const imageRevealConfigs: Record<string, ImageRevealConfig> = {
  artwork: {
    type: 'clip',
    direction: 'bottom',
    duration: animationTimings.cinematic,
    easing: premiumEasing.museum,
    stagger: 0.1
  },
  
  process: {
    type: 'slide',
    direction: 'left',
    duration: animationTimings.slow,
    easing: premiumEasing.elegant,
    stagger: 0.2
  },
  
  hero: {
    type: 'fade',
    direction: 'bottom',
    duration: animationTimings.cinematic,
    easing: premiumEasing.cinematic,
    stagger: 0
  }
};

// Performance-optimized animation utilities
export class PremiumAnimationController {
  private static instance: PremiumAnimationController;
  private animationFrameId: number | null = null;
  private scrollCallbacks: Map<string, (progress: number) => void> = new Map();
  
  static getInstance(): PremiumAnimationController {
    if (!PremiumAnimationController.instance) {
      PremiumAnimationController.instance = new PremiumAnimationController();
    }
    return PremiumAnimationController.instance;
  }
  
  // Register scroll-driven animation
  registerScrollAnimation(id: string, callback: (progress: number) => void): void {
    this.scrollCallbacks.set(id, callback);
    this.startAnimationLoop();
  }
  
  // Unregister scroll-driven animation
  unregisterScrollAnimation(id: string): void {
    this.scrollCallbacks.delete(id);
    if (this.scrollCallbacks.size === 0) {
      this.stopAnimationLoop();
    }
  }
  
  private startAnimationLoop(): void {
    if (this.animationFrameId !== null) return;
    
    const animate = () => {
      const scrollProgress = this.calculateScrollProgress();
      
      this.scrollCallbacks.forEach(callback => {
        callback(scrollProgress);
      });
      
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }
  
  private stopAnimationLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  private calculateScrollProgress(): number {
    if (typeof window === 'undefined') return 0;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(1, Math.max(0, scrollTop / scrollHeight));
  }
}

// Utility functions for premium animations
export function createStaggeredAnimation(
  elements: NodeListOf<Element> | Element[],
  config: {
    delay: number;
    duration: number;
    easing: string;
    transform: string;
    opacity?: boolean;
  }
): void {
  Array.from(elements).forEach((element, index) => {
    const htmlElement = element as HTMLElement;
    const totalDelay = config.delay * index;
    
    htmlElement.style.transition = `all ${config.duration}s ${config.easing} ${totalDelay}s`;
    
    if (config.opacity) {
      htmlElement.style.opacity = '0';
    }
    
    // Trigger animation
    requestAnimationFrame(() => {
      htmlElement.style.transform = config.transform;
      if (config.opacity) {
        htmlElement.style.opacity = '1';
      }
    });
  });
}

export function createParallaxEffect(
  element: HTMLElement,
  intensity: number = 0.5
): () => void {
  const controller = PremiumAnimationController.getInstance();
  const id = `parallax-${Math.random().toString(36).substr(2, 9)}`;
  
  controller.registerScrollAnimation(id, (progress) => {
    const offset = progress * intensity * 100;
    element.style.transform = `translateY(${offset}px)`;
  });
  
  // Return cleanup function
  return () => {
    controller.unregisterScrollAnimation(id);
  };
}

export function createSmoothReveal(
  element: HTMLElement,
  config: ImageRevealConfig
): void {
  const { type, direction, duration, easing } = config;
  
  element.style.transition = `all ${duration}s ${easing}`;
  
  switch (type) {
    case 'clip':
      const clipValue = direction === 'bottom' ? 'inset(100% 0 0 0)' :
                       direction === 'top' ? 'inset(0 0 100% 0)' :
                       direction === 'left' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
      element.style.clipPath = clipValue;
      
      requestAnimationFrame(() => {
        element.style.clipPath = 'inset(0 0 0 0)';
      });
      break;
      
    case 'slide':
      const slideValue = direction === 'bottom' ? 'translateY(30px)' :
                        direction === 'top' ? 'translateY(-30px)' :
                        direction === 'left' ? 'translateX(-30px)' : 'translateX(30px)';
      element.style.transform = slideValue;
      element.style.opacity = '0';
      
      requestAnimationFrame(() => {
        element.style.transform = 'translate(0, 0)';
        element.style.opacity = '1';
      });
      break;
      
    case 'fade':
      element.style.opacity = '0';
      
      requestAnimationFrame(() => {
        element.style.opacity = '1';
      });
      break;
  }
}