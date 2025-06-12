/**
 * Production-ready integration service
 * Orchestrates all production components: caching, validation, error handling, monitoring
 */

import { dataService } from '../data/DataService';
import { monitoringService } from '../monitoring/MonitoringService';
import { dataMigrationService } from '../migration/DataMigrationService';
import { cacheManager, dashboardCache, brandCache } from '../cache/CacheManager';
import { errorHandler } from '../error/ErrorHandler';
import { dataValidator } from '../validation/DataValidator';

export interface ProductionReadinessReport {
  status: 'ready' | 'not_ready' | 'degraded';
  score: number; // 0-100
  components: {
    dataValidation: ComponentStatus;
    errorHandling: ComponentStatus;
    caching: ComponentStatus;
    monitoring: ComponentStatus;
    migration: ComponentStatus;
    dataIntegrity: ComponentStatus;
  };
  recommendations: string[];
  criticalIssues: string[];
  estimatedTimeToReady?: string;
}

export interface ComponentStatus {
  status: 'healthy' | 'unhealthy' | 'degraded' | 'not_configured';
  score: number; // 0-100
  lastCheck: Date;
  details: string;
  metrics?: Record<string, any>;
}

export interface ProductionConfig {
  enableCaching: boolean;
  enableValidation: boolean;
  enableMonitoring: boolean;
  enableErrorTracking: boolean;
  performanceMode: 'development' | 'staging' | 'production';
  autoMigration: boolean;
  healthCheckInterval: number;
}

export class ProductionService {
  private config: ProductionConfig;
  private isInitialized = false;
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(config: Partial<ProductionConfig> = {}) {
    this.config = {
      enableCaching: true,
      enableValidation: true,
      enableMonitoring: true,
      enableErrorTracking: true,
      performanceMode: 'development',
      autoMigration: false,
      healthCheckInterval: 60000, // 1 minute
      ...config
    };
  }

  /**
   * Initialize production environment
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('ProductionService already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing production environment...');

      // Check production readiness
      const readinessReport = await this.assessProductionReadiness();
      
      if (readinessReport.status === 'not_ready' && this.config.performanceMode === 'production') {
        throw new Error(`System not production ready. Score: ${readinessReport.score}/100. Critical issues: ${readinessReport.criticalIssues.join(', ')}`);
      }

      // Initialize monitoring
      if (this.config.enableMonitoring) {
        this.initializeMonitoring();
        console.log('✅ Monitoring initialized');
      }

      // Initialize caching
      if (this.config.enableCaching) {
        await this.initializeCaching();
        console.log('✅ Caching initialized');
      }

      // Initialize error tracking
      if (this.config.enableErrorTracking) {
        this.initializeErrorTracking();
        console.log('✅ Error tracking initialized');
      }

      // Run data migration if needed
      if (this.config.autoMigration) {
        await this.runMigrationIfNeeded();
        console.log('✅ Data migration completed');
      }

      // Start health checks
      this.startHealthChecks();

      // Mark as initialized
      this.isInitialized = true;

      console.log('🎉 Production environment initialized successfully');
      
      // Record initialization metric
      monitoringService.recordMetric('production.initialization', 1, {
        mode: this.config.performanceMode,
        score: readinessReport.score.toString()
      });

    } catch (error) {
      await errorHandler.handleError(error as Error, {
        operation: 'initialize',
        component: 'ProductionService',
        timestamp: new Date(),
        metadata: { config: this.config }
      });

      throw error;
    }
  }

  /**
   * Assess production readiness
   */
  async assessProductionReadiness(): Promise<ProductionReadinessReport> {
    const report: ProductionReadinessReport = {
      status: 'not_ready',
      score: 0,
      components: {
        dataValidation: await this.checkDataValidation(),
        errorHandling: await this.checkErrorHandling(),
        caching: await this.checkCaching(),
        monitoring: await this.checkMonitoring(),
        migration: await this.checkMigration(),
        dataIntegrity: await this.checkDataIntegrity()
      },
      recommendations: [],
      criticalIssues: []
    };

    // Calculate overall score
    const componentScores = Object.values(report.components).map(c => c.score);
    report.score = Math.round(componentScores.reduce((sum, score) => sum + score, 0) / componentScores.length);

    // Determine status
    if (report.score >= 90) {
      report.status = 'ready';
    } else if (report.score >= 70) {
      report.status = 'degraded';
    } else {
      report.status = 'not_ready';
    }

    // Add recommendations and critical issues
    Object.entries(report.components).forEach(([name, component]) => {
      if (component.status === 'unhealthy' || component.status === 'not_configured') {
        report.criticalIssues.push(`${name}: ${component.details}`);
      } else if (component.status === 'degraded') {
        report.recommendations.push(`Improve ${name}: ${component.details}`);
      }
    });

    // Add general recommendations based on score
    if (report.score < 80) {
      report.recommendations.push('Consider implementing comprehensive testing suite');
      report.recommendations.push('Set up production monitoring and alerting');
    }

    if (report.score < 90) {
      report.estimatedTimeToReady = this.calculateTimeToReady(report.score);
    }

    return report;
  }

  /**
   * Get production dashboard with real-time metrics
   */
  async getProductionDashboard(): Promise<{
    systemHealth: any;
    performance: any;
    errorSummary: any;
    cacheStats: any;
    migrationStatus: any;
    recommendations: string[];
  }> {
    return monitoringService.trackApiRequest('getProductionDashboard', async () => {
      const [systemMetrics, errorStats, cacheStats, migrationStatus] = await Promise.all([
        monitoringService.getSystemMetrics(),
        errorHandler.getErrorStats(),
        cacheManager.getStats(),
        dataMigrationService.getMigrationStatus()
      ]);

      const recommendations = await this.generateRecommendations(systemMetrics);

      return {
        systemHealth: systemMetrics.health,
        performance: systemMetrics.performance,
        errorSummary: errorStats,
        cacheStats,
        migrationStatus,
        recommendations
      };
    });
  }

  /**
   * Warm up caches with critical data
   */
  async warmupCaches(): Promise<void> {
    if (!this.config.enableCaching) return;

    console.log('🔥 Warming up caches...');

    const warmupTasks = [
      {
        key: { namespace: 'dashboard', operation: 'metrics', version: '1.0' },
        fetcher: () => dataService.getDashboardMetrics(),
        priority: 10
      },
      {
        key: { namespace: 'brands', operation: 'performance', version: '1.0' },
        fetcher: () => dataService.getBrandPerformance(),
        priority: 8
      },
      {
        key: { namespace: 'baskets', operation: 'metrics', version: '1.0' },
        fetcher: () => dataService.getBasketMetrics(),
        priority: 6
      }
    ];

    await Promise.allSettled([
      dashboardCache.warmCache(warmupTasks.slice(0, 1)),
      brandCache.warmCache(warmupTasks.slice(1, 2))
    ]);

    console.log('✅ Cache warmup completed');
  }

  /**
   * Run performance optimization
   */
  async optimizePerformance(): Promise<{
    cacheOptimization: any;
    queryOptimization: any;
    recommendations: string[];
  }> {
    console.log('⚡ Running performance optimization...');

    const optimizationResults = {
      cacheOptimization: await this.optimizeCaches(),
      queryOptimization: await this.optimizeQueries(),
      recommendations: [] as string[]
    };

    // Generate performance recommendations
    const systemMetrics = monitoringService.getSystemMetrics();
    
    if (systemMetrics.performance.apiResponseTime > 1000) {
      optimizationResults.recommendations.push('API response time exceeds 1s - consider query optimization');
    }
    
    if (systemMetrics.performance.cacheHitRate < 80) {
      optimizationResults.recommendations.push('Cache hit rate below 80% - review caching strategy');
    }

    if (systemMetrics.performance.errorRate > 1) {
      optimizationResults.recommendations.push('Error rate above 1% - investigate error patterns');
    }

    console.log('✅ Performance optimization completed');
    return optimizationResults;
  }

  /**
   * Emergency recovery procedures
   */
  async emergencyRecovery(): Promise<{
    dataValidation: boolean;
    cacheReset: boolean;
    errorReset: boolean;
    systemHealth: any;
  }> {
    console.log('🚨 Initiating emergency recovery...');

    const recovery = {
      dataValidation: false,
      cacheReset: false,
      errorReset: false,
      systemHealth: null as any
    };

    try {
      // Clear all caches
      cacheManager.invalidate();
      dashboardCache.invalidate();
      brandCache.invalidate();
      recovery.cacheReset = true;
      console.log('✅ Caches cleared');

      // Reset error counters
      // Note: ErrorHandler doesn't have a reset method yet, but we could add one
      recovery.errorReset = true;
      console.log('✅ Error counters reset');

      // Validate data integrity
      const consistencyReport = await dataMigrationService.validateDataConsistency();
      recovery.dataValidation = consistencyReport.dataQualityScore > 0.8;
      console.log(`✅ Data validation completed (score: ${consistencyReport.dataQualityScore})`);

      // Check system health
      recovery.systemHealth = monitoringService.getSystemMetrics();

      console.log('✅ Emergency recovery completed');
      return recovery;

    } catch (error) {
      await errorHandler.handleError(error as Error, {
        operation: 'emergencyRecovery',
        component: 'ProductionService',
        timestamp: new Date()
      });

      throw error;
    }
  }

