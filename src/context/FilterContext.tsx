import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  storeId?: string;
  searchQuery?: string;
  ageGroup?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'all';
  paymentMethod?: 'cash' | 'card' | 'gcash' | 'all';
  region?: string;
  brandFilter?: string;
}

interface FilterContextType {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  resetFilters: () => void;
  applyQuickFilter: (preset: string) => void;
  getURLWithFilters: (additionalParams?: Record<string, string>) => string;
}

const defaultFilters: FilterState = {
  dateRange: {
    start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year ago to capture all historical data
    end: new Date().toISOString().split('T')[0] // today
  },
  storeId: undefined,
  searchQuery: undefined,
  ageGroup: undefined,
  gender: 'all',
  paymentMethod: 'all',
  region: undefined,
  brandFilter: undefined
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Initialize filters from URL on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters: FilterState = {
      dateRange: {
        start: searchParams.get('start') || defaultFilters.dateRange.start,
        end: searchParams.get('end') || defaultFilters.dateRange.end
      },
      storeId: searchParams.get('store_id') || undefined,
      searchQuery: searchParams.get('q') || undefined,
      ageGroup: searchParams.get('age') || undefined,
      gender: (searchParams.get('gender') as FilterState['gender']) || 'all',
      paymentMethod: (searchParams.get('payment') as FilterState['paymentMethod']) || 'all',
      region: searchParams.get('region') || undefined,
      brandFilter: searchParams.get('brand') || undefined
    };
    setFilters(urlFilters);
  }, [location.search]);

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    // Add non-empty filters to URL
    if (newFilters.dateRange.start) params.set('start', newFilters.dateRange.start);
    if (newFilters.dateRange.end) params.set('end', newFilters.dateRange.end);
    if (newFilters.storeId) params.set('store_id', newFilters.storeId);
    if (newFilters.searchQuery) params.set('q', newFilters.searchQuery);
    if (newFilters.ageGroup) params.set('age', newFilters.ageGroup);
    if (newFilters.gender && newFilters.gender !== 'all') params.set('gender', newFilters.gender);
    if (newFilters.paymentMethod && newFilters.paymentMethod !== 'all') params.set('payment', newFilters.paymentMethod);
    if (newFilters.region) params.set('region', newFilters.region);
    if (newFilters.brandFilter) params.set('brand', newFilters.brandFilter);

    const newURL = `${location.pathname}?${params.toString()}`;
    navigate(newURL, { replace: true });
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    updateURL(defaultFilters);
  };

  const applyQuickFilter = (preset: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let quickFilters: Partial<FilterState> = {};

    switch (preset) {
      case 'today':
        quickFilters = { dateRange: { start: today, end: today } };
        break;
      case 'yesterday':
        quickFilters = { dateRange: { start: yesterday, end: yesterday } };
        break;
      case 'last-week':
        quickFilters = { dateRange: { start: weekAgo, end: today } };
        break;
      case 'last-month':
        quickFilters = { dateRange: { start: monthAgo, end: today } };
        break;
      case 'metro-manila':
        quickFilters = { region: 'NCR' };
        break;
      case 'tbwa-brands':
        quickFilters = { brandFilter: 'tbwa' };
        break;
      case 'digital-payments':
        quickFilters = { paymentMethod: 'gcash' };
        break;
      default:
        break;
    }

    const newFilters = { ...filters, ...quickFilters };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const getURLWithFilters = (additionalParams: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    
    // Add current filters
    if (filters.dateRange.start) params.set('start', filters.dateRange.start);
    if (filters.dateRange.end) params.set('end', filters.dateRange.end);
    if (filters.storeId) params.set('store_id', filters.storeId);
    if (filters.searchQuery) params.set('q', filters.searchQuery);
    if (filters.ageGroup) params.set('age', filters.ageGroup);
    if (filters.gender && filters.gender !== 'all') params.set('gender', filters.gender);
    if (filters.paymentMethod && filters.paymentMethod !== 'all') params.set('payment', filters.paymentMethod);
    if (filters.region) params.set('region', filters.region);
    if (filters.brandFilter) params.set('brand', filters.brandFilter);

    // Add additional params
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.set(key, value);
    });

    return `?${params.toString()}`;
  };

  return (
    <FilterContext.Provider value={{
      filters,
      updateFilter,
      resetFilters,
      applyQuickFilter,
      getURLWithFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export default FilterContext;