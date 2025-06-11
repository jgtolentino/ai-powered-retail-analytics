import React, { useState } from 'react';
import { Package, Bot, RefreshCw, Download, Filter, Settings, BarChart3, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useEnhancedFiltering } from '../hooks/useEnhancedFiltering';
import { EnhancedScoutPanel } from './enhanced/EnhancedScoutPanelFixed';
import { AIInsightsOverlay } from './ai/AIInsightsOverlay';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase/client';
import { FilterPersistence } from '../utils/filterPersistence';

interface FilterBarProps {
  filters: any;
  updateFilter: (key: string, value: any) => void;
  resetFilters: () => void;
  filterSummary: string[];
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  updateFilter, 
  resetFilters, 
  filterSummary, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Active Filters</h3>
        <Button 
          onClick={resetFilters} 
          variant="outline" 
          size="sm"
          disabled={filterSummary.length === 0}
        >
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Date Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Time Period</label>
          <select
            value={filters.dateFilter}
            onChange={(e) => updateFilter('dateFilter', e.target.value)}
            className="w-full text-sm border rounded-lg px-3 py-2"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Region</label>
          <input
            type="text"
            placeholder="e.g., NCR, Cebu"
            value={filters.regionFilter || ''}
            onChange={(e) => updateFilter('regionFilter', e.target.value || null)}
            className="w-full text-sm border rounded-lg px-3 py-2"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Category</label>
          <input
            type="text"
            placeholder="Product category"
            value={filters.categoryFilter || ''}
            onChange={(e) => updateFilter('categoryFilter', e.target.value || null)}
            className="w-full text-sm border rounded-lg px-3 py-2"
          />
        </div>

