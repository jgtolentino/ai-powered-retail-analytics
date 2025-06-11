import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lcoxtanyckjzyxxcsjzz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3h0YW55Y2tqenl4eGNzanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDUzMjcsImV4cCI6MjA2MzkyMTMyN30.W2JgvZdXubvWpKCNZ7TfjLiKANZO1Hlb164fBEKH2dA';

// Create the original client
const originalClient = createClient(supabaseUrl, supabaseKey);

// Import configurable limits
import { SUPABASE_LIMITS } from '../../config/supabase-limits';

// Create a wrapper function that auto-applies limits
function createEnhancedFrom(tableName: string) {
  const originalQuery = originalClient.from(tableName);
  
  // Store the original select method
  const originalSelect = originalQuery.select;
  
  // Override select to auto-apply limits
  originalQuery.select = function(columns?: string, options?: any) {
    const result = originalSelect.call(this, columns, options);
    
    // Get appropriate limit for this table
    const limit = SUPABASE_LIMITS[tableName as keyof typeof SUPABASE_LIMITS] || SUPABASE_LIMITS.default;
    
    // DEBUG: Log the limit being applied
    console.log(`🔧 Enhanced Client: Applying limit ${limit} to table '${tableName}'`);
    
    // Auto-apply limit
    return result.limit(limit);
  };
  
  return originalQuery;
}

// Enhanced client object
export const supabase = {
  // Enhanced from method with auto-limits
  from: createEnhancedFrom,
  
  // Pass through all other methods
  rpc: originalClient.rpc.bind(originalClient),
  auth: originalClient.auth,
  storage: originalClient.storage,
  realtime: originalClient.realtime,
  
  // Utilities for special cases
  fromUnlimited: (tableName: string) => originalClient.from(tableName),
  fromWithLimit: (tableName: string, limit: number) => {
    const query = originalClient.from(tableName);
    const originalSelect = query.select;
    query.select = function(columns?: string, options?: any) {
      return originalSelect.call(this, columns, options).limit(limit);
    };
    return query;
  }
};

// Export original client if needed
export const supabaseOriginal = originalClient;