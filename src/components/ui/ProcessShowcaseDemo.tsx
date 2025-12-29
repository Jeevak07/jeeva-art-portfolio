'use client';

import React from 'react';
import { ProcessShowcase } from './ProcessShowcase';
import { sampleProcessSteps } from '@/data/sampleArtworks';

export const ProcessShowcaseDemo: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <ProcessShowcase 
        steps={sampleProcessSteps} 
        autoPlay={false} 
      />
    </div>
  );
};

export default ProcessShowcaseDemo;