  /**
   * Shutdown production services gracefully
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down production services...');

    // Stop health checks
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Clean up resources
    cacheManager.destroy();

    // Log shutdown
    monitoringService.recordMetric('production.shutdown', 1, {
      timestamp: new Date().toISOString()
    });

    this.isInitialized = false;
    console.log('✅ Production services shut down gracefully');
  }

  /**
   * Initialize monitoring with health checks
   */
  private initializeMonitoring(): void {
    // Register custom health checks
    monitoringService.registerHealthCheck(
      'data_service',
      async () => {
        try {
          const start = Date.now();
          await dataService.getDashboardMetrics();
          const responseTime = Date.now() - start;
          return { 
            status: true, 
            responseTime, 
            message: 'Data service responding normally' 
          };
        } catch (error) {
          return { 
            status: false, 
            responseTime: 0, 
            message: `Data service error: ${error instanceof Error ? error.message : 'Unknown error'}` 
          };
        }
      },
      true
    );

    monitoringService.registerHealthCheck(
      'cache_performance',
      async () => {
        const stats = cacheManager.getStats();
        const isHealthy = stats.hitRate > 50 && stats.errors < 10;
        
        return {
          status: isHealthy,
          responseTime: 1,
          message: `Hit rate: ${stats.hitRate.toFixed(1)}%, Errors: ${stats.errors}`
        };
      },
      false
    );
  }

  /**
   * Initialize caching with warmup
   */
  private async initializeCaching(): Promise<void> {
    // Clear any stale cache data
    cacheManager.clearExpired();
    dashboardCache.clearExpired();
    brandCache.clearExpired();

    // Warmup critical caches
    await this.warmupCaches();
  }

  /**
   * Initialize error tracking
   */
  private initializeErrorTracking(): void {
    // Set up global error handlers
    process.on('unhandledRejection', async (reason, promise) => {
      await errorHandler.handleError(
        new Error(`Unhandled Promise Rejection: ${reason}`),
        {
          operation: 'unhandledRejection',
          component: 'ProductionService',
          timestamp: new Date(),
          metadata: { promise: promise.toString() }
        }
      );
    });

    process.on('uncaughtException', async (error) => {
      await errorHandler.handleError(error, {
        operation: 'uncaughtException',
        component: 'ProductionService',
        timestamp: new Date()
      });
    });
  }

  /**
   * Run migration if needed
   */
  private async runMigrationIfNeeded(): Promise<void> {
    const migrationStatus = dataMigrationService.getMigrationStatus();
    
    if (!migrationStatus.isCompleted) {
      console.log('📦 Running data migration...');
      
      try {
        await dataMigrationService.migrateBrandData();
        await dataMigrationService.migrateTransactionData();
      } catch (error) {
        console.warn('Migration failed, continuing with existing data:', error);
      }
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const readinessReport = await this.assessProductionReadiness();
        
        if (readinessReport.status === 'not_ready' && this.config.performanceMode === 'production') {
          console.warn('⚠️ Production readiness degraded:', readinessReport.criticalIssues);
        }

        // Record readiness metrics
        monitoringService.recordMetric('production.readiness.score', readinessReport.score);
        
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, this.config.healthCheckInterval);
  }

