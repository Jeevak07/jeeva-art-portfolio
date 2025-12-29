import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect } from 'vitest';
import { HeroSection } from './HeroSection';
import { museumTheme } from '@/styles/theme';

// Test wrapper with theme provider
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={museumTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('HeroSection', () => {
  describe('Hero content display', () => {
    it('should display correct title and subtitle text', () => {
      // **Validates: Requirements 1.1**
      renderWithTheme(<HeroSection />);
      
      // Check that the default title is displayed
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Arts by Jeeva');
      
      // Check that the default subtitle is displayed
      const subtitle = screen.getByText('Hand-drawn Anime & Portrait Art');
      expect(subtitle).toBeInTheDocument();
    });

    it('should display custom title and subtitle when provided', () => {
      const customTitle = 'Custom Art Gallery';
      const customSubtitle = 'Custom Art Description';
      
      renderWithTheme(
        <HeroSection 
          title={customTitle} 
          subtitle={customSubtitle} 
        />
      );
      
      // Check custom title
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent(customTitle);
      
      // Check custom subtitle
      const subtitle = screen.getByText(customSubtitle);
      expect(subtitle).toBeInTheDocument();
    });

    it('should display scroll indicator by default', () => {
      renderWithTheme(<HeroSection />);
      
      const scrollText = screen.getByText('Scroll to explore the galleries');
      expect(scrollText).toBeInTheDocument();
    });

    it('should hide scroll indicator when showScrollIndicator is false', () => {
      renderWithTheme(<HeroSection showScrollIndicator={false} />);
      
      const scrollText = screen.queryByText('Scroll to explore the galleries');
      expect(scrollText).not.toBeInTheDocument();
    });

    it('should have proper semantic structure', () => {
      renderWithTheme(<HeroSection />);
      
      // Check that hero section has proper id
      const heroSection = document.getElementById('hero');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection).toHaveAttribute('id', 'hero');
      
      // Check heading hierarchy
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
    });
  });
});