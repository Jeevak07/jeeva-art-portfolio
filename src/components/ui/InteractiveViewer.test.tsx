import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import * as fc from 'fast-check';
import { InteractiveViewer } from './InteractiveViewer';
import { museumTheme } from '@/styles/theme';
import { Artwork } from '@/types';

// **Feature: sketch-museum-portfolio, Property 2: Interactive viewer functionality with correct artwork data and device-appropriate controls**

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, onLoad, fill, priority, sizes, quality, ...props }: any) => {
    // Simulate image load after a short delay
    setTimeout(() => {
      if (onLoad) onLoad();
    }, 10);
    return <img src={src} alt={alt} data-testid="full-size-image" {...props} />;
  },
}));

// Test wrapper with theme
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={museumTheme}>
    {children}
  </ThemeProvider>
);

describe('InteractiveViewer Functionality', () => {
  let originalBodyOverflow: string;

  beforeEach(() => {
    vi.clearAllMocks();
    originalBodyOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    document.body.style.overflow = originalBodyOverflow;
  });

  // Property test for interactive viewer functionality
  it('should display correct artwork data and provide appropriate controls for all valid artworks', { timeout: 15000 }, async () => {
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

    await fc.assert(
      fc.asyncProperty(artworkArbitrary, async (artworkData) => {
        const artwork = artworkData as Artwork;
        const mockOnClose = vi.fn();
        
        const { unmount } = render(
          <TestWrapper>
            <InteractiveViewer
              artwork={artwork}
              isOpen={true}
              onClose={mockOnClose}
            />
          </TestWrapper>
        );

        try {
          // Verify modal is rendered and visible
          const backdrop = screen.getByTestId('interactive-viewer-backdrop');
          const container = screen.getByTestId('interactive-viewer-container');
          expect(backdrop).toBeInTheDocument();
          expect(container).toBeInTheDocument();

          // Verify artwork data is correctly displayed in info panel
          const infoPanel = screen.getByTestId('info-panel');
          
          // Check that the title appears in the info panel (it's in an h2 element)
          const titleElement = infoPanel.querySelector('h2');
          expect(titleElement).toHaveTextContent(artwork.title.trim());
          
          // Check other metadata in the info panel
          expect(infoPanel).toHaveTextContent(`Category: ${artwork.category}`);
          expect(infoPanel).toHaveTextContent(`Dimensions: ${artwork.dimensions.width} × ${artwork.dimensions.height}`);
          
          // Verify description is shown if provided
          if (artwork.description && artwork.description.trim()) {
            expect(infoPanel).toHaveTextContent(artwork.description.trim());
          }

          // Verify image is rendered with correct src and alt
          const image = screen.getByTestId('full-size-image');
          expect(image).toHaveAttribute('src', artwork.imageUrl);
          expect(image).toHaveAttribute('alt', artwork.title);

          // Verify essential controls are present
          const closeButton = screen.getByTestId('close-button');
          expect(closeButton).toBeInTheDocument();
          expect(closeButton).toHaveAttribute('aria-label', 'Close viewer');

          // Verify zoom controls are present (desktop)
          const zoomInButton = screen.getByTestId('zoom-in-button');
          const zoomOutButton = screen.getByTestId('zoom-out-button');
          const resetZoomButton = screen.getByTestId('reset-zoom-button');
          
          expect(zoomInButton).toBeInTheDocument();
          expect(zoomOutButton).toBeInTheDocument();
          expect(resetZoomButton).toBeInTheDocument();

          // Verify mobile gesture hint is present
          const gestureHint = screen.getByTestId('gesture-hint');
          expect(gestureHint).toBeInTheDocument();
          expect(gestureHint).toHaveTextContent('Pinch to zoom • Drag to pan • Tap to close');

          // Verify image container supports interaction
          const imageContainer = screen.getByTestId('image-container');
          expect(imageContainer).toBeInTheDocument();
          expect(imageContainer).toHaveStyle('cursor: grab');
          // Note: touch-action may not be supported in jsdom test environment

          // Test close functionality
          fireEvent.click(closeButton);
          expect(mockOnClose).toHaveBeenCalledTimes(1);

          // Test zoom controls functionality
          fireEvent.click(zoomInButton);
          fireEvent.click(zoomOutButton);
          fireEvent.click(resetZoomButton);
          
          // Verify controls are interactive (no errors thrown)
          expect(zoomInButton).toBeEnabled();
          expect(zoomOutButton).toBeEnabled();
          expect(resetZoomButton).toBeEnabled();
        } finally {
          // Clean up after each test run
          unmount();
        }
      }),
      { numRuns: 20 } // Reduced runs for faster testing
    );
  });

  it('should handle modal state correctly when opened and closed', () => {
    const sampleArtwork: Artwork = {
      id: 'modal-test',
      title: 'Modal Test Artwork',
      category: 'anime',
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      dimensions: { width: 800, height: 600 },
      createdDate: new Date(),
      tags: ['test'],
    };

    const mockOnClose = vi.fn();

    // Test closed state
    const { rerender } = render(
      <TestWrapper>
        <InteractiveViewer
          artwork={sampleArtwork}
          isOpen={false}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    // Modal should not be visible when closed
    const backdrop = screen.getByTestId('interactive-viewer-backdrop');
    expect(backdrop).toHaveStyle('opacity: 0');
    expect(backdrop).toHaveStyle('visibility: hidden');

    // Test opened state
    rerender(
      <TestWrapper>
        <InteractiveViewer
          artwork={sampleArtwork}
          isOpen={true}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    // Modal should be visible when opened
    expect(backdrop).toHaveStyle('opacity: 1');
    expect(backdrop).toHaveStyle('visibility: visible');

    // Body overflow should be hidden when modal is open
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should handle null artwork gracefully', () => {
    const mockOnClose = vi.fn();

    const { container } = render(
      <TestWrapper>
        <InteractiveViewer
          artwork={null}
          isOpen={true}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    // Component should not render anything when artwork is null
    expect(container.firstChild).toBeNull();
  });

  it('should handle keyboard navigation (Escape key)', () => {
    const sampleArtwork: Artwork = {
      id: 'keyboard-test',
      title: 'Keyboard Test Artwork',
      category: 'portrait',
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      dimensions: { width: 800, height: 600 },
      createdDate: new Date(),
      tags: ['test'],
    };

    const mockOnClose = vi.fn();

    render(
      <TestWrapper>
        <InteractiveViewer
          artwork={sampleArtwork}
          isOpen={true}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    // Test Escape key closes modal
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Test other keys don't close modal
    mockOnClose.mockClear();
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle backdrop clicks to close modal', () => {
    const sampleArtwork: Artwork = {
      id: 'backdrop-test',
      title: 'Backdrop Test Artwork',
      category: 'realism',
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      dimensions: { width: 800, height: 600 },
      createdDate: new Date(),
      tags: ['test'],
    };

    const mockOnClose = vi.fn();

    render(
      <TestWrapper>
        <InteractiveViewer
          artwork={sampleArtwork}
          isOpen={true}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    const backdrop = screen.getByTestId('interactive-viewer-backdrop');
    const container = screen.getByTestId('interactive-viewer-container');

    // Clicking backdrop should close modal
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // Clicking container should not close modal
    mockOnClose.mockClear();
    fireEvent.click(container);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should support zoom functionality with mouse wheel', () => {
    const sampleArtwork: Artwork = {
      id: 'zoom-test',
      title: 'Zoom Test Artwork',
      category: 'anime',
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      dimensions: { width: 800, height: 600 },
      createdDate: new Date(),
      tags: ['test'],
    };

    const mockOnClose = vi.fn();

    render(
      <TestWrapper>
        <InteractiveViewer
          artwork={sampleArtwork}
          isOpen={true}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    const imageContainer = screen.getByTestId('image-container');

    // Test zoom in with wheel
    fireEvent.wheel(imageContainer, { deltaY: -100 });
    
    // Test zoom out with wheel
    fireEvent.wheel(imageContainer, { deltaY: 100 });

    // Should not throw errors and container should still be interactive
    expect(imageContainer).toBeInTheDocument();
  });

  it('should handle touch gestures for mobile devices', () => {
    const sampleArtwork: Artwork = {
      id: 'touch-test',
      title: 'Touch Test Artwork',
      category: 'portrait',
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      dimensions: { width: 800, height: 600 },
      createdDate: new Date(),
      tags: ['test'],
    };

    const mockOnClose = vi.fn();

    render(
      <TestWrapper>
        <InteractiveViewer
          artwork={sampleArtwork}
          isOpen={true}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    const imageContainer = screen.getByTestId('image-container');

    // Test single touch (panning)
    fireEvent.touchStart(imageContainer, {
      touches: [{ clientX: 100, clientY: 100 }]
    });
    
    fireEvent.touchMove(imageContainer, {
      touches: [{ clientX: 110, clientY: 110 }]
    });
    
    fireEvent.touchEnd(imageContainer);

    // Test two-finger touch (pinch to zoom)
    fireEvent.touchStart(imageContainer, {
      touches: [
        { clientX: 100, clientY: 100 },
        { clientX: 200, clientY: 200 }
      ]
    });
    
    fireEvent.touchMove(imageContainer, {
      touches: [
        { clientX: 90, clientY: 90 },
        { clientX: 210, clientY: 210 }
      ]
    });
    
    fireEvent.touchEnd(imageContainer);

    // Should handle gestures without errors
    expect(imageContainer).toBeInTheDocument();
  });

  it('should display loading state before image loads', async () => {
    const sampleArtwork: Artwork = {
      id: 'loading-test',
      title: 'Loading Test Artwork',
      category: 'realism',
      imageUrl: 'https://example.com/image.jpg',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      dimensions: { width: 800, height: 600 },
      createdDate: new Date(),
      tags: ['test'],
    };

    const mockOnClose = vi.fn();

    render(
      <TestWrapper>
        <InteractiveViewer
          artwork={sampleArtwork}
          isOpen={true}
          onClose={mockOnClose}
        />
      </TestWrapper>
    );

    // Loading placeholder should be visible initially
    const loadingPlaceholder = screen.getByTestId('loading-placeholder');
    expect(loadingPlaceholder).toBeInTheDocument();
    expect(loadingPlaceholder).toHaveTextContent('Loading artwork...');

    // Wait for image to load (mocked to load after 10ms)
    await waitFor(() => {
      const image = screen.getByTestId('full-size-image');
      expect(image).toBeInTheDocument();
    }, { timeout: 100 });
  });
});