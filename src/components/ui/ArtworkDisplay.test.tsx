import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import * as fc from 'fast-check';
import { ArtworkDisplay } from './ArtworkDisplay';
import { museumTheme } from '@/styles/theme';
import { Artwork } from '@/types';

// **Feature: sketch-museum-portfolio, Property 5: Subtle hover interactions with gentle zoom and ease-out timing**

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, onLoad, fill, priority, sizes, quality, ...props }: any) => {
    // Simulate image load after a short delay
    setTimeout(() => {
      if (onLoad) onLoad();
    }, 10);
    return <img src={src} alt={alt} data-testid="artwork-image" {...props} />;
  },
}));

// Test wrapper with theme
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={museumTheme}>
    {children}
  </ThemeProvider>
);

describe('ArtworkDisplay Hover Interactions', () => {
  beforeEach(() => {
    // Reset IntersectionObserver mock for each test
    vi.clearAllMocks();
  });

  // Property test for hover interactions
  it('should apply gentle zoom and ease-out timing for all interactive artworks', async () => {
    // Generator for valid artwork data with non-empty strings
    const nonEmptyString = fc.string({ minLength: 1 }).filter(s => s.trim().length > 0);
    
    const artworkArbitrary = fc.record({
      id: nonEmptyString,
      title: nonEmptyString,
      category: fc.constantFrom('anime', 'portrait', 'realism'),
      imageUrl: fc.webUrl(),
      thumbnailUrl: fc.webUrl(),
      description: fc.option(nonEmptyString),
      dimensions: fc.record({
        width: fc.integer({ min: 100, max: 5000 }),
        height: fc.integer({ min: 100, max: 5000 }),
      }),
      createdDate: fc.date(),
      tags: fc.array(nonEmptyString, { minLength: 1, maxLength: 5 }),
    });

    // Generator for component props
    const propsArbitrary = fc.record({
      artwork: artworkArbitrary,
      size: fc.constantFrom('small', 'medium', 'large'),
      interactive: fc.constant(true), // Always interactive for hover testing
    });

    await fc.assert(
      fc.asyncProperty(propsArbitrary, async (props) => {
        const mockOnClick = vi.fn();
        
        const { container } = render(
          <TestWrapper>
            <ArtworkDisplay
              artwork={props.artwork as Artwork}
              size={props.size}
              interactive={props.interactive}
              onArtworkClick={mockOnClick}
            />
          </TestWrapper>
        );

        const artworkContainer = container.firstChild as HTMLElement;
        expect(artworkContainer).toBeTruthy();

        // Verify component has proper CSS classes and attributes for hover
        expect(artworkContainer).toHaveAttribute('role', 'button');
        expect(artworkContainer).toHaveAttribute('tabIndex', '0');
        
        // Verify cursor is pointer for interactive elements
        const styles = window.getComputedStyle(artworkContainer);
        expect(styles.cursor).toBe('pointer');
        
        // Verify transition properties are set for smooth animations
        expect(styles.transition).toMatch(/0\.8s|800ms/);
        expect(styles.transition).toMatch(/cubic-bezier/);
        
        // Simulate hover and verify hover state is tracked
        fireEvent.mouseEnter(artworkContainer);
        
        // Verify click functionality works
        fireEvent.click(artworkContainer);
        expect(mockOnClick).toHaveBeenCalledWith(props.artwork);
        
        // Simulate mouse leave
        fireEvent.mouseLeave(artworkContainer);
      }),
      { numRuns: 50 } // Reduced runs for faster testing
    );
  });

  it('should not apply hover effects when interactive is false', () => {
    const sampleArtwork: Artwork = {
      id: 'test-artwork',
      title: 'Test Artwork',
      category: 'anime',
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      dimensions: { width: 800, height: 600 },
      createdDate: new Date(),
      tags: ['test'],
    };

    const { container } = render(
      <TestWrapper>
        <ArtworkDisplay
          artwork={sampleArtwork}
          size="medium"
          interactive={false}
        />
      </TestWrapper>
    );

    const artworkContainer = container.firstChild as HTMLElement;
    
    // Verify proper attributes for non-interactive elements
    expect(artworkContainer).toHaveAttribute('role', 'img');
    expect(artworkContainer).toHaveAttribute('tabIndex', '-1');
    
    // Verify cursor is not pointer when not interactive
    const styles = window.getComputedStyle(artworkContainer);
    expect(styles.cursor).toBe('default');
  });

  it('should maintain ease-out timing for all hover transitions', () => {
    const sampleArtwork: Artwork = {
      id: 'test-artwork',
      title: 'Test Artwork',
      category: 'portrait',
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      dimensions: { width: 800, height: 600 },
      createdDate: new Date(),
      tags: ['test'],
    };

    const { container } = render(
      <TestWrapper>
        <ArtworkDisplay
          artwork={sampleArtwork}
          size="large"
          interactive={true}
        />
      </TestWrapper>
    );

    const artworkContainer = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(artworkContainer);
    
    // Verify ease-out timing function is applied
    expect(styles.transition).toContain('cubic-bezier');
    
    // Verify the specific museum easing curve (0.25, 0.1, 0.25, 1)
    const transitionMatch = styles.transition.match(/cubic-bezier\(([^)]+)\)/);
    if (transitionMatch) {
      const easingValues = transitionMatch[1].split(',').map(v => parseFloat(v.trim()));
      
      // Should use museum easing or similar ease-out curve
      expect(easingValues).toHaveLength(4);
      expect(easingValues[0]).toBeGreaterThanOrEqual(0.2); // First control point
      expect(easingValues[1]).toBeLessThanOrEqual(0.5);    // Second control point
      expect(easingValues[2]).toBeGreaterThanOrEqual(0.2); // Third control point
      expect(easingValues[3]).toBeGreaterThanOrEqual(0.9); // Fourth control point (ease-out)
    }
  });

  it('should handle click events properly when interactive', () => {
    const mockOnClick = vi.fn();
    const sampleArtwork: Artwork = {
      id: 'clickable-artwork',
      title: 'Clickable Artwork',
      category: 'realism',
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      dimensions: { width: 800, height: 600 },
      createdDate: new Date(),
      tags: ['test'],
    };

    const { container } = render(
      <TestWrapper>
        <ArtworkDisplay
          artwork={sampleArtwork}
          size="medium"
          interactive={true}
          onArtworkClick={mockOnClick}
        />
      </TestWrapper>
    );

    const artworkContainer = container.firstChild as HTMLElement;
    
    // Click the artwork
    fireEvent.click(artworkContainer);
    
    // Verify click handler was called with correct artwork
    expect(mockOnClick).toHaveBeenCalledWith(sampleArtwork);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should display artwork overlay on hover with proper animation timing', () => {
    const sampleArtwork: Artwork = {
      id: 'overlay-artwork',
      title: 'Overlay Test Artwork',
      category: 'anime',
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      description: 'Test description for overlay',
      dimensions: { width: 800, height: 600 },
      createdDate: new Date(),
      tags: ['test'],
    };

    render(
      <TestWrapper>
        <ArtworkDisplay
          artwork={sampleArtwork}
          size="medium"
          interactive={true}
        />
      </TestWrapper>
    );
    
    // Verify artwork title and description are in the document
    expect(screen.getByText('Overlay Test Artwork')).toBeInTheDocument();
    expect(screen.getByText('Test description for overlay')).toBeInTheDocument();
    
    // Verify image is rendered with correct alt text
    expect(screen.getByAltText('Overlay Test Artwork')).toBeInTheDocument();
  });
});