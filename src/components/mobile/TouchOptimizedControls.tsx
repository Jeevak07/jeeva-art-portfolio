'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useViewport, useTouchGestures } from '@/utils/mobileOptimization';
import { responsive } from '@/styles/museumAesthetics';

interface TouchOptimizedControlsProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onPinchZoom?: (scale: number) => void;
  onDoubleTap?: () => void;
  children: React.ReactNode;
  className?: string;
}

// Touch-optimized container with gesture support
const TouchContainer = styled.div<{ $isMobile: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: ${({ $isMobile }) => $isMobile ? 'pan-y pinch-zoom' : 'auto'};
  -webkit-user-select: none;
  user-select: none;
  
  /* Enhanced touch feedback */
  ${({ $isMobile }) => $isMobile && `
    -webkit-tap-highlight-color: rgba(201, 169, 110, 0.1);
    -webkit-touch-callout: none;
  `}
`;

// Touch feedback overlay
const TouchFeedback = styled.div<{ 
  $isActive: boolean; 
  $x: number; 
  $y: number; 
}>`
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(201, 169, 110, 0.3) 0%,
    rgba(201, 169, 110, 0.1) 50%,
    transparent 100%
  );
  pointer-events: none;
  transform: translate(-50%, -50%) scale(${({ $isActive }) => $isActive ? 1 : 0});
  transition: transform 0.2s ease-out;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  z-index: 1000;
`;

// Swipe indicator
const SwipeIndicator = styled.div<{ 
  $direction: 'left' | 'right' | null; 
  $progress: number; 
}>`
  position: absolute;
  top: 50%;
  ${({ $direction }) => $direction === 'left' ? 'right: 20px;' : 'left: 20px;'}
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(201, 169, 110, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $progress }) => Math.min($progress / 50, 1)};
  transform: translateY(-50%) scale(${({ $progress }) => Math.min($progress / 50, 1)});
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
  z-index: 999;
  
  &::after {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    ${({ $direction }) => $direction === 'left' 
      ? 'border-width: 6px 10px 6px 0; border-color: transparent #c9a96e transparent transparent;'
      : 'border-width: 6px 0 6px 10px; border-color: transparent transparent transparent #c9a96e;'
    }
  }
`;

// Zoom indicator for pinch gestures
const ZoomIndicator = styled.div<{ $scale: number; $isActive: boolean }>`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  opacity: ${({ $isActive }) => $isActive ? 1 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 1001;
  
  ${responsive.mobile`
    top: 10px;
    font-size: 12px;
    padding: 6px 12px;
  `}
`;

export const TouchOptimizedControls: React.FC<TouchOptimizedControlsProps> = ({
  onSwipeLeft,
  onSwipeRight,
  onPinchZoom,
  onDoubleTap,
  children,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewport = useViewport();
  
  const [touchFeedback, setTouchFeedback] = useState({
    isActive: false,
    x: 0,
    y: 0
  });
  
  const [swipeState, setSwipeState] = useState({
    direction: null as 'left' | 'right' | null,
    progress: 0
  });
  
  const [zoomState, setZoomState] = useState({
    scale: 1,
    isActive: false
  });
  
  const [lastTap, setLastTap] = useState(0);
  const touchGestures = useTouchGestures(containerRef.current);

  // Handle touch start for feedback
  useEffect(() => {
    if (!containerRef.current || !viewport.isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = containerRef.current!.getBoundingClientRect();
      
      setTouchFeedback({
        isActive: true,
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    };

    const handleTouchEnd = () => {
      setTouchFeedback(prev => ({ ...prev, isActive: false }));
      setSwipeState({ direction: null, progress: 0 });
      setZoomState(prev => ({ ...prev, isActive: false }));
    };

    const element = containerRef.current;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [viewport.isMobile]);

  // Handle swipe gestures
  useEffect(() => {
    if (!touchGestures.isTouch || !viewport.isMobile) return;

    const deltaX = touchGestures.currentX - touchGestures.startX;
    const deltaY = touchGestures.currentY - touchGestures.startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only process horizontal swipes
    if (absDeltaX > absDeltaY && absDeltaX > 10) {
      const direction = deltaX > 0 ? 'right' : 'left';
      const progress = Math.min(absDeltaX, 100);
      
      setSwipeState({ direction, progress });

      // Trigger swipe callback when threshold is reached
      if (absDeltaX > 80) {
        if (direction === 'left' && onSwipeLeft) {
          onSwipeLeft();
        } else if (direction === 'right' && onSwipeRight) {
          onSwipeRight();
        }
      }
    }
  }, [touchGestures, viewport.isMobile, onSwipeLeft, onSwipeRight]);

  // Handle double tap
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!viewport.isMobile || !onDoubleTap) return;

    const now = Date.now();
    const timeDiff = now - lastTap;

    if (timeDiff < 300 && timeDiff > 0) {
      e.preventDefault();
      onDoubleTap();
    }

    setLastTap(now);
  };

  // Handle pinch zoom (simplified for demonstration)
  useEffect(() => {
    if (!containerRef.current || !viewport.isMobile || !onPinchZoom) return;

    let initialDistance = 0;
    let currentScale = 1;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        setZoomState(prev => ({ ...prev, isActive: true }));
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance > 0) {
        e.preventDefault();
        
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        currentScale = currentDistance / initialDistance;
        setZoomState({ scale: currentScale, isActive: true });
        onPinchZoom(currentScale);
      }
    };

    const element = containerRef.current;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [viewport.isMobile, onPinchZoom]);

  return (
    <TouchContainer
      ref={containerRef}
      $isMobile={viewport.isMobile}
      className={className}
      onClick={handleClick}
      onTouchEnd={handleClick}
    >
      {children}
      
      {/* Touch feedback overlay */}
      {viewport.isMobile && (
        <TouchFeedback
          $isActive={touchFeedback.isActive}
          $x={touchFeedback.x}
          $y={touchFeedback.y}
        />
      )}
      
      {/* Swipe indicators */}
      {viewport.isMobile && swipeState.direction && (
        <SwipeIndicator
          $direction={swipeState.direction}
          $progress={swipeState.progress}
        />
      )}
      
      {/* Zoom indicator */}
      {viewport.isMobile && onPinchZoom && (
        <ZoomIndicator
          $scale={zoomState.scale}
          $isActive={zoomState.isActive}
        >
          {Math.round(zoomState.scale * 100)}%
        </ZoomIndicator>
      )}
    </TouchContainer>
  );
};

export default TouchOptimizedControls;