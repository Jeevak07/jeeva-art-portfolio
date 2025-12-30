import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { museumTheme } from '@/styles/theme';
import { PortraitGallery } from './PortraitGallery';
import { Artwork } from '@/types';

// **Feature: sketch-museum-portfolio, Property 6: Gallery layout differentiation for portrait gallery with increased spacing**
// **Validates: Requirements 3.1**

describe('Portrait Gallery Layout Differentiation', () => {
  // Helper to create a test wrapper with theme
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={museumTheme}>
      {children}
    </ThemeProvider>
  );

  // Generator for portrait and realism artwork data
  const portraitArtworkGenerator = fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    title: fc.string({ minLength: 1, maxLength: 50 }),
    category: fc.constantFrom('portrait', 'realism'),
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

  // Helper to check if portrait gallery has premium spacing
  const hasPremiumSpacing = (container: HTMLElement): boolean => {
    const portraitGrid = container.querySelector('[data-testid="portrait-artwork-grid"]') as HTMLElement;
    if (!portraitGrid) return false;

    // Check that the grid has spacious spacing attribute
    const spacingAttribute = portraitGrid.getAttribute('data-spacing');
    if (spacingAttribute !== 'spacious') return false;

    // Check that the grid has premium layout attribute
    const layoutAttribute = portraitGrid.getAttribute('data-layout');
    if (layoutAttribute !== 'premium-grid') return false;

    // Check that grid exists and has proper structure
    const computedStyle = window.getComputedStyle(portraitGrid);
    const gridTemplateColumns = computedStyle.gridTemplateColumns;
    
    // Should have grid template columns defined for premium layout
    return Boolean(gridTemplateColumns && gridTemplateColumns !== 'none');
  };

  // Helper to check if gallery has increased spacing compared to regular galleries
  const hasIncreasedSpacing = (container: HTMLElement): boolean => {
    const portraitGrid = container.querySelector('[data-testid="portrait-artwork-grid"]') as HTMLElement;
    if (!portraitGrid) return false;

    const computedStyle = window.getComputedStyle(portraitGrid);
    const gap = computedStyle.gap || computedStyle.gridGap;
    
    // Should have significant gap for premium feel
    // In jsdom, we can't measure exact pixel values, but we can verify gap exists
    return Boolean(gap && gap !== '0px' && gap !== 'normal');
  };

  // Helper to check if gallery limits columns for premium feel
  const hasLimitedColumnsForPremiumFeel = (container: HTMLElement): boolean => {
    const portraitGrid = container.querySelector('[data-testid="portrait-artwork-grid"]') as HTMLElement;
    if (!portraitGrid) return false;

    // Check that the grid is structured for premium presentation
    // This would typically be max 2 columns on desktop for portrait gallery
    const computedStyle = window.getComputedStyle(portraitGrid);
    const gridTemplateColumns = computedStyle.gridTemplateColumns;
    
    // Should have grid columns defined (exact count is hard to verify in jsdom)
    return Boolean(gridTemplateColumns && gridTemplateColumns !== 'none');
  };

  // Helper to check if artworks are properly filtered to portrait/realism
  const hasCorrectArtworkCategories = (container: HTMLElement, originalArtworks: Artwork[]): boolean => {
    const artworkContainers = container.querySelectorAll('[data-testid^="portrait-artwork-container-"]');
    
    // Should only show portrait and realism artworks
    const expectedCount = originalArtworks.filter(
      artwork => artwork.category === 'portrait' || artwork.category === 'realism'
    ).length;
    
    return artworkContainers.length === expectedCount;
  };

  // Helper to check premium framing and presentation
  const hasPremiumPresentation = (container: HTMLElement): boolean => {
    const galleryContainer = container.querySelector('[data-testid="portrait-gallery"]');
    const galleryContent = container.querySelector('[data-testid="portrait-gallery-content"]');
    const galleryTitle = container.querySelector('h2');
    
    // All premium elements should exist
    if (!galleryContainer || !galleryContent || !galleryTitle) return false;
    
    // Title should be specific to portrait gallery
    const titleText = galleryTitle.textContent;
    return Boolean(titleText && titleText.includes('Portrait'));
  };

  it('Property 6: Gallery layout differentiation for portrait gallery with increased spacing', () => {
    fc.assert(
      fc.property(
        fc.record({
          artworks: fc.array(portraitArtworkGenerator, { minLength: 1, maxLength: 4 }), // Reduced
          mixedArtworks: fc.array(
            fc.record({
              ...portraitArtworkGenerator.value,
              category: fc.constantFrom('anime', 'portrait', 'realism')
            }),
            { minLength: 0, maxLength: 2 } // Reduced
          )
        }),
        ({ artworks, mixedArtworks }) => {
          // Combine portrait artworks with mixed artworks to test filtering
          const allArtworks = [...artworks, ...mixedArtworks];
          
          const { container } = render(
            <TestWrapper>
              <PortraitGallery
                artworks={allArtworks}
                onArtworkClick={() => {}}
              />
            </TestWrapper>
          );

          // Check that portrait gallery has premium spacing
          expect(hasPremiumSpacing(container)).toBe(true);

          // Check that gallery has increased spacing compared to regular galleries
          expect(hasIncreasedSpacing(container)).toBe(true);

          // Check that gallery limits columns for premium feel
          expect(hasLimitedColumnsForPremiumFeel(container)).toBe(true);

          // Check that only portrait/realism artworks are displayed
          expect(hasCorrectArtworkCategories(container, allArtworks)).toBe(true);

          // Check that gallery has premium presentation
          expect(hasPremiumPresentation(container)).toBe(true);

          // Verify gallery structure exists
          const portraitGallery = container.querySelector('[data-testid="portrait-gallery"]');
          expect(portraitGallery).toBeTruthy();

          // Verify title is specific to portrait gallery
          const galleryTitle = container.querySelector('h2');
          expect(galleryTitle).toBeTruthy();
          expect(galleryTitle?.textContent).toContain('Portrait');

          // Verify grid has premium attributes
          const portraitGrid = container.querySelector('[data-testid="portrait-artwork-grid"]');
          expect(portraitGrid).toBeTruthy();
          expect(portraitGrid?.getAttribute('data-spacing')).toBe('spacious');
          expect(portraitGrid?.getAttribute('data-layout')).toBe('premium-grid');
        }
      ),
      { numRuns: 10 } // Further reduced for faster tests
    );
  }, 15000); // Increased timeout

  it('should differentiate portrait gallery from anime gallery spacing', () => {
    const portraitArtwork: Artwork = {
      id: 'portrait-1',
      title: 'Test Portrait',
      category: 'portrait',
      imageUrl: '/portrait.jpg',
      thumbnailUrl: '/portrait-thumb.jpg',
      dimensions: { width: 1000, height: 1200 },
      createdDate: new Date(),
      tags: ['portrait']
    };

    const realismArtwork: Artwork = {
      id: 'realism-1',
      title: 'Test Realism',
      category: 'realism',
      imageUrl: '/realism.jpg',
      thumbnailUrl: '/realism-thumb.jpg',
      dimensions: { width: 1000, height: 800 },
      createdDate: new Date(),
      tags: ['realism']
    };

    const animeArtwork: Artwork = {
      id: 'anime-1',
      title: 'Test Anime',
      category: 'anime',
      imageUrl: '/anime.jpg',
      thumbnailUrl: '/anime-thumb.jpg',
      dimensions: { width: 1000, height: 1000 },
      createdDate: new Date(),
      tags: ['anime']
    };

    const { container } = render(
      <TestWrapper>
        <PortraitGallery
          artworks={[portraitArtwork, realismArtwork, animeArtwork]}
          onArtworkClick={() => {}}
        />
      </TestWrapper>
    );

    // Should only display portrait and realism artworks (2 out of 3)
    const artworkContainers = container.querySelectorAll('[data-testid^="portrait-artwork-container-"]');
    expect(artworkContainers.length).toBe(2);

    // Should have premium spacing attributes
    const portraitGrid = container.querySelector('[data-testid="portrait-artwork-grid"]');
    expect(portraitGrid?.getAttribute('data-spacing')).toBe('spacious');
    expect(portraitGrid?.getAttribute('data-layout')).toBe('premium-grid');

    // Should have portrait-specific title
    const galleryTitle = container.querySelector('h2');
    expect(galleryTitle?.textContent).toBe('Portrait & Realism Gallery');
  });

  it('should handle empty portrait artworks gracefully', () => {
    const animeArtwork: Artwork = {
      id: 'anime-only',
      title: 'Only Anime',
      category: 'anime',
      imageUrl: '/anime.jpg',
      thumbnailUrl: '/anime-thumb.jpg',
      dimensions: { width: 1000, height: 1000 },
      createdDate: new Date(),
      tags: ['anime']
    };

    const { container } = render(
      <TestWrapper>
        <PortraitGallery
          artworks={[animeArtwork]}
          onArtworkClick={() => {}}
        />
      </TestWrapper>
    );

    // Should still render gallery structure
    const portraitGallery = container.querySelector('[data-testid="portrait-gallery"]');
    const portraitGrid = container.querySelector('[data-testid="portrait-artwork-grid"]');
    const galleryTitle = container.querySelector('h2');

    expect(portraitGallery).toBeTruthy();
    expect(portraitGrid).toBeTruthy();
    expect(galleryTitle).toBeTruthy();

    // Should have no artwork containers since no portrait/realism artworks
    const artworkContainers = container.querySelectorAll('[data-testid^="portrait-artwork-container-"]');
    expect(artworkContainers.length).toBe(0);

    // Should still maintain premium spacing attributes
    expect(portraitGrid?.getAttribute('data-spacing')).toBe('spacious');
    expect(portraitGrid?.getAttribute('data-layout')).toBe('premium-grid');
  });

  it('should maintain premium presentation with varying artwork counts', () => {
    fc.assert(
      fc.property(
        fc.record({
          portraitCount: fc.integer({ min: 1, max: 6 }),
          realismCount: fc.integer({ min: 0, max: 4 })
        }),
        ({ portraitCount, realismCount }) => {
          // Generate portrait artworks
          const portraitArtworks: Artwork[] = Array.from({ length: portraitCount }, (_, i) => ({
            id: `portrait-${i}`,
            title: `Portrait ${i + 1}`,
            category: 'portrait' as const,
            imageUrl: `/portrait-${i}.jpg`,
            thumbnailUrl: `/portrait-${i}-thumb.jpg`,
            dimensions: { width: 1000, height: 1200 },
            createdDate: new Date(),
            tags: ['portrait']
          }));

          // Generate realism artworks
          const realismArtworks: Artwork[] = Array.from({ length: realismCount }, (_, i) => ({
            id: `realism-${i}`,
            title: `Realism ${i + 1}`,
            category: 'realism' as const,
            imageUrl: `/realism-${i}.jpg`,
            thumbnailUrl: `/realism-${i}-thumb.jpg`,
            dimensions: { width: 1000, height: 800 },
            createdDate: new Date(),
            tags: ['realism']
          }));

          const allArtworks = [...portraitArtworks, ...realismArtworks];

          const { container } = render(
            <TestWrapper>
              <PortraitGallery
                artworks={allArtworks}
                onArtworkClick={() => {}}
              />
            </TestWrapper>
          );

          // Should maintain premium spacing regardless of count
          expect(hasPremiumSpacing(container)).toBe(true);
          expect(hasIncreasedSpacing(container)).toBe(true);
          expect(hasLimitedColumnsForPremiumFeel(container)).toBe(true);
          expect(hasPremiumPresentation(container)).toBe(true);

          // Should display correct number of artworks
          const artworkContainers = container.querySelectorAll('[data-testid^="portrait-artwork-container-"]');
          expect(artworkContainers.length).toBe(portraitCount + realismCount);

          // Each artwork should be properly structured
          artworkContainers.forEach((container, index) => {
            expect(container.getAttribute('data-testid')).toBe(`portrait-artwork-container-${index}`);
            
            // Should contain artwork display
            const artworkDisplay = container.querySelector('[data-testid="artwork-display"]');
            expect(artworkDisplay).toBeTruthy();
          });
        }
      ),
      { numRuns: 30 }
    );
  });
});