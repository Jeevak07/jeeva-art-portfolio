'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { ProcessShowcaseProps } from '@/types';
import { 
  museumFraming, 
  museumTypography, 
  museumAnimations,
  responsive 
} from '@/styles/museumAesthetics';

// Main showcase container
const ShowcaseContainer = styled.section`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.museum.darkBackground};
  position: relative;
  
  ${responsive.mobile`
    padding: 2rem 1rem;
  `}
`;

// Section header
const ShowcaseHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  
  ${responsive.mobile`
    margin-bottom: 2rem;
  `}
`;

const ShowcaseTitle = styled.h2`
  ${({ theme }) => museumTypography.sectionTitle(theme)}
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  ${responsive.mobile`
    font-size: 1.5rem;
  `}
`;

const ShowcaseSubtitle = styled.p`
  ${({ theme }) => museumTypography.bodyText(theme)}
  color: ${({ theme }) => theme.colors.text.muted};
  max-width: 600px;
  margin: 0 auto;
  
  ${responsive.mobile`
    font-size: 0.875rem;
  `}
`;

// Process steps container
const ProcessSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  
  ${responsive.tablet`
    gap: 2rem;
  `}
  
  ${responsive.mobile`
    gap: 1.5rem;
  `}
`;

// Individual process step
const ProcessStep = styled.div<{ $isVisible: boolean; $index: number }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: translateX(${({ $isVisible, $index }) => 
    $isVisible ? '0' : ($index % 2 === 0 ? '-30px' : '30px')
  });
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: ${({ $index }) => $index * 0.2}s;
  
  /* Alternate layout for visual interest */
  flex-direction: ${({ $index }) => $index % 2 === 0 ? 'row' : 'row-reverse'};
  
  ${responsive.tablet`
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  `}
  
  ${responsive.mobile`
    gap: 1rem;
  `}
`;

// Step image container
const StepImageContainer = styled.div`
  flex: 0 0 300px;
  aspect-ratio: 4/3;
  position: relative;
  overflow: hidden;
  ${({ theme }) => museumFraming.elegant(theme)}
  
  ${responsive.tablet`
    flex: 0 0 250px;
  `}
  
  ${responsive.mobile`
    flex: 0 0 200px;
  `}
`;

// Step image with reveal animation
const StepImage = styled(Image)<{ $isRevealed: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 1s cubic-bezier(0.25, 0.1, 0.25, 1);
  
  /* Soft clip reveal */
  clip-path: ${({ $isRevealed }) => 
    $isRevealed ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)'
  };
  
  /* Museum lighting effect */
  filter: brightness(1.02) contrast(1.05) saturate(1.1);
`;

// Step content container
const StepContent = styled.div`
  flex: 1;
  min-width: 0; /* Prevent flex item from overflowing */
`;

// Step number indicator
const StepNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.accent} 0%, 
    rgba(201, 169, 110, 0.8) 100%
  );
  color: ${({ theme }) => theme.colors.museum.darkBackground};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.museum.frame};
  
  ${responsive.mobile`
    width: 32px;
    height: 32px;
    font-size: 1rem;
    margin-bottom: 0.75rem;
  `}
`;

// Step title
const StepTitle = styled.h3`
  ${({ theme }) => museumTypography.artworkTitle(theme)}
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  ${responsive.mobile`
    font-size: 1.125rem;
  `}
`;

// Step description
const StepDescription = styled.p`
  ${({ theme }) => museumTypography.bodyText(theme)}
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  
  ${responsive.mobile`
    font-size: 0.875rem;
  `}
`;

// Duration indicator (optional)
const StepDuration = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  font-style: italic;
  
  &::before {
    content: '⏱ ';
    opacity: 0.7;
  }
`;

// Progress indicator
const ProgressIndicator = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    ${({ theme }) => theme.colors.accent} 20%,
    ${({ theme }) => theme.colors.accent} 80%,
    transparent 100%
  );
  transform: translateX(-50%);
  opacity: 0.3;
  
  ${responsive.tablet`
    display: none;
  `}
`;

export const ProcessShowcase: React.FC<ProcessShowcaseProps> = ({
  steps,
  autoPlay = false
}) => {
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sort steps by order to ensure correct sequential display
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  // Intersection Observer for progressive reveal
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((stepRef, index) => {
      if (stepRef) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSteps(prev => new Set([...prev, index]));
              
              // Delay image reveal for staggered effect
              setTimeout(() => {
                setRevealedImages(prev => new Set([...prev, index]));
              }, 300 + (index * 100));
            }
          },
          { threshold: 0.3, rootMargin: '50px' }
        );

        observer.observe(stepRef);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [sortedSteps.length]);

  // Auto-play functionality (if enabled)
  useEffect(() => {
    if (autoPlay && sortedSteps.length > 0) {
      const interval = setInterval(() => {
        setVisibleSteps(prev => {
          const nextIndex = prev.size;
          if (nextIndex < sortedSteps.length) {
            return new Set([...prev, nextIndex]);
          }
          return prev;
        });
      }, 2000); // 2 second intervals

      return () => clearInterval(interval);
    }
  }, [autoPlay, sortedSteps.length]);

  return (
    <ShowcaseContainer ref={containerRef} data-testid="process-showcase">
      <ShowcaseHeader>
        <ShowcaseTitle>Artistic Process</ShowcaseTitle>
        <ShowcaseSubtitle>
          From initial concept to finished artwork - witness the creative journey
        </ShowcaseSubtitle>
      </ShowcaseHeader>

      <ProcessSteps>
        <ProgressIndicator />
        
        {sortedSteps.map((step, index) => (
          <ProcessStep
            key={step.id}
            ref={el => { stepRefs.current[index] = el; }}
            $isVisible={visibleSteps.has(index)}
            $index={index}
            data-testid={`process-step-${step.order}`}
          >
            <StepImageContainer>
              <StepImage
                src={step.imageUrl}
                alt={`${step.title} - Step ${step.order}`}
                fill
                sizes="(max-width: 768px) 200px, 300px"
                priority={index < 2}
                quality={85}
                $isRevealed={revealedImages.has(index)}
              />
            </StepImageContainer>
            
            <StepContent>
              <StepNumber>{step.order}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
              {step.duration && (
                <StepDuration>
                  {step.duration} minutes
                </StepDuration>
              )}
            </StepContent>
          </ProcessStep>
        ))}
      </ProcessSteps>
    </ShowcaseContainer>
  );
};

export default ProcessShowcase;