'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { ArtworkDisplayProps } from '@/types';
import { 
  museumFraming, 
  museumHover, 
  museumTypography, 
  museumAnimations,
  responsive 
} from '@/styles/museumAesthetics';
import { 
  useImageLazyLoading, 
  useMemoryManagement, 
  useAnimationPerformance 
} from '@/utils/performanceOptimization';
import { 
  useImageErrorHandling, 
  useAnimationFallback 
} from '@/utils/errorHandling';

// Main artwork container with museum framing
const ArtworkContainer = styled.div<{ 
  $size: 'small' | 'medium' | 'large';
  $interactive: boolean;
  $isVisible: boolean;
  $isOptimized: boolean;
}>`
  position: relative;
  width: 100%;
  max-width: 100%;
  aspect-ratio: ${({ $size }) => 
    $size === 'small' ? '3/4' : 
    $size === 'large' ? '4/5' : '3/4'
  };
  overflow: hidden;
  cursor: ${({ $interactive }) => $interactive ? 'pointer' : 'default'};
  margin: 0 auto;
  
  ${({ theme }) => museumFraming.elegant(theme)}
  ${({ $interactive, theme, $isOptimized }) => 
    $interactive && !$isOptimized && museumHover.gentle(theme)
  }
  
  /* Progressive reveal animation - optimized for performance */
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: translateY(${({ $isVisible }) => $isVisible ? '0' : '20px'});
  transition: ${({ $isOptimized }) => 
    $isOptimized 
      ? 'all 0.2s ease-out' 
      : 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  };
  
  /* Performance-optimized transforms */
  will-change: ${({ $isVisible }) => $isVisible ? 'auto' : 'transform, opacity'};
  
  /* Hover interactions with gentle zoom - disabled on low performance */
  &:hover {
    ${({ $interactive, $isOptimized }) => $interactive && !$isOptimized && `
      transform: scale(1.03);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(201, 169, 110, 0.2);
    `}
  }
  
  ${responsive.mobile`
    aspect-ratio: 3/4;
  `}
`;

