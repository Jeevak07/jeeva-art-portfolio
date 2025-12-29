'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { GalleryRoomProps, Artwork } from '@/types';
import { ArtworkDisplay } from '@/components/ui/ArtworkDisplay';
import { 
  useViewport, 
  useMobileIntersectionObserver, 
  useMobileAnimationPreferences,
  validateTouchTarget 
} from '@/utils/mobileOptimization';
import { 
  museumLighting, 
  museumTypography, 
  responsive,
} from '@/styles/museumAesthetics';

// Mobile-optimized gallery container
const MobileGalleryContainer = styled.section<{ $isMobile: boolean }>`
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: ${({ theme, $isMobile }) => 
    $isMobile ? `${theme.spacing.lg} ${theme.spacing.md}` : `${theme.spacing.xl} ${theme.spacing.lg}`
  };
  background: ${({ theme }) => theme.colors.museum.darkBackground};
  ${({ theme }) => museumLighting.ambientGlow(theme)}
  
  /* Enhanced touch scrolling for mobile */
  ${({ $isMobile }) => $isMobile && `
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  `}
`;

// Mobile-optimized grid with touch-friendly spacing
const MobileArtworkGrid = styled.div<{ 
  $isMobile: boolean;
  $isTablet: boolean;
  $spacing: 'compact' | 'comfortable' | 'spacious';
}>`
  display: grid;
  gap: ${({ theme, $spacing, $isMobile }) => {
    if ($isMobile) {
      return $spacing === 'compact' ? theme.spacing.sm : 
             $spacing === 'spacious' ? theme.spacing.lg : theme.spacing.md;
    }
    const gapMap = {
      compact: theme.spacing.md,
      comfortable: theme.spacing.lg,
      spacious: theme.spacing.xl
    };
    return gapMap[$spacing];
  }};
  
  /* Mobile-first responsive grid */
  grid-template-columns: ${({ $isMobile, $isTablet }) => {
    if ($isMobile) return '1fr';
    if ($isTablet) return 'repeat(2, 1fr)';
    return 'repeat(3, 1fr)';
  }};
  
  /* Ensure proper touch targets on mobile */
  ${({ $isMobile }) => $isMobile && `
    > * {
      min-height: 44px;
      min-width: 44px;
    }
  `}
  
  ${({ theme }) => museumLighting.floorReflection(theme)}
`;

// Mobile-optimized artwork container with enhanced touch feedback
const MobileArtworkContainer = styled.div<{ 
  $index: number; 
  $isVisible: boolean; 
  $isMobile: boolean;
  $reduceAnimations: boolean;
}>`
  position: relative;
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: translateY(${({ $isVisible, $reduceAnimations }) => 
    $isVisible ? '0' : ($reduceAnimations ? '10px' : '20px')
  });
  transition: ${({ $reduceAnimations, theme }) => 
    $reduceAnimations 
      ? `opacity ${theme.animation.duration.fast} ease`
      : `all ${theme.animation.duration.slow} cubic-bezier(0.25, 0.46, 0.45, 0.94)`
  };
  transition-delay: ${({ $index, $reduceAnimations }) => 
    $reduceAnimations ? '0s' : `${$index * 0.1}s`
  };
  
  /* Enhanced touch feedback for mobile */
  ${({ $isMobile }) => $isMobile && `
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(201, 169, 110, 0.2);
    
    &:active {
      transform: scale(0.98);
      transition-duration: 0.1s;
    }
  `}
  
  /* Ensure minimum touch target size */
  min-height: 44px;
  min-width: 44px;
  
  /* Progressive reveal with reduced blur on mobile for performance */
  ${({ $isVisible, $isMobile }) => !$isVisible && `
    filter: blur(${$isMobile ? '1px' : '2px'});
  `}
`;

// Mobile-optimized gallery title with better readability
const MobileGalleryTitle = styled.h2<{ $isVisible: boolean; $isMobile: boolean }>`
  ${({ theme }) => museumTypography.sectionTitle(theme)}
  text-align: center;
  margin-bottom: ${({ theme, $isMobile }) => 
    $isMobile ? theme.spacing.lg : theme.spacing.xl
  };
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: translateY(${({ $isVisible }) => $isVisible ? '0' : '30px'});
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* Better mobile typography */
  ${({ $isMobile, theme }) => $isMobile && `
    font-size: ${theme.typography.fontSize.xxl};
    line-height: ${theme.typography.lineHeight.tight};
    padding: 0 ${theme.spacing.sm};
  `}
`;

