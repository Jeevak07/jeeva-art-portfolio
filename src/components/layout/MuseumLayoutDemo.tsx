'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { MuseumLayout } from './MuseumLayout';
import { sampleGallerySections } from '@/data/sampleArtworks';
import { GallerySection } from '@/types';

const DemoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
`;

const DemoTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 300;
`;

const DemoDescription = styled.p`
  font-size: 1.1rem;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0.7;
`;

const ArtworkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;
`;

const ArtworkCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease-out;
  
  &:hover {
    transform: scale(1.03);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
`;

export function MuseumLayoutDemo() {
  const [currentSection, setCurrentSection] = useState(sampleGallerySections[0]?.id || '');

  const renderSectionContent = (section: GallerySection, isActive: boolean, isVisible: boolean) => {
    return (
      <DemoContent>
        <DemoTitle>{section.name}</DemoTitle>
        <DemoDescription>
          {section.id === 'anime-gallery' && 
            'Explore hand-drawn anime artworks with detailed character designs and dynamic compositions.'
          }
          {section.id === 'portrait-gallery' && 
            'Discover realistic portrait studies showcasing classical techniques and expressive character work.'
          }
          {section.id === 'realism-gallery' && 
            'Experience hyperrealistic drawings that capture intricate details and lifelike textures.'
          }
        </DemoDescription>
        
        <ArtworkGrid>
          {section.artworks.slice(0, 4).map((artwork) => (
            <ArtworkCard key={artwork.id}>
              <h4>{artwork.title}</h4>
              <p>{artwork.tags.join(', ')}</p>
            </ArtworkCard>
          ))}
        </ArtworkGrid>
      </DemoContent>
    );
  };

  return (
    <MuseumLayout
      sections={sampleGallerySections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      renderSection={renderSectionContent}
    />
  );
}