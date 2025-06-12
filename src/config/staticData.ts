/**
 * Static Data Configuration - Week 4 Complete
 * All remaining static data moved to configuration files
 * Centralized configuration for all hardcoded values and reference data
 */

export interface CompetitiveBenchmarks {
  market_leaders: { [key: string]: number };
  industry_averages: { [key: string]: number };
  performance_targets: { [key: string]: number };
}

export interface BrandColors {
  [brandName: string]: string;
}

export interface CategoryMappings {
  [productName: string]: string;
}

export interface FallbackData {
  brandPerformance: Array<{
    id: string;
    name: string;
    marketShare: number;
    revenue: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
    category: string;
    color: string;
    transactionCount?: number;
  }>;
  basketMetrics: {
    avg_basket_size: number;
    basket_distribution: Array<{ size: number; count: number; percentage: number }>;
    top_products: Array<{ product_name: string; frequency: number; category: string }>;
  };
}

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
  },
  'Pet Care': {
    subcategories: ['Dog Food', 'Cat Food', 'Pet Supplies', 'Pet Health'],
    color: '#06B6D4'
  },
  'Baby Care': {
    subcategories: ['Baby Food', 'Diapers', 'Baby Hygiene', 'Baby Health'],
    color: '#EC4899'
  },
  'Home Care': {
    subcategories: ['Cleaning Products', 'Laundry Care', 'Kitchen Care', 'Air Care'],
    color: '#84CC16'
  }
};

// ✅ WEEK 4 COMPLETE: All competitive benchmarks moved to configuration
export const COMPETITIVE_BENCHMARKS: CompetitiveBenchmarks = {
  market_leaders: {
    'Brand Awareness': 92,
    'Purchase Intent': 85,
    'Customer Satisfaction': 4.8,
    'Price Perception': 88,
    'Quality Rating': 4.7,
    'Market Share': 45.2,
    'Revenue Growth': 18.5,
    'Net Promoter Score': 72,
    'Ad Recall': 68,
    'Brand Loyalty': 78
  },
  industry_averages: {
    'Brand Awareness': 78,
    'Purchase Intent': 68,
    'Customer Satisfaction': 4.2,
    'Price Perception': 75,
    'Quality Rating': 4.1,
    'Market Share': 15.8,
    'Revenue Growth': 8.2,
    'Net Promoter Score': 45,
    'Ad Recall': 42,
    'Brand Loyalty': 52
  },
  performance_targets: {
    'Brand Awareness': 85,
    'Purchase Intent': 75,
    'Customer Satisfaction': 4.5,
    'Price Perception': 80,
    'Quality Rating': 4.4,
    'Market Share': 35.0,
    'Revenue Growth': 12.0,
    'Net Promoter Score': 60,
    'Ad Recall': 55,
    'Brand Loyalty': 65
  }
};

// ✅ WEEK 4 COMPLETE: Brand color schemes for consistent visualization
export const BRAND_COLORS: BrandColors = {
  'TBWA': '#1E40AF',
  'P&G': '#22C55E',
  'Unilever': '#EF4444',
  'Nestlé': '#F59E0B',
  'Johnson & Johnson': '#8B5CF6',
  'Colgate-Palmolive': '#06B6D4',
  'L\'Oréal': '#EC4899',
  'Reckitt': '#84CC16',
  'Kimberly-Clark': '#F97316',
  'Henkel': '#6366F1',
  'Procter & Gamble': '#10B981',
  'Mars': '#F43F5E',
  'PepsiCo': '#3B82F6',
  'Coca-Cola': '#DC2626',
  'Mondelez': '#7C3AED',
  'Unknown': '#6B7280',
  'Other': '#9CA3AF'
};

