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

// Portrait gallery container with premium spacing
const PortraitGalleryContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.museum.darkBackground};
  overflow: visible;
  ${({ theme }) => museumLighting.ambientGlow(theme)}
  
  /* Enhanced lighting for portrait gallery */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at center top,
      rgba(212, 175, 55, 0.03) 0%,
      rgba(212, 175, 55, 0.01) 40%,
      transparent 70%
    );
    pointer-events: none;
  }
  
  ${responsive.tablet`
    padding: 3rem 2rem;
  `}
  
  ${responsive.mobile`
    padding: 2rem 1.5rem;
  `}
`;

// Portrait gallery content wrapper with premium spacing
const PortraitGalleryContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  ${({ theme }) => museumLighting.wallWash(theme)}
  
  /* Subtle golden accent lighting for portraits */
  &::after {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: linear-gradient(
      135deg,
      rgba(212, 175, 55, 0.02) 0%,
      transparent 30%,
      transparent 70%,
      rgba(212, 175, 55, 0.02) 100%
    );
    border-radius: 8px;
    pointer-events: none;
    z-index: -1;
  }
`;

// Portrait gallery title with elegant typography
const PortraitGalleryTitle = styled.h2<{ $isVisible: boolean }>`
  ${({ theme }) => museumTypography.sectionTitle(theme)}
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.museum.frameGold};
  font-weight: 300;
  letter-spacing: 0.05em;
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: translateY(${({ $isVisible }) => $isVisible ? '0' : '30px'});
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* Elegant underline effect */
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => theme.colors.museum.frameGold} 50%,
      transparent 100%
    );
    margin: ${({ theme }) => theme.spacing.md} auto 0;
    opacity: ${({ $isVisible }) => $isVisible ? 0.6 : 0};
    transition: opacity 1.5s ease;
  }
  
  ${responsive.mobile`
    margin-bottom: 2.5rem;
    font-size: 2.2rem;
  `}
`;

// Premium spaced grid for portrait artworks
const PortraitArtworkGrid = styled.div<{ $isVisible: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xxl};
  justify-items: center;
  align-items: start;
  width: 100%;
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: translateY(${({ $isVisible }) => $isVisible ? '0' : '20px'});
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.3s;
  
  /* Ensure maximum 2 columns on desktop for premium feel */
  ${responsive.desktop`
    grid-template-columns: repeat(2, minmax(300px, 400px));
    max-width: 900px;
    margin: 0 auto;
    justify-content: center;
  `}
  
  ${responsive.tablet`
    grid-template-columns: repeat(2, minmax(280px, 1fr));
    gap: 2.5rem;
    justify-content: center;
  `}
  
  ${responsive.mobile`
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 400px;
    margin: 0 auto;
  `}
`;

// Individual portrait artwork container with premium presentation
const PortraitArtworkContainer = styled.div<{ $index: number; $isVisible: boolean }>`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: translateY(${({ $isVisible }) => $isVisible ? '0' : '25px'});
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: ${({ $index }) => 0.5 + ($index * 0.15)}s;
  
  /* Premium framing effect */
  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: -15px;
    right: -15px;
    bottom: -15px;
    background: linear-gradient(
      135deg,
      rgba(212, 175, 55, 0.08) 0%,
      rgba(212, 175, 55, 0.03) 25%,
      transparent 50%,
      rgba(212, 175, 55, 0.03) 75%,
      rgba(212, 175, 55, 0.08) 100%
    );
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.6s ease;
    pointer-events: none;
    z-index: -1;
  }
  
  /* Enhanced framing on hover */
  &:hover::before {
    opacity: 1;
  }
  
  /* Subtle shadow for depth */
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: -10px;
    bottom: -10px;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    z-index: -2;
    opacity: ${({ $isVisible }) => $isVisible ? 0.3 : 0};
    transition: opacity 1.5s ease;
    transition-delay: ${({ $index }) => 0.8 + ($index * 0.1)}s;
  }
  
  /* Progressive reveal with subtle blur */
  ${({ $isVisible }) => !$isVisible && `
    filter: blur(3px);
  `}
  
  /* Ensure proper centering */
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Gallery navigation label for portrait section
const PortraitGalleryLabel = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center center;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.museum.frameGold};
  opacity: ${({ $isVisible }) => $isVisible ? 0.6 : 0};
  transition: opacity 1s ease;
  transition-delay: 1s;
  z-index: 5;
  pointer-events: none;
  
  ${responsive.tablet`
    display: none;
  `}
  
  ${responsive.mobile`
    display: none;
  `}
`;

export interface PortraitGalleryProps {
  artworks: Artwork[];
  onArtworkClick?: (artwork: Artwork) => void;
}

export const PortraitGallery: React.FC<PortraitGalleryProps> = ({
  artworks,
  onArtworkClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleArtworks, setVisibleArtworks] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const artworkRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Filter artworks to only show portrait and realism categories
  const portraitArtworks = artworks.filter(
    artwork => artwork.category === 'portrait' || artwork.category === 'realism'
  );

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
  }, [portraitArtworks.length]);

  const handleArtworkClick = (artwork: Artwork) => {
    if (onArtworkClick) {
      onArtworkClick(artwork);
    }
    console.log('Opening portrait artwork:', artwork.title);
  };

  return (
    <PortraitGalleryContainer 
      ref={containerRef} 
      data-testid="portrait-gallery"
    >
      <PortraitGalleryContent data-testid="portrait-gallery-content">
        <PortraitGalleryTitle $isVisible={isVisible}>
          Portrait & Realism Gallery
        </PortraitGalleryTitle>
        
        <PortraitArtworkGrid 
          $isVisible={isVisible}
          data-testid="portrait-artwork-grid"
          data-spacing="spacious"
          data-layout="premium-grid"
        >
          {portraitArtworks.map((artwork, index) => (
            <PortraitArtworkContainer
              key={artwork.id}
              ref={el => { artworkRefs.current[index] = el; }}
              $index={index}
              $isVisible={visibleArtworks.has(index)}
              data-testid={`portrait-artwork-container-${index}`}
            >
              <ArtworkDisplay
                artwork={artwork}
                size="large"
                interactive={true}
                onArtworkClick={handleArtworkClick}
              />
            </PortraitArtworkContainer>
          ))}
        </PortraitArtworkGrid>
        
        <PortraitGalleryLabel $isVisible={isVisible}>
          Portrait Collection
        </PortraitGalleryLabel>
      </PortraitGalleryContent>
    </PortraitGalleryContainer>
  );
};

export default PortraitGallery;