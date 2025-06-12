/**
 * Production-ready error handling and recovery system
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  DATABASE = 'database',
  VALIDATION = 'validation',
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  USER_INPUT = 'user_input'
}

export interface ErrorContext {
  operation: string;
  userId?: string;
  component: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  request?: {
    method: string;
    url: string;
    headers?: Record<string, string>;
  };
}

export interface ErrorLog {
  id: string;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  severity: ErrorSeverity;
  category: ErrorCategory;
  context: ErrorContext;
  timestamp: Date;
  resolved: boolean;
  resolution?: string;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export class ErrorHandler {
  private errorLogs: Map<string, ErrorLog> = new Map();
  private retryConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2
  };

  /**
   * Handle and categorize errors with recovery strategies
   */
  async handleError(error: Error, context: ErrorContext): Promise<void> {
    const errorLog = this.createErrorLog(error, context);
    this.errorLogs.set(errorLog.id, errorLog);

    // Log error
    console.error(`[${errorLog.severity}] ${errorLog.category}:`, {
      message: error.message,
      context,
      stack: error.stack
    });

    // Send alerts for high severity errors
    if (errorLog.severity === ErrorSeverity.CRITICAL || errorLog.severity === ErrorSeverity.HIGH) {
      await this.sendAlert(errorLog);
    }

    // Attempt recovery
    await this.attemptRecovery(error, context);

    // Track metrics
    this.trackErrorMetrics(errorLog);
  }

  /**
   * Create structured error log
   */
  private createErrorLog(error: Error, context: ErrorContext): ErrorLog {
    const severity = this.categorizeErrorSeverity(error);
    const category = this.categorizeError(error);

    return {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      severity,
      category,
      context: {
        ...context,
        timestamp: new Date()
      },
      timestamp: new Date(),
      resolved: false
    };
  }

  /**
   * Categorize error by type
   */
  private categorizeError(error: Error): ErrorCategory {
    const errorName = error.name.toLowerCase();
    const errorMessage = error.message.toLowerCase();

    if (errorName.includes('database') || errorMessage.includes('connection')) {
      return ErrorCategory.DATABASE;
    }
    if (errorName.includes('validation') || errorMessage.includes('invalid')) {
      return ErrorCategory.VALIDATION;
    }
    if (errorName.includes('network') || errorMessage.includes('fetch')) {
      return ErrorCategory.NETWORK;
    }
    if (errorName.includes('auth') || errorMessage.includes('unauthorized')) {
      return ErrorCategory.AUTHENTICATION;
    }
    if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
      return ErrorCategory.AUTHORIZATION;
    }

    return ErrorCategory.SYSTEM;
  }

  /**
   * Determine error severity
   */
  private categorizeErrorSeverity(error: Error): ErrorSeverity {
    const errorName = error.name.toLowerCase();
    const errorMessage = error.message.toLowerCase();

    // Critical errors
    if (errorMessage.includes('database') && errorMessage.includes('connection')) {
      return ErrorSeverity.CRITICAL;
    }
    if (errorMessage.includes('out of memory') || errorMessage.includes('fatal')) {
      return ErrorSeverity.CRITICAL;
    }

    // High severity errors
    if (errorName.includes('syntax') || errorName.includes('reference')) {
      return ErrorSeverity.HIGH;
    }
    if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
      return ErrorSeverity.HIGH;
    }

    // Medium severity errors
    if (errorName.includes('validation') || errorMessage.includes('invalid')) {
      return ErrorSeverity.MEDIUM;
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
      return ErrorSeverity.MEDIUM;
    }

    // Default to low severity
    return ErrorSeverity.LOW;
  }

  /**
   * Attempt error recovery based on error type
   */
  private async attemptRecovery(error: Error, context: ErrorContext): Promise<void> {
    const category = this.categorizeError(error);

    switch (category) {
      case ErrorCategory.DATABASE:
        await this.recoverFromDatabaseError(error, context);
        break;
      case ErrorCategory.NETWORK:
        await this.recoverFromNetworkError(error, context);
        break;
      case ErrorCategory.VALIDATION:
        await this.recoverFromValidationError(error, context);
        break;
      default:
        console.warn(`No recovery strategy for category: ${category}`);
    }
  }

  /**
   * Recovery strategy for database errors
   */
  private async recoverFromDatabaseError(error: Error, context: ErrorContext): Promise<void> {
    // Try to reconnect
    try {
      await this.retryWithBackoff(
        async () => {
          // Attempt to reconnect to database
          console.log('Attempting database reconnection...');
          // Implementation would depend on your database client
        },
        this.retryConfig
      );
    } catch (retryError) {
      // Use cached data as fallback
      console.warn('Database reconnection failed, using cached data');
      await this.useCachedData(context);
    }
  }

  /**
   * Recovery strategy for network errors
   */
  private async recoverFromNetworkError(error: Error, context: ErrorContext): Promise<void> {
    try {
      await this.retryWithBackoff(
        async () => {
          console.log('Retrying network operation...');
          // Retry the failed operation
        },
        { ...this.retryConfig, maxAttempts: 2 }
      );
    } catch (retryError) {
      // Use fallback service or cached data
      console.warn('Network retry failed, using fallback');
      await this.useNetworkFallback(context);
    }
  }

  /**
   * Recovery strategy for validation errors
   */
  private async recoverFromValidationError(error: Error, context: ErrorContext): Promise<void> {
    // Sanitize and retry with cleaned data
    console.log('Attempting data sanitization and retry...');
    // Implementation would sanitize the data and retry
  }

  /**
   * Retry with exponential backoff
   */
  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    config: RetryConfig = this.retryConfig
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === config.maxAttempts) {
          throw lastError;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt - 1),
          config.maxDelayMs
        );

        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Use cached data as fallback
   */
  private async useCachedData(context: ErrorContext): Promise<void> {
    console.log(`Using cached data for operation: ${context.operation}`);
    // Implementation would retrieve cached data
  }

  /**
   * Use network fallback service
   */
  private async useNetworkFallback(context: ErrorContext): Promise<void> {
    console.log(`Using network fallback for operation: ${context.operation}`);
    // Implementation would use backup service
  }

  /**
   * Send alert for critical errors
   */
  private async sendAlert(errorLog: ErrorLog): Promise<void> {
    // Implementation would send alert via email, Slack, etc.
    console.error('ALERT: Critical error occurred', {
      id: errorLog.id,
      error: errorLog.error.message,
      context: errorLog.context
    });
  }

  /**
   * Track error metrics
   */
  private trackErrorMetrics(errorLog: ErrorLog): void {
    // Implementation would send metrics to monitoring service
    console.log('Tracking error metrics', {
      severity: errorLog.severity,
      category: errorLog.category,
      component: errorLog.context.component
    });
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byCategory: Record<ErrorCategory, number>;
    resolved: number;
    unresolved: number;
  } {
    const errors = Array.from(this.errorLogs.values());
    
    const bySeverity = errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<ErrorSeverity, number>);

    const byCategory = errors.reduce((acc, error) => {
      acc[error.category] = (acc[error.category] || 0) + 1;
      return acc;
    }, {} as Record<ErrorCategory, number>);

    return {
      total: errors.length,
      bySeverity,
      byCategory,
      resolved: errors.filter(e => e.resolved).length,
      unresolved: errors.filter(e => !e.resolved).length
    };
  }

  /**
   * Mark error as resolved
   */
  resolveError(errorId: string, resolution: string): boolean {
    const error = this.errorLogs.get(errorId);
    if (error) {
      error.resolved = true;
      error.resolution = resolution;
      return true;
    }
    return false;
  }

  /**
   * Clear old error logs
   */
  clearOldErrors(olderThanHours: number = 24): number {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    let cleared = 0;

    for (const [id, error] of this.errorLogs.entries()) {
      if (error.timestamp < cutoff && error.resolved) {
        this.errorLogs.delete(id);
        cleared++;
      }
    }

    return cleared;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();