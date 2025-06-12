/**
 * Configuration file for static data that doesn't change frequently
 * This replaces hardcoded values throughout the application
 */

export const PHILIPPINES_LOCATIONS = {
  regions: [
    { name: 'Metro Manila', lat: 14.5995, lng: 120.9842, population: 13484462 },
    { name: 'Calabarzon', lat: 14.1014, lng: 121.0794, population: 14414774 },
    { name: 'Central Luzon', lat: 15.4801, lng: 120.7124, population: 12422172 },
    { name: 'Western Visayas', lat: 10.7202, lng: 122.5621, population: 4730771 },
    { name: 'Central Visayas', lat: 10.3157, lng: 123.8854, population: 6041903 },
    { name: 'Northern Mindanao', lat: 8.4833, lng: 124.6500, population: 4689302 },
    { name: 'Davao Region', lat: 7.1907, lng: 125.4553, population: 5243536 }
  ],
  cities: [
    { name: 'Manila', region: 'Metro Manila', lat: 14.5995, lng: 120.9842 },
    { name: 'Quezon City', region: 'Metro Manila', lat: 14.6760, lng: 121.0437 },
    { name: 'Caloocan', region: 'Metro Manila', lat: 14.6479, lng: 120.9657 },
    { name: 'Davao City', region: 'Davao Region', lat: 7.1907, lng: 125.4553 },
    { name: 'Cebu City', region: 'Central Visayas', lat: 10.3157, lng: 123.8854 },
    { name: 'Zamboanga City', region: 'Zamboanga Peninsula', lat: 6.9214, lng: 122.0790 }
  ]
};

export const PRODUCT_CATEGORIES = {
  'Food & Beverages': {
    subcategories: ['Beverages', 'Snacks', 'Instant Foods', 'Dairy', 'Condiments'],
    color: '#3B82F6'
  },
  'Personal Care': {
    subcategories: ['Soap & Bath', 'Oral Care', 'Hair Care', 'Skin Care', 'Deodorants'],
    color: '#10B981'
  },
  'Household Products': {
    subcategories: ['Cleaning', 'Laundry', 'Kitchen', 'Paper Products', 'Air Fresheners'],
    color: '#F59E0B'
  },
  'Health & Wellness': {
    subcategories: ['Vitamins', 'Medicine', 'First Aid', 'Baby Care', 'Adult Care'],
    color: '#EF4444'
  },
  'Tobacco': {
    subcategories: ['Cigarettes', 'Accessories'],
    color: '#8B5CF6'
  }
};

export const COMPETITIVE_BENCHMARKS = {
  industry_averages: {
    'Brand Awareness': 78,
    'Purchase Intent': 65,
    'Customer Satisfaction': 4.1,
    'Price Perception': 75,
    'Quality Rating': 4.3
  },
  market_leaders: {
    'Brand Awareness': 92,
    'Purchase Intent': 82,
    'Customer Satisfaction': 4.7,
    'Price Perception': 88,
    'Quality Rating': 4.8
  }
};

export const BUSINESS_HOURS = {
  standard: { open: 6, close: 22 }, // 6 AM to 10 PM
  weekend: { open: 7, close: 21 }, // 7 AM to 9 PM
  peak_hours: [8, 9, 12, 13, 17, 18, 19], // 8-9 AM, 12-1 PM, 5-7 PM
  low_hours: [2, 3, 4, 5, 14, 15] // 2-5 AM, 2-3 PM
};

export const CURRENCY_CONFIG = {
  symbol: '₱',
  code: 'PHP',
  locale: 'en-PH',
  decimals: 2
};

export const DATE_CONFIG = {
  locale: 'en-PH',
  timezone: 'Asia/Manila',
  formats: {
    short: 'MM/dd/yyyy',
    long: 'MMMM dd, yyyy',
    time: 'HH:mm',
    datetime: 'MM/dd/yyyy HH:mm'
  }
};

export const CHART_COLORS = {
  primary: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'],
  tbwa: '#3B82F6',
  competitor: '#EF4444',
  industry: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
};

export const PAGINATION_CONFIG = {
  defaultPageSize: 50,
  pageSizeOptions: [25, 50, 100, 200],
  maxItemsPerPage: 500
};

export const CACHE_CONFIG = {
  dashboard_metrics: 5 * 60 * 1000, // 5 minutes
  brand_performance: 10 * 60 * 1000, // 10 minutes
  basket_analytics: 15 * 60 * 1000, // 15 minutes
  transaction_data: 2 * 60 * 1000, // 2 minutes
  static_data: 60 * 60 * 1000 // 1 hour
};

/**
 * Helper functions for working with static data
 */
export const StaticDataHelpers = {
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: CURRENCY_CONFIG.code,
      minimumFractionDigits: CURRENCY_CONFIG.decimals
    }).format(amount);
  },

  formatDate: (date: Date, format: keyof typeof DATE_CONFIG.formats = 'short'): string => {
    const options: Intl.DateTimeFormatOptions = {};
    
    switch (format) {
      case 'short':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        break;
      case 'long':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        break;
      case 'time':
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = false;
        break;
      case 'datetime':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = false;
        break;
    }

    return new Intl.DateTimeFormat(DATE_CONFIG.locale, options).format(date);
  },

  getCategoryColor: (category: string): string => {
    return PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES]?.color || CHART_COLORS.primary[0];
  },

  getRegionByCity: (cityName: string): string | null => {
    const city = PHILIPPINES_LOCATIONS.cities.find(c => c.name === cityName);
    return city ? city.region : null;
  },

  isBusinessHour: (hour: number, isWeekend: boolean = false): boolean => {
    const hours = isWeekend ? BUSINESS_HOURS.weekend : BUSINESS_HOURS.standard;
    return hour >= hours.open && hour <= hours.close;
  },

  isPeakHour: (hour: number): boolean => {
    return BUSINESS_HOURS.peak_hours.includes(hour);
  }
};