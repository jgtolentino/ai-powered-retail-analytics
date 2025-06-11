/**
 * PERMANENT FIX FOR SUPABASE 1000 ROW LIMITS
 * 
 * Configure your table limits here once and never worry about them again!
 * 
 * The enhanced Supabase client will automatically apply these limits
 * to all queries without you having to remember to add .limit() manually.
 */

export const SUPABASE_LIMITS = {
  // Core transaction tables - set high for your 18K+ dataset
  transactions: 25000,        // Your main transaction table
  transaction_items: 50000,   // Multiple items per transaction
  
  // Master data tables
  products: 10000,           // Product catalog
  brands: 5000,              // Brand master data
  customers: 20000,          // Customer database
  stores: 1000,              // Store locations
  
  // Default for any unlisted tables
  default: 20000,
  
  // Special cases
  audit_logs: 100000,        // Large audit tables
  events: 75000,             // Event tracking tables
} as const;

// Export individual limits for easy access
export const {
  transactions: TRANSACTION_LIMIT,
  transaction_items: TRANSACTION_ITEMS_LIMIT,
  products: PRODUCTS_LIMIT,
  brands: BRANDS_LIMIT,
  customers: CUSTOMERS_LIMIT,
  stores: STORES_LIMIT,
  default: DEFAULT_LIMIT
} = SUPABASE_LIMITS;

/**
 * How to use:
 * 
 * 1. AUTOMATIC (recommended):
 *    Just use supabase.from('transactions').select() - limit applied automatically!
 * 
 * 2. OVERRIDE if needed:
 *    supabase.fromUnlimited('transactions').select() - no limit
 *    supabase.fromWithLimit('transactions', 1000).select() - custom limit
 * 
 * 3. UPDATE LIMITS:
 *    Just edit the numbers above and all queries update automatically!
 */