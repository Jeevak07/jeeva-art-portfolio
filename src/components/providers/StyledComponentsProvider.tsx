'use client';

import React from 'react';
import { ThemeProvider } from 'styled-components';
import { museumTheme } from '@/styles/theme';
import { GlobalStyles } from '@/styles/GlobalStyles';

interface StyledComponentsProviderProps {
  children: React.ReactNode;
}

export const StyledComponentsProvider: React.FC<StyledComponentsProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={museumTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};