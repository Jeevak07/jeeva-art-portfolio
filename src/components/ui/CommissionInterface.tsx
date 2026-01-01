'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { CommissionInterfaceProps, ContactMethod } from '@/types';
import { 
  CommissionContainer, 
  CommissionTitle, 
  CommissionDescription, 
  ContactButtonGroup, 
  ContactButton 
} from './MuseumComponents';
import { useExternalLinkHandling } from '@/utils/errorHandling';
import { responsive } from '@/styles/museumAesthetics';

// Enhanced Commission Components
const CommissionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const CommissionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
  margin: ${({ theme }) => theme.spacing.lg} auto 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  
  ${responsive.mobile`
    font-size: 1rem;
  `}
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  
  ${responsive.mobile`
    grid-template-columns: 1fr;
    gap: 2rem;
  `}
`;

const ServiceCard = styled.div`
  background: rgba(201, 169, 110, 0.05);
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(201, 169, 110, 0.4);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  }
`;

const ServiceIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ServiceTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.museum.frameGold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ServicePrice = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.museum.frameGold};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const ProcessTimeline = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const TimelineTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-weight: 300;
`;

const TimelineSteps = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 30px;
    left: 60px;
    right: 60px;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.museum.frameGold} 0%,
      rgba(201, 169, 110, 0.3) 50%,
      ${({ theme }) => theme.colors.museum.frameGold} 100%
    );
    z-index: 1;
  }
  
  ${responsive.tablet`
    flex-direction: column;
    gap: 2rem;
    
    &::before {
      display: none;
    }
  `}
`;

const TimelineStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  position: relative;
  z-index: 2;
  
  ${responsive.tablet`
    flex-direction: row;
    text-align: left;
    gap: 2rem;
  `}
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.museum.frameGold};
  color: ${({ theme }) => theme.colors.museum.darkBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  ${responsive.tablet`
    margin-bottom: 0;
    flex-shrink: 0;
  `}
`;

const StepContent = styled.div`
  ${responsive.tablet`
    flex: 1;
  `}
`;

const StepTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const ContactSection = styled.div`
  text-align: center;
  background: rgba(201, 169, 110, 0.03);
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  ${responsive.mobile`
    padding: 2rem;
  `}
`;

const ContactTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  color: ${({ theme }) => theme.colors.museum.frameGold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: 300;
`;

const ContactSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const TrustIndicators = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  ${responsive.mobile`
    grid-template-columns: 1fr;
    gap: 1rem;
  `}
`;

const TrustItem = styled.div`
  color: ${({ theme }) => theme.colors.museum.frameGold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CommissionInterface: React.FC<CommissionInterfaceProps> = ({
  contactMethods,
  availability = true,
}) => {
  const [linkErrors, setLinkErrors] = useState<Map<string, string>>(new Map());
  const { handleExternalLink } = useExternalLinkHandling();

  const handleContactClick = async (contactMethod: ContactMethod) => {
    try {
      const success = await handleExternalLink(contactMethod.url, contactMethod.platform);
      
      if (success) {
        setLinkErrors(prev => {
          const newMap = new Map(prev);
          newMap.delete(contactMethod.url);
          return newMap;
        });
      } else {
        setLinkErrors(prev => new Map(prev).set(
          contactMethod.url, 
          `Failed to open ${contactMethod.platform}. Please try again or contact directly.`
        ));
      }
    } catch (error) {
      console.error('Error handling external link:', error);
      setLinkErrors(prev => new Map(prev).set(
        contactMethod.url, 
        `Unable to open ${contactMethod.platform}. Please check your connection.`
      ));
    }
  };

  const getButtonVariant = (platform: string): 'instagram' | 'whatsapp' | undefined => {
    if (platform === 'instagram') return 'instagram';
    if (platform === 'whatsapp') return 'whatsapp';
    return undefined;
  };

  return (
    <CommissionContainer id="commission">
      {/* Commission Header */}
      <CommissionHeader>
        <CommissionTitle>
          {availability ? 'Commission Your Custom Artwork' : 'Commission Inquiries'}
        </CommissionTitle>
        
        <CommissionSubtitle>
          {availability 
            ? 'Transform your vision into a masterpiece. Professional hand-drawn sketches tailored to your specifications.'
            : 'Thank you for your interest. Please check back later for commission availability.'
          }
        </CommissionSubtitle>
      </CommissionHeader>
      
      {availability && (
        <>
          {/* Services Grid */}
          <ServicesGrid>
            <ServiceCard>
              <ServiceIcon>🎭</ServiceIcon>
              <ServiceTitle>Anime Characters</ServiceTitle>
              <ServiceDescription>
                Original characters, fan art, or your custom anime-style portraits
              </ServiceDescription>
              <ServicePrice>Starting at ₹2,500</ServicePrice>
            </ServiceCard>
            
            <ServiceCard>
              <ServiceIcon>👤</ServiceIcon>
              <ServiceTitle>Portrait Sketches</ServiceTitle>
              <ServiceDescription>
                Realistic portraits from photos with detailed shading and texture
              </ServiceDescription>
              <ServicePrice>Starting at ₹3,000</ServicePrice>
            </ServiceCard>
            
            <ServiceCard>
              <ServiceIcon>⚔️</ServiceIcon>
              <ServiceTitle>Character Design</ServiceTitle>
              <ServiceDescription>
                Complete character concepts with multiple poses and expressions
              </ServiceDescription>
              <ServicePrice>Starting at ₹4,500</ServicePrice>
            </ServiceCard>
          </ServicesGrid>
          
          {/* Process Timeline */}
          <ProcessTimeline>
            <TimelineTitle>Commission Process</TimelineTitle>
            <TimelineSteps>
              <TimelineStep>
                <StepNumber>1</StepNumber>
                <StepContent>
                  <StepTitle>Consultation</StepTitle>
                  <StepDescription>Discuss your vision, references, and requirements</StepDescription>
                </StepContent>
              </TimelineStep>
              
              <TimelineStep>
                <StepNumber>2</StepNumber>
                <StepContent>
                  <StepTitle>Sketch & Approval</StepTitle>
                  <StepDescription>Initial sketch for your review and feedback</StepDescription>
                </StepContent>
              </TimelineStep>
              
              <TimelineStep>
                <StepNumber>3</StepNumber>
                <StepContent>
                  <StepTitle>Final Artwork</StepTitle>
                  <StepDescription>Detailed completion and high-resolution delivery</StepDescription>
                </StepContent>
              </TimelineStep>
            </TimelineSteps>
          </ProcessTimeline>
          
          {/* Contact Section */}
          <ContactSection>
            <ContactTitle>Ready to Start Your Commission?</ContactTitle>
            <ContactSubtitle>
              Choose your preferred platform to discuss your project
            </ContactSubtitle>
            
            <ContactButtonGroup>
              {contactMethods.map((method, index) => (
                <ContactButton
                  key={`${method.platform}-${index}`}
                  $variant={getButtonVariant(method.platform)}
                  onClick={() => handleContactClick(method)}
                  type="button"
                  aria-label={`Contact via ${method.displayText}`}
                >
                  {method.displayText}
                </ContactButton>
              ))}
            </ContactButtonGroup>
            
            {/* Trust Indicators */}
            <TrustIndicators>
              <TrustItem>✅ 7-14 Day Delivery</TrustItem>
              <TrustItem>✅ Unlimited Revisions</TrustItem>
              <TrustItem>✅ High-Resolution Files</TrustItem>
              <TrustItem>✅ 100% Satisfaction Guarantee</TrustItem>
            </TrustIndicators>
          </ContactSection>
          
          {/* Display error messages if any links failed */}
          {linkErrors.size > 0 && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'rgba(231, 76, 60, 0.1)', 
              border: '1px solid rgba(231, 76, 60, 0.3)', 
              borderRadius: '4px',
              color: 'rgba(231, 76, 60, 0.9)',
              fontSize: '0.875rem'
            }}>
              {Array.from(linkErrors.values()).map((error, index) => (
                <div key={index} style={{ marginBottom: index < linkErrors.size - 1 ? '0.5rem' : 0 }}>
                  {error}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </CommissionContainer>
  );
};

export default CommissionInterface;