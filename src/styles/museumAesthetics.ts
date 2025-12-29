import { css, DefaultTheme } from 'styled-components';

// Museum lighting effects
export const museumLighting = {
  spotlight: (theme: DefaultTheme) => css`
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: -20%;
      left: -20%;
      right: -20%;
      bottom: -20%;
      background: ${theme.lighting.spotlight};
      pointer-events: none;
      z-index: -1;
    }
  `,
  
  ambientGlow: (theme: DefaultTheme) => css`
    background-image: ${theme.lighting.ambient};
    background-size: 100% 100%;
    background-repeat: no-repeat;
  `,
  
  wallWash: (theme: DefaultTheme) => css`
    background: linear-gradient(
      180deg,
      ${theme.colors.museum.galleryWall} 0%,
      ${theme.colors.museum.darkBackground} 100%
    );
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 30%;
      background: ${theme.lighting.wallWash};
      pointer-events: none;
    }
  `,
  
  floorReflection: (theme: DefaultTheme) => css`
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20%;
      background: ${theme.lighting.floorReflection};
      pointer-events: none;
    }
  `,
};

// Museum framing effects for artworks
export const museumFraming = {
  elegant: (theme: DefaultTheme) => css`
    position: relative;
    border: 2px solid ${theme.colors.museum.frameGold};
    box-shadow: ${theme.shadows.museum.frame};
    background: ${theme.colors.museum.galleryWall};
    
    &::before {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 1px solid rgba(201, 169, 110, 0.2);
      pointer-events: none;
    }
    
    &::after {
      content: '';
      position: absolute;
      inset: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      pointer-events: none;
    }
  `,
  
  minimal: (theme: DefaultTheme) => css`
    border: 1px solid rgba(201, 169, 110, 0.3);
    box-shadow: ${theme.shadows.museum.frame};
    background: ${theme.colors.museum.galleryWall};
  `,
  
  premium: (theme: DefaultTheme) => css`
    position: relative;
    border: 3px solid ${theme.colors.museum.frameGold};
    box-shadow: ${theme.shadows.museum.frame};
    background: ${theme.colors.museum.galleryWall};
    
    &::before {
      content: '';
      position: absolute;
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
      border: 2px solid rgba(201, 169, 110, 0.4);
      pointer-events: none;
    }
    
    &::after {
      content: '';
      position: absolute;
      inset: 12px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      pointer-events: none;
    }
  `,
};

// Hover interactions with museum-appropriate subtlety
export const museumHover = {
  gentle: (theme: DefaultTheme) => css`
    transition: all ${theme.animation.duration.slow} ${theme.animation.easing.museum};
    
    &:hover {
      transform: scale(1.03);
      box-shadow: ${theme.shadows.museum.artworkHover};
    }
  `,
  
  subtle: (theme: DefaultTheme) => css`
    transition: all ${theme.animation.duration.normal} ${theme.animation.easing.museum};
    
    &:hover {
      transform: scale(1.05);
      box-shadow: ${theme.shadows.museum.artworkHover};
      
      &::before {
        opacity: 0.8;
      }
    }
  `,
  
  premium: (theme: DefaultTheme) => css`
    transition: all ${theme.animation.duration.slow} ${theme.animation.easing.museum};
    
    &:hover {
      transform: scale(1.07);
      box-shadow: ${theme.shadows.museum.artworkHover};
      border-color: rgba(201, 169, 110, 0.6);
    }
  `,
};