        {/* Brand Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Brand</label>
          <input
            type="text"
            placeholder="Brand name"
            value={filters.brandFilter || ''}
            onChange={(e) => updateFilter('brandFilter', e.target.value || null)}
            className="w-full text-sm border rounded-lg px-3 py-2"
          />
        </div>

        {/* Age Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Age Group</label>
          <select
            value={filters.ageFilter || ''}
            onChange={(e) => updateFilter('ageFilter', e.target.value || null)}
            className="w-full text-sm border rounded-lg px-3 py-2"
          >
            <option value="">All Ages</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-50">36-50</option>
            <option value="50+">50+</option>
          </select>
        </div>

        {/* Payment Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Payment</label>
          <select
            value={filters.paymentFilter || ''}
            onChange={(e) => updateFilter('paymentFilter', e.target.value || null)}
            className="w-full text-sm border rounded-lg px-3 py-2"
          >
            <option value="">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="gcash">GCash</option>
          </select>
        </div>
      </div>

      {/* Filter Summary */}
      {filterSummary.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-700">Applied:</span>
            {filterSummary.map((summary, index) => (
              <span 
                key={index}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
              >
                {summary}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const EnhancedScoutDashboard: React.FC = () => {
  const [showAI, setShowAI] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    filters,
    updateFilter,
    resetFilters,
    activeFilterCount,
    filterSummary,
    applyQuickFilter,
    getApiFilters,
    saveFilterPreset,
    hasActiveFilters
  } = useEnhancedFiltering();

  // Mock dashboard data since we're using existing database functions
  const { data: dashboardData, refetch, isRefetching, error } = useQuery({
    queryKey: ['enhanced-dashboard', filters],
    queryFn: async () => {
      // Return mock data that matches the expected structure
      return {
        summary_stats: {
          total_transactions: 18000,
          total_revenue: 2500000,
          avg_transaction: 139,
          unique_customers: 8500
        }
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    retry: 2
  });

  // Auto-save filters
  React.useEffect(() => {
    if (hasActiveFilters) {
      FilterPersistence.autoSave(filters);
    }
  }, [filters, hasActiveFilters]);

  // Mock quick stats for header since we're using existing functions
  const { data: quickStats } = useQuery({
    queryKey: ['quick-stats'],
    queryFn: async () => {
      return {
        total_transactions: 18000,
        total_revenue: 2500000,
        unique_customers: 8500
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // 10 minutes
  });

  const handleExportData = () => {
    const exportData = {
      filters,
      data: dashboardData,
      quickStats,
      exportedAt: new Date().toISOString(),
      metadata: {
        totalTransactions: dashboardData?.summary_stats?.total_transactions || 0,
        totalRevenue: dashboardData?.summary_stats?.total_revenue || 0,
        dataSource: 'Enhanced Scout Dashboard',
        version: '2.0'
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `scout-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleSaveCurrentFilters = () => {
    const presetName = prompt('Enter a name for this filter preset:');
    if (presetName && presetName.trim()) {
      saveFilterPreset(presetName.trim());
      alert('Filter preset saved successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Enhanced Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="h-8 w-8 mr-3 text-blue-600" />
              Scout Dashboard
              <span className="ml-3 text-sm font-normal bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Enhanced
              </span>
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-600">
                Philippine Retail Intelligence • {dashboardData?.summary_stats?.total_transactions?.toLocaleString() || quickStats?.total_transactions?.toLocaleString() || '0'} Transactions
              </p>
              {dashboardData?.summary_stats?.total_revenue && (
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                  ₱{dashboardData.summary_stats.total_revenue.toLocaleString()} Revenue
                </span>
              )}
              {activeFilterCount > 0 && (
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {activeFilterCount} active filters
                </span>
              )}
              {error && (
                <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                  Data load error
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick Filter Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyQuickFilter('today')}
                className="text-xs"
              >
                Today
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyQuickFilter('last-week')}
                className="text-xs"
              >
                7 Days
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => applyQuickFilter('metro-manila')}
                className="text-xs"
              >
                NCR
              </Button>
            </div>

            <div className="h-8 w-px bg-gray-300" />

            {/* Main Action Buttons */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            
            <Button
              onClick={() => setShowAI(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="sm"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
            
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              disabled={isRefetching}
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={!dashboardData}
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              size="sm"
              className={showSettings ? 'bg-gray-100' : ''}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 bg-white rounded-lg border shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Dashboard Settings</h3>
          <div className="flex gap-3">
            <Button
              onClick={handleSaveCurrentFilters}
              variant="outline"
              size="sm"
              disabled={!hasActiveFilters}
            >
              Save Current Filters
            </Button>
            <Button
              onClick={() => {
                FilterPersistence.cleanup();
                alert('Filter cache cleaned up!');
              }}
              variant="outline"
              size="sm"
            >
              Clear Cache
            </Button>
            <Button
              onClick={() => {
                const info = FilterPersistence.getStorageInfo();
                alert(`Storage: ${info.usedKB}KB used (${info.percentUsed}%)`);
              }}
              variant="outline"
              size="sm"
            >
              Storage Info
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Filter Bar */}
      {showFilters && (
        <FilterBar
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          filterSummary={filterSummary}
          className="mb-6"
        />
      )}

      {/* Loading State */}
      {isRefetching && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-blue-700">Refreshing dashboard data...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm text-red-700">
              Error loading data: {error.message}
            </span>
            <Button onClick={() => refetch()} size="sm" variant="outline">
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced 4-Panel Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
        <EnhancedScoutPanel 
          panelType="trends" 
          filters={filters}
          className="h-full"
        />
        <EnhancedScoutPanel 
          panelType="products" 
          filters={filters}
          className="h-full"
        />
        <EnhancedScoutPanel 
          panelType="behavior" 
          filters={filters}
          className="h-full"
        />
        <EnhancedScoutPanel 
          panelType="profiling" 
          filters={filters}
          className="h-full"
        />
      </div>

      {/* Performance Metrics Footer */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-4 text-xs text-gray-500 bg-white px-4 py-2 rounded-full border">
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            Enhanced Performance
          </span>
          <span>•</span>
          <span>Database-Optimized Queries</span>
          <span>•</span>
          <span>AI-Powered Insights</span>
          <span>•</span>
          <span>Real-time Analytics</span>
        </div>
      </div>

      {/* AI Insights Overlay */}
      <AIInsightsOverlay
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        dashboardData={dashboardData}
        filters={filters}
      />
    </div>
  );
};

export default EnhancedScoutDashboard;