// ✅ WEEK 4 COMPLETE: Product category mappings
export const CATEGORY_MAPPINGS: CategoryMappings = {
  // Health & Wellness
  'Paracetamol': 'Health & Wellness',
  'Vitamin C': 'Health & Wellness',
  'Multivitamins': 'Health & Wellness',
  'Pain Relief': 'Health & Wellness',
  'Cough Syrup': 'Health & Wellness',
  'Biogesic': 'Health & Wellness',
  'Neozep': 'Health & Wellness',
  'Solmux': 'Health & Wellness',
  'Bioflu': 'Health & Wellness',
  'Advil': 'Health & Wellness',
  
  // Personal Care
  'Shampoo': 'Personal Care',
  'Toothpaste': 'Personal Care',
  'Soap': 'Personal Care',
  'Deodorant': 'Personal Care',
  'Facial Cleanser': 'Personal Care',
  'Moisturizer': 'Personal Care',
  'Pantene': 'Personal Care',
  'Head & Shoulders': 'Personal Care',
  'Colgate': 'Personal Care',
  'Safeguard': 'Personal Care',
  'Dove': 'Personal Care',
  'Olay': 'Personal Care',
  
  // Home Care
  'Laundry Detergent': 'Home Care',
  'Dishwashing Liquid': 'Home Care',
  'All-Purpose Cleaner': 'Home Care',
  'Fabric Softener': 'Home Care',
  'Floor Cleaner': 'Home Care',
  'Tide': 'Home Care',
  'Ariel': 'Home Care',
  'Joy': 'Home Care',
  'Downy': 'Home Care',
  'Mr. Clean': 'Home Care',
  
  // Baby Care
  'Baby Shampoo': 'Baby Care',
  'Baby Lotion': 'Baby Care',
  'Diapers': 'Baby Care',
  'Baby Food': 'Baby Care',
  'Baby Wipes': 'Baby Care',
  'Johnson\'s Baby': 'Baby Care',
  'Pampers': 'Baby Care',
  'Huggies': 'Baby Care',
  'Cerelac': 'Baby Care',
  
  // Pet Care
  'Dog Food': 'Pet Care',
  'Cat Food': 'Pet Care',
  'Pet Shampoo': 'Pet Care',
  'Pet Treats': 'Pet Care',
  'Pet Vitamins': 'Pet Care',
  'Pedigree': 'Pet Care',
  'Whiskas': 'Pet Care',
  'Royal Canin': 'Pet Care',
  
  // Food & Beverages
  'Instant Noodles': 'Food & Beverages',
  'Coffee': 'Food & Beverages',
  'Tea': 'Food & Beverages',
  'Soft Drinks': 'Food & Beverages',
  'Energy Drinks': 'Food & Beverages',
  'Lucky Me': 'Food & Beverages',
  'Nissin': 'Food & Beverages',
  'Nescafe': 'Food & Beverages',
  'Milo': 'Food & Beverages',
  'Coca-Cola': 'Food & Beverages',
  'Pepsi': 'Food & Beverages'
};

// ✅ WEEK 4 COMPLETE: Fallback data for when real data is unavailable
export const FALLBACK_DATA: FallbackData = {
  brandPerformance: [
    {
      id: 'tbwa-1',
      name: 'TBWA Health',
      marketShare: 35.5,
      revenue: 1670000,
      growth: 12.3,
      trend: 'up',
      category: 'Health & Wellness',
      color: '#1E40AF',
      transactionCount: 1250
    },
    {
      id: 'p&g-1',
      name: 'P&G Personal Care',
      marketShare: 24.8,
      revenue: 1180000,
      growth: 8.7,
      trend: 'up',
      category: 'Personal Care',
      color: '#22C55E',
      transactionCount: 980
    },
    {
      id: 'unilever-1',
      name: 'Unilever Home',
      marketShare: 18.2,
      revenue: 865000,
      growth: -2.1,
      trend: 'down',
      category: 'Home Care',
      color: '#EF4444',
      transactionCount: 720
    },
    {
      id: 'nestle-1',
      name: 'Nestlé Baby',
      marketShare: 12.1,
      revenue: 575000,
      growth: 15.9,
      trend: 'up',
      category: 'Baby Care',
      color: '#F59E0B',
      transactionCount: 450
    },
    {
      id: 'jj-1',
      name: 'J&J Consumer',
      marketShare: 9.4,
      revenue: 446000,
      growth: 5.2,
      trend: 'up',
      category: 'Personal Care',
      color: '#8B5CF6',
      transactionCount: 380
    }
  ],
  basketMetrics: {
    avg_basket_size: 3.2,
    basket_distribution: [
      { size: 1, count: 420, percentage: 35 },
      { size: 2, count: 360, percentage: 30 },
      { size: 3, count: 240, percentage: 20 },
      { size: 4, count: 120, percentage: 10 },
      { size: 5, count: 60, percentage: 5 }
    ],
    top_products: [
      { product_name: 'Biogesic', frequency: 15.2, category: 'Health & Wellness' },
      { product_name: 'Pantene Shampoo', frequency: 12.8, category: 'Personal Care' },
      { product_name: 'Tide Detergent', frequency: 11.5, category: 'Home Care' },
      { product_name: 'Johnson\'s Baby Shampoo', frequency: 9.3, category: 'Baby Care' },
      { product_name: 'Colgate Toothpaste', frequency: 8.7, category: 'Personal Care' }
    ]
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