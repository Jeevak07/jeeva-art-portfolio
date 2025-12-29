'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { MuseumLayoutProps, GallerySection, ScrollProgress } from '@/types';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useSectionDetection } from '@/hooks/useSectionDetection';
import { getOptimizedScrollConfig, ScrollPerformanceMonitor } from '@/utils/scrollConfig';
import { 
  PremiumAnimationController, 
  sectionTransitions, 
  createParallaxEffect 
} from '@/utils/premiumAnimations';
import { MuseumSection } from './MuseumSection';

// Styled components for museum layout
const LayoutContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
  overflow-x: hidden;
`;



const NavigationIndicator = styled.div`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    right: 1rem;
    gap: 0.3rem;
  }
`;

const IndicatorDot = styled.button<{ $isActive: boolean; $progress: number }>`
  width: ${props => props.$isActive ? '12px' : '8px'};
  height: ${props => props.$isActive ? '12px' : '8px'};
  border-radius: 50%;
  border: 1px solid rgba(201, 169, 110, 0.4);
  background: ${props => props.$isActive 
    ? `linear-gradient(90deg, rgba(201, 169, 110, 0.9) ${props.$progress * 100}%, rgba(201, 169, 110, 0.3) ${props.$progress * 100}%)`
    : 'rgba(201, 169, 110, 0.2)'
  };
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.cinematic} ${({ theme }) => theme.animation.easing.elegant};
  position: relative;
  
  &:hover {
    transform: scale(1.2);
    background: rgba(201, 169, 110, 0.6);
    box-shadow: 0 0 12px rgba(201, 169, 110, 0.4);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201, 169, 110, 0.2) 0%, transparent 70%);
    opacity: ${props => props.$isActive ? 1 : 0};
    transition: opacity ${({ theme }) => theme.animation.duration.slow} ${({ theme }) => theme.animation.easing.gentle};
  }

  @media (max-width: 768px) {
    width: ${props => props.$isActive ? '10px' : '6px'};
    height: ${props => props.$isActive ? '10px' : '6px'};
  }
`;

const ScrollProgressBar = styled.div<{ $progress: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.$progress * 100}%;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(201, 169, 110, 0.8) 0%, 
    rgba(201, 169, 110, 0.4) 100%
  );
  z-index: 1000;
  transition: width ${({ theme }) => theme.animation.duration.instant} ${({ theme }) => theme.animation.easing.cinematic};
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.3);
`;



interface MuseumLayoutState {
  scrollPosition: number;
  isScrolling: boolean;
  lastScrollTime: number;
}

interface MuseumLayoutComponentProps extends MuseumLayoutProps {
  children?: React.ReactNode;
  onSectionChange?: (sectionId: string) => void;
  renderSection?: (section: GallerySection, isActive: boolean, isVisible: boolean) => React.ReactNode;
}

export function MuseumLayout({ 
  sections, 
  currentSection, 
  children,
  onSectionChange,
  renderSection
}: MuseumLayoutComponentProps) {
  const scrollProgress = useScrollProgress();
  const sectionIds = sections.map(section => section.id);
  const { currentSection: detectedSection, scrollToSection } = useSectionDetection(sectionIds);
  
  const [layoutState, setLayoutState] = useState<MuseumLayoutState>({
    scrollPosition: 0,
    isScrolling: false,
    lastScrollTime: 0,
  });
  
  const performanceMonitorRef = useRef<ScrollPerformanceMonitor | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollPositionRef = useRef(0);

  // Initialize performance monitoring
  useEffect(() => {
    performanceMonitorRef.current = new ScrollPerformanceMonitor();
    performanceMonitorRef.current.start();

    return () => {
      if (performanceMonitorRef.current) {
        performanceMonitorRef.current.stop();
      }
    };
  }, []);

  // Handle scroll state management
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      
      setLayoutState(prev => ({
        scrollPosition: currentScrollY,
        isScrolling: true,
        lastScrollTime: currentTime,
      }));

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set scrolling to false after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        setLayoutState(prev => ({
          ...prev,
          isScrolling: false,
        }));
      }, 150);

      lastScrollPositionRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Calculate section progress for active section
  const calculateSectionProgress = useCallback((sectionId: string): number => {
    if (typeof window === 'undefined') return 0;
    
    const element = document.getElementById(sectionId);
    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the section is visible
    const visibleTop = Math.max(0, -rect.top);
    const visibleBottom = Math.min(rect.height, windowHeight - rect.top);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    
    return Math.min(1, visibleHeight / rect.height);
  }, []);

  // Check if section is visible
  const isSectionVisible = useCallback((sectionId: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    const element = document.getElementById(sectionId);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    return rect.top < windowHeight && rect.bottom > 0;
  }, []);

  // Handle navigation dot clicks
  const handleNavigationClick = useCallback((sectionId: string) => {
    scrollToSection(sectionId);
  }, [scrollToSection]);

  // Scroll position recovery
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('museum-scroll-position');
    if (savedScrollPosition) {
      const position = parseInt(savedScrollPosition, 10);
      window.scrollTo(0, position);
      sessionStorage.removeItem('museum-scroll-position');
    }

    // Save scroll position before page unload
    const handleBeforeUnload = () => {
      sessionStorage.setItem('museum-scroll-position', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const activeSection = detectedSection || currentSection || sections[0]?.id;
  const activeSectionProgress = calculateSectionProgress(activeSection);

  // Notify parent of section changes
  useEffect(() => {
    if (onSectionChange && detectedSection && detectedSection !== currentSection) {
      onSectionChange(detectedSection);
    }
  }, [detectedSection, currentSection, onSectionChange]);

  return (
    <LayoutContainer>
      <ScrollProgressBar $progress={scrollProgress.progress} />
      
      <NavigationIndicator>
        {sections.map((section) => {
          const isActive = section.id === activeSection;
          const progress = isActive ? activeSectionProgress : 0;
          
          return (
            <IndicatorDot
              key={section.id}
              $isActive={isActive}
              $progress={progress}
              onClick={() => handleNavigationClick(section.id)}
              aria-label={`Navigate to ${section.name}`}
              title={section.name}
            />
          );
        })}
      </NavigationIndicator>

      {sections.map((section) => {
        const isActive = section.id === activeSection;
        const isVisible = isSectionVisible(section.id);
        
        return (
          <MuseumSection
            key={section.id}
            section={section}
            isActive={isActive}
            isVisible={isVisible}
          >
            {renderSection ? renderSection(section, isActive, isVisible) : children}
          </MuseumSection>
        );
      })}
    </LayoutContainer>
  );
}