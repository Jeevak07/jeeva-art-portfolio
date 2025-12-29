'use client';

import React from 'react';
import { ThemeProvider } from 'styled-components';
import { museumTheme } from '@/styles/theme';
import { GalleryRoom } from './GalleryRoom';
import { sampleGallerySections } from '@/data/sampleArtworks';

/**
 * Demo component showcasing the GalleryRoom component with anime artworks
 * This demonstrates the grid layout, fade-in animations, and click handling
 */
export const GalleryRoomDemo: React.FC = () => {
  // Get the anime gallery section from sample data
  const animeGallery = sampleGallerySections.find(section => section.id === 'anime-gallery');
  
  if (!animeGallery) {
    return <div>No anime gallery data available</div>;
  }

  return (
    <ThemeProvider theme={museumTheme}>
      <GalleryRoom
        artworks={animeGallery.artworks}
        theme={animeGallery.theme}
        layout={animeGallery.layout}
      />
    </ThemeProvider>
  );
};

export default GalleryRoomDemo;