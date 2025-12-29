'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  className?: string;
}

const NavbarContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  backdrop-filter: blur(20px);
  background: rgba(10, 10, 10, 0.8);
  border-bottom: 1px solid rgba(201, 169, 110, 0.1);
  transition: all 0.3s ease;

  @supports not (backdrop-filter: blur(20px)) {
    background: rgba(10, 10, 10, 0.95);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(motion.div)`
  font-family: var(--font-playfair);
  font-size: 1.5rem;
  font-weight: 600;
  color: #c9a96e;
  cursor: pointer;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #c9a96e;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background: #c9a96e;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(201, 169, 110, 0.1);
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileNavLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  cursor: pointer;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: color 0.3s ease;

  &:hover {
    color: #c9a96e;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const GlassyNavbar: React.FC<NavbarProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <NavbarContainer
      className={className}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        background: isScrolled 
          ? 'rgba(10, 10, 10, 0.9)' 
          : 'rgba(10, 10, 10, 0.7)',
        borderBottomColor: isScrolled 
          ? 'rgba(201, 169, 110, 0.2)' 
          : 'rgba(201, 169, 110, 0.1)',
      }}
    >
      <NavContent>
        <Logo
          onClick={scrollToTop}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Arts by Jeeva
        </Logo>

        <NavLinks>
          <NavLink
            onClick={() => scrollToSection('hero')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => scrollToSection('anime-gallery')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Anime Gallery
          </NavLink>
          <NavLink
            onClick={() => scrollToSection('portrait-gallery')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Portrait & Realism
          </NavLink>
          <NavLink
            onClick={() => scrollToSection('process-showcase')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Process
          </NavLink>
          <NavLink
            onClick={() => scrollToSection('commission')}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Commission
          </NavLink>
        </NavLinks>

        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </NavContent>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MobileNavLink onClick={() => scrollToSection('hero')}>
              Home
            </MobileNavLink>
            <MobileNavLink onClick={() => scrollToSection('anime-gallery')}>
              Anime Gallery
            </MobileNavLink>
            <MobileNavLink onClick={() => scrollToSection('portrait-gallery')}>
              Portrait & Realism
            </MobileNavLink>
            <MobileNavLink onClick={() => scrollToSection('process-showcase')}>
              Process
            </MobileNavLink>
            <MobileNavLink onClick={() => scrollToSection('commission')}>
              Commission
            </MobileNavLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavbarContainer>
  );
};