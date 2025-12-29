import { Artwork, GallerySection, ProcessStep, ContactMethod, GalleryTheme } from '../types';

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// URL validation helper
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Date validation helper
const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

// Artwork validation
export const validateArtwork = (artwork: Artwork): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required string fields
  if (!artwork.id || typeof artwork.id !== 'string' || artwork.id.trim().length === 0) {
    errors.push({ field: 'id', message: 'ID is required and must be a non-empty string' });
  }

  if (!artwork.title || typeof artwork.title !== 'string' || artwork.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
  }

  // Category validation
  const validCategories = ['anime', 'portrait', 'realism'];
  if (!validCategories.includes(artwork.category)) {
    errors.push({ field: 'category', message: `Category must be one of: ${validCategories.join(', ')}` });
  }

  // URL validation
  if (!artwork.imageUrl || !isValidUrl(artwork.imageUrl)) {
    errors.push({ field: 'imageUrl', message: 'Image URL is required and must be a valid URL' });
  }

  if (!artwork.thumbnailUrl || !isValidUrl(artwork.thumbnailUrl)) {
    errors.push({ field: 'thumbnailUrl', message: 'Thumbnail URL is required and must be a valid URL' });
  }

  // Dimensions validation
  if (!artwork.dimensions || typeof artwork.dimensions !== 'object') {
    errors.push({ field: 'dimensions', message: 'Dimensions object is required' });
  } else {
    if (typeof artwork.dimensions.width !== 'number' || artwork.dimensions.width <= 0) {
      errors.push({ field: 'dimensions.width', message: 'Width must be a positive number' });
    }
    if (typeof artwork.dimensions.height !== 'number' || artwork.dimensions.height <= 0) {
      errors.push({ field: 'dimensions.height', message: 'Height must be a positive number' });
    }
  }

  // Date validation
  if (!isValidDate(artwork.createdDate)) {
    errors.push({ field: 'createdDate', message: 'Created date must be a valid Date object' });
  }

  // Tags validation
  if (!Array.isArray(artwork.tags)) {
    errors.push({ field: 'tags', message: 'Tags must be an array' });
  } else {
    artwork.tags.forEach((tag, index) => {
      if (typeof tag !== 'string' || tag.trim().length === 0) {
        errors.push({ field: `tags[${index}]`, message: 'Each tag must be a non-empty string' });
      }
    });
  }

  // Optional description validation
  if (artwork.description !== undefined && artwork.description !== null && (typeof artwork.description !== 'string' || artwork.description.trim().length === 0)) {
    errors.push({ field: 'description', message: 'Description, if provided, must be a non-empty string' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Gallery theme validation
export const validateGalleryTheme = (theme: GalleryTheme): ValidationResult => {
  const errors: ValidationError[] = [];

  // Background color validation (basic hex color check)
  if (!theme.backgroundColor || !/^#[0-9A-Fa-f]{6}$/.test(theme.backgroundColor)) {
    errors.push({ field: 'backgroundColor', message: 'Background color must be a valid hex color (e.g., #000000)' });
  }

  // Accent color validation
  if (!theme.accentColor || !/^#[0-9A-Fa-f]{6}$/.test(theme.accentColor)) {
    errors.push({ field: 'accentColor', message: 'Accent color must be a valid hex color (e.g., #ffffff)' });
  }

  // Spacing validation
  if (typeof theme.spacing !== 'number' || theme.spacing < 0) {
    errors.push({ field: 'spacing', message: 'Spacing must be a non-negative number' });
  }

  // Columns validation
  if (!theme.columns || typeof theme.columns !== 'object') {
    errors.push({ field: 'columns', message: 'Columns object is required' });
  } else {
    const columnKeys = ['mobile', 'tablet', 'desktop'];
    columnKeys.forEach(key => {
      const value = theme.columns[key as keyof typeof theme.columns];
      if (typeof value !== 'number' || value < 1 || !Number.isInteger(value)) {
        errors.push({ field: `columns.${key}`, message: `${key} columns must be a positive integer` });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Gallery section validation
export const validateGallerySection = (section: GallerySection): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required string fields
  if (!section.id || typeof section.id !== 'string' || section.id.trim().length === 0) {
    errors.push({ field: 'id', message: 'ID is required and must be a non-empty string' });
  }

  if (!section.name || typeof section.name !== 'string' || section.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string' });
  }

  // Layout validation
  const validLayouts = ['grid', 'masonry', 'linear'];
  if (!validLayouts.includes(section.layout)) {
    errors.push({ field: 'layout', message: `Layout must be one of: ${validLayouts.join(', ')}` });
  }

  // Spacing validation
  const validSpacing = ['compact', 'comfortable', 'spacious'];
  if (!validSpacing.includes(section.spacing)) {
    errors.push({ field: 'spacing', message: `Spacing must be one of: ${validSpacing.join(', ')}` });
  }

  // Theme validation
  const themeValidation = validateGalleryTheme(section.theme);
  if (!themeValidation.isValid) {
    themeValidation.errors.forEach(error => {
      errors.push({ field: `theme.${error.field}`, message: error.message });
    });
  }

  // Artworks validation
  if (!Array.isArray(section.artworks)) {
    errors.push({ field: 'artworks', message: 'Artworks must be an array' });
  } else {
    section.artworks.forEach((artwork, index) => {
      const artworkValidation = validateArtwork(artwork);
      if (!artworkValidation.isValid) {
        artworkValidation.errors.forEach(error => {
          errors.push({ field: `artworks[${index}].${error.field}`, message: error.message });
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Process step validation
export const validateProcessStep = (step: ProcessStep): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required string fields
  if (!step.id || typeof step.id !== 'string' || step.id.trim().length === 0) {
    errors.push({ field: 'id', message: 'ID is required and must be a non-empty string' });
  }

  if (!step.title || typeof step.title !== 'string' || step.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
  }

  if (!step.description || typeof step.description !== 'string' || step.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required and must be a non-empty string' });
  }

  // URL validation
  if (!step.imageUrl || !isValidUrl(step.imageUrl)) {
    errors.push({ field: 'imageUrl', message: 'Image URL is required and must be a valid URL' });
  }

  // Order validation
  if (typeof step.order !== 'number' || step.order < 1 || !Number.isInteger(step.order)) {
    errors.push({ field: 'order', message: 'Order must be a positive integer' });
  }

  // Optional duration validation
  if (step.duration !== undefined && step.duration !== null && (typeof step.duration !== 'number' || step.duration <= 0)) {
    errors.push({ field: 'duration', message: 'Duration, if provided, must be a positive number' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Contact method validation
export const validateContactMethod = (method: ContactMethod): ValidationResult => {
  const errors: ValidationError[] = [];

  // Platform validation
  const validPlatforms = ['instagram', 'whatsapp', 'email'];
  if (!validPlatforms.includes(method.platform)) {
    errors.push({ field: 'platform', message: `Platform must be one of: ${validPlatforms.join(', ')}` });
  }

  // URL validation
  if (!method.url || !isValidUrl(method.url)) {
    errors.push({ field: 'url', message: 'URL is required and must be a valid URL' });
  }

  // Display text validation
  if (!method.displayText || typeof method.displayText !== 'string' || method.displayText.trim().length === 0) {
    errors.push({ field: 'displayText', message: 'Display text is required and must be a non-empty string' });
  }

  // Icon validation
  if (!method.icon || typeof method.icon !== 'string' || method.icon.trim().length === 0) {
    errors.push({ field: 'icon', message: 'Icon is required and must be a non-empty string' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Batch validation functions
export const validateArtworks = (artworks: Artwork[]): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!Array.isArray(artworks)) {
    return {
      isValid: false,
      errors: [{ field: 'artworks', message: 'Input must be an array of artworks' }]
    };
  }

  artworks.forEach((artwork, index) => {
    const validation = validateArtwork(artwork);
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        errors.push({ field: `[${index}].${error.field}`, message: error.message });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateGallerySections = (sections: GallerySection[]): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!Array.isArray(sections)) {
    return {
      isValid: false,
      errors: [{ field: 'sections', message: 'Input must be an array of gallery sections' }]
    };
  }

  sections.forEach((section, index) => {
    const validation = validateGallerySection(section);
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        errors.push({ field: `[${index}].${error.field}`, message: error.message });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateProcessSteps = (steps: ProcessStep[]): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!Array.isArray(steps)) {
    return {
      isValid: false,
      errors: [{ field: 'steps', message: 'Input must be an array of process steps' }]
    };
  }

  steps.forEach((step, index) => {
    const validation = validateProcessStep(step);
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        errors.push({ field: `[${index}].${error.field}`, message: error.message });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateContactMethods = (methods: ContactMethod[]): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!Array.isArray(methods)) {
    return {
      isValid: false,
      errors: [{ field: 'methods', message: 'Input must be an array of contact methods' }]
    };
  }

  methods.forEach((method, index) => {
    const validation = validateContactMethod(method);
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        errors.push({ field: `[${index}].${error.field}`, message: error.message });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};