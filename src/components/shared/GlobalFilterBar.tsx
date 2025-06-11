import React, { useState } from 'react';
import { Calendar, Search, Store, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { useFilters } from '../../context/FilterContext';

interface GlobalFilterBarProps {
  className?: string;
}

export const GlobalFilterBar: React.FC<GlobalFilterBarProps> = ({ className = '' }) => {
  const { filters, updateFilter, resetFilters, applyQuickFilter } = useFilters();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Calculate active filters count
  React.useEffect(() => {
    let count = 0;
    if (filters.storeId) count++;
    if (filters.searchQuery) count++;
    if (filters.ageGroup) count++;
    if (filters.gender && filters.gender !== 'all') count++;
    if (filters.paymentMethod && filters.paymentMethod !== 'all') count++;
    if (filters.region) count++;
    if (filters.brandFilter) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const quickPresets = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last Week', value: 'last-week' },
    { label: 'Last Month', value: 'last-month' },
    { label: 'Metro Manila', value: 'metro-manila' },
    { label: 'TBWA Brands', value: 'tbwa-brands' },
    { label: 'Digital Payments', value: 'digital-payments' }
  ];

  return (
    <div className={`bg-white border-b border-gray-200 p-4 ${className}`}>
      {/* Main Filter Row */}
      <div className="flex items-center gap-4 mb-3">
        {/* Date Range Picker */}
        <div className="flex items-center gap-2 min-w-fit">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
            className="text-sm border rounded px-2 py-1"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
            className="text-sm border rounded px-2 py-1"
          />
        </div>

        {/* Store Selector */}
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-gray-500" />
          <select
            value={filters.storeId || ''}
            onChange={(e) => updateFilter('storeId', e.target.value || undefined)}
            className="text-sm border rounded px-2 py-1 min-w-32"
          >
            <option value="">All Stores</option>
            <option value="1">Main Store</option>
            <option value="2">Quezon City</option>
            <option value="3">Makati</option>
            <option value="4">Cebu</option>
            <option value="5">Davao</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search brands, products..."
            value={filters.searchQuery || ''}
            onChange={(e) => updateFilter('searchQuery', e.target.value || undefined)}
            className="text-sm border rounded px-2 py-1 flex-1"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          More Filters
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </Button>

        {/* Reset Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Quick Presets Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-gray-600 mr-2">Quick filters:</span>
        {quickPresets.map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter(preset.value)}
            className="text-xs px-2 py-1 h-auto"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Region Filter */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Region</label>
              <select
                value={filters.region || ''}
                onChange={(e) => updateFilter('region', e.target.value || undefined)}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="">All Regions</option>
                <option value="NCR">National Capital Region</option>
                <option value="Central Luzon">Central Luzon</option>
                <option value="Calabarzon">Calabarzon</option>
                <option value="Western Visayas">Western Visayas</option>
                <option value="Central Visayas">Central Visayas</option>
              </select>
            </div>

            {/* Age Group Filter */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Age Group</label>
              <select
                value={filters.ageGroup || ''}
                onChange={(e) => updateFilter('ageGroup', e.target.value || undefined)}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="">All Ages</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Gender</label>
              <select
                value={filters.gender || 'all'}
                onChange={(e) => updateFilter('gender', e.target.value)}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Payment</label>
              <select
                value={filters.paymentMethod || 'all'}
                onChange={(e) => updateFilter('paymentMethod', e.target.value)}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="gcash">GCash</option>
              </select>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mt-4">
            <label className="text-xs font-medium text-gray-700 mb-1 block">Brand Filter</label>
            <div className="flex gap-2">
              <Button
                variant={filters.brandFilter === 'tbwa' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('brandFilter', filters.brandFilter === 'tbwa' ? undefined : 'tbwa')}
              >
                TBWA Brands Only
              </Button>
              <Button
                variant={filters.brandFilter === 'competitor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('brandFilter', filters.brandFilter === 'competitor' ? undefined : 'competitor')}
              >
                Competitors Only
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-600">Active filters:</span>
            {filters.storeId && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Store: {filters.storeId}
              </span>
            )}
            {filters.searchQuery && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Search: "{filters.searchQuery}"
              </span>
            )}
            {filters.region && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Region: {filters.region}
              </span>
            )}
            {filters.ageGroup && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Age: {filters.ageGroup}
              </span>
            )}
            {filters.gender && filters.gender !== 'all' && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Gender: {filters.gender}
              </span>
            )}
            {filters.paymentMethod && filters.paymentMethod !== 'all' && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Payment: {filters.paymentMethod}
              </span>
            )}
            {filters.brandFilter && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Brands: {filters.brandFilter === 'tbwa' ? 'TBWA Only' : 'Competitors Only'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalFilterBar;