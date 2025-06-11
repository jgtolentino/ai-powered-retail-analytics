// Check Database Schema
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lcoxtanyckjzyxxcsjzz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3h0YW55Y2tqenl4eGNzanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDUzMjcsImV4cCI6MjA2MzkyMTMyN30.W2JgvZdXubvWpKCNZ7TfjLiKANZO1Hlb164fBEKH2dA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
  console.log('🔍 Checking database schema...\n')
  
  try {
    // Check transactions table structure
    console.log('📊 TRANSACTIONS TABLE:')
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('*')
      .limit(3)

    if (transError) {
      console.error('❌ Error:', transError.message)
    } else if (transactions && transactions.length > 0) {
      console.log('✅ Found transactions table')
      console.log('🔤 Available columns:', Object.keys(transactions[0]).join(', '))
      console.log('📄 Sample record:', transactions[0])
    }

    console.log('\n📊 CUSTOMERS TABLE:')
    const { data: customers, error: custError } = await supabase
      .from('customers')
      .select('*')
      .limit(3)

    if (custError) {
      console.error('❌ Error:', custError.message)
    } else if (customers && customers.length > 0) {
      console.log('✅ Found customers table')
      console.log('🔤 Available columns:', Object.keys(customers[0]).join(', '))
      console.log('📄 Sample record:', customers[0])
    }

    console.log('\n📊 PRODUCTS TABLE:')
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .limit(3)

    if (prodError) {
      console.error('❌ Error:', prodError.message)
    } else if (products && products.length > 0) {
      console.log('✅ Found products table')
      console.log('🔤 Available columns:', Object.keys(products[0]).join(', '))
      console.log('📄 Sample record:', products[0])
    }

    console.log('\n📊 BRANDS TABLE:')
    const { data: brands, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .limit(3)

    if (brandError) {
      console.error('❌ Error:', brandError.message)
    } else if (brands && brands.length > 0) {
      console.log('✅ Found brands table')
      console.log('🔤 Available columns:', Object.keys(brands[0]).join(', '))
      console.log('📄 Sample record:', brands[0])
    }

    console.log('\n📊 TRANSACTION_ITEMS TABLE:')
    const { data: transactionItems, error: itemsError } = await supabase
      .from('transaction_items')
      .select('*')
      .limit(3)

    if (itemsError) {
      console.error('❌ Error:', itemsError.message)
    } else if (transactionItems && transactionItems.length > 0) {
      console.log('✅ Found transaction_items table')
      console.log('🔤 Available columns:', Object.keys(transactionItems[0]).join(', '))
      console.log('📄 Sample record:', transactionItems[0])
    }

  } catch (error) {
    console.error('❌ Failed to check schema:', error.message)
  }
}

checkSchema()