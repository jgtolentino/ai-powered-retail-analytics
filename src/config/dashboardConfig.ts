/**
 * Dashboard Configuration
 * Week 4 of hardcoded data migration: Move remaining static data to configuration files
 * Centralized configuration for all dashboard components and static data
 */

export interface DashboardTheme {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
}

export interface ComponentConfig {
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  mobileVisible: boolean;
  refreshInterval?: number;
  cacheTimeout?: number;
}

export interface FeatureFlags {
  aiInsights: boolean;
  realTimeUpdates: boolean;
  predictiveModeling: boolean;
  timeSeriesAnalysis: boolean;
  mobileOptimization: boolean;
  productionMonitoring: boolean;
  exportFunctionality: boolean;
  advancedFiltering: boolean;
  comparativeAnalysis: boolean;
  seasonalityDetection: boolean;
  alertSystem: boolean;
  customDashboards: boolean;
}

export interface PerformanceThresholds {
  loadTime: {
    excellent: number;
    good: number;
    poor: number;
  };
  cacheHitRate: {
    excellent: number;
    good: number;
    poor: number;
  };
  errorRate: {
    excellent: number;
    good: number;
    poor: number;
  };
  dataQuality: {
    excellent: number;
    good: number;
    poor: number;
  };
}

export interface MetricDisplayConfig {
  format: 'currency' | 'percentage' | 'number' | 'decimal';
  precision: number;
  unit: string;
  prefix?: string;
  suffix?: string;
  showTrend: boolean;
  showComparison: boolean;
  colorCoding: boolean;
}

export interface DashboardLayout {
  gridColumns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  cardSpacing: string;
  sectionSpacing: string;
  headerHeight: string;
  sidebarWidth: string;
  compactMode: boolean;
  responsiveBreakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

// Theme Configuration
export const DASHBOARD_THEMES: Record<string, DashboardTheme> = {
  default: {
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      muted: '#9CA3AF'
    }
  },
  dark: {
    primary: '#60A5FA',
    secondary: '#818CF8',
    accent: '#A78BFA',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#22D3EE',
    background: '#111827',
    surface: '#1F2937',
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      muted: '#9CA3AF'
    }
  },
  corporate: {
    primary: '#1E40AF',
    secondary: '#1E3A8A',
    accent: '#3730A3',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0891B2',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      muted: '#64748B'
    }
  }
};

// Component Configurations
export const COMPONENT_CONFIG: Record<string, ComponentConfig> = {
  brandPerformance: {
    enabled: true,
    priority: 'high',
    mobileVisible: true,
    refreshInterval: 300000, // 5 minutes
    cacheTimeout: 600000 // 10 minutes
  },
  marketShare: {
    enabled: true,
    priority: 'high',
    mobileVisible: true,
    refreshInterval: 600000, // 10 minutes
    cacheTimeout: 1200000 // 20 minutes
  },
  competitiveMetrics: {
    enabled: true,
    priority: 'medium',
    mobileVisible: false,
    refreshInterval: 900000, // 15 minutes
    cacheTimeout: 1800000 // 30 minutes
  },
  aiInsights: {
    enabled: true,
    priority: 'medium',
    mobileVisible: false,
    refreshInterval: 1800000, // 30 minutes
    cacheTimeout: 3600000 // 1 hour
  },
  realTimeAnalytics: {
    enabled: true,
    priority: 'high',
    mobileVisible: true,
    refreshInterval: 5000, // 5 seconds
    cacheTimeout: 30000 // 30 seconds
  },
  timeSeriesAnalysis: {
    enabled: true,
    priority: 'medium',
    mobileVisible: false,
    refreshInterval: 1800000, // 30 minutes
    cacheTimeout: 3600000 // 1 hour
  },
  basketAnalysis: {
    enabled: true,
    priority: 'medium',
    mobileVisible: true,
    refreshInterval: 600000, // 10 minutes
    cacheTimeout: 1200000 // 20 minutes
  },
  categoryPerformance: {
    enabled: true,
    priority: 'low',
    mobileVisible: false,
    refreshInterval: 1800000, // 30 minutes
    cacheTimeout: 3600000 // 1 hour
  },
  systemMetrics: {
    enabled: true,
    priority: 'low',
    mobileVisible: false,
    refreshInterval: 60000, // 1 minute
    cacheTimeout: 120000 // 2 minutes
  }
};

