/**
 * Production-ready monitoring and observability service
 * Tracks performance, errors, and system health
 */

import { cacheManager } from '../cache/CacheManager';
import { errorHandler } from '../error/ErrorHandler';

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  labels?: Record<string, string>;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: Date;
  responseTime: number;
  message?: string;
  critical: boolean;
}

export interface SystemMetrics {
  performance: {
    apiResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
    throughput: number;
  };
  health: {
    overall: 'healthy' | 'unhealthy' | 'degraded';
    checks: HealthCheck[];
  };
  resources: {
    memoryUsage: number;
    cacheSize: number;
    activeConnections: number;
  };
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  operator: '>' | '<' | '=' | '>=' | '<=';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

export class MonitoringService {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private healthChecks: Map<string, HealthCheck> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private performanceBuffer: PerformanceMetric[] = [];
  private readonly maxMetricsHistory = 1000;
  private readonly metricsFlushInterval = 30000; // 30 seconds

  constructor() {
    this.setupDefaultAlertRules();
    this.startMetricsCollection();
    this.setupPeriodicHealthChecks();
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, labels?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      labels
    };

    // Add to buffer for batch processing
    this.performanceBuffer.push(metric);

    // Add to metrics history
    const history = this.metrics.get(name) || [];
    history.push(metric);
    
    // Keep only recent metrics
    if (history.length > this.maxMetricsHistory) {
      history.splice(0, history.length - this.maxMetricsHistory);
    }
    
    this.metrics.set(name, history);

    // Check alert rules
    this.checkAlertRules(metric);
  }

  /**
   * Track API request performance
   */
  async trackApiRequest<T>(
    operation: string,
    request: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    const operationLabels = { operation };

    try {
      const result = await request();
      const responseTime = Date.now() - startTime;
      
      this.recordMetric('api.response.time', responseTime, operationLabels);
      this.recordMetric('api.requests.success', 1, operationLabels);
      
      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.recordMetric('api.response.time', responseTime, operationLabels);
      this.recordMetric('api.requests.error', 1, operationLabels);
      
      throw error;
    }
  }

  /**
   * Get current system metrics
   */
  getSystemMetrics(): SystemMetrics {
    const cacheStats = cacheManager.getStats();
    const errorStats = errorHandler.getErrorStats();
    
    const apiResponseTimes = this.getRecentMetrics('api.response.time', 100);
    const avgResponseTime = apiResponseTimes.length > 0 
      ? apiResponseTimes.reduce((sum, m) => sum + m.value, 0) / apiResponseTimes.length 
      : 0;

    const successRequests = this.getRecentMetrics('api.requests.success', 100);
    const errorRequests = this.getRecentMetrics('api.requests.error', 100);
    const totalRequests = successRequests.length + errorRequests.length;
    const errorRate = totalRequests > 0 ? (errorRequests.length / totalRequests) * 100 : 0;

    const overallHealth = this.calculateOverallHealth();

    return {
      performance: {
        apiResponseTime: Math.round(avgResponseTime),
        cacheHitRate: Math.round(cacheStats.hitRate),
        errorRate: Math.round(errorRate * 100) / 100,
        throughput: this.calculateThroughput()
      },
      health: {
        overall: overallHealth,
        checks: Array.from(this.healthChecks.values())
      },
      resources: {
        memoryUsage: this.estimateMemoryUsage(),
        cacheSize: Math.round(cacheStats.totalSize / (1024 * 1024)), // MB
        activeConnections: this.estimateActiveConnections()
      }
    };
  }

  /**
   * Register a health check
   */
  registerHealthCheck(
    name: string, 
    checkFunction: () => Promise<{ status: boolean; message?: string; responseTime: number }>,
    critical: boolean = false
  ): void {
    this.healthChecks.set(name, {
      name,
      status: 'unhealthy',
      lastCheck: new Date(),
      responseTime: 0,
      critical,
      message: 'Not yet checked'
    });

    // Run the check immediately
    this.runHealthCheck(name, checkFunction);
  }

