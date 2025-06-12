import { supabase } from '../lib/supabaseClient';

interface PerformanceTestResult {
  name: string;
  time: number;
  count?: number;
  memory?: number;
  improvement?: string;
  status: 'success' | 'error';
  error?: string;
}

export const runPerformanceTests = async (): Promise<PerformanceTestResult[]> => {
  console.log('🧪 Starting Enhanced Scout Dashboard Performance Tests...');
  
  const results: PerformanceTestResult[] = [];

  // Helper function to measure memory usage
  const measureMemory = () => {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  };

  // Test 1: Client-side filtering (Original Method)
  console.log('📊 Test 1: Client-side filtering (Original)');
  try {
    const memoryBefore = measureMemory();
    const start = performance.now();
    
    // Simulate original client-side filtering approach
    const { data: allTransactions } = await supabase
      .from('transactions')
      .select(`
        *,
        transaction_items (
          *,
          products (
            *,
            brands (*)
          )
        )
      `)
      .limit(18000);
    
    // Client-side filtering simulation
    const filtered = allTransactions?.filter(t => {
      const age = t.customer_age;
      const region = t.store_location;
      return age > 25 && region?.includes('NCR');
    }) || [];
    
    // Client-side aggregation simulation
    const hourlyData = filtered.reduce((acc: any, transaction: any) => {
      const hour = new Date(transaction.created_at).getHours();
      if (!acc[hour]) {
        acc[hour] = { transactions: 0, revenue: 0 };
      }
      acc[hour].transactions += 1;
      acc[hour].revenue += transaction.total_amount || 0;
      return acc;
    }, {});
    
    const end = performance.now();
    const memoryAfter = measureMemory();
    
    results.push({
      name: 'Client-side filtering (Original)',
      time: end - start,
      count: filtered.length,
      memory: memoryAfter - memoryBefore,
      status: 'success'
    });
    
    console.log(`✅ Original method: ${(end - start).toFixed(2)}ms, ${filtered.length} records`);
  } catch (error) {
    console.error('❌ Original method failed:', error);
    results.push({
      name: 'Client-side filtering (Original)',
      time: 0,
      status: 'error',
      error: error.message
    });
  }

  // Test 2: Database function (Enhanced Method)
  console.log('📊 Test 2: Database function (Enhanced)');
  try {
    const memoryBefore = measureMemory();
    const start = performance.now();
    
    const { data } = await supabase.rpc('get_scout_dashboard_data', {
      p_region_filter: 'NCR',
      p_age_filter: '26-35'
    });
    
    const end = performance.now();
    const memoryAfter = measureMemory();
    
    results.push({
      name: 'Database function (Enhanced)',
      time: end - start,
      count: data?.summary_stats?.total_transactions,
      memory: memoryAfter - memoryBefore,
      status: 'success'
    });
    
    console.log(`✅ Enhanced method: ${(end - start).toFixed(2)}ms, ${data?.summary_stats?.total_transactions || 0} records`);
  } catch (error) {
    console.error('❌ Enhanced method failed:', error);
    results.push({
      name: 'Database function (Enhanced)',
      time: 0,
      status: 'error',
      error: error.message
    });
  }

  // Test 3: Quick stats function
  console.log('📊 Test 3: Quick stats function');
  try {
    const start = performance.now();
    const { data } = await supabase.rpc('get_quick_stats');
    const end = performance.now();
    
    results.push({
      name: 'Quick stats function',
      time: end - start,
      count: data?.total_transactions,
      status: 'success'
    });
    
    console.log(`✅ Quick stats: ${(end - start).toFixed(2)}ms`);
  } catch (error) {
    console.error('❌ Quick stats failed:', error);
    results.push({
      name: 'Quick stats function',
      time: 0,
      status: 'error',
      error: error.message
    });
  }

  // Test 4: Filter options function
  console.log('📊 Test 4: Filter options function');
  try {
    const start = performance.now();
    const { data } = await supabase.rpc('get_filter_options');
    const end = performance.now();
    
    results.push({
      name: 'Filter options function',
      time: end - start,
      status: 'success'
    });
    
    console.log(`✅ Filter options: ${(end - start).toFixed(2)}ms`);
  } catch (error) {
    console.error('❌ Filter options failed:', error);
    results.push({
      name: 'Filter options function',
      time: 0,
      status: 'error',
      error: error.message
    });
  }

  // Test 5: Multiple concurrent requests
  console.log('📊 Test 5: Concurrent dashboard requests');
  try {
    const start = performance.now();
    
    const promises = [
      supabase.rpc('get_scout_dashboard_data', { p_date_filter: 'today' }),
      supabase.rpc('get_scout_dashboard_data', { p_date_filter: '7d' }),
      supabase.rpc('get_scout_dashboard_data', { p_region_filter: 'NCR' }),
      supabase.rpc('get_quick_stats')
    ];
    
    await Promise.all(promises);
    const end = performance.now();
    
    results.push({
      name: 'Concurrent requests (4x)',
      time: end - start,
      status: 'success'
    });
    
    console.log(`✅ Concurrent requests: ${(end - start).toFixed(2)}ms`);
  } catch (error) {
    console.error('❌ Concurrent requests failed:', error);
    results.push({
      name: 'Concurrent requests (4x)',
      time: 0,
      status: 'error',
      error: error.message
    });
  }

  // Calculate improvements
  const originalTime = results.find(r => r.name.includes('Original'))?.time || 0;
  const enhancedTime = results.find(r => r.name.includes('Enhanced'))?.time || 0;
  
  if (originalTime > 0 && enhancedTime > 0) {
    const improvement = (originalTime / enhancedTime).toFixed(1);
    const enhancedResult = results.find(r => r.name.includes('Enhanced'));
    if (enhancedResult) {
      enhancedResult.improvement = `${improvement}x faster`;
    }
  }

  // Display results
  console.log('\n📈 Performance Test Results:');
  console.table(results.map(r => ({
    Test: r.name,
    'Time (ms)': r.time.toFixed(2),
    Records: r.count || '-',
    'Memory (bytes)': r.memory || '-',
    Improvement: r.improvement || '-',
    Status: r.status
  })));

  // Performance analysis
  const successfulTests = results.filter(r => r.status === 'success');
  const avgTime = successfulTests.reduce((sum, r) => sum + r.time, 0) / successfulTests.length;
  
  console.log('\n🎯 Performance Analysis:');
  console.log(`• Average response time: ${avgTime.toFixed(2)}ms`);
  console.log(`• Successful tests: ${successfulTests.length}/${results.length}`);
  
  if (originalTime > 0 && enhancedTime > 0) {
    const timeSaved = originalTime - enhancedTime;
    const percentImprovement = ((timeSaved / originalTime) * 100).toFixed(1);
    console.log(`• Performance improvement: ${percentImprovement}% faster`);
    console.log(`• Time saved per query: ${timeSaved.toFixed(2)}ms`);
  }

  return results;
};

