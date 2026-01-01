# Image Optimization Guide

## Current Issues:
- art-gojo.jpg: 14.9 MB
- art-zoro.jpg: 14.0 MB  
- art-shanks.jpg: 6.5 MB
- art-ryuma.jpg: 6.3 MB

## Target Sizes:
- Hero/Featured: 200-500 KB max
- Gallery thumbnails: 50-150 KB max
- Process images: 100-300 KB max

## Optimization Steps:

### Option 1: Online Tools
1. Use TinyPNG.com or Squoosh.app
2. Compress to 80-85% quality
3. Convert to WebP format if possible

### Option 2: Photoshop/GIMP
1. Save for Web & Devices
2. JPEG quality: 80-85%
3. Progressive JPEG enabled
4. Resize to max 1920px width

### Option 3: Command Line (if available)
```bash
# Install ImageMagick
# Then run:
magick art-gojo.jpg -quality 85 -resize 1920x1920> art-gojo-optimized.jpg
```

## Expected Results:
- 90-95% file size reduction
- Dramatically improved loading times
- Smooth scrolling performance