# Sketch Museum Portfolio

An immersive, museum-style portfolio showcasing hand-drawn pencil sketches, anime artworks, portraits, and realism pieces. Built with Next.js, TypeScript, and modern animation libraries to create a premium art viewing experience.

## 🎨 Features

- **Museum Experience**: Smooth scrolling navigation between themed gallery rooms
- **Elegant Presentation**: Museum-style framing and lighting effects for artworks
- **Interactive Viewer**: Full-screen artwork display with gesture controls
- **Responsive Design**: Optimized for all devices with touch-friendly interactions
- **Performance Optimized**: Image optimization, lazy loading, and smooth animations
- **Cinematic Animations**: GSAP and Framer Motion for premium scroll-driven effects

## 🛠 Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Styled Components with custom theme system
- **Animations**: GSAP + Framer Motion + Lenis smooth scrolling
- **Images**: Next.js Image optimization with WebP/AVIF support
- **Fonts**: Inter (primary) + Playfair Display (headings)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── gallery/           # Gallery-specific components
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── styles/                # Styled-components theme and globals
├── assets/                # Static assets
│   └── images/            # Image assets
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**: [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size

## 🎯 Design Philosophy

The portfolio follows a **cinematic museum experience** with:

- **Scroll-driven animations**: Everything reacts to scroll position
- **Subtle micro-interactions**: Gentle hover effects and transitions
- **Progressive revelation**: Content appears gradually as users scroll
- **Premium easing**: Custom cubic-bezier curves for sophisticated motion
- **Performance-first**: 60fps animations across all devices

## 🖼 Gallery Sections

1. **Hero Section**: Museum entrance with title and subtitle
2. **Anime Gallery**: Grid-based layout for anime artworks
3. **Portrait Gallery**: Premium spacing for portrait pieces
4. **Process Showcase**: Step-by-step artistic workflow
5. **Commission Interface**: Contact methods for custom orders

## 📱 Responsive Breakpoints

- **Mobile**: 480px and below
- **Tablet**: 768px and below
- **Desktop**: 1024px and above
- **Wide**: 1440px and above

## 🎨 Theme System

The project uses a comprehensive theme system with:

- **Colors**: Dark museum palette with accent colors
- **Typography**: Inter + Playfair Display font pairing
- **Spacing**: Consistent spacing scale
- **Animations**: Predefined durations and easing curves
- **Shadows**: Artwork-specific shadow effects

## 🔧 Configuration

### Next.js Configuration
- Image optimization with WebP/AVIF formats
- Styled-components compiler integration
- Bundle analysis tools
- Performance optimizations

### Animation Libraries
- **GSAP**: Precise scroll-driven animations
- **Lenis**: Smooth scrolling foundation
- **Framer Motion**: Component-level animations

## 📄 License

This project is for portfolio demonstration purposes.