export const runLoadTest = async (concurrency: number = 10, iterations: number = 5): Promise<any> => {
  console.log(`🚀 Running load test: ${concurrency} concurrent users, ${iterations} iterations`);
  
  const testResults = [];
  
  for (let i = 0; i < iterations; i++) {
    console.log(`Iteration ${i + 1}/${iterations}`);
    
    const promises = Array(concurrency).fill(null).map(async (_, index) => {
      const start = performance.now();
      
      try {
        const { data } = await supabase.rpc('get_scout_dashboard_data', {
          p_date_filter: i % 2 === 0 ? 'today' : '7d',
          p_region_filter: index % 3 === 0 ? 'NCR' : null
        });
        
        const end = performance.now();
        return {
          user: index,
          time: end - start,
          success: true,
          records: data?.summary_stats?.total_transactions || 0
        };
      } catch (error) {
        const end = performance.now();
        return {
          user: index,
          time: end - start,
          success: false,
          error: error.message
        };
      }
    });
    
    const iterationResults = await Promise.all(promises);
    testResults.push({
      iteration: i + 1,
      results: iterationResults,
      avgTime: iterationResults.reduce((sum, r) => sum + r.time, 0) / iterationResults.length,
      successRate: (iterationResults.filter(r => r.success).length / iterationResults.length) * 100
    });
  }
  
  // Analyze load test results
  const allResults = testResults.flatMap(t => t.results);
  const successfulResults = allResults.filter(r => r.success);
  
  console.log('\n📊 Load Test Results:');
  console.log(`• Total requests: ${allResults.length}`);
  console.log(`• Successful requests: ${successfulResults.length} (${((successfulResults.length / allResults.length) * 100).toFixed(1)}%)`);
  console.log(`• Average response time: ${(successfulResults.reduce((sum, r) => sum + r.time, 0) / successfulResults.length).toFixed(2)}ms`);
  console.log(`• Min response time: ${Math.min(...successfulResults.map(r => r.time)).toFixed(2)}ms`);
  console.log(`• Max response time: ${Math.max(...successfulResults.map(r => r.time)).toFixed(2)}ms`);
  
  return {
    testResults,
    summary: {
      totalRequests: allResults.length,
      successfulRequests: successfulResults.length,
      successRate: (successfulResults.length / allResults.length) * 100,
      avgResponseTime: successfulResults.reduce((sum, r) => sum + r.time, 0) / successfulResults.length,
      minResponseTime: Math.min(...successfulResults.map(r => r.time)),
      maxResponseTime: Math.max(...successfulResults.map(r => r.time))
    }
  };
};

