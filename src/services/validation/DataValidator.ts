/**
 * Production-ready data validation layer
 * Ensures data integrity and consistency before processing
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: Record<string, any>;
}

export interface BrandData {
  id: string;
  name: string;
  revenue: number;
  marketShare?: number;
  growth?: number;
  category?: string;
  transactionCount?: number;
}

export interface TransactionData {
  id: string;
  created_at: string;
  total_amount: number;
  store_id?: string;
  customer_id?: string;
  payment_method?: string;
  device_id?: string;
}

export interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  brand?: string;
  sku?: string;
}

export class DataValidator {
  /**
   * Validate brand data with comprehensive business rules
   */
  validateBrandData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metadata: Record<string, any> = {};

    // Type checking
    if (!data || typeof data !== 'object') {
      errors.push('Brand data must be an object');
      return { isValid: false, errors, warnings, metadata };
    }

    // Required fields validation
    if (!data.id || typeof data.id !== 'string') {
      errors.push('Brand ID is required and must be a string');
    }

    if (!data.name || typeof data.name !== 'string') {
      errors.push('Brand name is required and must be a string');
    } else if (data.name.length < 2 || data.name.length > 100) {
      errors.push('Brand name must be between 2 and 100 characters');
    }

    if (data.revenue === undefined || data.revenue === null) {
      errors.push('Revenue is required');
    } else if (typeof data.revenue !== 'number') {
      errors.push('Revenue must be a number');
    } else if (data.revenue < 0) {
      errors.push('Revenue cannot be negative');
    } else if (data.revenue === 0) {
      warnings.push('Revenue is zero - this may indicate no sales');
    }

    // Optional fields validation
    if (data.marketShare !== undefined) {
      if (typeof data.marketShare !== 'number') {
        errors.push('Market share must be a number');
      } else if (data.marketShare < 0 || data.marketShare > 100) {
        errors.push('Market share must be between 0 and 100');
      }
    }

    if (data.growth !== undefined) {
      if (typeof data.growth !== 'number') {
        errors.push('Growth rate must be a number');
      } else if (data.growth < -100) {
        errors.push('Growth rate cannot be less than -100%');
      } else if (Math.abs(data.growth) > 1000) {
        warnings.push('Unusually high growth rate detected');
      }
    }

    if (data.category && typeof data.category !== 'string') {
      errors.push('Category must be a string');
    }

    // Business logic validation
    if (data.revenue > 10000000) {
      warnings.push('Revenue exceeds ₱10M - please verify this is correct');
      metadata.highRevenue = true;
    }

    if (data.marketShare && data.marketShare > 50) {
      warnings.push('Market share exceeds 50% - dominant position');
      metadata.marketLeader = true;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata
    };
  }

  /**
   * Validate transaction data with Philippine market rules
   */
  validateTransactionData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metadata: Record<string, any> = {};

    // Type checking
    if (!data || typeof data !== 'object') {
      errors.push('Transaction data must be an object');
      return { isValid: false, errors, warnings, metadata };
    }

    // Required fields
    if (!data.id) {
      errors.push('Transaction ID is required');
    }

    if (!data.created_at) {
      errors.push('Transaction date is required');
    } else {
      const transactionDate = new Date(data.created_at);
      if (isNaN(transactionDate.getTime())) {
        errors.push('Invalid transaction date format');
      } else {
        // Check if date is reasonable (not in future, not too old)
        const now = new Date();
        const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        
        if (transactionDate > new Date()) {
          errors.push('Transaction date cannot be in the future');
        } else if (transactionDate < oneYearAgo) {
          warnings.push('Transaction is older than 1 year');
          metadata.oldTransaction = true;
        }
      }
    }

    if (data.total_amount === undefined || data.total_amount === null) {
      errors.push('Transaction amount is required');
    } else if (typeof data.total_amount !== 'number') {
      errors.push('Transaction amount must be a number');
    } else if (data.total_amount < 0) {
      errors.push('Transaction amount cannot be negative');
    } else if (data.total_amount === 0) {
      warnings.push('Transaction amount is zero');
    } else if (data.total_amount > 100000) {
      warnings.push('Transaction amount exceeds ₱100,000 - unusually high');
      metadata.highValueTransaction = true;
    }

    // Optional fields validation
    if (data.payment_method) {
      const validPaymentMethods = ['cash', 'card', 'gcash', 'maya', 'bank_transfer', 'credit'];
      if (!validPaymentMethods.includes(data.payment_method.toLowerCase())) {
        warnings.push(`Unusual payment method: ${data.payment_method}`);
      }
    }

    if (data.store_id && (typeof data.store_id !== 'string' && typeof data.store_id !== 'number')) {
      errors.push('Store ID must be a string or number');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata
    };
  }

  /**
   * Validate product data
   */
  validateProductData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metadata: Record<string, any> = {};

    if (!data || typeof data !== 'object') {
      errors.push('Product data must be an object');
      return { isValid: false, errors, warnings, metadata };
    }

    // Required fields
    if (!data.id) {
      errors.push('Product ID is required');
    }

    if (!data.name || typeof data.name !== 'string') {
      errors.push('Product name is required and must be a string');
    } else if (data.name.length < 2 || data.name.length > 200) {
      errors.push('Product name must be between 2 and 200 characters');
    }

    if (!data.category || typeof data.category !== 'string') {
      errors.push('Product category is required');
    }

    if (data.price === undefined || data.price === null) {
      errors.push('Product price is required');
    } else if (typeof data.price !== 'number') {
      errors.push('Product price must be a number');
    } else if (data.price < 0) {
      errors.push('Product price cannot be negative');
    } else if (data.price === 0) {
      warnings.push('Product price is zero - is this a free item?');
    } else if (data.price > 10000) {
      warnings.push('Product price exceeds ₱10,000 - luxury item?');
      metadata.luxuryItem = true;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata
    };
  }

  /**
   * Batch validation for multiple records
   */
  validateBatch<T>(
    records: any[],
    validator: (data: any) => ValidationResult
  ): {
    valid: T[];
    invalid: Array<{ record: any; errors: string[] }>;
    summary: {
      total: number;
      valid: number;
      invalid: number;
      warnings: number;
    };
  } {
    const valid: T[] = [];
    const invalid: Array<{ record: any; errors: string[] }> = [];
    let warningCount = 0;

    for (const record of records) {
      const result = validator.call(this, record);
      
      if (result.isValid) {
        valid.push(record as T);
        warningCount += result.warnings.length;
      } else {
        invalid.push({
          record,
          errors: result.errors
        });
      }
    }

    return {
      valid,
      invalid,
      summary: {
        total: records.length,
        valid: valid.length,
        invalid: invalid.length,
        warnings: warningCount
      }
    };
  }

  /**
   * Sanitize data to prevent XSS and SQL injection
   */
  sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';
    
    // Remove potential SQL injection patterns
    let sanitized = input.replace(/['";\\]/g, '');
    
    // Remove potential XSS patterns
    sanitized = sanitized.replace(/<script.*?>.*?<\/script>/gi, '');
    sanitized = sanitized.replace(/<[^>]+>/g, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    return sanitized;
  }

  /**
   * Validate data freshness
   */
  validateDataFreshness(timestamp: string | Date, maxAgeMinutes: number = 60): boolean {
    const dataTime = new Date(timestamp);
    if (isNaN(dataTime.getTime())) return false;
    
    const now = new Date();
    const ageMinutes = (now.getTime() - dataTime.getTime()) / (1000 * 60);
    
    return ageMinutes <= maxAgeMinutes;
  }
}

// Export singleton instance
export const dataValidator = new DataValidator();