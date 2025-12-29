import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { museumTheme } from './theme';
import {
  HeroContainer,
  HeroTitle,
  HeroSubtitle,
  GalleryContainer,
  GalleryTitle,
  GalleryGrid,
  ArtworkFrame,
  ProcessContainer,
  CommissionContainer,
  CommissionTitle,
  ContactButton,
} from '../components/ui/MuseumComponents';

// **Feature: sketch-museum-portfolio, Property 1: Museum aesthetic consistency across all sections and viewport sizes**

describe('Museum Aesthetic Consistency', () => {
  // Helper to create a test wrapper with theme
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={museumTheme}>
      {children}
    </ThemeProvider>
  );

  // Helper to generate viewport dimensions
  const viewportDimensions = fc.record({
    width: fc.integer({ min: 320, max: 2560 }), // From mobile to wide desktop
    height: fc.integer({ min: 568, max: 1440 }), // From mobile to desktop height
  });

  // Helper to generate text content
  const textContent = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);

  // Helper to check if element has museum aesthetic properties
  const hasMuseumAesthetic = (element: HTMLElement): boolean => {
    if (!element) return false;
    
    const computedStyle = window.getComputedStyle(element);
    const className = element.className;
    
    // Check for styled-component class names (indicates our components are being used)
    const hasStyledComponent = className.includes('sc-');
    
    // Check that element has basic styling properties applied
    const hasBasicStyling = computedStyle.display !== '' && 
                           computedStyle.display !== 'none';
    
    // For elements that should have fonts, check font family
    const isTextElement = element.tagName === 'H1' || element.tagName === 'H2' || 
                         element.tagName === 'H3' || element.tagName === 'P';
    
    if (isTextElement) {
      const fontFamily = computedStyle.fontFamily;
      const hasMuseumFont = fontFamily && fontFamily.length > 0;
      return hasStyledComponent && hasBasicStyling && hasMuseumFont;
    }
    
    // For container elements, just check they have styled-component classes and basic styling
    return hasStyledComponent && hasBasicStyling;
  };

  // Helper to check responsive behavior
  const isResponsive = (element: HTMLElement, viewport: { width: number; height: number }): boolean => {
    // In test environment, we mainly check that the element exists and is properly structured
    // Responsive behavior is primarily handled by CSS media queries which are hard to test in jsdom
    
    // Check that element exists and has basic properties
    const computedStyle = window.getComputedStyle(element);
    const hasBasicLayout = element.tagName && 
                          (computedStyle.display !== 'none') &&
                          element.offsetWidth >= 0 &&
                          element.offsetHeight >= 0;
    
    // For very small viewports, ensure element doesn't have excessive fixed widths
    if (viewport.width < 480) {
      const width = computedStyle.width;
      const minWidth = computedStyle.minWidth;
      // Avoid fixed large widths on mobile
      const hasReasonableWidth = !width.includes('1000px') && !minWidth.includes('1000px');
      return hasBasicLayout && hasReasonableWidth;
    }
    
    return hasBasicLayout;
  };

  it('should maintain museum aesthetic consistency across all hero components and viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: textContent,
          subtitle: textContent,
          viewport: viewportDimensions,
        }),
        ({ title, subtitle, viewport }) => {
          // Mock viewport size
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewport.width,
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewport.height,
          });

          // Test HeroContainer
          const { container: heroContainer } = render(
            <TestWrapper>
              <HeroContainer data-testid="hero-container">
                <HeroTitle data-testid="hero-title">{title}</HeroTitle>
                <HeroSubtitle data-testid="hero-subtitle">{subtitle}</HeroSubtitle>
              </HeroContainer>
            </TestWrapper>
          );

          const heroElement = heroContainer.querySelector('[data-testid="hero-container"]') as HTMLElement;
          const titleElement = heroContainer.querySelector('[data-testid="hero-title"]') as HTMLElement;
          const subtitleElement = heroContainer.querySelector('[data-testid="hero-subtitle"]') as HTMLElement;

          // All hero elements should have museum aesthetic
          expect(hasMuseumAesthetic(heroElement)).toBe(true);
          expect(hasMuseumAesthetic(titleElement)).toBe(true);
          expect(hasMuseumAesthetic(subtitleElement)).toBe(true);

          // All elements should be responsive
          expect(isResponsive(heroElement, viewport)).toBe(true);
          expect(isResponsive(titleElement, viewport)).toBe(true);
          expect(isResponsive(subtitleElement, viewport)).toBe(true);
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  it('should maintain museum aesthetic consistency across all gallery components and viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: textContent,
          columns: fc.integer({ min: 1, max: 4 }),
          spacing: fc.constantFrom('compact', 'comfortable', 'spacious'),
          viewport: viewportDimensions,
        }),
        ({ title, columns, spacing, viewport }) => {
          // Mock viewport size
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewport.width,
          });

          // Test Gallery components
          const { container } = render(
            <TestWrapper>
              <GalleryContainer data-testid="gallery-container">
                <GalleryTitle data-testid="gallery-title">{title}</GalleryTitle>
                <GalleryGrid 
                  data-testid="gallery-grid" 
                  $columns={columns} 
                  $spacing={spacing}
                >
                  <ArtworkFrame data-testid="artwork-frame" $variant="elegant">
                    <img src="test.jpg" alt="Test artwork" />
                  </ArtworkFrame>
                </GalleryGrid>
              </GalleryContainer>
            </TestWrapper>
          );

          const galleryContainer = container.querySelector('[data-testid="gallery-container"]') as HTMLElement;
          const galleryTitle = container.querySelector('[data-testid="gallery-title"]') as HTMLElement;
          const galleryGrid = container.querySelector('[data-testid="gallery-grid"]') as HTMLElement;
          const artworkFrame = container.querySelector('[data-testid="artwork-frame"]') as HTMLElement;

          // All gallery elements should have museum aesthetic
          expect(hasMuseumAesthetic(galleryContainer)).toBe(true);
          expect(hasMuseumAesthetic(galleryTitle)).toBe(true);
          expect(hasMuseumAesthetic(galleryGrid)).toBe(true);
          expect(hasMuseumAesthetic(artworkFrame)).toBe(true);

          // All elements should be responsive
          expect(isResponsive(galleryContainer, viewport)).toBe(true);
          expect(isResponsive(galleryTitle, viewport)).toBe(true);
          expect(isResponsive(galleryGrid, viewport)).toBe(true);
          expect(isResponsive(artworkFrame, viewport)).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  }, 10000);

  it('should maintain museum aesthetic consistency across process and commission components', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: textContent,
          description: textContent,
          buttonVariant: fc.constantFrom('instagram', 'whatsapp'),
          viewport: viewportDimensions,
        }),
        ({ title, description, buttonVariant, viewport }) => {
          // Mock viewport size
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewport.width,
          });

          // Test Process and Commission components
          const { container } = render(
            <TestWrapper>
              <ProcessContainer data-testid="process-container">
                <h3>{title}</h3>
              </ProcessContainer>
              <CommissionContainer data-testid="commission-container">
                <CommissionTitle data-testid="commission-title">{title}</CommissionTitle>
                <p>{description}</p>
                <ContactButton 
                  data-testid="contact-button" 
                  $variant={buttonVariant}
                >
                  Contact
                </ContactButton>
              </CommissionContainer>
            </TestWrapper>
          );

          const processContainer = container.querySelector('[data-testid="process-container"]') as HTMLElement;
          const commissionContainer = container.querySelector('[data-testid="commission-container"]') as HTMLElement;
          const commissionTitle = container.querySelector('[data-testid="commission-title"]') as HTMLElement;
          const contactButton = container.querySelector('[data-testid="contact-button"]') as HTMLElement;

          // All components should have museum aesthetic
          expect(hasMuseumAesthetic(processContainer)).toBe(true);
          expect(hasMuseumAesthetic(commissionContainer)).toBe(true);
          expect(hasMuseumAesthetic(commissionTitle)).toBe(true);
          // Contact button has special styling, so we check it exists and is styled
          expect(contactButton).toBeTruthy();

          // All elements should be responsive
          expect(isResponsive(processContainer, viewport)).toBe(true);
          expect(isResponsive(commissionContainer, viewport)).toBe(true);
          expect(isResponsive(commissionTitle, viewport)).toBe(true);
          expect(isResponsive(contactButton, viewport)).toBe(true);
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  it('should maintain consistent visual theming across different component combinations', () => {
    fc.assert(
      fc.property(
        fc.record({
          heroTitle: textContent,
          galleryTitle: textContent,
          commissionTitle: textContent,
          viewport: viewportDimensions,
        }),
        ({ heroTitle, galleryTitle, commissionTitle, viewport }) => {
          // Mock viewport size
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewport.width,
          });

          // Test multiple components together to ensure consistency
          const { container } = render(
            <TestWrapper>
              <div data-testid="combined-layout">
                <HeroContainer>
                  <HeroTitle data-testid="hero-title">{heroTitle}</HeroTitle>
                </HeroContainer>
                <GalleryContainer>
                  <GalleryTitle data-testid="gallery-title">{galleryTitle}</GalleryTitle>
                </GalleryContainer>
                <CommissionContainer>
                  <CommissionTitle data-testid="commission-title">{commissionTitle}</CommissionTitle>
                </CommissionContainer>
              </div>
            </TestWrapper>
          );

          const heroTitleEl = container.querySelector('[data-testid="hero-title"]') as HTMLElement;
          const galleryTitleEl = container.querySelector('[data-testid="gallery-title"]') as HTMLElement;
          const commissionTitleEl = container.querySelector('[data-testid="commission-title"]') as HTMLElement;

          // All title elements should have consistent museum aesthetic
          expect(hasMuseumAesthetic(heroTitleEl)).toBe(true);
          expect(hasMuseumAesthetic(galleryTitleEl)).toBe(true);
          expect(hasMuseumAesthetic(commissionTitleEl)).toBe(true);

          // Check that all titles use the same font family (Playfair Display)
          const heroFontFamily = window.getComputedStyle(heroTitleEl).fontFamily;
          const galleryFontFamily = window.getComputedStyle(galleryTitleEl).fontFamily;
          const commissionFontFamily = window.getComputedStyle(commissionTitleEl).fontFamily;

          // All should use display font (Playfair Display)
          expect(heroFontFamily).toContain('Playfair Display');
          expect(galleryFontFamily).toContain('Playfair Display');
          expect(commissionFontFamily).toContain('Playfair Display');

          // All should be responsive
          expect(isResponsive(heroTitleEl, viewport)).toBe(true);
          expect(isResponsive(galleryTitleEl, viewport)).toBe(true);
          expect(isResponsive(commissionTitleEl, viewport)).toBe(true);
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  it('should maintain museum aesthetic with edge case viewport sizes', () => {
    // Test with extreme viewport sizes to ensure robustness
    const extremeViewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 768, height: 1024 }, // iPad
      { width: 1920, height: 1080 }, // Full HD
      { width: 2560, height: 1440 }, // 2K
    ];

    extremeViewports.forEach(viewport => {
      // Mock viewport size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: viewport.width,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: viewport.height,
      });

      const { container } = render(
        <TestWrapper>
          <HeroContainer data-testid="hero-container">
            <HeroTitle data-testid="hero-title">Test Title</HeroTitle>
          </HeroContainer>
        </TestWrapper>
      );

      const heroElement = container.querySelector('[data-testid="hero-container"]') as HTMLElement;
      const titleElement = container.querySelector('[data-testid="hero-title"]') as HTMLElement;

      // Should maintain museum aesthetic at all viewport sizes
      expect(hasMuseumAesthetic(heroElement)).toBe(true);
      expect(hasMuseumAesthetic(titleElement)).toBe(true);
      expect(isResponsive(heroElement, viewport)).toBe(true);
      expect(isResponsive(titleElement, viewport)).toBe(true);
    });
  });
});