// Touch-optimized loading indicator
const MobileLoadingIndicator = styled.div<{ $isMobile: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme, $isMobile }) => 
    $isMobile ? theme.spacing.lg : theme.spacing.xl
  };
  
  &::after {
    content: '';
    width: ${({ $isMobile }) => $isMobile ? '24px' : '32px'};
    height: ${({ $isMobile }) => $isMobile ? '24px' : '32px'};
    border: 2px solid ${({ theme }) => theme.colors.museum.frameGold};
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const MobileOptimizedGallery: React.FC<GalleryRoomProps> = ({
  artworks,
  theme,
  layout = 'grid'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleArtworks, setVisibleArtworks] = useState<Set<number>>(new Set());
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const artworkRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const viewport = useViewport();
  const { shouldReduceAnimations } = useMobileAnimationPreferences();

  // Mobile-optimized intersection observer
  const setContainerRef = useMobileIntersectionObserver(
    (isIntersecting) => {
      if (isIntersecting) {
        setIsVisible(true);
        setIsLoading(false);
      }
    },
    { threshold: viewport.isMobile ? 0.1 : 0.2 }
  );

  // Individual artwork intersection observers with mobile optimization
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
          { 
            threshold: viewport.isMobile ? 0.1 : 0.2, 
            rootMargin: viewport.isMobile ? '20px' : '50px' 
          }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [artworks.length, viewport.isMobile]);

  // Touch-optimized artwork click handler
  const handleArtworkClick = (artwork: Artwork, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    
    // Validate touch target size on mobile
    if (viewport.isMobile && event.currentTarget instanceof HTMLElement) {
      if (!validateTouchTarget(event.currentTarget)) {
        console.warn('Touch target too small for optimal mobile interaction');
      }
    }
    
    setSelectedArtwork(artwork);
    console.log('Opening artwork:', artwork.title);
  };

  const getArtworkSize = (index: number): 'small' | 'medium' | 'large' => {
    // Simplified sizing for mobile performance
    if (viewport.isMobile) return 'medium';
    if (layout === 'grid') {
      return index % 7 === 0 ? 'large' : index % 3 === 0 ? 'small' : 'medium';
    }
    return 'medium';
  };

  const spacingType = theme.spacing === 32 ? 'comfortable' : theme.spacing === 40 ? 'spacious' : 'compact';

  // Set container ref for intersection observer
  useEffect(() => {
    if (containerRef.current) {
      setContainerRef(containerRef.current);
    }
  }, [setContainerRef]);

  return (
    <MobileGalleryContainer 
      ref={containerRef} 
      $isMobile={viewport.isMobile}
      data-testid="mobile-gallery-room"
    >
      <MobileGalleryTitle 
        $isVisible={isVisible} 
        $isMobile={viewport.isMobile}
      >
        {viewport.isMobile ? 'Gallery' : 'Anime Gallery'}
      </MobileGalleryTitle>
      
      {isLoading ? (
        <MobileLoadingIndicator $isMobile={viewport.isMobile} />
      ) : (
        <MobileArtworkGrid
          $isMobile={viewport.isMobile}
          $isTablet={viewport.isTablet}
          $spacing={spacingType}
          data-testid="mobile-artwork-grid"
          data-layout={layout}
          data-spacing={spacingType}
        >
          {artworks.map((artwork, index) => (
            <MobileArtworkContainer
              key={artwork.id}
              ref={el => { artworkRefs.current[index] = el; }}
              $index={index}
              $isVisible={visibleArtworks.has(index)}
              $isMobile={viewport.isMobile}
              $reduceAnimations={shouldReduceAnimations}
              data-testid={`mobile-artwork-container-${index}`}
              onClick={(e) => handleArtworkClick(artwork, e)}
              onTouchEnd={(e) => handleArtworkClick(artwork, e)}
            >
              <ArtworkDisplay
                artwork={artwork}
                size={getArtworkSize(index)}
                interactive={true}
                onArtworkClick={() => handleArtworkClick(artwork, {} as any)}
              />
            </MobileArtworkContainer>
          ))}
        </MobileArtworkGrid>
      )}
    </MobileGalleryContainer>
  );
};

export default MobileOptimizedGallery;