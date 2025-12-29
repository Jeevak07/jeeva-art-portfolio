import { Artwork, GallerySection, ProcessStep, ContactMethod, GalleryTheme } from '../types';

// Sample artwork data using your actual images across all categories
export const sampleArtworks: Artwork[] = [
  // Anime category - your 4 images
  {
    id: 'anime-001',
    title: 'Gojo Satoru',
    category: 'anime',
    imageUrl: '/images/artworks/art-gojo.jpg',
    thumbnailUrl: '/images/artworks/art-gojo.jpg',
    description: 'Detailed sketch of Gojo Satoru from Jujutsu Kaisen with his iconic blindfold and powerful presence',
    dimensions: { width: 2400, height: 3200 },
    createdDate: new Date('2024-01-15'),
    tags: ['anime', 'gojo', 'jujutsu-kaisen', 'pencil', 'detailed']
  },
  {
    id: 'anime-002',
    title: 'Roronoa Zoro',
    category: 'anime',
    imageUrl: '/images/artworks/art-zoro.jpg',
    thumbnailUrl: '/images/artworks/art-zoro.jpg',
    description: 'Dynamic sketch of Zoro, the legendary swordsman from One Piece, showcasing his fierce determination',
    dimensions: { width: 2000, height: 2800 },
    createdDate: new Date('2024-02-03'),
    tags: ['anime', 'zoro', 'one-piece', 'swordsman', 'warrior']
  },
  {
    id: 'anime-003',
    title: 'Red-Haired Shanks',
    category: 'anime',
    imageUrl: '/images/artworks/art-shanks.jpg',
    thumbnailUrl: '/images/artworks/art-shanks.jpg',
    description: 'Powerful portrait of Shanks, one of the Four Emperors from One Piece, with his commanding aura',
    dimensions: { width: 2600, height: 3400 },
    createdDate: new Date('2024-02-20'),
    tags: ['anime', 'shanks', 'one-piece', 'emperor', 'captain']
  },
  {
    id: 'anime-004',
    title: 'Shimotsuki Ryuma',
    category: 'anime',
    imageUrl: '/images/artworks/art-ryuma.jpg',
    thumbnailUrl: '/images/artworks/art-ryuma.jpg',
    description: 'Legendary samurai Ryuma from One Piece, depicted with masterful shading and traditional warrior spirit',
    dimensions: { width: 2200, height: 3000 },
    createdDate: new Date('2024-03-10'),
    tags: ['anime', 'ryuma', 'one-piece', 'samurai', 'legendary']
  },

  // Portrait category - using your same 4 images
  {
    id: 'portrait-001',
    title: 'Gojo Portrait Study',
    category: 'portrait',
    imageUrl: '/images/artworks/art-gojo.jpg',
    thumbnailUrl: '/images/artworks/art-gojo.jpg',
    description: 'Character portrait study focusing on facial features and expression techniques',
    dimensions: { width: 2400, height: 3200 },
    createdDate: new Date('2024-01-28'),
    tags: ['portrait', 'character-study', 'facial-features', 'expression']
  },
  {
    id: 'portrait-002',
    title: 'Zoro Character Portrait',
    category: 'portrait',
    imageUrl: '/images/artworks/art-zoro.jpg',
    thumbnailUrl: '/images/artworks/art-zoro.jpg',
    description: 'Detailed portrait capturing the intensity and determination in character expression',
    dimensions: { width: 2000, height: 2800 },
    createdDate: new Date('2024-02-14'),
    tags: ['portrait', 'intensity', 'character', 'expression']
  },
  {
    id: 'portrait-003',
    title: 'Shanks Leadership Portrait',
    category: 'portrait',
    imageUrl: '/images/artworks/art-shanks.jpg',
    thumbnailUrl: '/images/artworks/art-shanks.jpg',
    description: 'Portrait study emphasizing leadership qualities and commanding presence',
    dimensions: { width: 2600, height: 3400 },
    createdDate: new Date('2024-03-05'),
    tags: ['portrait', 'leadership', 'presence', 'authority']
  },

  // Realism category - using your same 4 images
  {
    id: 'realism-001',
    title: 'Realistic Gojo Study',
    category: 'realism',
    imageUrl: '/images/artworks/art-gojo.jpg',
    thumbnailUrl: '/images/artworks/art-gojo.jpg',
    description: 'Realistic interpretation with detailed shading and texture work',
    dimensions: { width: 2400, height: 3200 },
    createdDate: new Date('2024-01-20'),
    tags: ['realism', 'detailed-shading', 'texture', 'realistic']
  },
  {
    id: 'realism-002',
    title: 'Zoro Realistic Portrait',
    category: 'realism',
    imageUrl: '/images/artworks/art-zoro.jpg',
    thumbnailUrl: '/images/artworks/art-zoro.jpg',
    description: 'Hyperrealistic approach to character rendering with precise detail work',
    dimensions: { width: 2000, height: 2800 },
    createdDate: new Date('2024-02-28'),
    tags: ['realism', 'hyperrealistic', 'precision', 'detail']
  },
  {
    id: 'realism-003',
    title: 'Shanks Photorealistic Study',
    category: 'realism',
    imageUrl: '/images/artworks/art-shanks.jpg',
    thumbnailUrl: '/images/artworks/art-shanks.jpg',
    description: 'Photorealistic study focusing on light, shadow, and dimensional form',
    dimensions: { width: 2600, height: 3400 },
    createdDate: new Date('2024-03-15'),
    tags: ['realism', 'photorealistic', 'lighting', 'dimensional']
  },
  {
    id: 'realism-004',
    title: 'Ryuma Traditional Realism',
    category: 'realism',
    imageUrl: '/images/artworks/art-ryuma.jpg',
    thumbnailUrl: '/images/artworks/art-ryuma.jpg',
    description: 'Traditional realistic rendering with classical shading techniques',
    dimensions: { width: 2200, height: 3000 },
    createdDate: new Date('2024-04-01'),
    tags: ['realism', 'traditional', 'classical', 'shading']
  }
];