// Feature Flags
export const FEATURE_FLAGS: FeatureFlags = {
  aiInsights: true,
  realTimeUpdates: true,
  predictiveModeling: true,
  timeSeriesAnalysis: true,
  mobileOptimization: true,
  productionMonitoring: true,
  exportFunctionality: true,
  advancedFiltering: true,
  comparativeAnalysis: true,
  seasonalityDetection: false, // TODO: Implement seasonality detection
  alertSystem: true,
  customDashboards: false // TODO: Implement custom dashboards
};

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  loadTime: {
    excellent: 500,
    good: 1000,
    poor: 3000
  },
  cacheHitRate: {
    excellent: 90,
    good: 75,
    poor: 50
  },
  errorRate: {
    excellent: 0.1,
    good: 1.0,
    poor: 5.0
  },
  dataQuality: {
    excellent: 98,
    good: 95,
    poor: 90
  }
};

// Metric Display Configurations
export const METRIC_DISPLAY_CONFIG: Record<string, MetricDisplayConfig> = {
  revenue: {
    format: 'currency',
    precision: 0,
    unit: '₱',
    prefix: '₱',
    showTrend: true,
    showComparison: true,
    colorCoding: true
  },
  marketShare: {
    format: 'percentage',
    precision: 1,
    unit: '%',
    suffix: '%',
    showTrend: true,
    showComparison: true,
    colorCoding: true
  },
  growth: {
    format: 'percentage',
    precision: 1,
    unit: '%',
    suffix: '%',
    showTrend: true,
    showComparison: true,
    colorCoding: true
  },
  transactionCount: {
    format: 'number',
    precision: 0,
    unit: '',
    showTrend: true,
    showComparison: true,
    colorCoding: false
  },
  basketSize: {
    format: 'decimal',
    precision: 1,
    unit: ' items',
    suffix: ' items',
    showTrend: true,
    showComparison: true,
    colorCoding: false
  },
  satisfaction: {
    format: 'decimal',
    precision: 1,
    unit: '/5',
    suffix: '/5',
    showTrend: true,
    showComparison: true,
    colorCoding: true
  },
  awareness: {
    format: 'percentage',
    precision: 0,
    unit: '%',
    suffix: '%',
    showTrend: true,
    showComparison: true,
    colorCoding: true
  }
};

// Dashboard Layout Configuration
export const DASHBOARD_LAYOUT: DashboardLayout = {
  gridColumns: {
    mobile: 1,
    tablet: 2,
    desktop: 3
  },
  cardSpacing: '1rem',
  sectionSpacing: '1.5rem',
  headerHeight: '4rem',
  sidebarWidth: '16rem',
  compactMode: false,
  responsiveBreakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280
  }
};

// Animation Settings
export const ANIMATION_CONFIG = {
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  },
  realTime: {
    pulseInterval: 2000,
    updateDelay: 300,
    staggerDelay: 100
  },
  mobile: {
    reducedMotion: true,
    simplifiedAnimations: true,
    fasterTransitions: true
  }
};

// Chart Configurations
export const CHART_CONFIG = {
  colors: {
    primary: ['#3B82F6', '#1E40AF', '#1E3A8A'],
    secondary: ['#10B981', '#059669', '#047857'],
    accent: ['#8B5CF6', '#7C3AED', '#6D28D9'],
    neutral: ['#6B7280', '#4B5563', '#374151'],
    gradient: [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ]
  },
  defaults: {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    legend: {
      display: true,
      position: 'bottom' as const
    },
    tooltip: {
      enabled: true,
      intersect: false,
      mode: 'index' as const
    }
  },
  mobile: {
    animations: {
      duration: 400,
      easing: 'easeInOut'
    },
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      touchGestures: true
    }
  }
};

// Alert Configurations
export const ALERT_CONFIG = {
  thresholds: {
    performance: {
      loadTime: 2000, // ms
      errorRate: 2.0, // %
      cacheHitRate: 70 // %
    },
    business: {
      revenueGrowth: -10, // %
      marketShareLoss: -5, // %
      transactionDrop: -20 // %
    },
    dataQuality: {
      validationErrors: 10, // count
      missingData: 5, // %
      dataAge: 86400000 // ms (24 hours)
    }
  },
  notifications: {
    enabled: true,
    channels: ['dashboard', 'console'],
    persistence: 300000, // 5 minutes
    maxAlerts: 10
  },
  severity: {
    critical: {
      color: '#EF4444',
      autoShow: true,
      requireAck: true
    },
    warning: {
      color: '#F59E0B',
      autoShow: true,
      requireAck: false
    },
    info: {
      color: '#06B6D4',
      autoShow: false,
      requireAck: false
    }
  }
};

