'use client';

import React, { useState } from 'react';
import { CommissionInterfaceProps, ContactMethod } from '@/types';
import { 
  CommissionContainer, 
  CommissionTitle, 
  CommissionDescription, 
  ContactButtonGroup, 
  ContactButton 
} from './MuseumComponents';
import { useExternalLinkHandling } from '@/utils/errorHandling';

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
        // Clear any previous errors for this link
        setLinkErrors(prev => {
          const newMap = new Map(prev);
          newMap.delete(contactMethod.url);
          return newMap;
        });
      } else {
        // Set error message for failed link
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
      <CommissionTitle>
        {availability ? 'Custom Sketch Orders Available' : 'Commission Inquiries'}
      </CommissionTitle>
      
      <CommissionDescription>
        {availability 
          ? 'Ready to bring your vision to life? Contact me through your preferred platform to discuss your custom sketch commission.'
          : 'Thank you for your interest. Please check back later for commission availability.'
        }
      </CommissionDescription>
      
      {availability && (
        <>
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