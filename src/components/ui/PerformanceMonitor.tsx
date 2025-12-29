'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAnimationPerformance } from '@/utils/performanceOptimization';

interface PerformanceMonitorProps {
  showInProduction?: boolean;
}

const MonitorContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  z-index: 9999;
  pointer-events: none;
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const MetricRow = styled.div<{ $status: 'good' | 'warning' | 'poor' }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  color: ${({ $status }) => {
    switch ($status) {
      case 'good': return '#4ade80';
      case 'warning': return '#fbbf24';
      case 'poor': return '#f87171';
      default: return 'white';
    }
  }};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MetricLabel = styled.span`
  margin-right: 8px;
`;

const MetricValue = styled.span`
  font-weight: bold;
`;

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showInProduction = false
}) => {
  const { fps, isOptimized } = useAnimationPerformance();
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [loadTime, setLoadTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Show monitor in development or when explicitly enabled
  const shouldShow = process.env.NODE_ENV === 'development' || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    setIsVisible(true);
    const startTime = performance.now();

    // Monitor memory usage
    const updateMemory = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        setMemoryUsage(Math.round(memInfo.usedJSHeapSize / (1024 * 1024)));
      }
    };

    // Monitor load time
    const updateLoadTime = () => {
      setLoadTime(Math.round(performance.now() - startTime));
    };

    updateMemory();
    updateLoadTime();

    const interval = setInterval(() => {
      updateMemory();
      updateLoadTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [shouldShow]);

  if (!shouldShow) return null;

  const getFPSStatus = (fps: number) => {
    if (fps >= 50) return 'good';
    if (fps >= 30) return 'warning';
    return 'poor';
  };

  const getMemoryStatus = (memory: number) => {
    if (memory < 50) return 'good';
    if (memory < 100) return 'warning';
    return 'poor';
  };

  const getLoadTimeStatus = (time: number) => {
    if (time < 2000) return 'good';
    if (time < 5000) return 'warning';
    return 'poor';
  };

  return (
    <MonitorContainer $isVisible={isVisible}>
      <MetricRow $status={getFPSStatus(fps)}>
        <MetricLabel>FPS:</MetricLabel>
        <MetricValue>{fps}</MetricValue>
      </MetricRow>
      
      <MetricRow $status={getMemoryStatus(memoryUsage)}>
        <MetricLabel>Memory:</MetricLabel>
        <MetricValue>{memoryUsage}MB</MetricValue>
      </MetricRow>
      
      <MetricRow $status={getLoadTimeStatus(loadTime)}>
        <MetricLabel>Load:</MetricLabel>
        <MetricValue>{(loadTime / 1000).toFixed(1)}s</MetricValue>
      </MetricRow>
      
      {isOptimized && (
        <MetricRow $status="warning">
          <MetricLabel>Mode:</MetricLabel>
          <MetricValue>Optimized</MetricValue>
        </MetricRow>
      )}
    </MonitorContainer>
  );
};

export default PerformanceMonitor;