// Image container with clip reveal animation
const ImageContainer = styled.div<{ 
  $isRevealed: boolean; 
  $isOptimized: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  /* Vertical unveiling animation - simplified for low performance */
  clip-path: ${({ $isRevealed, $isOptimized }) => 
    $isOptimized 
      ? 'inset(0 0 0 0)' // Skip animation on low performance
      : ($isRevealed ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)')
  };
  transition: ${({ $isOptimized }) => 
    $isOptimized 
      ? 'none' 
      : 'clip-path 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  };
`;

// Styled Next.js Image with museum lighting
const ArtworkImage = styled(Image)<{ 
  $isLoaded: boolean; 
  $isOptimized: boolean;
}>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: ${({ $isOptimized }) => 
    $isOptimized 
      ? 'none' 
      : 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)'
  };
  
  /* Subtle lighting effect - disabled on low performance */
  filter: ${({ $isLoaded, $isOptimized }) => {
    if ($isOptimized) return 'none';
    return $isLoaded 
      ? 'brightness(1.02) contrast(1.05) saturate(1.1)' 
      : 'brightness(0.8) contrast(0.9)';
  }};
  
  /* Gentle zoom on hover - disabled on low performance */
  ${ArtworkContainer}:hover & {
    ${({ $isOptimized }) => !$isOptimized && `
      transform: scale(1.02);
    `}
  }
`;

// Performance-optimized placeholder with error state
const ImagePlaceholder = styled.div<{ 
  $isOptimized: boolean; 
  $hasError: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ $isOptimized, $hasError, theme }) => {
    if ($hasError) {
      return `linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(231, 76, 60, 0.05) 100%)`;
    }
    return $isOptimized 
      ? theme.colors.museum.galleryWall
      : `linear-gradient(
          135deg,
          ${theme.colors.museum.galleryWall} 0%,
          rgba(201, 169, 110, 0.1) 50%,
          ${theme.colors.museum.galleryWall} 100%
        )`;
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ $hasError, theme }) => 
    $hasError ? 'rgba(231, 76, 60, 0.8)' : 'rgba(201, 169, 110, 0.6)'
  };
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  
  &::before {
    content: '';
    width: 40px;
    height: 40px;
    border: 2px solid ${({ $hasError }) => 
      $hasError ? 'rgba(231, 76, 60, 0.3)' : 'rgba(201, 169, 110, 0.3)'
    };
    border-top-color: ${({ $hasError }) => 
      $hasError ? 'rgba(231, 76, 60, 0.8)' : 'rgba(201, 169, 110, 0.8)'
    };
    border-radius: 50%;
    animation: ${({ $isOptimized, $hasError }) => 
      ($isOptimized || $hasError) ? 'none' : 'spin 1s linear infinite'
    };
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Error message display
const ErrorMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: rgba(231, 76, 60, 0.8);
  text-align: center;
  margin-top: 0.5rem;
`;

// Artwork overlay with title and description
const ArtworkOverlay = styled.div<{ 
  $isVisible: boolean; 
  $isOptimized: boolean;
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ $isOptimized }) => 
    $isOptimized 
      ? 'rgba(0, 0, 0, 0.8)'
      : `linear-gradient(
          transparent 0%,
          rgba(0, 0, 0, 0.3) 30%,
          rgba(0, 0, 0, 0.8) 100%
        )`
  };
  padding: ${({ theme }) => theme.spacing.md};
  transform: translateY(${({ $isVisible, $isOptimized }) => 
    $isOptimized ? '0' : ($isVisible ? '0' : '100%')
  });
  transition: ${({ $isOptimized }) => 
    $isOptimized 
      ? 'none' 
      : 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
  };
  
  ${responsive.mobile`
    padding: 1rem;
  `}
`;

const ArtworkTitle = styled.h3`
  ${({ theme }) => museumTypography.artworkTitle(theme)}
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  ${responsive.mobile`
    font-size: 1rem;
  `}
`;

const ArtworkDescription = styled.p`
  ${({ theme }) => museumTypography.bodyText(theme)}
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  
  ${responsive.mobile`
    font-size: 0.75rem;
  `}
`;

// Museum lighting effect overlay - disabled on low performance
const LightingOverlay = styled.div<{ $isOptimized: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme, $isOptimized }) => 
    $isOptimized ? 'none' : theme.lighting.spotlight
  };
  pointer-events: none;
  opacity: 0;
  transition: ${({ $isOptimized }) => 
    $isOptimized ? 'none' : 'opacity 0.4s ease'
  };
  
  ${ArtworkContainer}:hover & {
    opacity: ${({ $isOptimized }) => $isOptimized ? 0 : 1};
  }