// Data Validation Rules
export const VALIDATION_CONFIG = {
  rules: {
    revenue: {
      min: 0,
      max: 100000000,
      required: true,
      type: 'number'
    },
    marketShare: {
      min: 0,
      max: 100,
      required: true,
      type: 'number'
    },
    growth: {
      min: -100,
      max: 1000,
      required: true,
      type: 'number'
    },
    brandName: {
      minLength: 1,
      maxLength: 100,
      required: true,
      type: 'string',
      pattern: /^[a-zA-Z0-9\s\-_&.]+$/
    },
    category: {
      minLength: 1,
      maxLength: 50,
      required: true,
      type: 'string',
      allowedValues: [
        'Health & Wellness',
        'Personal Care',
        'Home Care',
        'Baby Care',
        'Pet Care',
        'Food & Beverages',
        'Electronics',
        'Fashion',
        'Unknown'
      ]
    }
  },
  batch: {
    maxSize: 1000,
    timeoutMs: 30000,
    failFast: false,
    reportProgress: true
  }
};

// Export Configuration
export const EXPORT_CONFIG = {
  formats: ['csv', 'json', 'xlsx'],
  maxRecords: 10000,
  includeMetadata: true,
  compression: true,
  defaultFilename: (type: string) => `${type}-export-${new Date().toISOString().split('T')[0]}`,
  csv: {
    delimiter: ',',
    includeHeaders: true,
    quoteStrings: true
  },
  json: {
    pretty: true,
    includeSchema: false
  },
  xlsx: {
    sheetName: 'Analytics Data',
    includeCharts: false,
    autoWidth: true
  }
};

// API Configuration
export const API_CONFIG = {
  endpoints: {
    brands: '/api/brands',
    transactions: '/api/transactions',
    categories: '/api/categories',
    timeSeries: '/api/timeseries',
    metrics: '/api/metrics'
  },
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  cache: {
    enabled: true,
    defaultTTL: 300000, // 5 minutes
    maxSize: 100
  },
  rateLimiting: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60000 // 1 minute
  }
};

// Default Dashboard Configuration
export const DEFAULT_DASHBOARD_CONFIG = {
  theme: 'default',
  layout: DASHBOARD_LAYOUT,
  components: COMPONENT_CONFIG,
  features: FEATURE_FLAGS,
  performance: PERFORMANCE_THRESHOLDS,
  metrics: METRIC_DISPLAY_CONFIG,
  animations: ANIMATION_CONFIG,
  charts: CHART_CONFIG,
  alerts: ALERT_CONFIG,
  validation: VALIDATION_CONFIG,
  export: EXPORT_CONFIG,
  api: API_CONFIG
};

// Configuration Helper Functions
export const getDashboardConfig = (overrides?: Partial<typeof DEFAULT_DASHBOARD_CONFIG>) => {
  return {
    ...DEFAULT_DASHBOARD_CONFIG,
    ...overrides
  };
};

export const getComponentConfig = (componentName: string): ComponentConfig => {
  return COMPONENT_CONFIG[componentName] || {
    enabled: false,
    priority: 'low',
    mobileVisible: false
  };
};

export const getMetricConfig = (metricName: string): MetricDisplayConfig => {
  return METRIC_DISPLAY_CONFIG[metricName] || {
    format: 'number',
    precision: 0,
    unit: '',
    showTrend: false,
    showComparison: false,
    colorCoding: false
  };
};

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return FEATURE_FLAGS[feature] === true;
};

export const getPerformanceStatus = (
  metric: keyof PerformanceThresholds,
  value: number
): 'excellent' | 'good' | 'poor' => {
  const thresholds = PERFORMANCE_THRESHOLDS[metric];
  
  if (value <= thresholds.excellent) return 'excellent';
  if (value <= thresholds.good) return 'good';
  return 'poor';
};

export const shouldShowOnMobile = (componentName: string): boolean => {
  const config = getComponentConfig(componentName);
  return config.enabled && config.mobileVisible;
};

export default {
  DASHBOARD_THEMES,
  COMPONENT_CONFIG,
  FEATURE_FLAGS,
  PERFORMANCE_THRESHOLDS,
  METRIC_DISPLAY_CONFIG,
  DASHBOARD_LAYOUT,
  ANIMATION_CONFIG,
  CHART_CONFIG,
  ALERT_CONFIG,
  VALIDATION_CONFIG,
  EXPORT_CONFIG,
  API_CONFIG,
  DEFAULT_DASHBOARD_CONFIG,
  getDashboardConfig,
  getComponentConfig,
  getMetricConfig,
  isFeatureEnabled,
  getPerformanceStatus,
  shouldShowOnMobile
};