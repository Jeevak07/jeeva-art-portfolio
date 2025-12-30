'use client';

import { useState, useCallback } from 'react';
import { 
  MuseumLayout, 
  HeroSection, 
  GalleryRoom, 
  PortraitGallery, 
  ProcessShowcase, 
  CommissionInterface,
  InteractiveViewer
} from '@/components';
import { GlassyNavbar } from '@/components/ui/GlassyNavbar';
import { PerformanceOptimizer } from '@/components/PerformanceOptimizer';
import { 
  sampleArtworks, 
  sampleProcessSteps, 
  sampleContactMethods 
} from '@/data/sampleArtworks';
import { Artwork, GallerySection } from '@/types';

export default function Home() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [currentSection, setCurrentSection] = useState<string>('hero');

  // Filter artworks by category for each gallery
  const animeArtworks = sampleArtworks.filter(artwork => artwork.category === 'anime');
  const portraitArtworks = sampleArtworks.filter(artwork => artwork.category === 'portrait');
  const realismArtworks = sampleArtworks.filter(artwork => artwork.category === 'realism');

  // Define museum sections with complete gallery data
  const museumSections: GallerySection[] = [
    {
      id: 'hero',
      name: 'Museum Entrance',
      theme: {
        backgroundColor: '#0a0a0a',
        accentColor: '#c9a96e',
        spacing: 32,
        columns: { mobile: 1, tablet: 1, desktop: 1 }
      },
      artworks: [],
      layout: 'linear',
      spacing: 'comfortable'
    },
    {
      id: 'anime-gallery',
      name: 'Anime Gallery',
      theme: {
        backgroundColor: '#0a0a0a',
        accentColor: '#4a90e2',
        spacing: 24,
        columns: { mobile: 1, tablet: 2, desktop: 3 }
      },
      artworks: animeArtworks,
      layout: 'grid',
      spacing: 'comfortable'
    },
    {
      id: 'portrait-gallery',
      name: 'Portrait & Realism Gallery',
      theme: {
        backgroundColor: '#0d0d0d',
        accentColor: '#d4af37',
        spacing: 32,
        columns: { mobile: 1, tablet: 2, desktop: 2 }
      },
      artworks: [...portraitArtworks, ...realismArtworks],
      layout: 'grid',
      spacing: 'spacious'
    },
    {
      id: 'process-showcase',
      name: 'Artistic Process',
      theme: {
        backgroundColor: '#0f0f0f',
        accentColor: '#8b4513',
        spacing: 40,
        columns: { mobile: 1, tablet: 1, desktop: 1 }
      },
      artworks: [],
      layout: 'linear',
      spacing: 'spacious'
    },
    {
      id: 'commission',
      name: 'Commission Interface',
      theme: {
        backgroundColor: '#0a0a0a',
        accentColor: '#c9a96e',
        spacing: 32,
        columns: { mobile: 1, tablet: 1, desktop: 1 }
      },
      artworks: [],
      layout: 'linear',
      spacing: 'comfortable'
    }
  ];

  // Handle artwork clicks to open Interactive Viewer
  const handleArtworkClick = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
  }, []);

  // Handle Interactive Viewer close
  const handleViewerClose = useCallback(() => {
    setSelectedArtwork(null);
  }, []);

  // Handle section changes for smooth transitions
  const handleSectionChange = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
  }, []);

  // Render section content based on section type
  const renderSectionContent = useCallback((section: GallerySection) => {
    switch (section.id) {
      case 'hero':
        return <HeroSection />;
        
      case 'anime-gallery':
        return (
          <GalleryRoom
            artworks={section.artworks}
            theme={section.theme}
            layout={section.layout}
            onArtworkClick={handleArtworkClick}
          />
        );
        
      case 'portrait-gallery':
        return (
          <PortraitGallery
            artworks={section.artworks}
            onArtworkClick={handleArtworkClick}
          />
        );
        
      case 'process-showcase':
        return (
          <ProcessShowcase
            steps={sampleProcessSteps}
            autoPlay={false}
          />
        );
        
      case 'commission':
        return (
          <CommissionInterface
            contactMethods={sampleContactMethods}
            availability={true}
          />
        );
        
      default:
        return null;
    }
  }, [handleArtworkClick]);

  return (
    <>
      {/* Performance Optimizer */}
      <PerformanceOptimizer />
      
      {/* Glassy Sticky Navbar */}
      <GlassyNavbar />
      
      <MuseumLayout
        sections={museumSections}
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        renderSection={renderSectionContent}
      />
      
      {/* Interactive Viewer Modal */}
      {selectedArtwork && (
        <InteractiveViewer
          artwork={selectedArtwork}
          isOpen={!!selectedArtwork}
          onClose={handleViewerClose}
        />
      )}
    </>
  );
}
