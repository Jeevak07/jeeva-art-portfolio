'use client';

import { Component, ReactNode, ErrorInfo } from 'react';
import { setupGlobalErrorHandling } from '@/utils/errorHandling';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Inline styles to avoid theme dependency issues
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: '#0a0a0a',
    color: '#ffffff',
    textAlign: 'center' as const,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: 'rgba(231, 76, 60, 0.9)',
    fontWeight: 600,
  },
  message: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    maxWidth: '600px',
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  primaryButton: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    background: '#c9a96e',
    color: '#0a0a0a',
    fontWeight: 500,
  },
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 400,
  },
  details: {
    marginTop: '2rem',
    maxWidth: '800px',
    textAlign: 'left' as const,
  },
  summary: {
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '1rem',
  },
  pre: {
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '1rem',
    borderRadius: '4px',
    overflowX: 'auto' as const,
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontFamily: 'monospace',
  },
};

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
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    
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
    // Initialize global error handling - temporarily disabled to isolate issue
    // setupGlobalErrorHandling();
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
        <div style={styles.container}>
          <h1 style={styles.title}>Something went wrong</h1>
          <p style={styles.message}>
            We apologize for the inconvenience. The Sketch Museum encountered an unexpected error. 
            Please try refreshing the page or returning to the home gallery.
          </p>
          
          <div style={styles.actions}>
            <button 
              style={styles.primaryButton} 
              onClick={this.handleRetry}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Try Again
            </button>
            <button 
              style={styles.secondaryButton} 
              onClick={this.handleReload}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              Refresh Page
            </button>
            <button 
              style={styles.secondaryButton} 
              onClick={this.handleGoHome}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              Return Home
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && error && (
            <details style={styles.details}>
              <summary style={styles.summary}>Error Details (Development)</summary>
              <div>
                <h4>Error Message:</h4>
                <pre style={styles.pre}>{error.message}</pre>
                
                <h4>Stack Trace:</h4>
                <pre style={styles.pre}>{error.stack}</pre>
                
                {errorInfo && (
                  <>
                    <h4>Component Stack:</h4>
                    <pre style={styles.pre}>{errorInfo.componentStack}</pre>
                  </>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryProvider;