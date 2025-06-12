/**
 * Production-ready caching system with TTL, invalidation, and fallback strategies
 */

export interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
}

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size in MB
  strategy: 'LRU' | 'LFU' | 'FIFO';
  enableStaleWhileRevalidate: boolean;
  compressionEnabled: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalSize: number;
  entryCount: number;
  evictions: number;
  errors: number;
}

export interface CacheKey {
  namespace: string;
  operation: string;
  params?: Record<string, any>;
  version?: string;
}

export class CacheManager {
  private cache: Map<string, CacheEntry>;
  private config: CacheConfig;
  private stats: CacheStats;
  private readonly maxMemoryBytes: number;

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map();
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      maxSize: 100, // 100MB default
      strategy: 'LRU',
      enableStaleWhileRevalidate: true,
      compressionEnabled: false,
      ...config
    };
    
    this.maxMemoryBytes = this.config.maxSize * 1024 * 1024; // Convert MB to bytes
    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalSize: 0,
      entryCount: 0,
      evictions: 0,
      errors: 0
    };

    // Set up periodic cleanup
    this.setupPeriodicCleanup();
  }

  /**
   * Get data from cache or fetch using provided function
   */
  async get<T>(
    cacheKey: CacheKey | string, 
    fetcher: () => Promise<T>,
    options: { 
      ttl?: number;
      bypassCache?: boolean;
      enableStaleWhileRevalidate?: boolean;
    } = {}
  ): Promise<T> {
    const key = this.buildKey(cacheKey);
    
    // Bypass cache if requested
    if (options.bypassCache) {
      try {
        const data = await fetcher();
        this.set(key, data, options.ttl);
        return data;
      } catch (error) {
        this.stats.errors++;
        throw error;
      }
    }

    const cached = this.cache.get(key);
    
    if (cached) {
      // Update access statistics
      cached.accessCount++;
      cached.lastAccessed = Date.now();

      if (!this.isExpired(cached)) {
        // Cache hit - return fresh data
        this.stats.hits++;
        this.updateHitRate();
        return cached.data as T;
      } else if (this.config.enableStaleWhileRevalidate || options.enableStaleWhileRevalidate) {
        // Return stale data while revalidating in background
        this.stats.hits++;
        this.updateHitRate();
        
        // Revalidate in background
        this.revalidateInBackground(key, fetcher, options.ttl);
        
        return cached.data as T;
      }
    }

    // Cache miss - fetch fresh data
    this.stats.misses++;
    this.updateHitRate();

    try {
      const data = await fetcher();
      this.set(key, data, options.ttl);
      return data;
    } catch (error) {
      this.stats.errors++;
      
      // If fetch fails and we have stale data, return it
      if (cached && this.config.enableStaleWhileRevalidate) {
        console.warn(`Cache: Fetch failed for ${key}, returning stale data`);
        return cached.data as T;
      }
      
      throw error;
    }
  }

  /**
   * Set data in cache
   */
  set(cacheKey: CacheKey | string, data: any, customTtl?: number): void {
    const key = this.buildKey(cacheKey);
    const ttl = customTtl || this.config.ttl;
    const now = Date.now();
    
    // Calculate data size (rough estimate)
    const dataSize = this.estimateSize(data);
    
    // Check if we need to evict entries
    if (this.shouldEvict(dataSize)) {
      this.evictEntries(dataSize);
    }

    const entry: CacheEntry = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      accessCount: 1,
      lastAccessed: now,
      size: dataSize
    };

    this.cache.set(key, entry);
    this.updateStats();
  }

  /**
   * Delete specific cache entry
   */
  delete(cacheKey: CacheKey | string): boolean {
    const key = this.buildKey(cacheKey);
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStats();
    }
    return deleted;
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidate(pattern?: string | RegExp): number {
    let invalidated = 0;
    
    if (!pattern) {
      // Clear all
      invalidated = this.cache.size;
      this.cache.clear();
    } else if (typeof pattern === 'string') {
      // String pattern matching
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
          invalidated++;
        }
      }
    } else {
      // Regex pattern matching
      for (const key of this.cache.keys()) {
        if (pattern.test(key)) {
          this.cache.delete(key);
          invalidated++;
        }
      }
    }
    
    this.updateStats();
    console.log(`Cache: Invalidated ${invalidated} entries`);
    return invalidated;
  }

  /**
   * Invalidate cache entries by namespace
   */
  invalidateNamespace(namespace: string): number {
    return this.invalidate(new RegExp(`^${namespace}:`));
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get detailed cache information
   */
  getCacheInfo(): {
    stats: CacheStats;
    config: CacheConfig;
    entries: Array<{
      key: string;
      size: number;
      accessCount: number;
      age: number;
      ttl: number;
    }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      size: entry.size,
      accessCount: entry.accessCount,
      age: now - entry.timestamp,
      ttl: entry.expiresAt - now
    }));

    return {
      stats: this.getStats(),
      config: this.config,
      entries
    };
  }

  /**
   * Warm cache with predefined data
   */
  async warmCache(warmupTasks: Array<{
    key: CacheKey | string;
    fetcher: () => Promise<any>;
    priority?: number;
  }>): Promise<void> {
    console.log(`Cache: Starting warmup with ${warmupTasks.length} tasks`);
    
    // Sort by priority if provided
    const sortedTasks = warmupTasks.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    const promises = sortedTasks.map(async (task) => {
      try {
        await this.get(task.key, task.fetcher);
        console.log(`Cache: Warmed ${this.buildKey(task.key)}`);
      } catch (error) {
        console.warn(`Cache: Failed to warm ${this.buildKey(task.key)}:`, error);
      }
    });

    await Promise.allSettled(promises);
    console.log('Cache: Warmup completed');
  }

  /**
   * Clear expired entries
   */
  clearExpired(): number {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    this.updateStats();
    return cleared;
  }

  /**
   * Build cache key from CacheKey object or string
   */
  private buildKey(cacheKey: CacheKey | string): string {
    if (typeof cacheKey === 'string') {
      return cacheKey;
    }
    
    const { namespace, operation, params, version } = cacheKey;
    let key = `${namespace}:${operation}`;
    
    if (params) {
      const sortedParams = Object.keys(params)
        .sort()
        .map(k => `${k}=${JSON.stringify(params[k])}`)
        .join('&');
      key += `:${sortedParams}`;
    }
    
    if (version) {
      key += `:v${version}`;
    }
    
    return key;
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  /**
   * Revalidate cache entry in background
   */
  private async revalidateInBackground<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    customTtl?: number
  ): Promise<void> {
    try {
      const data = await fetcher();
      this.set(key, data, customTtl);
    } catch (error) {
      console.warn(`Cache: Background revalidation failed for ${key}:`, error);
      this.stats.errors++;
    }
  }

  /**
   * Estimate data size in bytes
   */
  private estimateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2; // Rough estimate (UTF-16)
    } catch {
      return 1024; // Default size if can't estimate
    }
  }

  /**
   * Check if we should evict entries
   */
  private shouldEvict(newEntrySize: number): boolean {
    const currentSize = this.calculateTotalSize();
    return (currentSize + newEntrySize) > this.maxMemoryBytes;
  }

  /**
   * Calculate total cache size
   */
  private calculateTotalSize(): number {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size;
    }
    return totalSize;
  }

  /**
   * Evict entries based on configured strategy
   */
  private evictEntries(requiredSpace: number): void {
    const entries = Array.from(this.cache.entries());
    let freedSpace = 0;
    let evicted = 0;

    // Sort entries based on eviction strategy
    let sortedEntries: Array<[string, CacheEntry]>;
    
    switch (this.config.strategy) {
      case 'LRU': // Least Recently Used
        sortedEntries = entries.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
        break;
      case 'LFU': // Least Frequently Used
        sortedEntries = entries.sort(([, a], [, b]) => a.accessCount - b.accessCount);
        break;
      case 'FIFO': // First In, First Out
        sortedEntries = entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
        break;
      default:
        sortedEntries = entries;
    }

    // Evict entries until we have enough space
    for (const [key, entry] of sortedEntries) {
      if (freedSpace >= requiredSpace) break;
      
      this.cache.delete(key);
      freedSpace += entry.size;
      evicted++;
    }

    this.stats.evictions += evicted;
    console.log(`Cache: Evicted ${evicted} entries (${freedSpace} bytes) using ${this.config.strategy} strategy`);
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.entryCount = this.cache.size;
    this.stats.totalSize = this.calculateTotalSize();
    this.updateHitRate();
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Set up periodic cleanup of expired entries
   */
  private setupPeriodicCleanup(): void {
    const cleanupInterval = Math.max(this.config.ttl / 4, 60000); // Every 1/4 of TTL or 1 minute, whichever is greater
    
    setInterval(() => {
      const cleared = this.clearExpired();
      if (cleared > 0) {
        console.log(`Cache: Periodic cleanup removed ${cleared} expired entries`);
      }
    }, cleanupInterval);
  }

  /**
   * Destroy cache and cleanup resources
   */
  destroy(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalSize: 0,
      entryCount: 0,
      evictions: 0,
      errors: 0
    };
  }
}

// Export singleton instance with default configuration
export const cacheManager = new CacheManager({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 50, // 50MB
  strategy: 'LRU',
  enableStaleWhileRevalidate: true,
  compressionEnabled: false
});

// Export specific cache instances for different data types
export const dashboardCache = new CacheManager({
  ttl: 2 * 60 * 1000, // 2 minutes for dashboard data
  maxSize: 20,
  strategy: 'LRU',
  enableStaleWhileRevalidate: true
});

export const brandCache = new CacheManager({
  ttl: 10 * 60 * 1000, // 10 minutes for brand data (changes less frequently)
  maxSize: 15,
  strategy: 'LFU',
  enableStaleWhileRevalidate: true
});

export const transactionCache = new CacheManager({
  ttl: 1 * 60 * 1000, // 1 minute for transaction data (most dynamic)
  maxSize: 30,
  strategy: 'LRU',
  enableStaleWhileRevalidate: false // Always fetch fresh transaction data
});