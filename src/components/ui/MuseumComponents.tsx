'use client';

import styled from 'styled-components';
import { 
  museumLighting, 
  museumFraming, 
  museumHover, 
  museumTypography, 
  responsive, 
  galleryLayout,
  museumAnimations 
} from '@/styles/museumAesthetics';

// Hero section components
export const HeroContainer = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.museum.darkBackground};
  ${({ theme }) => museumLighting.ambientGlow(theme)}
  ${({ theme }) => museumLighting.spotlight(theme)}
  overflow: hidden;
`;

export const HeroTitle = styled.h1`
  ${({ theme }) => museumTypography.heroTitle(theme)}
  ${museumAnimations.fadeInUp(0.2)}
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const HeroSubtitle = styled.p`
  ${({ theme }) => museumTypography.bodyText(theme)}
  ${museumAnimations.fadeInUp(0.4)}
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

// Gallery section components
export const GalleryContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  ${({ theme }) => museumLighting.wallWash(theme)}
  
  ${responsive.tablet`
    padding: 2rem 1.5rem;
  `}
  
  ${responsive.mobile`
    padding: 1.5rem 1rem;
  `}
`;

export const GalleryTitle = styled.h2`
  ${({ theme }) => museumTypography.sectionTitle(theme)}
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  ${museumAnimations.fadeInUp(0)}
`;

export const GalleryGrid = styled.div<{ $columns?: number; $spacing?: 'compact' | 'comfortable' | 'spacious' }>`
  ${({ $columns = 3, $spacing = 'comfortable', theme }) => {
    const gap = $spacing === 'compact' ? theme.spacing.md : 
                 $spacing === 'spacious' ? theme.spacing.xl : theme.spacing.lg;
    return galleryLayout.grid($columns, gap);
  }}
  
  ${({ theme }) => museumLighting.floorReflection(theme)}
`;

// Artwork display components
export const ArtworkFrame = styled.div<{ $variant?: 'elegant' | 'minimal' | 'premium' }>`
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  cursor: pointer;
  ${({ $variant = 'elegant', theme }) => museumFraming[$variant](theme)}
  ${({ theme }) => museumHover.gentle(theme)}
  ${museumAnimations.fadeInUp(0.1)}
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.animation.duration.slow} ${({ theme }) => theme.animation.easing.museum};
  }
  
  &:hover img {
    transform: scale(1.02);
  }
`;

export const ArtworkImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const ArtworkOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    transparent 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  padding: ${({ theme }) => theme.spacing.md};
  transform: translateY(100%);
  transition: transform ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.museum};
  
  ${ArtworkFrame}:hover & {
    transform: translateY(0);
  }
`;

export const ArtworkTitle = styled.h3`
  ${({ theme }) => museumTypography.artworkTitle(theme)}
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const ArtworkDescription = styled.p`
  ${({ theme }) => museumTypography.bodyText(theme)}
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
`;

// Process showcase components
export const ProcessContainer = styled.div`
  ${galleryLayout.centerContent}
  background: ${({ theme }) => theme.colors.museum.galleryWall};
  ${({ theme }) => museumLighting.ambientGlow(theme)}
  border-radius: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

export const ProcessStep = styled.div<{ $delay?: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  ${({ $delay = 0 }) => museumAnimations.fadeInUp($delay)}
  
  ${responsive.tablet`
    padding: 1.5rem;
  `}
`;

export const ProcessImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  ${({ theme }) => museumFraming.minimal(theme)}
  ${({ theme }) => museumHover.subtle(theme)}
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  ${responsive.mobile`
    width: 150px;
    height: 150px;
  `}
`;

// Commission interface components
export const CommissionContainer = styled.div`
  ${galleryLayout.centerContent}
  background: ${({ theme }) => theme.colors.museum.darkBackground};
  ${({ theme }) => museumLighting.spotlight(theme)}
  padding: ${({ theme }) => theme.spacing.xxl};
  
  ${responsive.tablet`
    padding: 3rem;
  `}
  
  ${responsive.mobile`
    padding: 2rem;
  `}
`;

export const CommissionTitle = styled.h2`
  ${({ theme }) => museumTypography.sectionTitle(theme)}
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  ${museumAnimations.fadeInUp(0)}
`;

export const CommissionDescription = styled.p`
  ${({ theme }) => museumTypography.bodyText(theme)}
  text-align: center;
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  ${museumAnimations.fadeInUp(0.2)}
`;

export const ContactButtonGroup = styled.div`
  display: flex;
  gap: 2rem;
  ${museumAnimations.fadeInUp(0.4)}
  
  ${responsive.mobile`
    flex-direction: column;
    gap: 1.5rem;
  `}
`;

export const ContactButton = styled.button<{ $variant?: 'instagram' | 'whatsapp' }>`
  ${responsive.touchTarget}
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ $variant, theme }) => 
    $variant === 'instagram' ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' :
    $variant === 'whatsapp' ? '#25D366' :
    theme.colors.accent
  };
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.spacing.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.museum};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  /* Enhanced mobile touch feedback */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0.2);
  -webkit-touch-callout: none;
  user-select: none;
  
  /* Ensure minimum touch target size */
  min-height: 48px;
  min-width: 48px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.strong};
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    transition-duration: 0.1s;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 2rem;
    font-size: 0.875rem;
    min-height: 52px;
    border-radius: 8px;
    
    /* Enhanced touch feedback for mobile */
    &:active {
      transform: scale(0.95);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
  }
`;

// Navigation components
export const NavigationLabel = styled.span`
  ${({ theme }) => museumTypography.galleryLabel(theme)}
  position: absolute;
  right: 2.5rem;
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: center;
  white-space: nowrap;
  opacity: 0.7;
  transition: opacity ${({ theme }) => theme.animation.duration.normal} ease;
  
  ${responsive.tablet`
    display: none;
  `}
`;

// Scroll indicator
export const ScrollIndicator = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xl};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  ${museumAnimations.gentleFloat}
  
  ${responsive.mobile`
    bottom: 2rem;
  `}
`;

export const ScrollText = styled.span`
  ${({ theme }) => museumTypography.galleryLabel(theme)}
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

export const ScrollArrow = styled.div`
  width: 1px;
  height: 30px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    ${({ theme }) => theme.colors.text.muted} 50%,
    transparent 100%
  );
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 6px solid ${({ theme }) => theme.colors.text.muted};
  }
`;