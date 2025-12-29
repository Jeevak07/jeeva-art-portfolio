import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommissionInterface } from './CommissionInterface';
import { museumTheme } from '@/styles/theme';
import { ContactMethod } from '@/types';

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

const mockContactMethods: ContactMethod[] = [
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
  }
];

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={museumTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('CommissionInterface', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  describe('Content Display', () => {
    it('displays correct messaging when availability is true', () => {
      renderWithTheme(
        <CommissionInterface 
          contactMethods={mockContactMethods} 
          availability={true} 
        />
      );

      expect(screen.getByText('Custom Sketch Orders Available')).toBeInTheDocument();
      expect(screen.getByText(/Ready to bring your vision to life/)).toBeInTheDocument();
    });

    it('displays contact buttons when availability is true', () => {
      renderWithTheme(
        <CommissionInterface 
          contactMethods={mockContactMethods} 
          availability={true} 
        />
      );

      expect(screen.getByText('Message on Instagram')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp Message')).toBeInTheDocument();
    });

    it('displays alternative messaging when availability is false', () => {
      renderWithTheme(
        <CommissionInterface 
          contactMethods={mockContactMethods} 
          availability={false} 
        />
      );

      expect(screen.getByText('Commission Inquiries')).toBeInTheDocument();
      expect(screen.getByText(/Thank you for your interest/)).toBeInTheDocument();
    });

    it('does not display contact buttons when availability is false', () => {
      renderWithTheme(
        <CommissionInterface 
          contactMethods={mockContactMethods} 
          availability={false} 
        />
      );

      expect(screen.queryByText('Message on Instagram')).not.toBeInTheDocument();
      expect(screen.queryByText('WhatsApp Message')).not.toBeInTheDocument();
    });

    it('renders all provided contact methods', () => {
      const extendedContactMethods: ContactMethod[] = [
        ...mockContactMethods,
        {
          platform: 'email',
          url: 'mailto:commissions@artsbyjeeva.com',
          displayText: 'Email Commission',
          icon: '/icons/email.svg'
        }
      ];

      renderWithTheme(
        <CommissionInterface 
          contactMethods={extendedContactMethods} 
          availability={true} 
        />
      );

      expect(screen.getByText('Message on Instagram')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp Message')).toBeInTheDocument();
      expect(screen.getByText('Email Commission')).toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
      renderWithTheme(
        <CommissionInterface 
          contactMethods={mockContactMethods} 
          availability={true} 
        />
      );

      const instagramButton = screen.getByLabelText('Contact via Message on Instagram');
      const whatsappButton = screen.getByLabelText('Contact via WhatsApp Message');

      expect(instagramButton).toBeInTheDocument();
      expect(whatsappButton).toBeInTheDocument();
    });
  });

  describe('External Link Behavior', () => {
    it('opens Instagram link in new window when Instagram button is clicked', () => {
      renderWithTheme(
        <CommissionInterface 
          contactMethods={mockContactMethods} 
          availability={true} 
        />
      );

      const instagramButton = screen.getByText('Message on Instagram');
      fireEvent.click(instagramButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://www.instagram.com/sketchwew/',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('opens WhatsApp link in new window when WhatsApp button is clicked', () => {
      renderWithTheme(
        <CommissionInterface 
          contactMethods={mockContactMethods} 
          availability={true} 
        />
      );

      const whatsappButton = screen.getByText('WhatsApp Message');
      fireEvent.click(whatsappButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://wa.me/919952859522?text=Hi%2C%20I%27d%20like%20to%20commission%20a%20sketch',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('opens correct URL for each contact method', () => {
      const testContactMethods: ContactMethod[] = [
        {
          platform: 'email',
          url: 'mailto:test@example.com?subject=Commission',
          displayText: 'Email Us',
          icon: '/icons/email.svg'
        }
      ];

      renderWithTheme(
        <CommissionInterface 
          contactMethods={testContactMethods} 
          availability={true} 
        />
      );

      const emailButton = screen.getByText('Email Us');
      fireEvent.click(emailButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'mailto:test@example.com?subject=Commission',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });
});