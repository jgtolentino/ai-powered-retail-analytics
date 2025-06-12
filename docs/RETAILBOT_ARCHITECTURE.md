# 🏪 RetailBot Sari-Sari Architecture

## 📋 Page Map & Navigation Structure

### 1. `/overview` (Default Dashboard)
**Purpose**: Daily pulse snapshot
**Panels**:
- 1-A: KPI Cards (4) - Revenue, Transactions, Avg Basket, Active Customers
- 1-B: Daily Trends Heatmap - Hour-by-hour transaction intensity
- 1-C: Basket Summary - Size distribution & top items
- 1-D: Brand Performance - TBWA vs competitors
- 1-E: Consumer Profile Pie - Age/gender breakdown

**Cross-links**: Widget drill-downs to sales-explorer, basket-analysis, brand pages

### 2. `/sales-explorer` 
**Purpose**: Transaction drill-down & filtering
**Panels**:
- 2-A: Global Filter Bar - Date, store, search (persistent context)
- 2-B: Timeseries Chart - Revenue & transaction trends
- 2-C: Hour Heatmap - Peak hour analysis
- 2-D: Dynamic Transaction Table - Infinite scroll with details

**Cross-links**: Row click → `/sales-explorer/[txn_id]` for individual transaction

### 3. `/basket-analysis`
**Purpose**: Basket patterns & substitution analysis
**Panels**:
- 3-A: Basket Size Distribution - Histogram of items per transaction
- 3-B: Sankey Substitution Flow - Original → substitute product flows
- 3-C: Top Combos Table - Frequently bought together

**Cross-links**: Brand nodes → `/brand/[id]` for brand deep-dive

### 4. `/brand/[id]`
**Purpose**: Individual brand performance analysis
**Panels**:
- 4-A: KPI Strip - Market share, growth rate, customer penetration
- 4-B: Price Elasticity Chart - Demand vs price sensitivity
- 4-C: Geographic Heatmap - Regional performance
- 4-D: Age-Gender Bars - Demographic breakdown
- 4-E: Recent News Headlines - Brand-related news feed

**Cross-links**: SKU rows → `/product/[id]` for product details

### 5. `/consumer-insights`
**Purpose**: Demographics & behavior patterns
**Panels**:
- 5-A: Age Pyramid - Population distribution visualization
- 5-B: Request Behavior Matrix - Verbal vs pointing vs indirect requests
- 5-C: Loyalty Funnel - Customer retention stages
- 5-D: Visit Frequency ECDF - Purchase behavior distribution

**Cross-links**: Region chips → filtered overview dashboard

### 6. `/device-health`
**Purpose**: Edge device monitoring & status
**Panels**:
- 6-A: Device Status Grid - Online/offline status matrix
- 6-B: CPU/Temperature Sparklines - Real-time health metrics
- 6-C: Log Viewer - Recent device logs with filtering
- 6-D: Device Map - Geographic distribution of edge devices

**Cross-links**: Device click → Supabase row modal with full details

### 7. `/admin/logs`
**Purpose**: Operations & audit trail (admin only)
**Panels**:
- 7-A: API Latency Chart - Performance monitoring
- 7-B: Error Table - System errors with stack traces
- 7-C: RLS Policy Editor - Security policy viewer (readonly)

**Cross-links**: Admin-only section, no external navigation

## 🧭 Navigation Shell Components

### Global Filter Toolbar (Top, Sticky)
```tsx
<GlobalFilterBar>
  <DateRangePicker />      // URL: ?start=2025-06-01&end=2025-06-15
  <StoreSelector />        // URL: ?store_id=12
  <SearchInput />          // URL: ?q=coca-cola
  <AdvancedFilters />      // Modal with age, gender, payment method
</GlobalFilterBar>
```

### Left Rail Navigation
```tsx
<SideNavigation>
  <NavItem href="/overview" icon={BarChart3} />
  <NavItem href="/sales-explorer" icon={TrendingUp} />
  <NavItem href="/basket-analysis" icon={Package} />
  <NavItem href="/consumer-insights" icon={Users} />
  <NavItem href="/device-health" icon={Monitor} />
  <NavItem href="/admin/logs" icon={Settings} />
</SideNavigation>
```

### Breadcrumb System
```tsx
<Breadcrumb>
  Overview → Sales Explorer → Transaction #12345
  Overview → Brand Performance → Coca-Cola → Classic 355ml
</Breadcrumb>
```

## 🔄 Cross-Page Data Flow

### Filter Context (React Context + URL Sync)
```tsx
const FilterContext = {
  dateRange: { start: '2025-06-01', end: '2025-06-15' },
  storeId: '12',
  searchQuery: 'coca-cola',
  ageGroup: '25-34',
  gender: 'all',
  paymentMethod: 'all'
}
```

