import { DefaultTheme } from 'styled-components';
import { premiumEasing, animationTimings } from '@/utils/premiumAnimations';

export const museumTheme: DefaultTheme = {
  colors: {
    primary: '#1a1a1a',
    secondary: '#2a2a2a',
    background: '#0a0a0a',
    surface: '#1e1e1e',
    text: {
      primary: '#f8f8f8',
      secondary: '#e0e0e0',
      muted: '#b0b0b0',
    },
    accent: '#c9a96e',
    border: '#333333',
    // Museum-specific colors
    museum: {
      darkBackground: '#0a0a0a',
      lightingGlow: 'rgba(201, 169, 110, 0.08)',
      spotlightGlow: 'rgba(255, 255, 255, 0.03)',
      frameGold: '#c9a96e',
      frameShadow: 'rgba(0, 0, 0, 0.8)',
      galleryWall: '#1a1a1a',
      floorReflection: 'rgba(255, 255, 255, 0.02)',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      secondary: '"Playfair Display", Georgia, serif',
      display: '"Playfair Display", Georgia, serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem',
      display: '3rem',
      hero: '4rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
      loose: 1.8,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
  animation: {
    duration: {
      instant: `${animationTimings.instant}s`,
      fast: `${animationTimings.fast}s`,
      normal: `${animationTimings.normal}s`,
      slow: `${animationTimings.slow}s`,
      cinematic: `${animationTimings.cinematic}s`,
    },
    easing: {
      easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      museum: premiumEasing.museum,
      cinematic: premiumEasing.cinematic,
      gentle: premiumEasing.gentle,
      elegant: premiumEasing.elegant,
    },
  },
  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.2)',
    strong: '0 8px 32px rgba(0, 0, 0, 0.3)',
    artwork: '0 8px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(201, 169, 110, 0.1)',
    // Museum-specific shadows
    museum: {
      spotlight: '0 0 40px rgba(255, 255, 255, 0.05), inset 0 0 20px rgba(201, 169, 110, 0.03)',
      frame: '0 4px 20px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(201, 169, 110, 0.3)',
      galleryFloor: '0 -2px 10px rgba(0, 0, 0, 0.3)',
      artworkHover: '0 12px 40px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(201, 169, 110, 0.2)',
    },
  },
  // Museum lighting effects
  lighting: {
    ambient: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
    spotlight: 'radial-gradient(circle at center, rgba(201, 169, 110, 0.08) 0%, rgba(201, 169, 110, 0.02) 40%, transparent 70%)',
    wallWash: 'linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, transparent 50%)',
    floorReflection: 'linear-gradient(0deg, rgba(255, 255, 255, 0.02) 0%, transparent 20%)',
  },
};