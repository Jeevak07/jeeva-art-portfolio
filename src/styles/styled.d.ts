import 'styled-components';

// Extend the DefaultTheme interface for styled-components
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: {
        primary: string;
        secondary: string;
        muted: string;
      };
      accent: string;
      border: string;
      museum: {
        darkBackground: string;
        lightingGlow: string;
        spotlightGlow: string;
        frameGold: string;
        frameShadow: string;
        galleryWall: string;
        floorReflection: string;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    typography: {
      fontFamily: {
        primary: string;
        secondary: string;
        display: string;
        body: string;
      };
      fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        xxl: string;
        xxxl: string;
        display: string;
        hero: string;
      };
      fontWeight: {
        light: number;
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
      };
      lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
        loose: number;
      };
      letterSpacing: {
        tight: string;
        normal: string;
        wide: string;
        wider: string;
        widest: string;
      };
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      wide: string;
    };
    animation: {
      duration: {
        instant: string;
        fast: string;
        normal: string;
        slow: string;
        cinematic: string;
      };
      easing: {
        easeOut: string;
        easeInOut: string;
        museum: string;
        cinematic: string;
        gentle: string;
        elegant: string;
      };
    };
    shadows: {
      soft: string;
      medium: string;
      strong: string;
      artwork: string;
      museum: {
        spotlight: string;
        frame: string;
        galleryFloor: string;
        artworkHover: string;
      };
    };
    lighting: {
      ambient: string;
      spotlight: string;
      wallWash: string;
      floorReflection: string;
    };
  }
}