// Sample gallery themes
export const galleryThemes: Record<string, GalleryTheme> = {
  anime: {
    backgroundColor: '#0a0a0a',
    accentColor: '#4a90e2',
    spacing: 24,
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3
    }
  },
  portrait: {
    backgroundColor: '#0d0d0d',
    accentColor: '#d4af37',
    spacing: 32,
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 2
    }
  },
  realism: {
    backgroundColor: '#0f0f0f',
    accentColor: '#8b4513',
    spacing: 40,
    columns: {
      mobile: 1,
      tablet: 1,
      desktop: 2
    }
  }
};

// Sample gallery sections - your 4 images displayed across all galleries
export const sampleGallerySections: GallerySection[] = [
  {
    id: 'anime-gallery',
    name: 'Anime Gallery',
    theme: galleryThemes.anime,
    artworks: sampleArtworks.filter(artwork => artwork.category === 'anime'),
    layout: 'grid',
    spacing: 'comfortable'
  },
  {
    id: 'portrait-gallery',
    name: 'Portrait Gallery',
    theme: galleryThemes.portrait,
    artworks: sampleArtworks.filter(artwork => artwork.category === 'portrait'),
    layout: 'grid',
    spacing: 'spacious'
  },
  {
    id: 'realism-gallery',
    name: 'Realism Gallery',
    theme: galleryThemes.realism,
    artworks: sampleArtworks.filter(artwork => artwork.category === 'realism'),
    layout: 'masonry',
    spacing: 'spacious'
  }
];

// Sample process steps using your actual images
export const sampleProcessSteps: ProcessStep[] = [
  {
    id: 'step-001',
    title: 'Reference Gathering',
    description: 'Collecting visual references and inspiration for the artwork',
    imageUrl: '/images/artworks/art-gojo.jpg',
    order: 1,
    duration: 30
  },
  {
    id: 'step-002',
    title: 'Initial Sketch',
    description: 'Creating the basic composition and rough outline',
    imageUrl: '/images/artworks/art-zoro.jpg',
    order: 2,
    duration: 45
  },
  {
    id: 'step-003',
    title: 'Detailed Drawing',
    description: 'Adding details, proportions, and refining the structure',
    imageUrl: '/images/artworks/art-shanks.jpg',
    order: 3,
    duration: 120
  },
  {
    id: 'step-004',
    title: 'Shading & Texture',
    description: 'Applying shadows, highlights, and texture work',
    imageUrl: '/images/artworks/art-ryuma.jpg',
    order: 4,
    duration: 90
  },
  {
    id: 'step-005',
    title: 'Final Touches',
    description: 'Adding finishing details and final adjustments',
    imageUrl: '/images/artworks/art-gojo.jpg',
    order: 5,
    duration: 60
  }
];

// Contact methods with actual information - Updated
export const sampleContactMethods: ContactMethod[] = [
  {
    platform: 'instagram',
    url: 'https://www.instagram.com/sketchwew/',
    displayText: 'Message on Instagram',
    icon: '/icons/instagram.svg'
  },
  {
    platform: 'whatsapp',
    url: 'https://wa.me/919952859522?text=Hi%2C%20I%27d%20like%20to%20commission%20a%20sketch',
    displayText: 'WhatsApp Message',
    icon: '/icons/whatsapp.svg'
  },
  {
    platform: 'email',
    url: 'mailto:jeeva200606@gmail.com?subject=Commission%20Inquiry',
    displayText: 'Email Commission',
    icon: '/icons/email.svg'
  }
];