`;

export const ArtworkDisplay: React.FC<ArtworkDisplayProps> = ({
  artwork,
  size = 'medium',
  interactive = true,
  onArtworkClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState(artwork.thumbnailUrl);
  const [hasImageError, setHasImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Performance optimization hooks
  const { observeImage, unobserveImage } = useImageLazyLoading();
  const { trackImage, untrackImage, checkMemory } = useMemoryManagement();
  const { isOptimized } = useAnimationPerformance();
  
  // Error handling hooks
  const { handleImageError, clearImageError } = useImageErrorHandling();
  const { isFallbackMode, markAnimationFailed, isAnimationDisabled } = useAnimationFallback(`artwork-${artwork.id}`);

  // Intersection Observer for progressive reveal with error handling
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          try {
            setIsVisible(true);
            // Delay the clip reveal for a staggered effect - skip on low performance or fallback mode
            const delay = (isOptimized || isFallbackMode) ? 0 : 200;
            setTimeout(() => setIsRevealed(true), delay);
          } catch (error) {
            console.warn('Animation error in intersection observer:', error);
            markAnimationFailed(error as Error);
            // Fallback: show immediately
            setIsVisible(true);
            setIsRevealed(true);
          }
        }
      },
      { 
        threshold: isOptimized ? 0.1 : 0.2, 
        rootMargin: isOptimized ? '20px' : '50px' 
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isOptimized, isFallbackMode, markAnimationFailed]);

  // Memory management for images
  useEffect(() => {
    if (imageRef.current && isLoaded) {
      trackImage(imageRef.current, artwork.thumbnailUrl);
    }

    return () => {
      if (imageRef.current) {
        untrackImage(imageRef.current);
      }
    };
  }, [isLoaded, artwork.thumbnailUrl, trackImage, untrackImage]);

  // Periodic memory check
  useEffect(() => {
    const interval = setInterval(async () => {
      const memoryCleanupNeeded = await checkMemory();
      if (memoryCleanupNeeded) {
        console.log('Memory cleanup performed');
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [checkMemory]);

  const handleClick = useCallback(() => {
    if (interactive && onArtworkClick) {
      onArtworkClick(artwork);
    }
  }, [interactive, onArtworkClick, artwork]);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setHasImageError(false);
    clearImageError(currentImageSrc);
  }, [currentImageSrc, clearImageError]);

  const handleImageLoadError = useCallback(async () => {
    console.warn('Image failed to load:', currentImageSrc);
    setHasImageError(true);
    
    try {
      // Attempt to get fallback image
      const fallbackSrc = await handleImageError(artwork.thumbnailUrl, artwork.category);
      
      if (fallbackSrc !== currentImageSrc) {
        setCurrentImageSrc(fallbackSrc);
        setHasImageError(false);
        // Don't set isLoaded to true yet, wait for fallback to load
      }
    } catch (error) {
      console.error('Failed to handle image error:', error);
      setHasImageError(true);
    }
  }, [currentImageSrc, artwork.thumbnailUrl, artwork.category, handleImageError]);

  const handleMouseEnter = useCallback(() => {
    if (!isOptimized && !isFallbackMode) {
      try {
        setIsHovered(true);
      } catch (error) {
        console.warn('Hover animation error:', error);
        markAnimationFailed(error as Error);
      }
    }
  }, [isOptimized, isFallbackMode, markAnimationFailed]);

  const handleMouseLeave = useCallback(() => {
    try {
      setIsHovered(false);
    } catch (error) {
      console.warn('Hover animation error:', error);
      markAnimationFailed(error as Error);
    }
  }, [markAnimationFailed]);

  // Generate optimized sizes based on viewport and size prop
  const getSizes = useCallback(() => {
    const sizeMap = {
      small: '(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw',
      medium: '(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw',
      large: '(max-width: 480px) 100vw, (max-width: 768px) 75vw, 50vw'
    };
    return sizeMap[size];
  }, [size]);

  return (
    <ArtworkContainer
      ref={containerRef}
      $size={size}
      $interactive={interactive}
      $isVisible={isVisible}
      $isOptimized={isOptimized || isFallbackMode}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={interactive ? 'button' : 'img'}
      tabIndex={interactive ? 0 : -1}
      aria-label={`${artwork.title} - ${artwork.description || 'Artwork'}`}
      data-testid="artwork-display"
    >
      <ImageContainer 
        $isRevealed={isRevealed} 
        $isOptimized={isOptimized || isFallbackMode}
      >
        {(!isLoaded || hasImageError) && (
          <ImagePlaceholder 
            $isOptimized={isOptimized} 
            $hasError={hasImageError}
          >
            {hasImageError ? (
              <>
                <div>Image Unavailable</div>
                <ErrorMessage>
                  {artwork.category.charAt(0).toUpperCase() + artwork.category.slice(1)} Artwork
                </ErrorMessage>
              </>
            ) : (
              'Loading...'
            )}
          </ImagePlaceholder>
        )}
        <ArtworkImage
          ref={imageRef}
          src={currentImageSrc}
          alt={artwork.title}
          fill
          sizes={getSizes()}
          priority={false}
          quality={isOptimized ? 75 : 85} // Lower quality on low performance
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          onLoad={handleImageLoad}
          onError={handleImageLoadError}
          $isLoaded={isLoaded && !hasImageError}
          $isOptimized={isOptimized || isFallbackMode}
        />
        
        {/* Museum lighting effect - disabled on low performance or fallback mode */}
        <LightingOverlay $isOptimized={isOptimized || isFallbackMode} />
        
        {/* Artwork information overlay */}
        <ArtworkOverlay 
          $isVisible={isHovered && interactive} 
          $isOptimized={isOptimized || isFallbackMode}
        >
          <ArtworkTitle>{artwork.title}</ArtworkTitle>
          {artwork.description && (
            <ArtworkDescription>{artwork.description}</ArtworkDescription>
          )}
        </ArtworkOverlay>
      </ImageContainer>
    </ArtworkContainer>
  );
};

export default ArtworkDisplay;