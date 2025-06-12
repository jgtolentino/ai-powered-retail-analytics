import { useState, useEffect } from 'react';
import { dataService, DashboardMetrics, BrandMetric, BasketMetrics } from '@/services/data/DataService';

/**
 * Hook for real-time dashboard metrics (replaces hardcoded data)
 */
export function useRealTimeDashboardMetrics() {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const metrics = await dataService.getDashboardMetrics();
        setData(metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      const metrics = await dataService.getDashboardMetrics();
      setData(metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh };
}

/**
 * Hook for real-time brand performance (replaces hardcoded brand data)
 */
export function useRealTimeBrandPerformance() {
  const [data, setData] = useState<BrandMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const brands = await dataService.getBrandPerformance();
        setData(brands);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch brand data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      const brands = await dataService.getBrandPerformance();
      setData(brands);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh brand data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh };
}

/**
 * Hook for real-time basket analytics (replaces hardcoded product names)
 */
export function useRealTimeBasketMetrics() {
  const [data, setData] = useState<BasketMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const metrics = await dataService.getBasketMetrics();
        setData(metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch basket data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      const metrics = await dataService.getBasketMetrics();
      setData(metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh basket data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh };
}

/**
 * Hook for caching and refreshing data with intervals
 */
export function useDataWithCache<T>(
  fetcher: () => Promise<T>, 
  refreshInterval: number = 5 * 60 * 1000 // 5 minutes
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher();
        setData(result);
        setLastFetch(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for refreshing
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [fetcher, refreshInterval]);

  const refresh = async () => {
    try {
      setLoading(true);
      const result = await fetcher();
      setData(result);
      setLastFetch(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh, lastFetch };
}