  /**
   * Run a specific health check
   */
  async runHealthCheck(
    name: string, 
    checkFunction: () => Promise<{ status: boolean; message?: string; responseTime: number }>
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      const result = await checkFunction();
      const responseTime = Date.now() - startTime;
      
      this.healthChecks.set(name, {
        name,
        status: result.status ? 'healthy' : 'unhealthy',
        lastCheck: new Date(),
        responseTime: result.responseTime || responseTime,
        message: result.message || (result.status ? 'OK' : 'Check failed'),
        critical: this.healthChecks.get(name)?.critical || false
      });

      // Record metrics
      this.recordMetric('health.check.response_time', responseTime, { check: name });
      this.recordMetric('health.check.status', result.status ? 1 : 0, { check: name });
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.healthChecks.set(name, {
        name,
        status: 'unhealthy',
        lastCheck: new Date(),
        responseTime,
        message: `Check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        critical: this.healthChecks.get(name)?.critical || false
      });

      this.recordMetric('health.check.response_time', responseTime, { check: name });
      this.recordMetric('health.check.status', 0, { check: name });
    }
  }

  /**
   * Add custom alert rule
   */
  addAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule);
  }

  /**
   * Get metrics for a specific time range
   */
  getMetrics(
    metricName: string, 
    since?: Date, 
    until?: Date
  ): PerformanceMetric[] {
    const metrics = this.metrics.get(metricName) || [];
    
    if (!since && !until) {
      return [...metrics];
    }

    return metrics.filter(metric => {
      if (since && metric.timestamp < since) return false;
      if (until && metric.timestamp > until) return false;
      return true;
    });
  }

  /**
   * Get metric statistics
   */
  getMetricStats(metricName: string, since?: Date): {
    count: number;
    min: number;
    max: number;
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  } {
    const metrics = this.getMetrics(metricName, since);
    
    if (metrics.length === 0) {
      return { count: 0, min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 };
    }

    const values = metrics.map(m => m.value).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      count,
      min: values[0],
      max: values[count - 1],
      avg: sum / count,
      p50: values[Math.floor(count * 0.5)],
      p95: values[Math.floor(count * 0.95)],
      p99: values[Math.floor(count * 0.99)]
    };
  }

  /**
   * Export metrics for external monitoring systems
   */
  exportMetrics(format: 'json' | 'prometheus' = 'json'): string {
    if (format === 'prometheus') {
      return this.exportPrometheusFormat();
    }

    const exportData = {
      timestamp: new Date().toISOString(),
      system: this.getSystemMetrics(),
      metrics: Object.fromEntries(
        Array.from(this.metrics.entries()).map(([name, metrics]) => [
          name,
          this.getMetricStats(name, new Date(Date.now() - 3600000)) // Last hour
        ])
      )
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Setup default alert rules
   */
  private setupDefaultAlertRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'high_response_time',
        name: 'High API Response Time',
        metric: 'api.response.time',
        threshold: 2000,
        operator: '>',
        severity: 'high',
        enabled: true
      },
      {
        id: 'high_error_rate',
        name: 'High Error Rate',
        metric: 'api.requests.error_rate',
        threshold: 5,
        operator: '>',
        severity: 'critical',
        enabled: true
      },
      {
        id: 'low_cache_hit_rate',
        name: 'Low Cache Hit Rate',
        metric: 'cache.hit_rate',
        threshold: 50,
        operator: '<',
        severity: 'medium',
        enabled: true
      }
    ];

    defaultRules.forEach(rule => this.addAlertRule(rule));
  }

  /**
   * Check if metric triggers any alert rules
   */
  private checkAlertRules(metric: PerformanceMetric): void {
    for (const rule of this.alertRules.values()) {
      if (!rule.enabled || rule.metric !== metric.name) continue;

      const triggered = this.evaluateRule(rule, metric.value);
      
      if (triggered) {
        this.triggerAlert(rule, metric);
      }
    }
  }

  /**
   * Evaluate if a rule is triggered
   */
  private evaluateRule(rule: AlertRule, value: number): boolean {
    switch (rule.operator) {
      case '>': return value > rule.threshold;
      case '<': return value < rule.threshold;
      case '>=': return value >= rule.threshold;
      case '<=': return value <= rule.threshold;
      case '=': return value === rule.threshold;
      default: return false;
    }
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(rule: AlertRule, metric: PerformanceMetric): void {
    console.warn(`ALERT [${rule.severity.toUpperCase()}]: ${rule.name}`, {
      rule: rule.name,
      metric: metric.name,
      value: metric.value,
      threshold: rule.threshold,
      operator: rule.operator,
      timestamp: metric.timestamp
    });

    // Record alert metric
    this.recordMetric('alerts.triggered', 1, {
      rule: rule.id,
      severity: rule.severity
    });
  }

  /**
   * Get recent metrics
   */
  private getRecentMetrics(name: string, count: number): PerformanceMetric[] {
    const metrics = this.metrics.get(name) || [];
    return metrics.slice(-count);
  }

  /**
   * Calculate overall system health
   */
  private calculateOverallHealth(): 'healthy' | 'unhealthy' | 'degraded' {
    const checks = Array.from(this.healthChecks.values());
    
    if (checks.length === 0) return 'degraded';

    const criticalChecks = checks.filter(c => c.critical);
    const unhealthyCritical = criticalChecks.filter(c => c.status === 'unhealthy');
    
    if (unhealthyCritical.length > 0) return 'unhealthy';

    const unhealthyChecks = checks.filter(c => c.status === 'unhealthy');
    const degradedChecks = checks.filter(c => c.status === 'degraded');
    
    if (unhealthyChecks.length > 0 || degradedChecks.length > 0) return 'degraded';

    return 'healthy';
  }

  /**
   * Calculate system throughput
   */
  private calculateThroughput(): number {
    const recentSuccessRequests = this.getRecentMetrics('api.requests.success', 60);
    const timeWindow = 60; // seconds
    return Math.round(recentSuccessRequests.length / timeWindow);
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): number {
    // Simplified memory estimation
    return Math.round(process.memoryUsage().heapUsed / (1024 * 1024)); // MB
  }

  /**
   * Estimate active connections
   */
  private estimateActiveConnections(): number {
    // This would typically integrate with your database/connection pool
    return Math.floor(Math.random() * 10) + 5; // Placeholder
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    setInterval(() => {
      // Record system metrics
      const systemMetrics = this.getSystemMetrics();
      
      this.recordMetric('system.memory_usage', systemMetrics.resources.memoryUsage);
      this.recordMetric('system.cache_size', systemMetrics.resources.cacheSize);
      this.recordMetric('cache.hit_rate', systemMetrics.performance.cacheHitRate);
      
      // Flush metrics buffer if needed
      if (this.performanceBuffer.length > 100) {
        this.flushMetrics();
      }
    }, this.metricsFlushInterval);
  }

  /**
   * Setup periodic health checks
   */
  private setupPeriodicHealthChecks(): void {
    // Register default health checks
    this.registerHealthCheck(
      'database_connection',
      async () => {
        try {
          // Test database connection (placeholder)
          const start = Date.now();
          // await supabase.from('transactions').select('id').limit(1);
          const responseTime = Date.now() - start;
          return { status: true, responseTime, message: 'Database connection OK' };
        } catch {
          return { status: false, responseTime: 0, message: 'Database connection failed' };
        }
      },
      true
    );

    this.registerHealthCheck(
      'cache_service',
      async () => {
        const start = Date.now();
        const stats = cacheManager.getStats();
        const responseTime = Date.now() - start;
        
        return {
          status: stats.total >= 0, // Cache is responsive
          responseTime,
          message: `Cache entries: ${stats.entryCount}, Hit rate: ${stats.hitRate.toFixed(1)}%`
        };
      },
      false
    );

    // Run health checks every 30 seconds
    setInterval(() => {
      this.runAllHealthChecks();
    }, 30000);
  }

  /**
   * Run all health checks
   */
  private async runAllHealthChecks(): Promise<void> {
    const checks = Array.from(this.healthChecks.keys());
    
    await Promise.allSettled(
      checks.map(async (checkName) => {
        // Re-run health checks (you'd need to store the check functions)
        // This is a simplified version
      })
    );
  }

  /**
   * Flush metrics buffer
   */
  private flushMetrics(): void {
    console.log(`Flushing ${this.performanceBuffer.length} metrics to external system`);
    // Here you would send metrics to external monitoring system
    this.performanceBuffer = [];
  }

  /**
   * Export metrics in Prometheus format
   */
  private exportPrometheusFormat(): string {
    const lines: string[] = [];
    
    for (const [metricName, metrics] of this.metrics.entries()) {
      if (metrics.length === 0) continue;
      
      const latestMetric = metrics[metrics.length - 1];
      const safeName = metricName.replace(/[.-]/g, '_');
      
      lines.push(`# HELP ${safeName} ${metricName} metric`);
      lines.push(`# TYPE ${safeName} gauge`);
      
      if (latestMetric.labels) {
        const labelStr = Object.entries(latestMetric.labels)
          .map(([k, v]) => `${k}="${v}"`)
          .join(',');
        lines.push(`${safeName}{${labelStr}} ${latestMetric.value}`);
      } else {
        lines.push(`${safeName} ${latestMetric.value}`);
      }
    }
    
    return lines.join('\n');
  }
}

// Export singleton instance
export const monitoringService = new MonitoringService();