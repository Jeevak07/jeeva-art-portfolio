import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateArtwork,
  validateGallerySection,
  validateProcessStep,
  validateContactMethod,
  validateArtworks,
  validateGallerySections,
  validateProcessSteps,
  validateContactMethods,
} from './validation';
import { Artwork, GallerySection, ProcessStep, ContactMethod, GalleryTheme } from '../types';

// **Feature: sketch-museum-portfolio, Property 10: Performance optimization - data validation should maintain fast response times**

describe('Data Model Validation Performance', () => {
  // Helper to generate non-empty strings that aren't just whitespace
  const nonEmptyString = fc.string({ minLength: 1 }).filter(s => s.trim().length > 0);
  
  // Helper to generate valid dates
  const validDate = fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') });
  
  // Helper to generate hex colors
  const hexColor = fc.array(fc.integer({ min: 0, max: 15 }), { minLength: 6, maxLength: 6 })
    .map(arr => '#' + arr.map(n => n.toString(16)).join(''));

  it('should validate artwork data efficiently maintaining fast response times', () => {
    const artworkArbitrary = fc.record({
      id: nonEmptyString,
      title: nonEmptyString,
      category: fc.constantFrom('anime', 'portrait', 'realism'),
      imageUrl: fc.webUrl(),
      thumbnailUrl: fc.webUrl(),
      description: fc.option(nonEmptyString),
      dimensions: fc.record({
        width: fc.integer({ min: 1, max: 10000 }),
        height: fc.integer({ min: 1, max: 10000 }),
      }),
      createdDate: validDate,
      tags: fc.array(nonEmptyString, { minLength: 1, maxLength: 10 }),
    });

    fc.assert(
      fc.property(artworkArbitrary, (artwork) => {
        const startTime = performance.now();
        const result = validateArtwork(artwork as Artwork);
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Validation should complete within 10ms for performance
        expect(duration).toBeLessThan(10);
        
        // Valid artwork should pass validation
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate gallery section data efficiently maintaining fast response times', () => {
    const galleryThemeArbitrary = fc.record({
      backgroundColor: hexColor,
      accentColor: hexColor,
      spacing: fc.integer({ min: 0, max: 100 }),
      columns: fc.record({
        mobile: fc.integer({ min: 1, max: 4 }),
        tablet: fc.integer({ min: 1, max: 6 }),
        desktop: fc.integer({ min: 1, max: 8 }),
      }),
    });

    const artworkArbitrary = fc.record({
      id: nonEmptyString,
      title: nonEmptyString,
      category: fc.constantFrom('anime', 'portrait', 'realism'),
      imageUrl: fc.webUrl(),
      thumbnailUrl: fc.webUrl(),
      description: fc.option(nonEmptyString),
      dimensions: fc.record({
        width: fc.integer({ min: 1, max: 10000 }),
        height: fc.integer({ min: 1, max: 10000 }),
      }),
      createdDate: validDate,
      tags: fc.array(nonEmptyString, { minLength: 1, maxLength: 10 }),
    });

    const gallerySectionArbitrary = fc.record({
      id: nonEmptyString,
      name: nonEmptyString,
      theme: galleryThemeArbitrary,
      artworks: fc.array(artworkArbitrary, { minLength: 0, maxLength: 20 }),
      layout: fc.constantFrom('grid', 'masonry', 'linear'),
      spacing: fc.constantFrom('compact', 'comfortable', 'spacious'),
    });

    fc.assert(
      fc.property(gallerySectionArbitrary, (section) => {
        // Filter out invalid generated data (like NaN dates)
        const hasValidDate = section.artworks.every(artwork => 
          artwork.createdDate instanceof Date && !isNaN(artwork.createdDate.getTime())
        );
        
        // Skip test if generated data is invalid
        if (!hasValidDate) {
          return true;
        }

        const startTime = performance.now();
        const result = validateGallerySection(section as GallerySection);
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Validation should complete within 50ms for performance (more complex validation)
        expect(duration).toBeLessThan(50);
        
        // Valid gallery section should pass validation
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate process step data efficiently maintaining fast response times', () => {
    const processStepArbitrary = fc.record({
      id: nonEmptyString,
      title: nonEmptyString,
      description: nonEmptyString,
      imageUrl: fc.webUrl(),
      order: fc.integer({ min: 1, max: 100 }),
      duration: fc.option(fc.integer({ min: 1, max: 1000 })),
    });

    fc.assert(
      fc.property(processStepArbitrary, (step) => {
        const startTime = performance.now();
        const result = validateProcessStep(step as ProcessStep);
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Validation should complete within 5ms for performance
        expect(duration).toBeLessThan(5);
        
        // Valid process step should pass validation
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate contact method data efficiently maintaining fast response times', () => {
    const contactMethodArbitrary = fc.record({
      platform: fc.constantFrom('instagram', 'whatsapp', 'email'),
      url: fc.webUrl(),
      displayText: nonEmptyString,
      icon: nonEmptyString,
    });

    fc.assert(
      fc.property(contactMethodArbitrary, (method) => {
        const startTime = performance.now();
        const result = validateContactMethod(method as ContactMethod);
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Validation should complete within 5ms for performance
        expect(duration).toBeLessThan(5);
        
        // Valid contact method should pass validation
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should validate batch artwork data efficiently maintaining fast response times', () => {
    const artworkArbitrary = fc.record({
      id: nonEmptyString,
      title: nonEmptyString,
      category: fc.constantFrom('anime', 'portrait', 'realism'),
      imageUrl: fc.webUrl(),
      thumbnailUrl: fc.webUrl(),
      description: fc.option(nonEmptyString),
      dimensions: fc.record({
        width: fc.integer({ min: 1, max: 10000 }),
        height: fc.integer({ min: 1, max: 10000 }),
      }),
      createdDate: validDate,
      tags: fc.array(nonEmptyString, { minLength: 1, maxLength: 10 }),
    });

    const artworksArbitrary = fc.array(artworkArbitrary, { minLength: 1, maxLength: 50 });

    fc.assert(
      fc.property(artworksArbitrary, (artworks) => {
        const startTime = performance.now();
        const result = validateArtworks(artworks as Artwork[]);
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Batch validation should complete within 100ms for performance
        expect(duration).toBeLessThan(100);
        
        // Valid artworks should pass validation
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle invalid data gracefully while maintaining performance', () => {
    // Test with intentionally invalid data to ensure error handling is also performant
    const invalidArtwork = {
      id: '', // Invalid: empty string
      title: '', // Invalid: empty string
      category: 'invalid' as any, // Invalid: not a valid category
      imageUrl: 'not-a-url', // Invalid: not a valid URL
      thumbnailUrl: 'not-a-url', // Invalid: not a valid URL
      dimensions: { width: -1, height: -1 }, // Invalid: negative dimensions
      createdDate: new Date('invalid'), // Invalid: invalid date
      tags: [''], // Invalid: empty tag
    };

    const startTime = performance.now();
    const result = validateArtwork(invalidArtwork as Artwork);
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Even invalid data validation should be fast
    expect(duration).toBeLessThan(10);
    
    // Should properly identify as invalid
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});