import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { CommissionInterface } from './CommissionInterface';
import { museumTheme } from '@/styles/theme';
import { ContactMethod } from '@/types';

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={museumTheme}>
      {component}
    </ThemeProvider>
  );
};

// Generators for property-based testing
const platformArbitrary = fc.constantFrom('instagram', 'whatsapp', 'email');

const urlArbitrary = fc.oneof(
  fc.webUrl(),
  fc.constant('mailto:jeeva200606@gmail.com?subject=Commission'),
  fc.constant('https://wa.me/919952859522?text=Hello'),
  fc.constant('https://www.instagram.com/sketchwew/')
);

// Generate unique display texts to avoid conflicts
const displayTextArbitrary = fc.string({ minLength: 5, maxLength: 20 })
  .filter(text => {
    const trimmed = text.trim();
    // Avoid problematic characters that get HTML-escaped or cause issues
    return trimmed.length >= 5 && 
           !/[<>&"'\s]{2,}/.test(trimmed) && // No multiple consecutive problematic chars
           !/^\s|\s$/.test(trimmed) && // No leading/trailing whitespace
           /^[a-zA-Z0-9\s\-_]+$/.test(trimmed); // Only safe characters
  })
  .map((text: string) => `${text.trim().replace(/\s+/g, '_')}_${Date.now()}_${Math.random()}`);

const contactMethodArbitrary: fc.Arbitrary<ContactMethod> = fc.record({
  platform: platformArbitrary,
  url: urlArbitrary,
  displayText: displayTextArbitrary,
  icon: fc.constant('/icons/test.svg')
});

const contactMethodsArbitrary = fc.array(contactMethodArbitrary, { minLength: 1, maxLength: 3 })
  .map(methods => {
    // Ensure unique display texts within each array
    return methods.map((method, index) => ({
      ...method,
      displayText: `Contact_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));
  });

describe('CommissionInterface Property-Based Tests', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Property 9: External link behavior', () => {
    it('should open correct URLs in new windows for any contact method configuration', () => {
      /**
       * **Feature: sketch-museum-portfolio, Property 9: External link behavior opening correct URLs in new windows**
       * **Validates: Requirements 5.3**
       * 
       * Property: For any contact method button, clicking should open the correct external 
       * platform URL in a new window without affecting the current page state
       */
      fc.assert(
        fc.property(contactMethodsArbitrary, (contactMethods) => {
          // Render component with generated contact methods
          const { unmount } = renderWithTheme(
            <CommissionInterface 
              contactMethods={contactMethods} 
              availability={true} 
            />
          );

          // Test each contact method
          contactMethods.forEach((method) => {
            // Find and click the button for this contact method
            const button = screen.getByText(method.displayText);
            expect(button).toBeInTheDocument();
            
            // Clear previous calls
            mockWindowOpen.mockClear();
            
            // Click the button
            fireEvent.click(button);
            
            // Verify window.open was called with correct parameters
            expect(mockWindowOpen).toHaveBeenCalledTimes(1);
            expect(mockWindowOpen).toHaveBeenCalledWith(
              method.url,
              '_blank',
              'noopener,noreferrer'
            );
          });

          // Clean up for next iteration
          unmount();
        }),
        { numRuns: 50 }
      );
    });

    it('should maintain button accessibility for any contact method configuration', () => {
      /**
       * **Feature: sketch-museum-portfolio, Property 9: External link behavior opening correct URLs in new windows**
       * **Validates: Requirements 5.3**
       * 
       * Property: For any contact method configuration, all buttons should have proper 
       * accessibility attributes and be keyboard accessible
       */
      fc.assert(
        fc.property(contactMethodsArbitrary, (contactMethods) => {
          const { unmount } = renderWithTheme(
            <CommissionInterface 
              contactMethods={contactMethods} 
              availability={true} 
            />
          );

          // Test accessibility for each contact method
          contactMethods.forEach((method) => {
            const button = screen.getByText(method.displayText);
            
            // Check button has proper type attribute
            expect(button).toHaveAttribute('type', 'button');
            
            // Check button has proper aria-label
            expect(button).toHaveAttribute('aria-label', `Contact via ${method.displayText}`);
            
            // Check button is focusable (not disabled)
            expect(button).not.toBeDisabled();
          });

          unmount();
        }),
        { numRuns: 50 }
      );
    });

    it('should handle edge cases in URL formats correctly', () => {
      /**
       * **Feature: sketch-museum-portfolio, Property 9: External link behavior opening correct URLs in new windows**
       * **Validates: Requirements 5.3**
       * 
       * Property: For any valid URL format (web URLs, mailto, tel, etc.), the system should 
       * correctly pass the URL to window.open without modification
       */
      const edgeCaseUrls = [
        'mailto:jeeva200606@gmail.com?subject=Commission%20Inquiry&body=Hello',
        'https://wa.me/919952859522?text=Hi%2C%20I%27d%20like%20to%20commission',
        'https://www.instagram.com/sketchwew/',
        'tel:+919952859522',
        'https://example.com/contact?ref=portfolio&source=commission'
      ];

      fc.assert(
        fc.property(
          fc.constantFrom(...edgeCaseUrls), 
          fc.string({ minLength: 5, maxLength: 15 })
            .filter(s => /^[a-zA-Z0-9_]+$/.test(s.trim()))
            .map(s => `Contact_${s.trim()}_${Date.now()}`), 
          (url, displayText) => {
            const testContactMethod: ContactMethod = {
              platform: 'email',
              url: url,
              displayText: displayText || 'Contact_Default',
              icon: '/icons/test.svg'
            };

            const { unmount } = renderWithTheme(
              <CommissionInterface 
                contactMethods={[testContactMethod]} 
                availability={true} 
              />
            );

            const button = screen.getByText(testContactMethod.displayText);
            mockWindowOpen.mockClear();
            
            fireEvent.click(button);
            
            // Verify the URL is passed exactly as provided
            expect(mockWindowOpen).toHaveBeenCalledWith(
              url,
              '_blank',
              'noopener,noreferrer'
            );

            unmount();
          }
        ),
        { numRuns: 25 }
      );
    });

    it('should not affect page state when opening external links', () => {
      /**
       * **Feature: sketch-museum-portfolio, Property 9: External link behavior opening correct URLs in new windows**
       * **Validates: Requirements 5.3**
       * 
       * Property: For any contact method, clicking the button should not change the current 
       * page location or affect any other page state
       */
      fc.assert(
        fc.property(contactMethodsArbitrary, (contactMethods) => {
          // Store initial page state
          const initialLocation = window.location.href;
          const initialTitle = document.title;
          
          const { unmount } = renderWithTheme(
            <CommissionInterface 
              contactMethods={contactMethods} 
              availability={true} 
            />
          );

          // Click all buttons
          contactMethods.forEach((method) => {
            const button = screen.getByText(method.displayText);
            fireEvent.click(button);
          });

          // Verify page state is unchanged
          expect(window.location.href).toBe(initialLocation);
          expect(document.title).toBe(initialTitle);
          
          // Verify component is still rendered correctly
          expect(screen.getByText('Custom Sketch Orders Available')).toBeInTheDocument();

          unmount();
        }),
        { numRuns: 50 }
      );
    });
  });
});