// Typography styles for museum context
export const museumTypography = {
  heroTitle: (theme: DefaultTheme) => css`
    font-family: ${theme.typography.fontFamily.display};
    font-size: ${theme.typography.fontSize.hero};
    font-weight: ${theme.typography.fontWeight.light};
    letter-spacing: ${theme.typography.letterSpacing.wider};
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.text.primary};
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    
    @media (max-width: 768px) {
      font-size: ${theme.typography.fontSize.display};
      letter-spacing: ${theme.typography.letterSpacing.wide};
    }
    
    @media (max-width: 480px) {
      font-size: ${theme.typography.fontSize.xxxl};
    }
  `,
  
  sectionTitle: (theme: DefaultTheme) => css`
    font-family: ${theme.typography.fontFamily.display};
    font-size: ${theme.typography.fontSize.display};
    font-weight: ${theme.typography.fontWeight.normal};
    letter-spacing: ${theme.typography.letterSpacing.wide};
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.text.primary};
    
    @media (max-width: 768px) {
      font-size: ${theme.typography.fontSize.xxxl};
    }
    
    @media (max-width: 480px) {
      font-size: ${theme.typography.fontSize.xxl};
    }
  `,
  
  galleryLabel: (theme: DefaultTheme) => css`
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    letter-spacing: ${theme.typography.letterSpacing.widest};
    text-transform: uppercase;
    color: ${theme.colors.text.muted};
  `,
  
  artworkTitle: (theme: DefaultTheme) => css`
    font-family: ${theme.typography.fontFamily.display};
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.normal};
    letter-spacing: ${theme.typography.letterSpacing.normal};
    color: ${theme.colors.text.secondary};
  `,
  
  bodyText: (theme: DefaultTheme) => css`
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.normal};
    line-height: ${theme.typography.lineHeight.relaxed};
    color: ${theme.colors.text.secondary};
  `,
};

// Responsive design utilities
export const responsive = {
  mobile: (styles: any) => css`
    @media (max-width: 480px) {
      ${styles}
    }
  `,
  
  tablet: (styles: any) => css`
    @media (max-width: 768px) {
      ${styles}
    }
  `,
  
  desktop: (styles: any) => css`
    @media (min-width: 1024px) {
      ${styles}
    }
  `,
  
  wide: (styles: any) => css`
    @media (min-width: 1440px) {
      ${styles}
    }
  `,
  
  // Touch-friendly sizing with enhanced mobile support
  touchTarget: css`
    min-height: 44px;
    min-width: 44px;
    
    @media (max-width: 768px) {
      min-height: 48px;
      min-width: 48px;
    }
    
    @media (max-width: 480px) {
      min-height: 52px;
      min-width: 52px;
    }
  `,
  
  // Mobile-optimized animations
  mobileAnimation: css`
    @media (max-width: 768px) {
      animation-duration: 0.3s !important;
      transition-duration: 0.3s !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
      animation: none !important;
      transition: none !important;
    }
  `,
  
  // Enhanced mobile scrolling
  mobileScroll: css`
    @media (max-width: 768px) {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      scroll-behavior: smooth;
    }
  `,
  
  // Mobile-friendly hover states
  mobileHover: css`
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        /* Hover styles only for devices that support hover */
      }
    }
    
    @media (max-width: 768px) {
      &:active {
        /* Touch feedback for mobile */
        transform: scale(0.98);
        transition-duration: 0.1s;
      }
    }
  `,
};

// Gallery layout utilities
export const galleryLayout = {
  grid: (columns: number, gap: string) => css`
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: ${gap};
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(${Math.max(1, columns - 1)}, 1fr);
    }
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  `,
  
  masonry: (columns: number, gap: string) => css`
    column-count: ${columns};
    column-gap: ${gap};
    
    @media (max-width: 768px) {
      column-count: ${Math.max(1, columns - 1)};
    }
    
    @media (max-width: 480px) {
      column-count: 1;
    }
  `,
  
  centerContent: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    
    @media (max-width: 768px) {
      padding: 1.5rem;
    }
    
    @media (max-width: 480px) {
      padding: 1rem;
    }
  `,
};

// Animation utilities for museum experience
export const museumAnimations = {
  fadeInUp: (delay: number = 0) => css`
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards;
    
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  
  revealClip: (direction: 'top' | 'bottom' | 'left' | 'right' = 'bottom') => css`
    clip-path: ${direction === 'bottom' ? 'inset(100% 0 0 0)' : 
                direction === 'top' ? 'inset(0 0 100% 0)' :
                direction === 'left' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'};
    animation: revealClip 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    
    @keyframes revealClip {
      to {
        clip-path: inset(0 0 0 0);
      }
    }
  `,
  
  gentleFloat: css`
    animation: gentleFloat 6s ease-in-out infinite;
    
    @keyframes gentleFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }
  `,
};