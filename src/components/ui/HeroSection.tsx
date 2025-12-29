'use client';

import React from 'react';
import { 
  HeroContainer, 
  HeroTitle, 
  HeroSubtitle, 
  ScrollIndicator, 
  ScrollText, 
  ScrollArrow 
} from './MuseumComponents';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showScrollIndicator?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Arts by Jeeva",
  subtitle = "Hand-drawn Anime & Portrait Art",
  showScrollIndicator = true,
}) => {
  return (
    <HeroContainer id="hero">
      <div>
        <HeroTitle>{title}</HeroTitle>
        <HeroSubtitle>{subtitle}</HeroSubtitle>
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