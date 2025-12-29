'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { InteractiveViewerProps } from '@/types';
import { museumTypography, responsive } from '@/styles/museumAesthetics';
import { 
  useImageErrorHandling, 
  useScrollPositionRecovery 
} from '@/utils/errorHandling';

// Modal backdrop with museum-dark overlay
const ModalBackdrop = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  
  ${responsive.mobile`
    padding: 1rem;
  `}
`;

// Main viewer container
const ViewerContainer = styled.div<{ $isOpen: boolean }>`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.museum.darkBackground};
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.museum.frame};
  
  transform: ${({ $isOpen }) => $isOpen ? 'scale(1)' : 'scale(0.9)'};
  transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  
  ${responsive.mobile`
    max-width: 95vw;
    max-height: 95vh;
    border-radius: 4px;
  `}
`;

// Image container with zoom and pan capabilities
const ImageContainer = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
  cursor: grab;
  touch-action: none;
  
  &:active {
    cursor: grabbing;
  }
`;

// Zoomable and pannable image wrapper
const ZoomableImage = styled.div<{ 
  $scale: number; 
  $translateX: number; 
  $translateY: number;
  $isTransitioning: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  transform: scale(${({ $scale }) => $scale}) 
             translate(${({ $translateX }) => $translateX}px, ${({ $translateY }) => $translateY}px);
  transition: ${({ $isTransitioning }) => 
    $isTransitioning ? 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
  };
  transform-origin: center center;
`;

// Full-size artwork image
const FullSizeImage = styled(Image)<{ $isLoaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.4s ease;
  opacity: ${({ $isLoaded }) => $isLoaded ? 1 : 0};
`;

// Loading placeholder with error state
const LoadingPlaceholder = styled.div<{ $hasError?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme, $hasError }) => 
    $hasError ? 'rgba(231, 76, 60, 0.8)' : theme.colors.text.muted
  };
  text-align: center;
  max-width: 300px;
  
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
    animation: ${({ $hasError }) => 
      $hasError ? 'none' : 'spin 1s linear infinite'
    };
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Error message for viewer
const ErrorMessage = styled.div`
  color: rgba(231, 76, 60, 0.9);
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: 1rem;
  
  button {
    background: rgba(231, 76, 60, 0.2);
    color: rgba(231, 76, 60, 0.9);
    border: 1px solid rgba(231, 76, 60, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
    
    &:hover {
      background: rgba(231, 76, 60, 0.3);
    }
  }
`;

// Artwork information panel
const InfoPanel = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.museum.galleryWall};
  border-top: 1px solid rgba(201, 169, 110, 0.2);
  
  ${responsive.mobile`
    padding: 1rem;
  `}
`;

const ArtworkTitle = styled.h2`
  ${({ theme }) => museumTypography.sectionTitle(theme)}
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  
  ${responsive.mobile`
    font-size: 1.25rem;
  `}
`;

const ArtworkMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  ${responsive.mobile`
    flex-direction: column;
    gap: 0.5rem;
  `}
`;

const MetaItem = styled.span`
  ${({ theme }) => museumTypography.bodyText(theme)}
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ArtworkDescription = styled.p`
  ${({ theme }) => museumTypography.bodyText(theme)}
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

// Control buttons
const ControlsContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 10;
  
  ${responsive.mobile`
    top: 1rem;
    right: 1rem;
  `}
`;

const ControlButton = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// Zoom controls for desktop
const ZoomControls = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.md};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 10;
  
  ${responsive.mobile`
    display: none;
  `}
`;

const ZoomButton = styled(ControlButton)`
  width: 40px;
  height: 40px;
  font-size: 1rem;
`;

// Mobile gesture instructions
const GestureHint = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.md};
  left: 50%;
  transform: translateX(-50%);
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
  z-index: 10;
  
  ${responsive.desktop`
    display: none;
  `}