### Navigation Patterns
1. **Widget Drill-Down**: Click chart → filtered detail page
2. **Entity Navigation**: Brand/Product → dedicated entity page  
3. **Filter Inheritance**: All pages respect global filter context
4. **Bookmarkable State**: URL contains complete filter state

## 📊 Component Architecture

### Core Widget Components (23 total)
```
src/components/retail/
├── overview/
│   ├── KPICards.tsx
│   ├── DailyTrendsHeatmap.tsx
│   ├── BasketSummary.tsx
│   ├── BrandPerformance.tsx
│   └── ConsumerProfilePie.tsx
├── sales/
│   ├── TimeseriesChart.tsx
│   ├── HourHeatmap.tsx
│   └── TransactionTable.tsx
├── basket/
│   ├── BasketSizeDistribution.tsx
│   ├── SubstitutionSankey.tsx
│   └── TopCombosTable.tsx
├── brand/
│   ├── BrandKPIStrip.tsx
│   ├── PriceElasticityChart.tsx
│   ├── GeographicHeatmap.tsx
│   ├── DemographicBars.tsx
│   └── NewsHeadlines.tsx
├── consumer/
│   ├── AgePyramid.tsx
│   ├── RequestBehaviorMatrix.tsx
│   ├── LoyaltyFunnel.tsx
│   └── VisitFrequencyECDF.tsx
├── device/
│   ├── DeviceStatusGrid.tsx
│   ├── HealthSparklines.tsx
│   ├── LogViewer.tsx
│   └── DeviceMap.tsx
└── admin/
    ├── APILatencyChart.tsx
    ├── ErrorTable.tsx
    └── RLSPolicyEditor.tsx
```

### Shared Components
```
src/components/shared/
├── GlobalFilterBar.tsx     // Top sticky filter toolbar
├── SideNavigation.tsx      // Left rail menu
├── Breadcrumb.tsx          // Navigation path
├── LoadingSpinner.tsx      // Loading states
├── ErrorBoundary.tsx       // Error handling
└── Modal.tsx               // Drill-down modals
```

## 🎯 Key Features

### 1. **Universal Filtering**
- Global filter state persisted in URL
- All widgets automatically re-query on filter change
- Bookmarkable filtered views

### 2. **Hierarchical Drill-Down**
- Category → Brand → SKU navigation
- Breadcrumb trail preservation
- Context-aware back navigation

### 3. **Real-Time Updates**
- WebSocket connection for device health
- Auto-refresh for transaction data
- Push notifications for system alerts

### 4. **Performance Optimization**
- Virtualized tables for large datasets
- Chart data pagination
- Intelligent caching with React Query

## 🚀 Implementation Priority

### Phase 1: Core Dashboard (Week 1)
- `/overview` page with 5 core widgets
- Global filter context
- Basic navigation shell

### Phase 2: Transaction Analysis (Week 2)
- `/sales-explorer` with drill-down
- `/basket-analysis` with substitution flows
- URL-based filtering

### Phase 3: Entity Pages (Week 3)
- `/brand/[id]` dynamic pages
- `/consumer-insights` demographics
- Cross-page navigation

### Phase 4: Operations (Week 4)
- `/device-health` monitoring
- `/admin/logs` audit trail
- Real-time updates

## 📝 Technical Notes

### Database RPC Functions Required
```sql
-- Overview page
get_daily_kpis(start_date, end_date, store_id)
get_hourly_trends(start_date, end_date, store_id)
get_basket_summary(start_date, end_date, store_id)
get_brand_performance(start_date, end_date, store_id)
get_consumer_profile(start_date, end_date, store_id)

-- Sales explorer
get_transaction_timeseries(start_date, end_date, store_id)
get_transaction_list(offset, limit, filters)

-- Basket analysis
get_basket_size_distribution(start_date, end_date, store_id)
get_substitution_flows(start_date, end_date, store_id)
get_product_combinations(start_date, end_date, store_id)

-- Brand pages
get_brand_details(brand_id, start_date, end_date)
get_brand_geography(brand_id, start_date, end_date)
get_brand_demographics(brand_id, start_date, end_date)

-- Consumer insights
get_age_pyramid(start_date, end_date, store_id)
get_request_behavior_matrix(start_date, end_date, store_id)
get_loyalty_funnel(start_date, end_date, store_id)

-- Device health
get_device_status_grid()
get_device_health_metrics(device_id, hours)
get_device_logs(device_id, offset, limit)
```

This architecture provides a complete retail analytics platform with intuitive navigation, powerful filtering, and comprehensive drill-down capabilities. 🏪📊