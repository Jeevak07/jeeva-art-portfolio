'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { GallerySection } from '@/types';
import { sectionTransitions, createParallaxEffect } from '@/utils/premiumAnimations';

const SectionContainer = styled.section<{ 
  $isActive: boolean; 
  $theme: any;
  $isVisible: boolean;
  $sectionType: string;
}>`
  position: relative;
  min-height: 100vh;
  width: 100%;
  padding: 2rem 1rem;
  background: ${({ $theme }) => $theme.backgroundColor};
  background-image: ${({ theme }) => theme.lighting.ambient};
  transition: all ${({ $sectionType }) => sectionTransitions[$sectionType]?.duration || '0.8s'} 
              ${({ $sectionType }) => sectionTransitions[$sectionType]?.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.lighting.spotlight};
    pointer-events: none;
    opacity: ${props => props.$isActive ? 1 : 0.3};
    transition: opacity ${({ theme }) => theme.animation.duration.cinematic} ${({ theme }) => theme.animation.easing.elegant};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20%;
    background: ${({ theme }) => theme.lighting.floorReflection};
    pointer-events: none;
  }

  /* Premium cinematic entrance animation */
  transform: translateY(${props => props.$isVisible ? '0' : '30px'});
  opacity: ${props => props.$isVisible ? 1 : 0.6};
  filter: blur(${props => props.$isVisible ? '0px' : '2px'});

  @media (min-width: 768px) {
    padding: 4rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 6rem 3rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
    filter: none;
  }
`;

const SectionTitle = styled.h2<{ $isVisible: boolean }>`
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.widest};
  text-transform: uppercase;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: translateY(${props => props.$isVisible ? '0' : '20px'});
  transition: all ${({ theme }) => theme.animation.duration.slow} ${({ theme }) => theme.animation.easing.elegant};
  z-index: 10;
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    top: 1rem;
    left: 1rem;
  }
`;

const ContentContainer = styled.div<{ $isActive: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 4rem;
  transform: translateY(${props => props.$isActive ? '0' : '15px'});
  opacity: ${props => props.$isActive ? 1 : 0.85};
  transition: all ${({ theme }) => theme.animation.duration.cinematic} ${({ theme }) => theme.animation.easing.museum};
  z-index: 5;
  
  @media (max-width: 768px) {
    padding-top: 3rem;
  }
`;

// Parallax background element for depth
const ParallaxBackground = styled.div<{ $offset: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(201, 169, 110, 0.03) 0%,
    transparent 60%
  );
  transform: translateY(${props => props.$offset}px);
  pointer-events: none;
  z-index: 1;
`;

interface MuseumSectionProps {
  section: GallerySection;
  isActive: boolean;
  isVisible: boolean;
  children: React.ReactNode;
}

export function MuseumSection({ 
  section, 
  isActive, 
  isVisible, 
  children 
}: MuseumSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  // Determine section type for animation configuration
  const getSectionType = (sectionId: string): string => {
    if (sectionId === 'hero') return 'hero';
    if (sectionId.includes('gallery')) return 'gallery';
    if (sectionId === 'process-showcase') return 'process';
    if (sectionId === 'commission') return 'commission';
    return 'gallery';
  };

  const sectionType = getSectionType(section.id);

  // Trigger animation when section becomes visible
  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  // Set up parallax effect for background
  useEffect(() => {
    if (!parallaxRef.current) return;

    const parallaxConfig = sectionTransitions[sectionType];
    if (!parallaxConfig) return;

    const cleanup = createParallaxEffect(
      parallaxRef.current,
      parallaxConfig.parallaxOffset
    );

    return cleanup;
  }, [sectionType]);

  // Enhanced scroll-based parallax for premium feel
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, 
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      ));

      const config = sectionTransitions[sectionType];
      if (config) {
        const offset = scrollProgress * config.parallaxOffset * 50;
        setParallaxOffset(offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionType]);

  return (
    <SectionContainer
      ref={sectionRef}
      id={section.id}
      $isActive={isActive}
      $theme={section.theme}
      $isVisible={isVisible}
      $sectionType={sectionType}
    >
      <ParallaxBackground 
        ref={parallaxRef}
        $offset={parallaxOffset}
      />
      
      <SectionTitle $isVisible={isActive}>
        {section.name}
      </SectionTitle>
      
      <ContentContainer $isActive={isActive}>
        {children}
      </ContentContainer>
    </SectionContainer>
  );
}