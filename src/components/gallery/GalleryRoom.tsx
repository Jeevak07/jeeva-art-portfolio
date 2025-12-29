'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { GalleryRoomProps, Artwork } from '@/types';
import { ArtworkDisplay } from '@/components/ui/ArtworkDisplay';
import { 
  museumLighting, 
  museumTypography, 
  museumAnimations,
  responsive,
  galleryLayout
} from '@/styles/museumAesthetics';

// Main gallery room container
const GalleryRoomContainer = styled.section<{ $spacing: 'compact' | 'comfortable' | 'spacious' }>`
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme, $spacing }) => {
    const spacingMap = {
      compact: theme.spacing.lg,
      comfortable: theme.spacing.xl,
      spacious: theme.spacing.xxl
    };
    return `${spacingMap[$spacing]} ${theme.spacing.lg}`;
  }};
  background: ${({ theme }) => theme.colors.museum.darkBackground};
  ${({ theme }) => museumLighting.ambientGlow(theme)}
  
  ${responsive.tablet`
    padding: 2rem 1.5rem;
  `}
  
  ${responsive.mobile`
    padding: 1.5rem 1rem;
  `}
`;

// Gallery content wrapper
const GalleryContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  ${({ theme }) => museumLighting.wallWash(theme)}
`;

// Gallery title with museum typography
const GalleryTitle = styled.h2<{ $isVisible: boolean }>`
  ${({ theme }) => museumTypography.sectionTitle(theme)}
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: translateY(${({ $isVisible }) => $isVisible ? '0' : '30px'});
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  ${responsive.mobile`
    margin-bottom: 2rem;
    font-size: 2rem;
  `}
`;

// Responsive grid layout for artworks
const ArtworkGrid = styled.div<{ 
  $layout: 'grid' | 'masonry' | 'linear';
  $spacing: 'compact' | 'comfortable' | 'spacious';
  $columns: { mobile: number; tablet: number; desktop: number };
}>`
  display: grid;
  gap: ${({ theme, $spacing }) => {
    const gapMap = {
      compact: theme.spacing.md,
      comfortable: theme.spacing.lg,
      spacious: theme.spacing.xl
    };
    return gapMap[$spacing];
  }};
  
  /* Responsive grid columns */
  grid-template-columns: ${({ $columns }) => `repeat(${$columns.mobile}, 1fr)`};
  
  ${responsive.tablet`
    grid-template-columns: repeat(2, 1fr);
  `}
  
  ${responsive.desktop`
    grid-template-columns: repeat(3, 1fr);
  `}
  
  /* Masonry layout for varied heights */
  ${({ $layout }) => $layout === 'masonry' && `
    grid-auto-rows: masonry;
  `}
  
  /* Linear layout for single column */
  ${({ $layout }) => $layout === 'linear' && `
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  `}
  
  ${({ theme }) => museumLighting.floorReflection(theme)}
`;

// Individual artwork container with staggered animation
const ArtworkContainer = styled.div<{ $index: number; $isVisible: boolean }>`
  position: relative;
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: translateY(${({ $isVisible }) => $isVisible ? '0' : '20px'});
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: ${({ $index }) => $index * 0.1}s;
  
  /* Ensure proper aspect ratio maintenance */
  width: 100%;
  
  /* Progressive reveal with subtle movement */
  ${({ $isVisible }) => !$isVisible && `
    filter: blur(2px);
  `}
`;

// Gallery navigation label
const GalleryLabel = styled.div<{ $isVisible: boolean }>`
  ${({ theme }) => museumTypography.galleryLabel(theme)}
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
  white-space: nowrap;
  opacity: ${({ $isVisible }) => $isVisible ? 0.7 : 0};
  transition: opacity 0.8s ease;
  
  ${responsive.tablet`
    display: none;
  `}
`;

export const GalleryRoom: React.FC<GalleryRoomProps> = ({
  artworks,
  theme,
  layout = 'grid',
  onArtworkClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleArtworks, setVisibleArtworks] = useState<Set<number>>(new Set());
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const artworkRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Main container intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Individual artwork intersection observers for staggered animations
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    artworkRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleArtworks(prev => new Set([...prev, index]));
            }
          },
          { threshold: 0.2, rootMargin: '50px' }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [artworks.length]);

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    if (onArtworkClick) {
      onArtworkClick(artwork);
    }
  };

  const getArtworkSize = (index: number): 'small' | 'medium' | 'large' => {
    // Vary artwork sizes for visual interest
    if (layout === 'grid') {
      return index % 7 === 0 ? 'large' : index % 3 === 0 ? 'small' : 'medium';
    }
    return 'medium';
  };

  const spacingType = theme.spacing === 32 ? 'comfortable' : theme.spacing === 40 ? 'spacious' : 'compact';

  return (
    <GalleryRoomContainer 
      ref={containerRef} 
      $spacing={spacingType}
      data-testid="gallery-room"
    >
      <GalleryContent data-testid="gallery-content">
        <GalleryTitle $isVisible={isVisible}>
          Anime Gallery
        </GalleryTitle>
        
        <ArtworkGrid
          $layout={layout}
          $spacing={spacingType}
          $columns={theme.columns}
          data-testid="artwork-grid"
          data-layout={layout}
          data-spacing={spacingType}
        >
          {artworks.map((artwork, index) => (
            <ArtworkContainer
              key={artwork.id}
              ref={el => { artworkRefs.current[index] = el; }}
              $index={index}
              $isVisible={visibleArtworks.has(index)}
              data-testid={`artwork-container-${index}`}
            >
              <ArtworkDisplay
                artwork={artwork}
                size={getArtworkSize(index)}
                interactive={true}
                onArtworkClick={handleArtworkClick}
              />
            </ArtworkContainer>
          ))}
        </ArtworkGrid>
        
        <GalleryLabel $isVisible={isVisible}>
          Anime Collection
        </GalleryLabel>
      </GalleryContent>
    </GalleryRoomContainer>
  );
};

export default GalleryRoom;