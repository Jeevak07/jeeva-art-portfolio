'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Artwork } from '@/types';
import { ArtworkDisplay } from './ArtworkDisplay';
import { responsive } from '@/styles/museumAesthetics';

// Featured section container
const FeaturedContainer = styled.section`
  position: relative;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.museum.darkBackground} 0%,
    rgba(10, 10, 10, 0.95) 50%,
    ${({ theme }) => theme.colors.museum.darkBackground} 100%
  );
  
  ${responsive.tablet`
    padding: 4rem 2rem;
  `}
  
  ${responsive.mobile`
    padding: 3rem 1.5rem;
  `}
`;

const FeaturedTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontFamily.display};
  font-size: ${({ theme }) => theme.typography.fontSize.display};
  font-weight: 300;
  color: ${({ theme }) => theme.colors.museum.frameGold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  letter-spacing: 0.05em;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => theme.colors.museum.frameGold} 50%,
      transparent 100%
    );
    margin: ${({ theme }) => theme.spacing.lg} auto 0;
  }
  
  ${responsive.mobile`
    font-size: 2.2rem;
    margin-bottom: 2rem;
  `}
`;

const FeaturedSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  max-width: 500px;
  margin: 0 auto ${({ theme }) => theme.spacing.xxl};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  
  ${responsive.mobile`
    font-size: 1rem;
    margin-bottom: 2rem;
  `}
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  height: 600px;
  
  ${responsive.tablet`
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    height: auto;
    gap: 1.5rem;
  `}
  
  ${responsive.mobile`
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 300px);
    gap: 1.5rem;
  `}
`;

const FeaturedItem = styled.div<{ $isPrimary?: boolean; $index: number }>`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  ${({ $isPrimary }) => $isPrimary && `
    grid-row: 1 / 3;
  `}
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(201, 169, 110, 0.2);
  }
  
  ${responsive.tablet`
    &:first-child {
      grid-column: 1 / 3;
      grid-row: 1;
    }
  `}
  
  ${responsive.mobile`
    grid-column: 1;
    grid-row: auto;
  `}
`;

const FeaturedOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    transparent 0%,
    rgba(0, 0, 0, 0.3) 30%,
    rgba(0, 0, 0, 0.8) 100%
  );
  padding: ${({ theme }) => theme.spacing.xl};
  color: white;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  ${FeaturedItem}:hover & {
    transform: translateY(0);
  }
  
  ${responsive.mobile`
    padding: 2rem;
  `}
`;

const FeaturedArtworkTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  ${responsive.mobile`
    font-size: 1.25rem;
  `}
`;

const FeaturedArtworkCategory = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.museum.frameGold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ViewAllButton = styled.button`
  display: block;
  margin: ${({ theme }) => theme.spacing.xxl} auto 0;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: transparent;
  color: ${({ theme }) => theme.colors.museum.frameGold};
  border: 2px solid ${({ theme }) => theme.colors.museum.frameGold};
  border-radius: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:hover {
    background: ${({ theme }) => theme.colors.museum.frameGold};
    color: ${({ theme }) => theme.colors.museum.darkBackground};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(201, 169, 110, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface FeaturedArtworksProps {
  artworks: Artwork[];
  onArtworkClick?: (artwork: Artwork) => void;
  onViewAll?: () => void;
}

export const FeaturedArtworks: React.FC<FeaturedArtworksProps> = ({
  artworks,
  onArtworkClick,
  onViewAll
}) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Get featured artworks (first 4, with the first being primary)
  const featuredArtworks = artworks.slice(0, 4);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    const items = containerRef.current?.querySelectorAll('[data-index]');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const handleArtworkClick = (artwork: Artwork) => {
    if (onArtworkClick) {
      onArtworkClick(artwork);
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      // Default behavior - scroll to anime gallery
      document.getElementById('anime-gallery')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <FeaturedContainer ref={containerRef}>
      <FeaturedTitle>Featured Artworks</FeaturedTitle>
      <FeaturedSubtitle>
        Discover the artistry and attention to detail that brings each character to life
      </FeaturedSubtitle>
      
      <FeaturedGrid>
        {featuredArtworks.map((artwork, index) => (
          <FeaturedItem
            key={artwork.id}
            $isPrimary={index === 0}
            $index={index}
            data-index={index}
            onClick={() => handleArtworkClick(artwork)}
          >
            <ArtworkDisplay
              artwork={artwork}
              size={index === 0 ? 'large' : 'medium'}
              interactive={false}
            />
            <FeaturedOverlay>
              <FeaturedArtworkCategory>{artwork.category}</FeaturedArtworkCategory>
              <FeaturedArtworkTitle>{artwork.title}</FeaturedArtworkTitle>
            </FeaturedOverlay>
          </FeaturedItem>
        ))}
      </FeaturedGrid>
      
      <ViewAllButton onClick={handleViewAll}>
        View Complete Portfolio
      </ViewAllButton>
    </FeaturedContainer>
  );
};

export default FeaturedArtworks;