import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface FilterState {
  // Time filters
  dateFilter: 'all' | 'today' | '7d' | '30d' | 'custom';
  customDateRange?: { start: Date; end: Date };
  
  // Location filters
  regionFilter: string | null;
  cityFilter: string | null;
  
  // Product filters
  categoryFilter: string | null;
  brandFilter: string | null;
  
  // Customer filters
  ageFilter: '18-25' | '26-35' | '36-50' | '50+' | null;
  genderFilter: 'Male' | 'Female' | null;
  paymentFilter: 'cash' | 'card' | 'gcash' | null;
  
  // Advanced filters
  minTransaction: number | null;
  maxTransaction: number | null;
  customerSegment: string | null;
}

const defaultFilters: FilterState = {
  dateFilter: 'all',
  regionFilter: null,
  cityFilter: null,
  categoryFilter: null,
  brandFilter: null,
  ageFilter: null,
  genderFilter: null,
  paymentFilter: null,
  minTransaction: null,
  maxTransaction: null,
  customerSegment: null,
};

export const useEnhancedFiltering = (initialFilters?: Partial<FilterState>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL params or defaults
  const [filters, setFilters] = useState<FilterState>(() => {
    const urlFilters: Partial<FilterState> = {};
    
    // Parse URL params
    searchParams.forEach((value, key) => {
      if (key in defaultFilters) {
        urlFilters[key as keyof FilterState] = value === 'null' ? null : value;
      }
    });
    
    return {
      ...defaultFilters,
      ...initialFilters,
      ...urlFilters,
    };
  });

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== defaultFilters[key as keyof FilterState]) {
        params.set(key, String(value));
      }
    });
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Load saved filter presets from localStorage
  const [filterPresets, setFilterPresets] = useState<Record<string, FilterState>>(() => {
    const saved = localStorage.getItem('scout-filter-presets');
    return saved ? JSON.parse(saved) : {};
  });

  // Save filter preset
  const saveFilterPreset = useCallback((name: string) => {
    const newPresets = {
      ...filterPresets,
      [name]: { ...filters }
    };
    setFilterPresets(newPresets);
    localStorage.setItem('scout-filter-presets', JSON.stringify(newPresets));
  }, [filters, filterPresets]);

  // Load filter preset
  const loadFilterPreset = useCallback((name: string) => {
    if (filterPresets[name]) {
      setFilters(filterPresets[name]);
    }
  }, [filterPresets]);

  // Update single filter
  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Batch update filters
  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset filters
  const resetFilters = useCallback((keys?: (keyof FilterState)[]) => {
    if (keys) {
      const updates: Partial<FilterState> = {};
      keys.forEach(key => {
        updates[key] = defaultFilters[key];
      });
      setFilters(prev => ({ ...prev, ...updates }));
    } else {
      setFilters(defaultFilters);
    }
  }, []);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      const defaultValue = defaultFilters[key as keyof FilterState];
      return value !== defaultValue && value !== null;
    }).length;
  }, [filters]);

  // Generate filter summary
  const filterSummary = useMemo(() => {
    const summary: string[] = [];
    
    if (filters.dateFilter !== 'all') {
      summary.push(`Date: ${filters.dateFilter}`);
    }
    if (filters.regionFilter) {
      summary.push(`Region: ${filters.regionFilter}`);
    }
    if (filters.categoryFilter) {
      summary.push(`Category: ${filters.categoryFilter}`);
    }
    if (filters.brandFilter) {
      summary.push(`Brand: ${filters.brandFilter}`);
    }
    if (filters.ageFilter) {
      summary.push(`Age: ${filters.ageFilter}`);
    }
    if (filters.genderFilter) {
      summary.push(`Gender: ${filters.genderFilter}`);
    }
    if (filters.paymentFilter) {
      summary.push(`Payment: ${filters.paymentFilter}`);
    }
    
    return summary;
  }, [filters]);

  // Check if filters have changed from default
  const hasActiveFilters = useMemo(() => {
    return activeFilterCount > 0;
  }, [activeFilterCount]);

  // Export filters for API calls
  const getApiFilters = useCallback(() => {
    const apiFilters: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== defaultFilters[key as keyof FilterState]) {
        // Convert to API parameter names
        const apiKey = key === 'dateFilter' ? 'p_date_filter' :
                      key === 'regionFilter' ? 'p_region_filter' :
                      key === 'categoryFilter' ? 'p_category_filter' :
                      key === 'brandFilter' ? 'p_brand_filter' :
                      key === 'ageFilter' ? 'p_age_filter' :
                      key === 'genderFilter' ? 'p_gender_filter' :
                      key === 'paymentFilter' ? 'p_payment_filter' :
                      `p_${key}`;
        apiFilters[apiKey] = value;
      }
    });
    
    return apiFilters;
  }, [filters]);

  // Quick filter presets
  const applyQuickFilter = useCallback((preset: string) => {
    switch (preset) {
      case 'today':
        updateFilters({
          dateFilter: 'today',
          regionFilter: null,
          categoryFilter: null,
        });
        break;
      case 'last-week':
        updateFilters({
          dateFilter: '7d',
          regionFilter: null,
          categoryFilter: null,
        });
        break;
      case 'last-month':
        updateFilters({
          dateFilter: '30d',
          regionFilter: null,
          categoryFilter: null,
        });
        break;
      case 'high-value':
        updateFilters({
          minTransaction: 500,
          customerSegment: 'premium',
        });
        break;
      case 'metro-manila':
        updateFilters({
          regionFilter: 'NCR',
          cityFilter: null,
        });
        break;
      case 'tbwa-brands':
        updateFilters({
          brandFilter: null, // Will be handled in component with TBWA brand list
        });
        break;
      case 'digital-payments':
        updateFilters({
          paymentFilter: 'gcash',
        });
        break;
      case 'young-customers':
        updateFilters({
          ageFilter: '18-25',
        });
        break;
      default:
        break;
    }
  }, [updateFilters]);

  // Smart filter suggestions based on current data
  const getFilterSuggestions = useCallback(() => {
    const suggestions = [];
    
    if (!hasActiveFilters) {
      suggestions.push(
        { preset: 'today', label: 'Today\'s Data', description: 'View today\'s transactions' },
        { preset: 'high-value', label: 'High Value Customers', description: 'Transactions over ₱500' },
        { preset: 'metro-manila', label: 'Metro Manila', description: 'NCR region only' }
      );
    } else {
      if (filters.dateFilter === 'all') {
        suggestions.push({ preset: 'today', label: 'Focus on Today', description: 'Narrow to today\'s data' });
      }
      if (!filters.regionFilter) {
        suggestions.push({ preset: 'metro-manila', label: 'Metro Manila', description: 'Add location filter' });
      }
      if (!filters.paymentFilter) {
        suggestions.push({ preset: 'digital-payments', label: 'Digital Payments', description: 'GCash/Card only' });
      }
    }
    
    return suggestions;
  }, [filters, hasActiveFilters]);

  return {
    // State
    filters,
    filterPresets,
    activeFilterCount,
    filterSummary,
    hasActiveFilters,
    
    // Actions
    updateFilter,
    updateFilters,
    resetFilters,
    saveFilterPreset,
    loadFilterPreset,
    applyQuickFilter,
    getApiFilters,
    getFilterSuggestions,
    
    // Utilities
    isFilterActive: (key: keyof FilterState) => {
      return filters[key] !== defaultFilters[key] && filters[key] !== null;
    },
    
    // Validation
    isValidFilter: (key: keyof FilterState, value: any) => {
      switch (key) {
        case 'dateFilter':
          return ['all', 'today', '7d', '30d', 'custom'].includes(value);
        case 'ageFilter':
          return value === null || ['18-25', '26-35', '36-50', '50+'].includes(value);
        case 'genderFilter':
          return value === null || ['Male', 'Female'].includes(value);
        case 'paymentFilter':
          return value === null || ['cash', 'card', 'gcash'].includes(value);
        case 'minTransaction':
        case 'maxTransaction':
          return value === null || (typeof value === 'number' && value >= 0);
        default:
          return true;
      }
    },
  };
};

export default useEnhancedFiltering;