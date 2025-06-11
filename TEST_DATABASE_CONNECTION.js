// Test your real database functions
// Run: node TEST_DATABASE_CONNECTION.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lcoxtanyckjzyxxcsjzz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3h0YW55Y2tqenl4eGNzanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDUzMjcsImV4cCI6MjA2MzkyMTMyN30.W2JgvZdXubvWpKCNZ7TfjLiKANZO1Hlb164fBEKH2dA'
);

async function testDatabaseFunctions() {
  console.log('🧪 Testing RetailBot Database Functions...\n');

  // Test 1: Daily KPIs
  try {
    console.log('1. Testing get_daily_kpis...');
    const { data: kpis, error: kpiError } = await supabase.rpc('get_daily_kpis');
    if (kpiError) throw kpiError;
    console.log('✅ KPIs:', kpis);
  } catch (error) {
    console.log('❌ KPIs failed:', error.message);
    console.log('💡 This is expected if function doesn\'t exist yet');
  }

  // Test 2: Hourly Trends  
  try {
    console.log('\n2. Testing get_hourly_trends...');
    const { data: trends, error: trendError } = await supabase.rpc('get_hourly_trends');
    if (trendError) throw trendError;
    console.log('✅ Trends:', trends?.slice(0, 3), '... (showing first 3)');
  } catch (error) {
    console.log('❌ Trends failed:', error.message);
  }

  // Test 3: Basket Summary
  try {
    console.log('\n3. Testing get_basket_summary...');
    const { data: basket, error: basketError } = await supabase.rpc('get_basket_summary');
    if (basketError) throw basketError;
    console.log('✅ Basket:', basket);
  } catch (error) {
    console.log('❌ Basket failed:', error.message);
  }

  // Test 4: Brand Performance
  try {
    console.log('\n4. Testing get_brand_performance...');
    const { data: brands, error: brandError } = await supabase.rpc('get_brand_performance');
    if (brandError) throw brandError;
    console.log('✅ Brands:', brands);
  } catch (error) {
    console.log('❌ Brands failed:', error.message);
  }

  // Test 5: Check existing data
  try {
    console.log('\n5. Testing basic table access...');
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .limit(5);
    if (txError) throw txError;
    console.log('✅ Sample transactions:', transactions.length, 'found');
  } catch (error) {
    console.log('❌ Table access failed:', error.message);
  }
}

testDatabaseFunctions();