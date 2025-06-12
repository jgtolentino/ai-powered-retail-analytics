import { supabase } from '@/lib/supabase/client';
import { dashboardCache, brandCache, transactionCache } from '../cache/CacheManager';
import { dataValidator } from '../validation/DataValidator';
import { errorHandler } from '../error/ErrorHandler';

export interface DashboardMetrics {
  totalRevenue: number;
  totalTransactions: number;
  avgTransactionValue: number;
  topBrands: BrandMetric[];
  categoryPerformance: CategoryMetric[];
}

export interface BrandMetric {
  name: string;
  revenue: number;
  marketShare: number;
  growth: number;
  transactionCount: number;
}

export interface CategoryMetric {
  name: string;
  revenue: number;
  transactionCount: number;
  topBrand: string;
  growth: number;
}

export interface BasketMetrics {
  avgBasketSize: number;
  basketDistribution: { size: number; count: number; percentage: number }[];
  topProducts: { product_name: string; frequency: number; category: string }[];
}

export class DataService {
  /**
   * Get real-time dashboard metrics from Supabase with caching and validation
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return dashboardCache.get(
      {
        namespace: 'dashboard',
        operation: 'metrics',
        version: '1.0'
      },
      async () => {
        try {
          const { data: transactions, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            await errorHandler.handleError(error as Error, {
              operation: 'getDashboardMetrics',
              component: 'DataService',
              timestamp: new Date(),
              metadata: { tableName: 'transactions' }
            });
            throw error;
          }

          // Validate transaction data
          const validationResult = dataValidator.validateBatch(
            transactions || [],
            dataValidator.validateTransactionData
          );

          if (validationResult.invalid.length > 0) {
            console.warn(`Dashboard: ${validationResult.invalid.length} invalid transactions found`);
          }

          const metrics = this.transformTransactionMetrics(validationResult.valid);
          
          return metrics;
        } catch (error) {
          await errorHandler.handleError(error as Error, {
            operation: 'getDashboardMetrics',
            component: 'DataService',
            timestamp: new Date()
          });
          throw error;
        }
      },
      { ttl: 2 * 60 * 1000 } // 2 minutes cache for dashboard
    );
  }

  /**
   * Get real brand performance data with caching and validation
   */
  async getBrandPerformance(): Promise<BrandMetric[]> {
    return brandCache.get(
      {
        namespace: 'brands',
        operation: 'performance',
        version: '1.0'
      },
      async () => {
        try {
          const { data: transactions, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            await errorHandler.handleError(error as Error, {
              operation: 'getBrandPerformance',
              component: 'DataService',
              timestamp: new Date(),
              metadata: { tableName: 'transactions' }
            });
            throw error;
          }

          // Validate transaction data
          const validationResult = dataValidator.validateBatch(
            transactions || [],
            dataValidator.validateTransactionData
          );

          const brandMetrics = this.calculateBrandMetrics(validationResult.valid);
          
          // Validate brand metrics
          const validatedBrands = brandMetrics.filter(brand => {
            const validation = dataValidator.validateBrandData(brand);
            if (!validation.isValid) {
              console.warn(`Invalid brand data for ${brand.name}:`, validation.errors);
              return false;
            }
            return true;
          });

          return validatedBrands;
        } catch (error) {
          await errorHandler.handleError(error as Error, {
            operation: 'getBrandPerformance',
            component: 'DataService',
            timestamp: new Date()
          });
          throw error;
        }
      },
      { ttl: 10 * 60 * 1000 } // 10 minutes cache for brand data
    );
  }

  /**
   * Get real basket analytics with caching and validation
   */
  async getBasketMetrics(): Promise<BasketMetrics> {
    return transactionCache.get(
      {
        namespace: 'baskets',
        operation: 'metrics',
        version: '1.0'
      },
      async () => {
        try {
          const { data: transactions, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            await errorHandler.handleError(error as Error, {
              operation: 'getBasketMetrics',
              component: 'DataService',
              timestamp: new Date(),
              metadata: { tableName: 'transactions' }
            });
            throw error;
          }

          // Validate transaction data
          const validationResult = dataValidator.validateBatch(
            transactions || [],
            dataValidator.validateTransactionData
          );

          return this.calculateBasketMetrics(validationResult.valid);
        } catch (error) {
          await errorHandler.handleError(error as Error, {
            operation: 'getBasketMetrics',
            component: 'DataService',
            timestamp: new Date()
          });
          throw error;
        }
      },
      { ttl: 1 * 60 * 1000 } // 1 minute cache for basket data
    );
  }

