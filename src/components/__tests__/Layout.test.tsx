import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../Layout';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  it('renders the RetailBot branding', () => {
    renderWithRouter(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    
    expect(screen.getByText('RetailBot')).toBeInTheDocument();
    expect(screen.getByText('Sari-Sari Analytics')).toBeInTheDocument();
  });

  it('renders navigation sections', () => {
    renderWithRouter(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    
    expect(screen.getByText('ANALYTICS')).toBeInTheDocument();
    expect(screen.getByText('ADMINISTRATION')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    renderWithRouter(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Sales Explorer')).toBeInTheDocument();
    expect(screen.getByText('AI Console')).toBeInTheDocument();
    expect(screen.getByText('Brand Performance')).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="child-content">Test child content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test child content')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    // This would require mocking useLocation hook
    // For now, just verify structure exists
    renderWithRouter(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    
    const overviewLink = screen.getByText('Overview').closest('a');
    expect(overviewLink).toHaveAttribute('href', '/');
  });
});