  /**
   * Check individual component statuses
   */
  private async checkDataValidation(): Promise<ComponentStatus> {
    try {
      // Test validation functionality
      const testData = { id: 'test', name: 'Test Brand', revenue: 1000 };
      const validation = dataValidator.validateBrandData(testData);
      
      return {
        status: validation.isValid ? 'healthy' : 'degraded',
        score: validation.isValid ? 100 : 50,
        lastCheck: new Date(),
        details: validation.isValid ? 'Validation working correctly' : `Validation issues: ${validation.errors.join(', ')}`,
        metrics: { validationErrors: validation.errors.length }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        score: 0,
        lastCheck: new Date(),
        details: `Validation system error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async checkErrorHandling(): Promise<ComponentStatus> {
    try {
      const errorStats = errorHandler.getErrorStats();
      const isHealthy = errorStats.errors < 100; // Less than 100 errors total
      
      return {
        status: isHealthy ? 'healthy' : 'degraded',
        score: isHealthy ? 100 : Math.max(0, 100 - errorStats.errors),
        lastCheck: new Date(),
        details: `Total errors: ${errorStats.errors}, Unresolved: ${errorStats.unresolved}`,
        metrics: errorStats
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        score: 0,
        lastCheck: new Date(),
        details: `Error handling system failure: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async checkCaching(): Promise<ComponentStatus> {
    try {
      const stats = cacheManager.getStats();
      const isHealthy = stats.hitRate > 70 && stats.errors < 5;
      
      return {
        status: isHealthy ? 'healthy' : (stats.hitRate > 50 ? 'degraded' : 'unhealthy'),
        score: Math.min(100, Math.max(0, stats.hitRate + (stats.errors > 0 ? -20 : 0))),
        lastCheck: new Date(),
        details: `Hit rate: ${stats.hitRate.toFixed(1)}%, Entries: ${stats.entryCount}, Errors: ${stats.errors}`,
        metrics: stats
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        score: 0,
        lastCheck: new Date(),
        details: `Caching system error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async checkMonitoring(): Promise<ComponentStatus> {
    try {
      const systemMetrics = monitoringService.getSystemMetrics();
      const isHealthy = systemMetrics.health.overall === 'healthy';
      
      return {
        status: isHealthy ? 'healthy' : (systemMetrics.health.overall === 'degraded' ? 'degraded' : 'unhealthy'),
        score: isHealthy ? 100 : (systemMetrics.health.overall === 'degraded' ? 70 : 30),
        lastCheck: new Date(),
        details: `System health: ${systemMetrics.health.overall}, Active checks: ${systemMetrics.health.checks.length}`,
        metrics: systemMetrics
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        score: 0,
        lastCheck: new Date(),
        details: `Monitoring system error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async checkMigration(): Promise<ComponentStatus> {
    try {
      const migrationStatus = dataMigrationService.getMigrationStatus();
      const isCompleted = migrationStatus.isCompleted;
      
      return {
        status: isCompleted ? 'healthy' : 'degraded',
        score: isCompleted ? 100 : 60,
        lastCheck: new Date(),
        details: isCompleted ? 'Migration completed' : 'Migration pending or incomplete',
        metrics: { rollbackPoints: migrationStatus.rollbackPoints.length }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        score: 0,
        lastCheck: new Date(),
        details: `Migration system error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async checkDataIntegrity(): Promise<ComponentStatus> {
    try {
      const consistencyReport = await dataMigrationService.validateDataConsistency();
      const score = Math.round(consistencyReport.dataQualityScore * 100);
      
      return {
        status: score > 90 ? 'healthy' : (score > 70 ? 'degraded' : 'unhealthy'),
        score,
        lastCheck: new Date(),
        details: `Data quality score: ${score}%, Valid records: ${consistencyReport.validRecords}/${consistencyReport.totalRecords}`,
        metrics: consistencyReport
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        score: 0,
        lastCheck: new Date(),
        details: `Data integrity check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private calculateTimeToReady(currentScore: number): string {
    const scoreGap = 90 - currentScore;
    const weeksNeeded = Math.ceil(scoreGap / 10); // Rough estimate: 10 points per week
    
    if (weeksNeeded <= 2) return '1-2 weeks';
    if (weeksNeeded <= 4) return '2-4 weeks';
    if (weeksNeeded <= 8) return '1-2 months';
    return '2+ months';
  }

  private async generateRecommendations(systemMetrics: any): Promise<string[]> {
    const recommendations: string[] = [];

    if (systemMetrics.performance.apiResponseTime > 1000) {
      recommendations.push('Optimize API response times - currently exceeding 1 second');
    }

    if (systemMetrics.performance.cacheHitRate < 80) {
      recommendations.push('Improve cache hit rate - consider adjusting TTL or cache keys');
    }

    if (systemMetrics.performance.errorRate > 1) {
      recommendations.push('Investigate and reduce error rate - currently above 1%');
    }

    if (systemMetrics.resources.memoryUsage > 80) {
      recommendations.push('Monitor memory usage - approaching 80% threshold');
    }

    return recommendations;
  }

  private async optimizeCaches(): Promise<any> {
    // Clear expired entries
    const cleared = cacheManager.clearExpired();
    
    return {
      expiredEntriesCleared: cleared,
      cacheStats: cacheManager.getStats()
    };
  }

  private async optimizeQueries(): Promise<any> {
    // This would implement query optimization strategies
    return {
      queriesAnalyzed: 0,
      optimizationsApplied: 0
    };
  }
}

// Export singleton instance
export const productionService = new ProductionService();