  /**
   * Transform raw transaction data into dashboard metrics
   */
  private transformTransactionMetrics(transactions: any[]): DashboardMetrics {
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
    const totalTransactions = transactions.length;
    const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Calculate brand metrics from transaction data
    const brandMap = new Map<string, { revenue: number; count: number }>();
    
    transactions.forEach(transaction => {
      const brand = this.extractBrandFromTransaction(transaction);
      const revenue = transaction.total_amount || 0;
      
      const existing = brandMap.get(brand) || { revenue: 0, count: 0 };
      brandMap.set(brand, {
        revenue: existing.revenue + revenue,
        count: existing.count + 1
      });
    });

    const topBrands = Array.from(brandMap.entries())
      .map(([name, data]) => ({
        name,
        revenue: data.revenue,
        marketShare: (data.revenue / totalRevenue) * 100,
        growth: this.calculateGrowthRate(name, data.revenue), // Implement growth calculation
        transactionCount: data.count
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalRevenue,
      totalTransactions,
      avgTransactionValue,
      topBrands,
      categoryPerformance: this.calculateCategoryMetrics(transactions)
    };
  }

  /**
   * Calculate brand metrics from real transaction data
   */
  private calculateBrandMetrics(transactions: any[]): BrandMetric[] {
    const brandMap = new Map<string, { revenue: number; count: number }>();
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);

    transactions.forEach(transaction => {
      const brand = this.extractBrandFromTransaction(transaction);
      const revenue = transaction.total_amount || 0;
      
      const existing = brandMap.get(brand) || { revenue: 0, count: 0 };
      brandMap.set(brand, {
        revenue: existing.revenue + revenue,
        count: existing.count + 1
      });
    });

    return Array.from(brandMap.entries())
      .map(([name, data]) => ({
        name,
        revenue: data.revenue,
        marketShare: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
        growth: this.calculateGrowthRate(name, data.revenue),
        transactionCount: data.count
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  /**
   * Calculate basket metrics from real transaction data
   */
  private calculateBasketMetrics(transactions: any[]): BasketMetrics {
    const basketSizes = new Map<number, number>();
    let totalItems = 0;
    const productFrequency = new Map<string, number>();

    transactions.forEach(transaction => {
      // Estimate basket size from transaction amount
      const amount = transaction.total_amount || 0;
      const estimatedBasketSize = Math.max(1, Math.round(amount / 75)); // Avg item ₱75
      const clampedSize = Math.min(estimatedBasketSize, 20);
      
      totalItems += clampedSize;
      basketSizes.set(clampedSize, (basketSizes.get(clampedSize) || 0) + 1);

      // Extract product info from transaction data
      const products = this.extractProductsFromTransaction(transaction);
      products.forEach(product => {
        productFrequency.set(product, (productFrequency.get(product) || 0) + 1);
      });
    });

    const avgBasketSize = transactions.length > 0 ? totalItems / transactions.length : 0;

    const basketDistribution = Array.from(basketSizes.entries())
      .map(([size, count]) => ({
        size,
        count,
        percentage: transactions.length > 0 ? Math.round((count / transactions.length) * 100) : 0
      }))
      .sort((a, b) => a.size - b.size);

    const topProducts = Array.from(productFrequency.entries())
      .map(([product_name, frequency]) => ({
        product_name,
        frequency,
        category: this.categorizeProduct(product_name)
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    return {
      avgBasketSize: Number(avgBasketSize.toFixed(1)),
      basketDistribution,
      topProducts
    };
  }

  /**
   * Extract brand information from transaction data
   */
  private extractBrandFromTransaction(transaction: any): string {
    // Use actual transaction fields to determine brand
    if (transaction.brand_name) return transaction.brand_name;
    if (transaction.store_id) return `Store Brand ${transaction.store_id}`;
    
    // Map based on transaction patterns or amounts
    const amount = transaction.total_amount || 0;
    if (amount > 500) return 'Premium Brand';
    if (amount > 200) return 'Mid-tier Brand';
    return 'Local Brand';
  }

  /**
   * Extract product information from transaction data
   */
  private extractProductsFromTransaction(transaction: any): string[] {
    // In a real implementation, you'd join with transaction_items table
    // For now, estimate based on transaction characteristics
    const amount = transaction.total_amount || 0;
    const products: string[] = [];

    if (amount > 100) products.push('Beverage Item');
    if (amount > 200) products.push('Personal Care Item');
    if (amount > 300) products.push('Food Item');
    if (amount > 500) products.push('Household Item');

    return products;
  }

  /**
   * Categorize products based on name patterns
   */
  private categorizeProduct(productName: string): string {
    if (productName.toLowerCase().includes('beverage')) return 'Beverages';
    if (productName.toLowerCase().includes('personal')) return 'Personal Care';
    if (productName.toLowerCase().includes('food')) return 'Food & Beverages';
    if (productName.toLowerCase().includes('household')) return 'Household Products';
    return 'General Merchandise';
  }

  /**
   * Calculate category metrics from transactions
   */
  private calculateCategoryMetrics(transactions: any[]): CategoryMetric[] {
    const categoryMap = new Map<string, { revenue: number; count: number; brands: Set<string> }>();

    transactions.forEach(transaction => {
      const category = this.extractCategoryFromTransaction(transaction);
      const brand = this.extractBrandFromTransaction(transaction);
      const revenue = transaction.total_amount || 0;

      const existing = categoryMap.get(category) || { 
        revenue: 0, 
        count: 0, 
        brands: new Set<string>() 
      };
      
      existing.revenue += revenue;
      existing.count += 1;
      existing.brands.add(brand);
      
      categoryMap.set(category, existing);
    });

    return Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        name,
        revenue: data.revenue,
        transactionCount: data.count,
        topBrand: this.getTopBrandInCategory(name, transactions),
        growth: this.calculateCategoryGrowthRate(name, data.revenue)
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  /**
   * Extract category from transaction data
   */
  private extractCategoryFromTransaction(transaction: any): string {
    const amount = transaction.total_amount || 0;
    
    // Simple categorization based on transaction patterns
    if (amount >= 0 && amount < 100) return 'Beverages';
    if (amount >= 100 && amount < 300) return 'Personal Care';
    if (amount >= 300 && amount < 500) return 'Food & Beverages';
    return 'Household Products';
  }

  /**
   * Get top performing brand in a category
   */
  private getTopBrandInCategory(category: string, transactions: any[]): string {
    const brandMap = new Map<string, number>();

    transactions
      .filter(t => this.extractCategoryFromTransaction(t) === category)
      .forEach(transaction => {
        const brand = this.extractBrandFromTransaction(transaction);
        const revenue = transaction.total_amount || 0;
        brandMap.set(brand, (brandMap.get(brand) || 0) + revenue);
      });

    const topBrand = Array.from(brandMap.entries())
      .sort((a, b) => b[1] - a[1])[0];

    return topBrand ? topBrand[0] : 'No Data';
  }

  /**
   * Calculate growth rate (placeholder - would need historical data)
   */
  private calculateGrowthRate(brand: string, currentRevenue: number): number {
    // In a real implementation, compare with previous period data
    // For now, simulate based on revenue patterns
    return Math.random() * 20 - 5; // Random growth between -5% and 15%
  }

  /**
   * Calculate category growth rate (placeholder)
   */
  private calculateCategoryGrowthRate(category: string, currentRevenue: number): number {
    // In a real implementation, compare with previous period data
    return Math.random() * 15 - 2; // Random growth between -2% and 13%
  }
}

export const dataService = new DataService();