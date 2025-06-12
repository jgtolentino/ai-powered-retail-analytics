/**
 * Responsive Dashboard Wrapper
 * Automatically switches between desktop and mobile layouts based on screen size
 * Integrates all advanced features: AI insights, real-time analytics, and mobile optimization
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Monitor, Smartphone, Tablet, Loader2 } from 'lucide-react';

// Lazy load components for better performance
const BrandPerformancePage = lazy(() => import('./BrandPerformancePage'));
const ProductionReadyBrandPerformance = lazy(() => import('./enhanced/ProductionReadyBrandPerformance'));
const AdvancedAIInsights = lazy(() => import('./ai/AdvancedAIInsights'));
const RealTimeAnalyticsDashboard = lazy(() => import('./realtime/RealTimeAnalyticsDashboard'));
const MobileOptimizedDashboard = lazy(() => import('./mobile/MobileOptimizedDashboard'));

interface ViewportInfo {
  width: number;
  height: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  isTouch: boolean;
}

interface DashboardConfig {
  view: 'basic' | 'production' | 'ai-insights' | 'realtime' | 'mobile';
  showAdvancedFeatures: boolean;
  enableRealTimeUpdates: boolean;
  mobileOptimized: boolean;
}

export const ResponsiveDashboardWrapper: React.FC = () => {
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    deviceType: 'desktop',
    orientation: 'landscape',
    isTouch: false
  });

  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
    view: 'basic',
    showAdvancedFeatures: true,
    enableRealTimeUpdates: true,
    mobileOptimized: true
  });

  const [isLoading, setIsLoading] = useState(true);

  /**
   * Detect viewport changes and device capabilities
   */
  useEffect(() => {
    const updateViewportInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine device type based on screen size
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (width < 768) {
        deviceType = 'mobile';
      } else if (width < 1024) {
        deviceType = 'tablet';
      }

      // Determine orientation
      const orientation = width > height ? 'landscape' : 'portrait';

      // Detect touch capability
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setViewportInfo({
        width,
        height,
        deviceType,
        orientation,
        isTouch
      });

      // Auto-configure dashboard based on device
      setDashboardConfig(prev => ({
        ...prev,
        view: deviceType === 'mobile' ? 'mobile' : 
              deviceType === 'tablet' ? 'production' : 
              'realtime',
        mobileOptimized: deviceType !== 'desktop'
      }));
    };

    updateViewportInfo();
    window.addEventListener('resize', updateViewportInfo);
    window.addEventListener('orientationchange', updateViewportInfo);

    // Initial loading delay for smooth transition
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener('resize', updateViewportInfo);
      window.removeEventListener('orientationchange', updateViewportInfo);
      clearTimeout(loadingTimer);
    };
  }, []);

  /**
   * Get device icon
   */
  const getDeviceIcon = () => {
    switch (viewportInfo.deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  /**
   * Loading component
   */
  const LoadingFallback = ({ message = 'Loading dashboard...' }: { message?: string }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-100"></div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Initializing Analytics Dashboard
            </h3>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            {getDeviceIcon()}
            <span>
              {viewportInfo.deviceType} • {viewportInfo.width}×{viewportInfo.height}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-gray-500">Loading components...</div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Get optimal dashboard component based on device and config
   */
  const getDashboardComponent = () => {
    // Mobile-first approach
    if (viewportInfo.deviceType === 'mobile' || dashboardConfig.view === 'mobile') {
      return <MobileOptimizedDashboard />;
    }

    // Route based on selected view
    switch (dashboardConfig.view) {
      case 'ai-insights':
        return <AdvancedAIInsights />;
      
      case 'realtime':
        return <RealTimeAnalyticsDashboard />;
      
      case 'production':
        return <ProductionReadyBrandPerformance />;
      
      case 'basic':
      default:
        return <BrandPerformancePage />;
    }
  };

  /**
   * View selector for desktop/tablet
   */
  const ViewSelector = () => {
    if (viewportInfo.deviceType === 'mobile') return null;

    const views = [
      { id: 'basic' as const, label: 'Basic Analytics', description: 'Standard brand performance dashboard' },
      { id: 'production' as const, label: 'Production Ready', description: 'Enhanced with monitoring & validation' },
      { id: 'ai-insights' as const, label: 'AI Insights', description: 'Advanced AI-powered analysis' },
      { id: 'realtime' as const, label: 'Real-Time', description: 'Live updates with animations' },
      { id: 'mobile' as const, label: 'Mobile Preview', description: 'Mobile-optimized interface' }
    ];

    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Dashboard View</h3>
            <p className="text-sm text-gray-600">
              Choose the dashboard experience ({viewportInfo.deviceType} • {viewportInfo.width}×{viewportInfo.height})
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {getDeviceIcon()}
            <span>{viewportInfo.isTouch ? 'Touch' : 'Mouse'}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => setDashboardConfig(prev => ({ ...prev, view: view.id }))}
              className={`p-3 rounded-lg border text-left transition-all ${
                dashboardConfig.view === view.id
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm">{view.label}</div>
              <div className="text-xs text-gray-500 mt-1">{view.description}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingFallback message="Optimizing for your device..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Import mobile styles */}
      <style>{`
        @import url('./styles/mobile-animations.css');
      `}</style>

      {/* Responsive Dashboard Content */}
      <div className={`${
        viewportInfo.deviceType === 'mobile' ? 'safe-area-top safe-area-bottom' : ''
      }`}>
        {/* View Selector (Desktop/Tablet only) */}
        <div className={viewportInfo.deviceType === 'mobile' ? 'hidden' : 'p-6 pb-0'}>
          <ViewSelector />
        </div>

        {/* Main Dashboard */}
        <Suspense fallback={<LoadingFallback message="Loading dashboard components..." />}>
          <div className={`${
            viewportInfo.deviceType === 'mobile' ? '' : 'p-6 pt-0'
          }`}>
            {getDashboardComponent()}
          </div>
        </Suspense>

        {/* Debug Info (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
            <div>Device: {viewportInfo.deviceType}</div>
            <div>Size: {viewportInfo.width}×{viewportInfo.height}</div>
            <div>Orientation: {viewportInfo.orientation}</div>
            <div>Touch: {viewportInfo.isTouch ? 'Yes' : 'No'}</div>
            <div>View: {dashboardConfig.view}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveDashboardWrapper;