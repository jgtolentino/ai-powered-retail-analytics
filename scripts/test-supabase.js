// Test Supabase Connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lcoxtanyckjzyxxcsjzz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3h0YW55Y2tqenl4eGNzanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDUzMjcsImV4cCI6MjA2MzkyMTMyN30.W2JgvZdXubvWpKCNZ7TfjLiKANZO1Hlb164fBEKH2dA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabase() {
  console.log('🧪 Testing Supabase connection...')
  console.log('📍 Project URL:', supabaseUrl)
  
  try {
    // Check what tables exist
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables', {})
      .single()
    
    if (tablesError && tablesError.message.includes('function')) {
      // Try alternative method to check tables
      console.log('\n📊 Checking for retail analytics tables...')
      
      const retailTables = [
        'brands', 'stores', 'products', 'customers', 
        'transactions', 'transaction_items', 'sales'
      ]
      
      let foundTables = []
      let missingTables = []
      
      for (const table of retailTables) {
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(1)
          .single()
        
        if (!error || error.code === 'PGRST116') {
          foundTables.push(table)
        } else {
          missingTables.push(table)
        }
      }
      
      console.log('\n✅ Supabase connection successful!')
      
      if (foundTables.length > 0) {
        console.log('📋 Found tables:', foundTables.join(', '))
      }
      
      if (missingTables.length > 0) {
        console.log('⚠️  Missing tables:', missingTables.join(', '))
        console.log('\n💡 Run the database setup SQL to create these tables')
      }
      
      // Check for any data
      if (foundTables.includes('transactions')) {
        const { count } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })
        
        console.log(`\n📊 Transactions table has ${count || 0} records`)
      }
      
    } else if (tablesError) {
      throw tablesError
    }
    
    console.log('\n🎉 Supabase is ready for data!')
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message)
    console.error('Please check your Supabase credentials')
    process.exit(1)
  }
}

testSupabase()