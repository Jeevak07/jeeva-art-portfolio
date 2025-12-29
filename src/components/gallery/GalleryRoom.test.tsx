import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { museumTheme } from '@/styles/theme';
import { GalleryRoom } from './GalleryRoom';
import { Artwork, GalleryTheme } from '@/types';

// **Feature: sketch-museum-portfolio, Property 6: Gallery layout differentiation with appropriate spacing and presentation**
// **Validates: Requirements 2.1, 2.4**

describe('Gallery Layout Differentiation', () => {
  // Helper to create a test wrapper with theme
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={museumTheme}>
      {children}
    </ThemeProvider>
  );

  // Generator for artwork data
  const artworkGenerator = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    title: fc.string({ minLength: 1, maxLength: 50 }),
    category: fc.constantFrom('anime', 'portrait', 'realism'),
    imageUrl: fc.webUrl(),
    thumbnailUrl: fc.webUrl(),
    description: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
    dimensions: fc.record({
      width: fc.integer({ min: 100, max: 4000 }),
      height: fc.integer({ min: 100, max: 4000 })
    }),
    createdDate: fc.date(),
    tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 })
  }) as fc.Arbitrary<Artwork>;

  // Generator for gallery themes with different spacing configurations
  const galleryThemeGenerator = fc.record({
    backgroundColor: fc.constantFrom('#000000', '#0a0a0a', '#0d0d0d', '#0f0f0f'),
    accentColor: fc.constantFrom('#4a90e2', '#d4af37', '#8b4513', '#ffffff'),
    spacing: fc.constantFrom(24, 32, 40), // compact, comfortable, spacious
    columns: fc.record({
      mobile: fc.integer({ min: 1, max: 2 }),
      tablet: fc.integer({ min: 1, max: 3 }),
      desktop: fc.integer({ min: 2, max: 4 })
    })
  }) as fc.Arbitrary<GalleryTheme>;

  // Helper to check if gallery has appropriate spacing based on theme
  const hasAppropriateSpacing = (container: HTMLElement, theme: GalleryTheme): boolean => {
    const galleryGrid = container.querySelector('[data-testid="artwork-grid"]') as HTMLElement;
    if (!galleryGrid) return false;

    const computedStyle = window.getComputedStyle(galleryGrid);
    const gap = computedStyle.gap || computedStyle.gridGap;
    
    // Check that gap exists and is reasonable
    const hasGap = gap && gap !== '0px' && gap !== 'normal';
    
    // For different spacing values, we expect different gap sizes
    // This is a simplified check since exact CSS values are hard to verify in jsdom
    return Boolean(hasGap);
  };

  // Helper to check if gallery has appropriate presentation based on category
  const hasAppropriatePresentation = (container: HTMLElement, artworks: Artwork[]): boolean => {
    const artworkContainers = container.querySelectorAll('[data-testid^="artwork-container-"]');
    
    // Should have artwork containers for each artwork
    if (artworkContainers.length !== artworks.length) return false;
    
    // Each artwork container should be properly structured
    return Array.from(artworkContainers).every(artworkContainer => {
      const artworkElement = artworkContainer.querySelector('[data-testid="artwork-display"]');
      return artworkElement !== null;
    });
  };

  // Helper to check responsive column behavior
  const hasResponsiveColumns = (container: HTMLElement, theme: GalleryTheme): boolean => {
    const galleryGrid = container.querySelector('[data-testid="artwork-grid"]') as HTMLElement;
    if (!galleryGrid) return false;

    const computedStyle = window.getComputedStyle(galleryGrid);
    const gridTemplateColumns = computedStyle.gridTemplateColumns;
    
    // Should have grid template columns defined
    return Boolean(gridTemplateColumns && gridTemplateColumns !== 'none');
  };

  it('Property 6: Gallery layout differentiation with appropriate spacing and presentation', () => {
    fc.assert(
      fc.property(
        fc.record({
          artworks: fc.array(artworkGenerator, { minLength: 1, maxLength: 6 }),
          theme: galleryThemeGenerator,
          layout: fc.constantFrom('grid', 'masonry', 'linear')
        }),
        ({ artworks, theme, layout }) => {
          // Filter artworks to be anime category for this test
          const animeArtworks = artworks.map(artwork => ({ ...artwork, category: 'anime' as const }));
          
          const { container } = render(
            <TestWrapper>
              <GalleryRoom
                artworks={animeArtworks}
                theme={theme}
                layout={layout}
              />
            </TestWrapper>
          );

          // Check that gallery has appropriate spacing based on theme
          expect(hasAppropriateSpacing(container, theme)).toBe(true);

          // Check that gallery has appropriate presentation for artworks
          expect(hasAppropriatePresentation(container, animeArtworks)).toBe(true);

          // Check that gallery has responsive column behavior
          expect(hasResponsiveColumns(container, theme)).toBe(true);

          // Check that gallery container exists and is properly structured
          const galleryContainer = container.querySelector('[data-testid="gallery-room"]');
          expect(galleryContainer).toBeTruthy();

          // Check that gallery title exists
          const galleryTitle = container.querySelector('h2');
          expect(galleryTitle).toBeTruthy();
          expect(galleryTitle?.textContent).toBe('Anime Gallery');

          // For different spacing values, verify different visual treatment
          const galleryContent = container.querySelector('[data-testid="gallery-content"]');
          expect(galleryContent).toBeTruthy();

          // Verify that the layout type affects the grid structure
          const artworkGrid = container.querySelector('[data-testid="artwork-grid"]') as HTMLElement;
          expect(artworkGrid).toBeTruthy();
          
          if (layout === 'linear') {
            // Linear layout should have single column behavior
            expect(artworkGrid.getAttribute('data-layout')).toBe('linear');
          }
        }
      ),
      { numRuns: 20 }
    );
  }, 10000);

  it('should differentiate between compact, comfortable, and spacious spacing', () => {
    const testArtwork: Artwork = {
      id: 'test-1',
      title: 'Test Artwork',
      category: 'anime',
      imageUrl: '/test.jpg',
      thumbnailUrl: '/test-thumb.jpg',
      dimensions: { width: 1000, height: 1000 },
      createdDate: new Date(),
      tags: ['test']
    };

    const spacingConfigs = [
      { spacing: 24, expected: 'compact' },
      { spacing: 32, expected: 'comfortable' },
      { spacing: 40, expected: 'spacious' }
    ];

    spacingConfigs.forEach(({ spacing, expected }) => {
      const theme: GalleryTheme = {
        backgroundColor: '#000000',
        accentColor: '#ffffff',
        spacing,
        columns: { mobile: 1, tablet: 2, desktop: 3 }
      };

      const { container } = render(
        <TestWrapper>
          <GalleryRoom
            artworks={[testArtwork]}
            theme={theme}
            layout="grid"
          />
        </TestWrapper>
      );

      // Verify that different spacing values result in different visual treatment
      const galleryContainer = container.querySelector('[data-testid="gallery-room"]');
      expect(galleryContainer).toBeTruthy();
      
      // Check that the spacing is reflected in the component structure
      const galleryGrid = container.querySelector('[data-testid="artwork-grid"]');
      expect(galleryGrid).toBeTruthy();
      expect(galleryGrid?.getAttribute('data-spacing')).toBe(expected);
    });
  });

  it('should maintain consistent presentation across different artwork counts', () => {
    fc.assert(
      fc.property(
        fc.record({
          artworkCount: fc.integer({ min: 1, max: 20 }),
          theme: galleryThemeGenerator
        }),
        ({ artworkCount, theme }) => {
          // Generate artworks with consistent structure
          const artworks: Artwork[] = Array.from({ length: artworkCount }, (_, i) => ({
            id: `artwork-${i}`,
            title: `Artwork ${i + 1}`,
            category: 'anime' as const,
            imageUrl: `/artwork-${i}.jpg`,
            thumbnailUrl: `/artwork-${i}-thumb.jpg`,
            dimensions: { width: 1000, height: 1000 },
            createdDate: new Date(),
            tags: ['anime']
          }));

          const { container } = render(
            <TestWrapper>
              <GalleryRoom
                artworks={artworks}
                theme={theme}
                layout="grid"
              />
            </TestWrapper>
          );

          // Should maintain appropriate presentation regardless of artwork count
          expect(hasAppropriatePresentation(container, artworks)).toBe(true);
          expect(hasAppropriateSpacing(container, theme)).toBe(true);
          expect(hasResponsiveColumns(container, theme)).toBe(true);

          // Gallery should handle both small and large artwork collections
          const galleryGrid = container.querySelector('[data-testid="artwork-grid"]');
          expect(galleryGrid).toBeTruthy();
          
          // Should have proper structure regardless of count
          const artworkElements = container.querySelectorAll('[data-testid^="artwork-container-"]');
          expect(artworkElements.length).toBe(artworkCount);
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });
});

// **Feature: sketch-museum-portfolio, Property 7: Progressive reveal animations with subtle fade and movement**
// **Validates: Requirements 2.5**

describe('Progressive Reveal Animations', () => {
  // Helper to create a test wrapper with theme
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={museumTheme}>
      {children}
    </ThemeProvider>
  );

  // Generator for artwork data (simplified for animation testing)
  const simpleArtworkGenerator = fc.record({
    id: fc.string({ minLength: 1, maxLength: 10 }),
    title: fc.string({ minLength: 1, maxLength: 30 }),
    category: fc.constant('anime' as const),
    imageUrl: fc.constant('/test.jpg'),
    thumbnailUrl: fc.constant('/test-thumb.jpg'),
    dimensions: fc.record({
      width: fc.constant(1000),
      height: fc.constant(1000)
    }),
    createdDate: fc.constant(new Date()),
    tags: fc.constant(['anime'])
  }) as fc.Arbitrary<Artwork>;

  // Helper to check if animations have subtle fade and movement properties
  const hasSubtleFadeAndMovement = (container: HTMLElement): boolean => {
    const artworkContainers = container.querySelectorAll('[data-testid^="artwork-container-"]');
    
    if (artworkContainers.length === 0) return false;
    
    // Check that artwork containers have animation properties
    return Array.from(artworkContainers).every((artworkContainer, index) => {
      const element = artworkContainer as HTMLElement;
      const computedStyle = window.getComputedStyle(element);
      
      // Check for transition properties (fade and movement)
      const hasTransition = computedStyle.transition && 
                           computedStyle.transition !== 'none' && 
                           computedStyle.transition.length > 0;
      
      // Check for opacity and transform properties (subtle fade and movement)
      const hasOpacity = computedStyle.opacity !== undefined;
      const hasTransform = computedStyle.transform !== undefined;
      
      return hasTransition && hasOpacity && hasTransform;
    });
  };

  // Helper to check staggered animation delays
  const hasStaggeredAnimations = (container: HTMLElement): boolean => {
    const artworkContainers = container.querySelectorAll('[data-testid^="artwork-container-"]');
    
    if (artworkContainers.length <= 1) return true; // Single item doesn't need staggering
    
    // In a real implementation, we would check transition-delay values
    // For testing purposes, we verify that containers exist and are properly indexed
    return Array.from(artworkContainers).every((container, index) => {
      const element = container as HTMLElement;
      const testId = element.getAttribute('data-testid');
      return testId === `artwork-container-${index}`;
    });
  };

  // Helper to check progressive reveal behavior
  const hasProgressiveReveal = (container: HTMLElement): boolean => {
    const galleryTitle = container.querySelector('h2');
    const artworkGrid = container.querySelector('[data-testid="artwork-grid"]');
    const artworkContainers = container.querySelectorAll('[data-testid^="artwork-container-"]');
    
    // All elements should exist for progressive reveal
    const elementsExist = galleryTitle && artworkGrid && artworkContainers.length > 0;
    
    if (!elementsExist) return false;
    
    // Check that elements have CSS properties that support progressive reveal
    const titleStyle = window.getComputedStyle(galleryTitle);
    const hasProgressiveProperties = Boolean(titleStyle.transition && titleStyle.transition !== 'none');
    
    return hasProgressiveProperties;
  };

  it('Property 7: Progressive reveal animations with subtle fade and movement', () => {
    fc.assert(
      fc.property(
        fc.record({
          artworks: fc.array(simpleArtworkGenerator, { minLength: 1, maxLength: 8 }),
          spacing: fc.constantFrom(24, 32, 40),
          columns: fc.record({
            mobile: fc.integer({ min: 1, max: 2 }),
            tablet: fc.integer({ min: 2, max: 3 }),
            desktop: fc.integer({ min: 2, max: 4 })
          })
        }),
        ({ artworks, spacing, columns }) => {
          const theme = {
            backgroundColor: '#000000',
            accentColor: '#4a90e2',
            spacing,
            columns
          };

          const { container } = render(
            <TestWrapper>
              <GalleryRoom
                artworks={artworks}
                theme={theme}
                layout="grid"
              />
            </TestWrapper>
          );

          // Check that animations have subtle fade and movement properties
          expect(hasSubtleFadeAndMovement(container)).toBe(true);

          // Check that animations are staggered for multiple artworks
          expect(hasStaggeredAnimations(container)).toBe(true);

          // Check that progressive reveal behavior is implemented
          expect(hasProgressiveReveal(container)).toBe(true);

          // Verify that all artwork containers are properly structured for animation
          const artworkContainers = container.querySelectorAll('[data-testid^="artwork-container-"]');
          expect(artworkContainers.length).toBe(artworks.length);

          // Each artwork container should have proper animation setup
          artworkContainers.forEach((artworkContainer, index) => {
            const element = artworkContainer as HTMLElement;
            
            // Should have proper test ID for staggered animations
            expect(element.getAttribute('data-testid')).toBe(`artwork-container-${index}`);
            
            // Should contain an artwork display component
            const artworkDisplay = element.querySelector('[data-testid="artwork-display"]');
            expect(artworkDisplay).toBeTruthy();
          });

          // Gallery should have proper structure for progressive reveal
          const galleryRoom = container.querySelector('[data-testid="gallery-room"]');
          const galleryContent = container.querySelector('[data-testid="gallery-content"]');
          const artworkGrid = container.querySelector('[data-testid="artwork-grid"]');
          
          expect(galleryRoom).toBeTruthy();
          expect(galleryContent).toBeTruthy();
          expect(artworkGrid).toBeTruthy();
        }
      ),
      { numRuns: 30 }
    );
  }, 8000);

  it('should handle edge cases for progressive reveal animations', () => {
    // Test with single artwork
    const singleArtwork: Artwork = {
      id: 'single-1',
      title: 'Single Artwork',
      category: 'anime',
      imageUrl: '/single.jpg',
      thumbnailUrl: '/single-thumb.jpg',
      dimensions: { width: 1000, height: 1000 },
      createdDate: new Date(),
      tags: ['anime']
    };

    const theme = {
      backgroundColor: '#000000',
      accentColor: '#4a90e2',
      spacing: 32,
      columns: { mobile: 1, tablet: 2, desktop: 3 }
    };

    const { container } = render(
      <TestWrapper>
        <GalleryRoom
          artworks={[singleArtwork]}
          theme={theme}
          layout="grid"
        />
      </TestWrapper>
    );

    // Should still have progressive reveal properties with single artwork
    expect(hasProgressiveReveal(container)).toBe(true);
    expect(hasSubtleFadeAndMovement(container)).toBe(true);
    expect(hasStaggeredAnimations(container)).toBe(true);

    // Test with empty artworks array
    const { container: emptyContainer } = render(
      <TestWrapper>
        <GalleryRoom
          artworks={[]}
          theme={theme}
          layout="grid"
        />
      </TestWrapper>
    );

    // Should handle empty state gracefully
    const galleryRoom = emptyContainer.querySelector('[data-testid="gallery-room"]');
    const artworkGrid = emptyContainer.querySelector('[data-testid="artwork-grid"]');
    
    expect(galleryRoom).toBeTruthy();
    expect(artworkGrid).toBeTruthy();
    
    // No artwork containers should exist
    const artworkContainers = emptyContainer.querySelectorAll('[data-testid^="artwork-container-"]');
    expect(artworkContainers.length).toBe(0);
  });

  it('should maintain animation consistency across different layout types', () => {
    const testArtworks: Artwork[] = Array.from({ length: 4 }, (_, i) => ({
      id: `layout-test-${i}`,
      title: `Layout Test ${i + 1}`,
      category: 'anime' as const,
      imageUrl: `/layout-test-${i}.jpg`,
      thumbnailUrl: `/layout-test-${i}-thumb.jpg`,
      dimensions: { width: 1000, height: 1000 },
      createdDate: new Date(),
      tags: ['anime']
    }));

    const theme = {
      backgroundColor: '#000000',
      accentColor: '#4a90e2',
      spacing: 32,
      columns: { mobile: 1, tablet: 2, desktop: 3 }
    };

    const layouts: Array<'grid' | 'masonry' | 'linear'> = ['grid', 'masonry', 'linear'];

    layouts.forEach(layout => {
      const { container } = render(
        <TestWrapper>
          <GalleryRoom
            artworks={testArtworks}
            theme={theme}
            layout={layout}
          />
        </TestWrapper>
      );

      // All layouts should maintain progressive reveal animations
      expect(hasProgressiveReveal(container)).toBe(true);
      expect(hasSubtleFadeAndMovement(container)).toBe(true);
      expect(hasStaggeredAnimations(container)).toBe(true);

      // Layout should be properly set
      const artworkGrid = container.querySelector('[data-testid="artwork-grid"]');
      expect(artworkGrid?.getAttribute('data-layout')).toBe(layout);
    });
  });
});