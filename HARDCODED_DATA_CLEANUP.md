# 🔧 Hardcoded Data Cleanup & Migration Guide

## 📊 **Overview**
This document outlines the hardcoded mock data found in the codebase and provides a comprehensive migration plan to replace it with real data connections.

## 🔍 **Hardcoded Data Found**

### **1. Brand Performance Data** (CRITICAL)
**Location**: `src/components/BrandPerformancePage.tsx`
```typescript
// ❌ HARDCODED - Replace with real data
const brandData = [
  {
    name: 'TBWA Philippines',
    marketShare: 35.5,
    revenue: 1669688.38,
    growth: 12.3,
    trend: 'up',
    color: '#3B82F6'
  },
  // ... more hardcoded brands
];
```

**✅ SOLUTION**: Use `useRealTimeBrandPerformance()` hook
```typescript
import { useRealTimeBrandPerformance } from '@/hooks/useRealTimeData';

const BrandPerformancePage = () => {
  const { data: brandData, loading, error } = useRealTimeBrandPerformance();
  // brandData now comes from real Supabase transactions
};
```

### **2. Product Names & Categories** (HIGH PRIORITY)
**Location**: `src/components/retail/overview/BasketSummary.tsx`
```typescript
// ❌ HARDCODED - Replace with real data
const topProducts = [
  { product_name: 'Coca-Cola 355ml', frequency: 45, category: 'Beverages' },
  { product_name: 'Lucky Me Pancit Canton', frequency: 38, category: 'Noodles' },
  // ... more hardcoded products
];
```

**✅ SOLUTION**: Use `useRealTimeBasketMetrics()` hook
```typescript
import { useRealTimeBasketMetrics } from '@/hooks/useRealTimeData';

export const BasketSummary = () => {
  const { data, loading, error } = useRealTimeBasketMetrics();
  const topProducts = data?.topProducts || [];
  // Products now extracted from real transaction data
};
```

### **3. Competitive Metrics** (MEDIUM PRIORITY)
**Location**: `src/components/BrandPerformancePage.tsx`
```typescript
// ❌ HARDCODED - Replace with configurable data
const competitiveMetrics = [
  { metric: 'Brand Awareness', tbwa: 87, competitor: 92, industry: 78 },
  // ... more hardcoded metrics
];
```

**✅ SOLUTION**: Use configuration + real calculations
```typescript
import { COMPETITIVE_BENCHMARKS } from '@/config/staticData';
import { useRealTimeBrandPerformance } from '@/hooks/useRealTimeData';

const BrandPerformancePage = () => {
  const { data: brandData } = useRealTimeBrandPerformance();
  
  const competitiveMetrics = [
    {
      metric: 'Brand Awareness',
      tbwa: calculateBrandAwareness(brandData), // Calculate from real data
      competitor: COMPETITIVE_BENCHMARKS.market_leaders['Brand Awareness'],
      industry: COMPETITIVE_BENCHMARKS.industry_averages['Brand Awareness']
    }
  ];
};
```

### **4. Monthly Revenue Data** (MEDIUM PRIORITY)
**Location**: `src/components/BrandPerformancePage.tsx`
```typescript
// ❌ HARDCODED - Replace with time-series data
const monthlyData = [
  { month: 'Jan', tbwa: 420000, competitors: 380000 },
  { month: 'Feb', tbwa: 445000, competitors: 395000 },
  // ... more hardcoded monthly data
];
```

**✅ SOLUTION**: Calculate from transaction timestamps
```typescript
import { useAllTransactions } from '@/hooks/useAllTransactions';

const BrandPerformancePage = () => {
  const { transactions } = useAllTransactions();
  
  const monthlyData = useMemo(() => {
    return calculateMonthlyRevenue(transactions);
  }, [transactions]);
};
```

### **5. Location Data** (LOW PRIORITY - Configuration)
**Location**: Various components
```typescript
// ❌ HARDCODED - Move to configuration
const philippinesLocations = {
  province: [
    { name: 'Metro Manila', lat: 14.5995, lng: 120.9842 },
    // ... more hardcoded locations
  ]
};
```

**✅ SOLUTION**: Use configuration file
```typescript
import { PHILIPPINES_LOCATIONS } from '@/config/staticData';

const locations = PHILIPPINES_LOCATIONS.regions;
```

## 🚀 **Migration Implementation Plan**

### **Phase 1: Critical Data (Week 1)**
1. **Replace Brand Performance Hardcoded Data**
   - Implement `DataService.getBrandPerformance()`
   - Update `BrandPerformancePage.tsx` to use real data
   - Test with actual transaction data

2. **Replace Product/Basket Hardcoded Data**
   - Implement `DataService.getBasketMetrics()`
   - Update `BasketSummary.tsx` to use real calculations
   - Test basket size calculations

### **Phase 2: Dashboard Metrics (Week 2)**
1. **Replace Dashboard KPI Hardcoded Data**
   - Implement `DataService.getDashboardMetrics()`
   - Update all dashboard components
   - Add real-time refresh capabilities

2. **Replace Competitive Metrics**
   - Move benchmarks to configuration
   - Calculate TBWA metrics from real data
   - Implement growth rate calculations

### **Phase 3: Time-Series & Analytics (Week 3)**
1. **Replace Monthly/Time-Series Data**
   - Implement time-based aggregations
   - Add date range filtering
   - Create trend calculations

2. **Add Data Caching & Performance**
   - Implement caching layer
   - Add background refresh
   - Optimize database queries

### **Phase 4: Configuration & Cleanup (Week 4)**
1. **Move Static Data to Configuration**
   - Location data to `staticData.ts`
   - Category definitions
   - Color schemes and UI constants

2. **Final Cleanup & Validation**
   - Remove all hardcoded arrays
   - Add data validation
   - Test error handling

## 📝 **Implementation Examples**

### **Example 1: Replacing Hardcoded Brand Data**

**Before** (Hardcoded):
```typescript
const brandData = [
  { name: 'TBWA Philippines', revenue: 1669688.38, marketShare: 35.5 }
];
```

**After** (Real Data):
```typescript
import { useRealTimeBrandPerformance } from '@/hooks/useRealTimeData';

const { data: brandData, loading, error } = useRealTimeBrandPerformance();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### **Example 2: Replacing Hardcoded Product Lists**

**Before** (Hardcoded):
```typescript
const topProducts = [
  { product_name: 'Coca-Cola 355ml', frequency: 45 }
];
```

**After** (Calculated):
```typescript
import { useRealTimeBasketMetrics } from '@/hooks/useRealTimeData';

const { data } = useRealTimeBasketMetrics();
const topProducts = data?.topProducts || [];
```

### **Example 3: Configuration-Based Static Data**

**Before** (Hardcoded):
```typescript
const colors = ['#3B82F6', '#10B981', '#F59E0B'];
```

**After** (Configured):
```typescript
import { CHART_COLORS } from '@/config/staticData';

const colors = CHART_COLORS.primary;
```

## 🔍 **Testing Strategy**

### **1. Data Validation Tests**
```typescript
// test/dataService.test.ts
describe('DataService', () => {
  it('should calculate brand metrics correctly', async () => {
    const brands = await dataService.getBrandPerformance();
    expect(brands).toBeDefined();
    expect(brands.length).toBeGreaterThan(0);
    expect(brands[0]).toHaveProperty('name');
    expect(brands[0]).toHaveProperty('revenue');
  });
});
```

### **2. Integration Tests**
```typescript
// test/components/BrandPerformance.test.tsx
describe('BrandPerformancePage', () => {
  it('should display real brand data', async () => {
    render(<BrandPerformancePage />);
    await waitFor(() => {
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });
    expect(screen.getByText(/market share/i)).toBeInTheDocument();
  });
});
```

### **3. Performance Tests**
```typescript
// test/performance.test.ts
describe('Data Loading Performance', () => {
  it('should load dashboard metrics under 3 seconds', async () => {
    const start = Date.now();
    await dataService.getDashboardMetrics();
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });
});
```

## 📊 **Impact Assessment**

### **Benefits of Migration**
1. **Real-time Accuracy**: Data reflects actual business performance
2. **Scalability**: System grows with actual data volume
3. **Maintainability**: No need to update hardcoded values
4. **Credibility**: Stakeholders see real insights, not mock data
5. **Performance**: Optimized queries vs static arrays

### **Risks & Mitigation**
1. **Performance Risk**: Large dataset queries
   - **Mitigation**: Implement caching and pagination
2. **Data Quality Risk**: Inconsistent transaction data
   - **Mitigation**: Add data validation and fallbacks
3. **UI Breaking Risk**: Missing data scenarios
   - **Mitigation**: Proper loading states and error handling

## 🎯 **Success Criteria**

### **Phase 1 Success**
- [ ] All brand performance data comes from Supabase
- [ ] Product recommendations based on real transaction patterns
- [ ] No hardcoded brand names in components

### **Phase 2 Success**
- [ ] Dashboard KPIs calculate from real transaction totals
- [ ] Competitive metrics use configurable benchmarks
- [ ] Real-time data refresh every 5 minutes

### **Phase 3 Success**
- [ ] Time-series charts show actual monthly trends
- [ ] Date range filtering works correctly
- [ ] Performance under 2 seconds for all metrics

### **Final Success**
- [ ] Zero hardcoded data arrays in components
- [ ] All static data in configuration files
- [ ] Data validation and error handling complete
- [ ] Performance benchmarks met

## 🔧 **Files Created for Migration**

1. **`src/services/data/DataService.ts`** - Real data service
2. **`src/hooks/useRealTimeData.ts`** - Real-time data hooks
3. **`src/config/staticData.ts`** - Configuration for static data
4. **`HARDCODED_DATA_CLEANUP.md`** - This migration guide

## 📅 **Implementation Timeline**

| Week | Focus | Deliverables |
|------|-------|-------------|
| 1 | Critical Brand & Product Data | Real brand performance, basket metrics |
| 2 | Dashboard & Competitive Data | Real-time KPIs, configurable benchmarks |
| 3 | Time-Series & Analytics | Monthly trends, date filtering |
| 4 | Configuration & Cleanup | Static data config, final testing |

## 🎉 **Next Steps**

1. **Review this migration plan** with the team
2. **Prioritize which hardcoded data to replace first**
3. **Start with Phase 1: Critical Data**
4. **Implement `DataService` methods**
5. **Update components to use real data hooks**
6. **Test thoroughly with actual transaction data**

---

**Ready to eliminate hardcoded data and connect everything to real Supabase data!** 🚀