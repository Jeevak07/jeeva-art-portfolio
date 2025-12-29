import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enhanced image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache for better performance
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'default',
    path: '/_next/image',
    domains: [], // Add external domains if needed
    remotePatterns: [], // For external image sources
    unoptimized: false,
    qualities: [75, 85], // Add quality 85 to supported qualities
  },
  
  // Enhanced performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'gsap', 'lenis', 'styled-components'],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
  },
  
  // Turbopack configuration (empty to silence warnings)
  turbopack: {},
  
  // Enhanced compiler optimizations
  compiler: {
    styledComponents: {
      displayName: process.env.NODE_ENV === 'development',
      ssr: true,
      minify: true,
      transpileTemplateLiterals: true,
      pure: true,
    },
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Performance headers and optimizations
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  
  // Enhanced webpack configuration
  webpack: (config: any, { dev, isServer }) => {
    // Bundle analyzer (optional, for development)
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new (require('@next/bundle-analyzer'))({
          enabled: true,
        })
      );
    }

    // Enable tree shaking
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;
    
    // Enhanced chunk splitting for better caching
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
        },
        animations: {
          test: /[\\/]node_modules[\\/](framer-motion|gsap|lenis)[\\/]/,
          name: 'animations',
          priority: 10,
          chunks: 'all',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: 20,
          chunks: 'all',
        },
        styles: {
          test: /[\\/]node_modules[\\/]styled-components[\\/]/,
          name: 'styles',
          priority: 15,
          chunks: 'all',
        },
      },
    };

    // Optimize module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    // Add performance optimizations for production
    if (!dev && !isServer) {
      config.optimization.minimize = true;
      config.optimization.concatenateModules = true;
      
      // Enable module concatenation
      config.optimization.providedExports = true;
      config.optimization.usedExports = true;
      
      // Optimize runtime chunk
      config.optimization.runtimeChunk = {
        name: 'runtime',
      };
    }

    return config;
  },
  
  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
