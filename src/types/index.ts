// Core data models for the Sketch Museum Portfolio

export interface Artwork {
  id: string;
  title: string;
  category: 'anime' | 'portrait' | 'realism';
  imageUrl: string;
  thumbnailUrl: string;
  description?: string;
  dimensions: { width: number; height: number };
  createdDate: Date;
  tags: string[];
}

export interface GallerySection {
  id: string;
  name: string;
  theme: GalleryTheme;
  artworks: Artwork[];
  layout: 'grid' | 'masonry' | 'linear';
  spacing: 'compact' | 'comfortable' | 'spacious';
}

export interface GalleryTheme {
  backgroundColor: string;
  accentColor: string;
  spacing: number;
  columns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  duration?: number;
}

export interface ContactMethod {
  platform: 'instagram' | 'whatsapp' | 'email';
  url: string;
  displayText: string;
  icon: string;
}

// Animation and interaction types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface ScrollProgress {
  progress: number;
  direction: 'up' | 'down';
  velocity: number;
}

export interface ViewportSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// Component prop types
export interface MuseumLayoutProps {
  sections: GallerySection[];
  currentSection: string;
}

export interface GalleryRoomProps {
  artworks: Artwork[];
  theme: GalleryTheme;
  layout: 'grid' | 'masonry' | 'linear';
  onArtworkClick?: (artwork: Artwork) => void;
}

export interface ArtworkDisplayProps {
  artwork: Artwork;
  size: 'small' | 'medium' | 'large';
  interactive: boolean;
  onArtworkClick?: (artwork: Artwork) => void;
}

export interface InteractiveViewerProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ProcessShowcaseProps {
  steps: ProcessStep[];
  autoPlay: boolean;
}

export interface CommissionInterfaceProps {
  contactMethods: ContactMethod[];
  availability: boolean;
}