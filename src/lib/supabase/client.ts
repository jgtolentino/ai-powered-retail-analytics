import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lcoxtanyckjzyxxcsjzz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3h0YW55Y2tqenl4eGNzanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDUzMjcsImV4cCI6MjA2MzkyMTMyN30.W2JgvZdXubvWpKCNZ7TfjLiKANZO1Hlb164fBEKH2dA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection function
export async function testSupabaseConnection() {
  try {
    console.log('🧪 Testing Supabase connection...')
    console.log('📍 URL:', supabaseUrl)
    
    // Test basic connection
    const { error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1)
    
    if (error && error.message.includes('relation "_test_connection" does not exist')) {
      // This is expected - it means we connected but table doesn't exist
      console.log('✅ Supabase connection successful!')
      console.log('📊 Ready to create tables and load data')
      return true
    } else if (error) {
      throw error
    }
    
    console.log('✅ Supabase connection successful!')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    throw error
  }
}

// Helper function to check if tables exist
export async function checkTables() {
  const tables = ['brands', 'stores', 'products', 'customers', 'transactions', 'transaction_items']
  const results: Record<string, boolean> = {}
  
  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .select('*')
      .limit(1)
    
    results[table] = !error
  }
  
  return results
}