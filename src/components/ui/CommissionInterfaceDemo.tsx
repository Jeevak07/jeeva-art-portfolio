'use client';

import React from 'react';
import { CommissionInterface } from './CommissionInterface';
import { sampleContactMethods } from '@/data/sampleArtworks';

export const CommissionInterfaceDemo: React.FC = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <h1 style={{ color: '#f8f8f8', textAlign: 'center', marginBottom: '2rem' }}>
        Commission Interface Demo
      </h1>
      
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Available for Commissions</h2>
        <CommissionInterface 
          contactMethods={sampleContactMethods} 
          availability={true} 
        />
      </div>
      
      <div>
        <h2 style={{ color: '#e0e0e0', marginBottom: '1rem' }}>Not Available for Commissions</h2>
        <CommissionInterface 
          contactMethods={sampleContactMethods} 
          availability={false} 
        />
      </div>
    </div>
  );
};

export default CommissionInterfaceDemo;