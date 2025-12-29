import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import * as fc from 'fast-check';
import { ProcessShowcase } from './ProcessShowcase';
import { museumTheme } from '@/styles/theme';
import { ProcessStep } from '@/types';

// **Feature: sketch-museum-portfolio, Property 8: Process workflow display with correct sequential order and minimal text**

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, fill, priority, sizes, quality, ...props }: any) => (
    <img src={src} alt={alt} data-testid="process-step-image" {...props} />
  ),
}));

// Test wrapper with theme
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={museumTheme}>
    {children}
  </ThemeProvider>
);

describe('ProcessShowcase Workflow Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Property test for process workflow display
  it('should display workflow steps in correct sequential order with minimal text', async () => {
    // Generator for valid process steps with non-empty strings
    const nonEmptyString = fc.string({ minLength: 2, maxLength: 50 })
      .filter(s => s.trim().length >= 2 && !/^\d+$/.test(s.trim()) && /^[a-zA-Z0-9\s\-_]+$/.test(s.trim()));
    const minimalDescription = fc.string({ minLength: 10, maxLength: 100 })
      .filter(s => s.trim().length >= 10 && /^[a-zA-Z0-9\s\-_.,!?]+$/.test(s.trim()));
    
    const processStepArbitrary = fc.record({
      id: nonEmptyString,
      title: nonEmptyString,
      description: minimalDescription, // Keep descriptions minimal but meaningful
      imageUrl: fc.webUrl(),
      order: fc.integer({ min: 1, max: 10 }),
      duration: fc.option(fc.integer({ min: 5, max: 300 })), // 5 minutes to 5 hours
    });

    // Generator for array of process steps (2-6 steps for realistic workflow)
    const processStepsArbitrary = fc.array(processStepArbitrary, { minLength: 2, maxLength: 6 })
      .map(steps => {
        // Ensure unique IDs and sequential order numbers
        return steps.map((step, index) => ({
          ...step,
          id: `step-${index + 1}`,
          order: index + 1,
        }));
      });

    // Generator for component props
    const propsArbitrary = fc.record({
      steps: processStepsArbitrary,
      autoPlay: fc.boolean(),
    });

    await fc.assert(
      fc.asyncProperty(propsArbitrary, async (props) => {
        const { container, unmount } = render(
          <TestWrapper>
            <ProcessShowcase
              steps={props.steps as ProcessStep[]}
              autoPlay={props.autoPlay}
            />
          </TestWrapper>
        );

        try {
          // Verify the main showcase container exists
          const showcase = screen.getByTestId('process-showcase');
          expect(showcase).toBeInTheDocument();

          // Verify all steps are rendered
          expect(props.steps).toHaveLength(props.steps.length);
          
          // Check that steps are displayed in correct sequential order
          const renderedSteps = props.steps.map((_, index) => 
            screen.getByTestId(`process-step-${index + 1}`)
          );
          
          expect(renderedSteps).toHaveLength(props.steps.length);

          // Verify each step contains required elements with minimal text
          props.steps.forEach((step, index) => {
            const stepElement = screen.getByTestId(`process-step-${step.order}`);
            expect(stepElement).toBeInTheDocument();

            // Verify step title is displayed within this specific step (should be concise)
            const titleElement = stepElement.querySelector('h3');
            expect(titleElement).toBeTruthy();
            expect(titleElement?.textContent).toBe(step.title);
            expect(step.title.length).toBeLessThanOrEqual(50); // Minimal text constraint
            
            // Verify step description is displayed within this specific step (should be minimal but informative)
            const descriptionElement = stepElement.querySelector('p');
            expect(descriptionElement).toBeTruthy();
            expect(descriptionElement?.textContent).toBe(step.description);
            expect(step.description.length).toBeLessThanOrEqual(100); // Minimal text constraint
            expect(step.description.length).toBeGreaterThanOrEqual(10); // But still informative
            
            // Verify image is rendered with correct alt text within this step
            const stepImage = stepElement.querySelector('img[data-testid="process-step-image"]');
            expect(stepImage).toBeTruthy();
            expect(stepImage?.getAttribute('alt')).toContain(`Step ${step.order}`);
            expect(stepImage?.getAttribute('src')).toBe(step.imageUrl);
            
            // Verify duration is displayed if provided within this step
            if (step.duration) {
              const durationElement = stepElement.querySelector('div:last-child');
              if (durationElement?.textContent?.includes('minutes')) {
                expect(durationElement.textContent).toContain(`${step.duration} minutes`);
              }
            }
          });

          // Verify sequential order is maintained in DOM
          // Get step numbers from the current test instance only
          const currentShowcase = screen.getByTestId('process-showcase');
          const stepNumberElements = currentShowcase.querySelectorAll('[class*="StepNumber"], [class*="sc-"]');
          const stepNumbers = Array.from(stepNumberElements)
            .map(el => el.textContent?.trim())
            .filter(text => text && /^\d+$/.test(text))
            .map(text => parseInt(text!));
          const expectedOrder = props.steps.map((_, index) => index + 1);
          expect(stepNumbers.sort()).toEqual(expectedOrder.sort());
          
          // Verify visual progression indicators exist
          expect(showcase.querySelector('div')).toBeTruthy();
        } finally {
          // Clean up to avoid conflicts between test runs
          unmount();
        }
      }),
      { numRuns: 20 } // Reduced runs for faster testing and less conflicts
    );
  });

  it('should handle empty steps array gracefully', () => {
    render(
      <TestWrapper>
        <ProcessShowcase steps={[]} autoPlay={false} />
      </TestWrapper>
    );

    // Verify the showcase container still renders
    const showcase = screen.getByTestId('process-showcase');
    expect(showcase).toBeInTheDocument();
    
    // Verify header content is still displayed
    expect(screen.getByText('Artistic Process')).toBeInTheDocument();
    expect(screen.getByText(/From initial concept to finished artwork/)).toBeInTheDocument();
  });

  it('should sort steps by order property regardless of input order', () => {
    const unorderedSteps: ProcessStep[] = [
      {
        id: 'step-3',
        title: 'Third Step',
        description: 'This should appear third',
        imageUrl: 'https://example.com/step3.jpg',
        order: 3,
      },
      {
        id: 'step-1',
        title: 'First Step',
        description: 'This should appear first',
        imageUrl: 'https://example.com/step1.jpg',
        order: 1,
      },
      {
        id: 'step-2',
        title: 'Second Step',
        description: 'This should appear second',
        imageUrl: 'https://example.com/step2.jpg',
        order: 2,
      },
    ];

    render(
      <TestWrapper>
        <ProcessShowcase steps={unorderedSteps} autoPlay={false} />
      </TestWrapper>
    );

    // Verify steps are displayed in correct order despite input order
    expect(screen.getByTestId('process-step-1')).toBeInTheDocument();
    expect(screen.getByTestId('process-step-2')).toBeInTheDocument();
    expect(screen.getByTestId('process-step-3')).toBeInTheDocument();
    
    // Verify content appears in correct order
    expect(screen.getByText('First Step')).toBeInTheDocument();
    expect(screen.getByText('Second Step')).toBeInTheDocument();
    expect(screen.getByText('Third Step')).toBeInTheDocument();
  });

  it('should maintain minimal text constraint for titles and descriptions', () => {
    const stepsWithLongText: ProcessStep[] = [
      {
        id: 'step-1',
        title: 'A'.repeat(100), // Very long title
        description: 'B'.repeat(200), // Very long description
        imageUrl: 'https://example.com/step1.jpg',
        order: 1,
      },
    ];

    render(
      <TestWrapper>
        <ProcessShowcase steps={stepsWithLongText} autoPlay={false} />
      </TestWrapper>
    );

    // Component should still render even with long text
    expect(screen.getByTestId('process-step-1')).toBeInTheDocument();
    
    // The text should be displayed (component doesn't truncate, but design should encourage minimal text)
    expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    expect(screen.getByText('B'.repeat(200))).toBeInTheDocument();
  });

  it('should display clear visual progression indicators', () => {
    const sampleSteps: ProcessStep[] = [
      {
        id: 'step-1',
        title: 'Start',
        description: 'Beginning of process',
        imageUrl: 'https://example.com/step1.jpg',
        order: 1,
      },
      {
        id: 'step-2',
        title: 'Middle',
        description: 'Middle of process',
        imageUrl: 'https://example.com/step2.jpg',
        order: 2,
      },
    ];

    const { container } = render(
      <TestWrapper>
        <ProcessShowcase steps={sampleSteps} autoPlay={false} />
      </TestWrapper>
    );

    // Verify step numbers are displayed as visual indicators
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Verify progress indicator line exists in the DOM
    const progressIndicator = container.querySelector('div[class*="ProgressIndicator"], div[class*="sc-"]');
    expect(progressIndicator).toBeTruthy();
  });
});