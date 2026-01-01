'use client';

import React from 'react';
import styled from 'styled-components';
import { 
  HeroContainer, 
  HeroTitle, 
  HeroSubtitle, 
  ScrollIndicator, 
  ScrollText, 
  ScrollArrow 
} from './MuseumComponents';
import { responsive } from '@/styles/museumAesthetics';

// New styled components for enhanced hero section
const ValueProposition = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 600px;
  margin: ${({ theme }) => theme.spacing.xl} auto ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-weight: 300;
  
  ${responsive.mobile`
    font-size: 1rem;
    margin: 2rem auto;
    padding: 0 1rem;
  `}
`;

const SocialProof = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  
  ${responsive.tablet`
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  `}
  
  ${responsive.mobile`
    gap: 0.75rem;
  `}
`;

const ProofItem = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.museum.frameGold};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: 0.05em;
  
  ${responsive.mobile`
    font-size: 0.75rem;
  `}
`;

const CTAContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.xxl} 0 ${({ theme }) => theme.spacing.xl};
  
  ${responsive.mobile`
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  `}
`;

const PrimaryCTA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.museum.frameGold} 0%, #b8941f 100%);
  color: ${({ theme }) => theme.colors.museum.darkBackground};
  text-decoration: none;
  border-radius: 6px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  letter-spacing: 0.05em;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 16px rgba(201, 169, 110, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(201, 169, 110, 0.4);
    background: linear-gradient(135deg, #e6c875 0%, ${({ theme }) => theme.colors.museum.frameGold} 100%);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${responsive.mobile`
    padding: 1rem 2rem;
    font-size: 0.875rem;
    min-width: 200px;
  `}
`;

const SecondaryCTA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  border: 2px solid rgba(201, 169, 110, 0.3);
  border-radius: 6px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  letter-spacing: 0.05em;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.museum.frameGold};
    background: rgba(201, 169, 110, 0.1);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${responsive.mobile`
    padding: 1rem 2rem;
    font-size: 0.875rem;
    min-width: 200px;
  `}
`;

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showScrollIndicator?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Arts by Jeeva",
  subtitle = "Premium Hand-Drawn Anime & Portrait Commissions",
  showScrollIndicator = true,
}) => {
  return (
    <HeroContainer id="hero">
      <div>
        <HeroTitle>{title}</HeroTitle>
        <HeroSubtitle>{subtitle}</HeroSubtitle>
        
        {/* New Value Proposition */}
        <ValueProposition>
          Bringing your favorite characters to life with detailed pencil artistry. 
          Each piece is meticulously crafted to capture emotion, personality, and the essence that makes your vision unique.
        </ValueProposition>
        
        {/* Social Proof */}
        <SocialProof>
          <ProofItem>✨ 50+ Custom Commissions Completed</ProofItem>
          <ProofItem>⚡ 7-14 Day Turnaround</ProofItem>
          <ProofItem>🎨 Anime & Realism Specialist</ProofItem>
        </SocialProof>
        
        {/* Primary CTA */}
        <CTAContainer>
          <PrimaryCTA href="#commission">
            Commission Your Art
          </PrimaryCTA>
          <SecondaryCTA href="#anime-gallery">
            View Portfolio
          </SecondaryCTA>
        </CTAContainer>
      </div>
      
      {showScrollIndicator && (
        <ScrollIndicator>
          <ScrollText>Scroll to explore the galleries</ScrollText>
          <ScrollArrow />
        </ScrollIndicator>
      )}
    </HeroContainer>
  );
};

export default HeroSection;