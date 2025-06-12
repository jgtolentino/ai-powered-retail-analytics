import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageLayout from '../PageLayout';

describe('PageLayout Component', () => {
  it('renders title when provided', () => {
    render(
      <PageLayout title="Test Title">
        <div>Content</div>
      </PageLayout>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <PageLayout 
        title="Test Title" 
        description="Test description"
      >
        <div>Content</div>
      </PageLayout>
    );
    
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    const actions = <button>Test Action</button>;
    
    render(
      <PageLayout 
        title="Test Title" 
        actions={actions}
      >
        <div>Content</div>
      </PageLayout>
    );
    
    expect(screen.getByText('Test Action')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <PageLayout title="Test Title">
        <div data-testid="page-content">Test content</div>
      </PageLayout>
    );
    
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('handles complex title with React elements', () => {
    const complexTitle: React.ReactNode = (
      <div className="flex items-center">
        <span>Complex Title</span>
        <span className="badge">PRO</span>
      </div>
    );
    
    render(
      <PageLayout title={complexTitle}>
        <div>Content</div>
      </PageLayout>
    );
    
    expect(screen.getByText('Complex Title')).toBeInTheDocument();
    expect(screen.getByText('PRO')).toBeInTheDocument();
  });

  it('maintains consistent spacing structure', () => {
    const { container } = render(
      <PageLayout title="Test Title">
        <div>Content</div>
      </PageLayout>
    );
    
    // Verify the main container has the space-y-6 class
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('space-y-6');
  });
});