export const benchmarkQueries = async (): Promise<any> => {
  console.log('⚡ Benchmarking database queries...');
  
  const queries = [
    {
      name: 'All data (no filters)',
      params: {}
    },
    {
      name: 'Date filter only',
      params: { p_date_filter: '7d' }
    },
    {
      name: 'Region filter only',
      params: { p_region_filter: 'NCR' }
    },
    {
      name: 'Multiple filters',
      params: {
        p_date_filter: '30d',
        p_region_filter: 'NCR',
        p_age_filter: '26-35'
      }
    },
    {
      name: 'Complex filters',
      params: {
        p_date_filter: '30d',
        p_region_filter: 'NCR',
        p_age_filter: '26-35',
        p_gender_filter: 'Female',
        p_payment_filter: 'gcash'
      }
    }
  ];
  
  const results = [];
  
  for (const query of queries) {
    console.log(`Testing: ${query.name}`);
    
    const times = [];
    const runs = 3; // Run each query 3 times for average
    
    for (let i = 0; i < runs; i++) {
      const start = performance.now();
      
      try {
        const { data } = await supabase.rpc('get_scout_dashboard_data', query.params);
        const end = performance.now();
        
        times.push(end - start);
      } catch (error) {
        console.error(`Query failed: ${error.message}`);
        times.push(0);
      }
    }
    
    const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    results.push({
      name: query.name,
      avgTime,
      minTime,
      maxTime,
      params: query.params
    });
  }
  
  console.log('\n⚡ Query Benchmark Results:');
  console.table(results.map(r => ({
    Query: r.name,
    'Avg (ms)': r.avgTime.toFixed(2),
    'Min (ms)': r.minTime.toFixed(2),
    'Max (ms)': r.maxTime.toFixed(2)
  })));
  
  return results;
};

// Export utility for easy testing from console
export const testPerformance = {
  run: runPerformanceTests,
  load: runLoadTest,
  benchmark: benchmarkQueries,
  
  // Quick test function for development
  quick: async () => {
    console.log('🏃‍♂️ Quick performance test...');
    const start = performance.now();
    const { data } = await supabase.rpc('get_scout_dashboard_data');
    const end = performance.now();
    console.log(`✅ Dashboard data loaded in ${(end - start).toFixed(2)}ms`);
    return { time: end - start, data };
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testPerformance = testPerformance;
}