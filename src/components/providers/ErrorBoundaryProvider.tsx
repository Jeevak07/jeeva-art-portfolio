'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import styled from 'styled-components';
import { setupGlobalErrorHandling } from '@/utils/errorHandling';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Error display component
const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.museum.darkBackground};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: rgba(231, 76, 60, 0.9);
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ErrorButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.museum.darkBackground};
    
    &:hover {
      background: ${({ theme }) => theme.colors.accent};
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
  
  &.secondary {
    background: transparent;
    color: ${({ theme }) => theme.colors.text.muted};
    border: 1px solid ${({ theme }) => theme.colors.text.muted};
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }
`;

const ErrorDetails = styled.details`
  margin-top: 2rem;
  max-width: 800px;
  text-align: left;
  
  summary {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.muted};
    margin-bottom: 1rem;
    
    &:hover {
      color: ${({ theme }) => theme.colors.text.primary};
    }
  }
  
  pre {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text.muted};
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export class ErrorBoundaryProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Report error to monitoring service if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  componentDidMount() {
    // Initialize global error handling
    setupGlobalErrorHandling();
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            We apologize for the inconvenience. The Sketch Museum encountered an unexpected error. 
            Please try refreshing the page or returning to the home gallery.
          </ErrorMessage>
          
          <ErrorActions>
            <ErrorButton className="primary" onClick={this.handleRetry}>
              Try Again
            </ErrorButton>
            <ErrorButton className="secondary" onClick={this.handleReload}>
              Refresh Page
            </ErrorButton>
            <ErrorButton className="secondary" onClick={this.handleGoHome}>
              Return Home
            </ErrorButton>
          </ErrorActions>

          {process.env.NODE_ENV === 'development' && error && (
            <ErrorDetails>
              <summary>Error Details (Development)</summary>
              <div>
                <h4>Error Message:</h4>
                <pre>{error.message}</pre>
                
                <h4>Stack Trace:</h4>
                <pre>{error.stack}</pre>
                
                {errorInfo && (
                  <>
                    <h4>Component Stack:</h4>
                    <pre>{errorInfo.componentStack}</pre>
                  </>
                )}
              </div>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryProvider;