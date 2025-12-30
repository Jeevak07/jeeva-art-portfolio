'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    
    /* Enhanced mobile scrolling */
    @media (max-width: 768px) {
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
    }
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    background: ${({ theme }) => theme.colors.museum.darkBackground};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding-top: 80px; /* Space for sticky navbar */
    
    /* Museum ambient lighting effect - OPTIMIZED */
    /* Remove background-attachment: fixed for better performance */
    background-image: ${({ theme }) => theme.lighting.ambient};
    background-size: 100% 100%;
    background-repeat: no-repeat;
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      touch-action: pan-y;
      padding-top: 70px; /* Smaller navbar on mobile */
      
      /* Prevent zoom on input focus */
      font-size: 16px;
    }
    
    /* Prevent horizontal scroll on mobile */
    @media (max-width: 480px) {
      max-width: 100vw;
      overflow-x: hidden;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.hero};
    font-weight: ${({ theme }) => theme.typography.fontWeight.light};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wider};
    
    @media (max-width: 768px) {
      font-size: ${({ theme }) => theme.typography.fontSize.display};
    }
    
    @media (max-width: 480px) {
      font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
      line-height: 1.1;
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.display};
    
    @media (max-width: 768px) {
      font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
    }
    
    @media (max-width: 480px) {
      font-size: ${({ theme }) => theme.typography.fontSize.xxl};
    }
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xxl};
    
    @media (max-width: 768px) {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
    }
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
    
    /* Better mobile readability */
    @media (max-width: 480px) {
      line-height: 1.6;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
    
    /* Enhanced mobile touch targets */
    @media (max-width: 768px) {
      min-height: 44px;
      min-width: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeOut};
    
    /* Enhanced mobile touch feedback */
    @media (max-width: 768px) {
      -webkit-tap-highlight-color: rgba(201, 169, 110, 0.2);
      -webkit-touch-callout: none;
      user-select: none;
      
      &:active {
        transform: scale(0.98);
        transition-duration: 0.1s;
      }
    }
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    
    /* Prevent image dragging on mobile */
    @media (max-width: 768px) {
      -webkit-user-drag: none;
      -webkit-touch-callout: none;
      user-select: none;
    }
  }

  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
    
    @media (max-width: 768px) {
      width: 4px;
    }
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.muted};
  }

  /* Selection styles */
  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.background};
  }

  /* Focus styles for accessibility */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  /* Enhanced mobile focus styles */
  @media (max-width: 768px) {
    :focus {
      outline: 3px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 3px;
    }
  }

  /* Smooth transitions for theme changes - OPTIMIZED */
  /* Remove universal selector and target specific elements only */
  .theme-transition {
    transition: background-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut},
                color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut},
                border-color ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeOut};
  }
  
  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  /* Mobile-specific optimizations */
  @media (max-width: 768px) {
    /* Prevent text inflation on mobile */
    html {
      -webkit-text-size-adjust: 100%;
    }
    
    /* Optimize font rendering on mobile */
    body {
      text-rendering: optimizeSpeed;
    }
    
    /* Improve touch scrolling performance */
    * {
      -webkit-overflow-scrolling: touch;
    }
  }
`;