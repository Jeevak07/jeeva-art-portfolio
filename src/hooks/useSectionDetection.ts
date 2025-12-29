'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface SectionInfo {
  id: string;
  element: HTMLElement;
  isVisible: boolean;
  intersectionRatio: number;
}

export function useSectionDetection(sectionIds: string[]) {
  const [currentSection, setCurrentSection] = useState<string>('');
  const [sections, setSections] = useState<Map<string, SectionInfo>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const updateCurrentSection = useCallback((sectionsMap: Map<string, SectionInfo>) => {
    // Find the section with the highest intersection ratio that's visible
    let maxRatio = 0;
    let activeSection = '';

    sectionsMap.forEach((section) => {
      if (section.isVisible && section.intersectionRatio > maxRatio) {
        maxRatio = section.intersectionRatio;
        activeSection = section.id;
      }
    });

    if (activeSection && activeSection !== currentSection) {
      setCurrentSection(activeSection);
    }
  }, [currentSection]);

  useEffect(() => {
    // Create intersection observer with optimized options
    observerRef.current = new IntersectionObserver(
      (entries) => {
        setSections((prevSections) => {
          const newSections = new Map(prevSections);
          
          entries.forEach((entry) => {
            const sectionId = entry.target.id;
            if (sectionId) {
              newSections.set(sectionId, {
                id: sectionId,
                element: entry.target as HTMLElement,
                isVisible: entry.isIntersecting,
                intersectionRatio: entry.intersectionRatio,
              });
            }
          });
          
          updateCurrentSection(newSections);
          return newSections;
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -20% 0px', // Trigger when section is 20% visible
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Multiple thresholds for smooth detection
      }
    );

    // Observe all sections
    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sectionIds, updateCurrentSection]);

  // Function to scroll to a specific section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  return {
    currentSection,
    sections: Array.from(sections.values()),
    scrollToSection,
  };
}