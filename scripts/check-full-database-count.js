// Check Full Database Record Counts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lcoxtanyckjzyxxcsjzz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3h0YW55Y2tqenl4eGNzanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDUzMjcsImV4cCI6MjA2MzkyMTMyN30.W2JgvZdXubvWpKCNZ7TfjLiKANZO1Hlb164fBEKH2dA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkFullCounts() {
  console.log('🔍 Checking FULL database record counts...\n')
  
  try {
    // Count all transactions
    console.log('📊 TRANSACTION COUNTS:')
    const { count: transactionCount, error: transError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })

    if (transError) {
      console.error('❌ Error counting transactions:', transError.message)
    } else {
      console.log(`✅ Total Transactions: ${transactionCount?.toLocaleString()}`)
      
      if (transactionCount >= 18000) {
        console.log('🎯 ✅ Database meets 18K+ requirement!')
      } else {
        console.log(`⚠️  Database has ${transactionCount} transactions (expecting 18K+)`)
      }
    }

    // Count transaction items
    const { count: itemCount, error: itemError } = await supabase
      .from('transaction_items')
      .select('*', { count: 'exact', head: true })

    if (itemError) {
      console.error('❌ Error counting transaction items:', itemError.message)
    } else {
      console.log(`✅ Total Transaction Items: ${itemCount?.toLocaleString()}`)
    }

    // Count products
    const { count: productCount, error: prodError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (prodError) {
      console.error('❌ Error counting products:', prodError.message)
    } else {
      console.log(`✅ Total Products: ${productCount?.toLocaleString()}`)
    }

    // Count brands
    const { count: brandCount, error: brandError } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true })

    if (brandError) {
      console.error('❌ Error counting brands:', brandError.message)
    } else {
      console.log(`✅ Total Brands: ${brandCount?.toLocaleString()}`)
    }

    // Check latest transactions
    console.log('\n📅 LATEST TRANSACTIONS:')
    const { data: latest, error: latestError } = await supabase
      .from('transactions')
      .select('id, created_at, total_amount, store_location, device_id')
      .order('created_at', { ascending: false })
      .limit(3)

    if (latestError) {
      console.error('❌ Error fetching latest:', latestError.message)
    } else {
      latest?.forEach((t, i) => {
        console.log(`${i + 1}. ID: ${t.id} | Amount: ₱${t.total_amount} | Store: ${t.store_location} | Date: ${new Date(t.created_at).toLocaleDateString()}`)
      })
    }

    // Calculate total revenue
    console.log('\n💰 REVENUE ANALYSIS:')
    const { data: allTransactions, error: revenueError } = await supabase
      .from('transactions')
      .select('total_amount')

    if (revenueError) {
      console.error('❌ Error calculating revenue:', revenueError.message)
    } else {
      const totalRevenue = allTransactions?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0
      const avgTransaction = allTransactions?.length > 0 ? totalRevenue / allTransactions.length : 0
      
      console.log(`✅ Total Revenue: ₱${totalRevenue.toLocaleString('en-PH')}`)
      console.log(`✅ Average Transaction: ₱${avgTransaction.toFixed(2)}`)
    }

  } catch (error) {
    console.error('❌ Failed to check counts:', error.message)
  }
}

checkFullCounts()