`;

export const InteractiveViewer: React.FC<InteractiveViewerProps> = ({
  artwork,
  isOpen,
  onClose
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState('');
  const [hasImageError, setHasImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Error handling hooks
  const { handleImageError, clearImageError } = useImageErrorHandling();
  const { savePosition, restorePosition } = useScrollPositionRecovery('interactive-viewer');

  // Reset state when artwork changes or modal opens
  useEffect(() => {
    if (isOpen && artwork) {
      // Save current scroll position
      savePosition(window.scrollY);
      
      setIsLoaded(false);
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
      setIsTransitioning(false);
      
      // Validate image URL before setting it
      let imageUrl = '';
      if (artwork.imageUrl && artwork.imageUrl.trim() !== '') {
        imageUrl = artwork.imageUrl;
      } else if (artwork.thumbnailUrl && artwork.thumbnailUrl.trim() !== '') {
        imageUrl = artwork.thumbnailUrl;
      } else {
        // No valid image URL available
        setHasImageError(true);
        setCurrentImageSrc('');
        return;
      }
      
      setCurrentImageSrc(imageUrl);
      setHasImageError(false);
      setRetryCount(0);
      clearImageError(imageUrl);
    }
  }, [isOpen, artwork, savePosition, clearImageError]);

  // Handle escape key and cleanup
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle close with scroll position restoration
  const handleClose = useCallback(() => {
    try {
      onClose();
      // Restore scroll position after a brief delay
      setTimeout(() => {
        const savedPosition = restorePosition();
        if (savedPosition > 0) {
          window.scrollTo({
            top: savedPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } catch (error) {
      console.warn('Error during viewer close:', error);
      onClose(); // Fallback to simple close
    }
  }, [onClose, restorePosition]);

  // Calculate touch distance for pinch gestures
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Handle zoom with constraints
  const handleZoom = useCallback((newScale: number, centerX?: number, centerY?: number) => {
    const minScale = 1;
    const maxScale = 4;
    const constrainedScale = Math.max(minScale, Math.min(maxScale, newScale));
    
    setScale(constrainedScale);
    
    // Reset position when zooming out to 1x
    if (constrainedScale === 1) {
      setTranslateX(0);
      setTranslateY(0);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, []);

  // Handle pan with boundaries
  const handlePan = useCallback((deltaX: number, deltaY: number) => {
    if (scale <= 1) return;
    
    const container = imageContainerRef.current;
    if (!container) return;
    
    const maxTranslateX = (container.offsetWidth * (scale - 1)) / 2;
    const maxTranslateY = (container.offsetHeight * (scale - 1)) / 2;
    
    const newTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX + deltaX));
    const newTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY + deltaY));
    
    setTranslateX(newTranslateX);
    setTranslateY(newTranslateY);
  }, [scale, translateX, translateY]);

  // Mouse/touch event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    const deltaX = e.clientX - lastPanPoint.x;
    const deltaY = e.clientY - lastPanPoint.y;
    handlePan(deltaX, deltaY);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start panning
      if (scale > 1) {
        setIsDragging(true);
        setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    } else if (e.touches.length === 2) {
      // Two touches - start pinching
      setLastTouchDistance(getTouchDistance(e.touches));
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging && scale > 1) {
      // Single touch panning
      const deltaX = e.touches[0].clientX - lastPanPoint.x;
      const deltaY = e.touches[0].clientY - lastPanPoint.y;
      handlePan(deltaX, deltaY);
      setLastPanPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      // Pinch to zoom
      const currentDistance = getTouchDistance(e.touches);
      if (lastTouchDistance > 0) {
        const scaleChange = currentDistance / lastTouchDistance;
        handleZoom(scale * scaleChange);
      }
      setLastTouchDistance(currentDistance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(0);
  };

  // Wheel zoom for desktop
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    handleZoom(scale * zoomFactor);
  };

  // Control button handlers
  const handleZoomIn = () => handleZoom(scale * 1.2);
  const handleZoomOut = () => handleZoom(scale * 0.8);
  const handleReset = () => handleZoom(1);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Image loading handlers with error recovery
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setHasImageError(false);
    setRetryCount(0);
  }, []);

  const handleImageLoadError = useCallback(async () => {
    console.warn('Full-size image failed to load:', currentImageSrc);
    setHasImageError(true);
    
    if (retryCount < 2 && artwork) {
      try {
        // Attempt to get fallback image
        const fallbackSrc = await handleImageError(artwork.imageUrl, artwork.category);
        
        if (fallbackSrc !== currentImageSrc) {
          setCurrentImageSrc(fallbackSrc);
          setRetryCount(prev => prev + 1);
          setHasImageError(false);
        }
      } catch (error) {
        console.error('Failed to handle image error in viewer:', error);
        setHasImageError(true);
      }
    }
  }, [currentImageSrc, retryCount, artwork, handleImageError]);

  const handleRetryImage = useCallback(() => {
    if (artwork) {
      setHasImageError(false);
      setIsLoaded(false);
      setRetryCount(0);
      // Try original image again with cache busting
      setCurrentImageSrc(`${artwork.imageUrl}?retry=${Date.now()}`);
    }
  }, [artwork]);

  if (!artwork) return null;

  return (
    <ModalBackdrop 
      $isOpen={isOpen} 
      onClick={handleBackdropClick}
      data-testid="interactive-viewer-backdrop"
    >
      <ViewerContainer 
        ref={modalRef}
        $isOpen={isOpen}
        data-testid="interactive-viewer-container"
      >
        <ControlsContainer>
          <ControlButton 
            onClick={handleClose}
            aria-label="Close viewer"
            data-testid="close-button"
          >
            ✕
          </ControlButton>
        </ControlsContainer>

        <ImageContainer
          ref={imageContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          data-testid="image-container"
        >
          {(!isLoaded || hasImageError) && (
            <LoadingPlaceholder 
              data-testid="loading-placeholder"
              $hasError={hasImageError}
            >
              {hasImageError ? (
                <>
                  <div>Failed to load full-size image</div>
                  <ErrorMessage>
                    The high-resolution version of this artwork could not be loaded.
                    <br />
                    <button onClick={handleRetryImage}>
                      Try Again
                    </button>
                  </ErrorMessage>
                </>
              ) : (
                'Loading artwork...'
              )}
            </LoadingPlaceholder>
          )}
          
          <ZoomableImage
            $scale={scale}
            $translateX={translateX}
            $translateY={translateY}
            $isTransitioning={isTransitioning}
          >
            <FullSizeImage
              src={currentImageSrc || '/placeholder-image.jpg'}
              alt={artwork.title}
              fill
              sizes="90vw"
              priority
              quality={95}
              onLoad={handleImageLoad}
              onError={handleImageLoadError}
              $isLoaded={isLoaded && !hasImageError}
              data-testid="full-size-image"
            />
          </ZoomableImage>
        </ImageContainer>

        <ZoomControls>
          <ZoomButton 
            onClick={handleZoomOut}
            aria-label="Zoom out"
            data-testid="zoom-out-button"
          >
            −
          </ZoomButton>
          <ZoomButton 
            onClick={handleReset}
            aria-label="Reset zoom"
            data-testid="reset-zoom-button"
          >
            ⌂
          </ZoomButton>
          <ZoomButton 
            onClick={handleZoomIn}
            aria-label="Zoom in"
            data-testid="zoom-in-button"
          >
            +
          </ZoomButton>
        </ZoomControls>

        <GestureHint data-testid="gesture-hint">
          Pinch to zoom • Drag to pan • Tap to close
        </GestureHint>

        <InfoPanel data-testid="info-panel">
          <ArtworkTitle>{artwork.title.trim()}</ArtworkTitle>
          <ArtworkMeta>
            <MetaItem>Category: {artwork.category}</MetaItem>
            <MetaItem>
              Dimensions: {artwork.dimensions.width} × {artwork.dimensions.height}
            </MetaItem>
            <MetaItem>
              Created: {artwork.createdDate.toLocaleDateString()}
            </MetaItem>
          </ArtworkMeta>
          {artwork.description && artwork.description.trim() && (
            <ArtworkDescription>{artwork.description.trim()}</ArtworkDescription>
          )}
        </InfoPanel>
      </ViewerContainer>
    </ModalBackdrop>
  );
};

export default InteractiveViewer;