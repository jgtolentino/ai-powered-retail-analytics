/**
 * Time Series Data Hooks
 * Custom React hooks for accessing time-series analytics data
 * Integrates with existing real-time data infrastructure
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  timeSeriesService, 
  BrandTimeSeriesData, 
  CategoryTimeSeriesData, 
  DashboardTimeSeriesMetrics 
} from '@/services/data/TimeSeriesService';
import { monitoringService } from '@/services/monitoring/MonitoringService';

interface UseTimeSeriesResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Hook for brand time-series data
 */
export const useBrandTimeSeries = (
  brandName?: string, 
  periodDays: number = 30,
  autoRefresh: boolean = true,
  refreshInterval: number = 300000 // 5 minutes
): UseTimeSeriesResult<BrandTimeSeriesData[]> => {
  const [data, setData] = useState<BrandTimeSeriesData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startTime = Date.now();
      const result = await timeSeriesService.getBrandTimeSeriesData(brandName, periodDays);
      
      setData(result);
      setLastUpdated(new Date());
      
      // Record performance metrics
      monitoringService.recordMetric('hooks.brand_timeseries.fetch_time', Date.now() - startTime);
      monitoringService.recordMetric('hooks.brand_timeseries.success', 1);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brand time series data';
      setError(errorMessage);
      
      monitoringService.recordMetric('hooks.brand_timeseries.error', 1);
      console.error('Brand time series fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [brandName, periodDays]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return { data, loading, error, refresh, lastUpdated };
};

/**
 * Hook for category time-series data
 */
export const useCategoryTimeSeries = (
  periodDays: number = 30,
  autoRefresh: boolean = true,
  refreshInterval: number = 300000
): UseTimeSeriesResult<CategoryTimeSeriesData[]> => {
  const [data, setData] = useState<CategoryTimeSeriesData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startTime = Date.now();
      const result = await timeSeriesService.getCategoryTimeSeriesData(periodDays);
      
      setData(result);
      setLastUpdated(new Date());
      
      monitoringService.recordMetric('hooks.category_timeseries.fetch_time', Date.now() - startTime);
      monitoringService.recordMetric('hooks.category_timeseries.success', 1);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category time series data';
      setError(errorMessage);
      
      monitoringService.recordMetric('hooks.category_timeseries.error', 1);
      console.error('Category time series fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [periodDays]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return { data, loading, error, refresh, lastUpdated };
};

/**
 * Hook for dashboard time-series metrics
 */
export const useDashboardTimeSeries = (
  periodDays: number = 30,
  autoRefresh: boolean = true,
  refreshInterval: number = 300000
): UseTimeSeriesResult<DashboardTimeSeriesMetrics> => {
  const [data, setData] = useState<DashboardTimeSeriesMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startTime = Date.now();
      const result = await timeSeriesService.getDashboardTimeSeriesMetrics(periodDays);
      
      setData(result);
      setLastUpdated(new Date());
      
      monitoringService.recordMetric('hooks.dashboard_timeseries.fetch_time', Date.now() - startTime);
      monitoringService.recordMetric('hooks.dashboard_timeseries.success', 1);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard time series data';
      setError(errorMessage);
      
      monitoringService.recordMetric('hooks.dashboard_timeseries.error', 1);
      console.error('Dashboard time series fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [periodDays]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return { data, loading, error, refresh, lastUpdated };
};

/**
 * Hook for time-series trend analysis
 */
export const useTimeSeriesTrends = (
  brandName?: string,
  periodDays: number = 30
) => {
  const { data: brandData, loading: brandLoading, error: brandError } = useBrandTimeSeries(brandName, periodDays);
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardTimeSeries(periodDays);

  const loading = brandLoading || dashboardLoading;
  const error = brandError || dashboardError;

  // Analyze trends
  const trends = {
    revenue: {
      direction: brandData?.[0]?.revenue.summary.trend || 'stable',
      growth: brandData?.[0]?.revenue.summary.growth || 0,
      significance: Math.abs(brandData?.[0]?.revenue.summary.growth || 0) > 10 ? 'high' : 
                   Math.abs(brandData?.[0]?.revenue.summary.growth || 0) > 5 ? 'medium' : 'low'
    },
    transactions: {
      direction: brandData?.[0]?.transactions.summary.trend || 'stable',
      growth: brandData?.[0]?.transactions.summary.growth || 0,
      significance: Math.abs(brandData?.[0]?.transactions.summary.growth || 0) > 15 ? 'high' : 
                   Math.abs(brandData?.[0]?.transactions.summary.growth || 0) > 8 ? 'medium' : 'low'
    },
    marketShare: {
      direction: brandData?.[0]?.marketShare.summary.trend || 'stable',
      growth: brandData?.[0]?.marketShare.summary.growth || 0,
      significance: Math.abs(brandData?.[0]?.marketShare.summary.growth || 0) > 5 ? 'high' : 
                   Math.abs(brandData?.[0]?.marketShare.summary.growth || 0) > 2 ? 'medium' : 'low'
    },
    peakHours: dashboardData?.peakHours.slice(0, 3).map(hour => ({
      hour: hour.hour,
      transactions: hour.transactionCount,
      revenue: hour.revenue
    })) || [],
    weeklyPattern: dashboardData?.weeklyPatterns.reduce((best, current) => 
      current.performance > best.performance ? current : best
    ) || null,
    seasonality: {
      detected: false, // TODO: Implement seasonality detection
      pattern: null as string | null,
      strength: 0
    }
  };

  return {
    data: trends,
    loading,
    error,
    brandData,
    dashboardData
  };
};

/**
 * Hook for comparative time-series analysis
 */
export const useComparativeTimeSeries = (
  brands: string[],
  periodDays: number = 30
) => {
  const [comparativeData, setComparativeData] = useState<{
    brands: BrandTimeSeriesData[];
    comparison: {
      revenueLeader: string;
      growthLeader: string;
      transactionLeader: string;
      marketShareLeader: string;
    } | null;
  }>({ brands: [], comparison: null });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparativeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const results = await Promise.all(
        brands.map(brandName => 
          timeSeriesService.getBrandTimeSeriesData(brandName, periodDays)
        )
      );

      const brandData = results.flat();
      
      // Find leaders in each category
      const comparison = {
        revenueLeader: brandData.reduce((best, current) => 
          current.revenue.summary.total > best.revenue.summary.total ? current : best
        ).brandName,
        growthLeader: brandData.reduce((best, current) => 
          current.revenue.summary.growth > best.revenue.summary.growth ? current : best
        ).brandName,
        transactionLeader: brandData.reduce((best, current) => 
          current.transactions.summary.total > best.transactions.summary.total ? current : best
        ).brandName,
        marketShareLeader: brandData.reduce((best, current) => 
          current.marketShare.summary.average > best.marketShare.summary.average ? current : best
        ).brandName
      };

      setComparativeData({ brands: brandData, comparison });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch comparative data';
      setError(errorMessage);
      console.error('Comparative time series fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [brands, periodDays]);

  useEffect(() => {
    if (brands.length > 0) {
      fetchComparativeData();
    }
  }, [fetchComparativeData]);

  return {
    data: comparativeData,
    loading,
    error,
    refresh: fetchComparativeData
  };
};

/**
 * Hook for real-time time-series updates
 */
export const useRealTimeTimeSeries = (
  brandName?: string,
  updateInterval: number = 60000 // 1 minute
) => {
  const [isRealTime, setIsRealTime] = useState(true);
  const [updateCount, setUpdateCount] = useState(0);
  
  const { 
    data: brandData, 
    loading, 
    error, 
    refresh, 
    lastUpdated 
  } = useBrandTimeSeries(brandName, 1, isRealTime, updateInterval); // 1 day for real-time

  const toggleRealTime = useCallback(() => {
    setIsRealTime(prev => !prev);
  }, []);

  const forceUpdate = useCallback(async () => {
    await refresh();
    setUpdateCount(prev => prev + 1);
  }, [refresh]);

  // Track update frequency
  useEffect(() => {
    if (lastUpdated) {
      setUpdateCount(prev => prev + 1);
    }
  }, [lastUpdated]);

  return {
    data: brandData,
    loading,
    error,
    isRealTime,
    updateCount,
    lastUpdated,
    toggleRealTime,
    forceUpdate,
    refresh
  };
};

export default {
  useBrandTimeSeries,
  useCategoryTimeSeries,
  useDashboardTimeSeries,
  useTimeSeriesTrends,
  useComparativeTimeSeries,
  useRealTimeTimeSeries
};