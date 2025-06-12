# UAT Plan: AI-Powered Retail Analytics (using Supabase "real" data)

## 1. Objectives

* Validate that each feature on Overview, Sales Explorer, Basket Analysis, Consumer Insights, Device Health, Brand Performance and AI Console loads *actual* Supabase data.
* Confirm UI, filters, charts, tables, and AI recommendations match client requirements.
* Surface any mismatches in metrics, missing data, performance issues, or broken workflows.

## 2. Environment Setup

1. **Staging App URL**
   [https://ai-powered-retail-analytics-jgtolentino-jakes-projects-e9f46c30.vercel.app](https://ai-powered-retail-analytics-jgtolentino-jakes-projects-e9f46c30.vercel.app)
2. **Supabase Staging Instance**

   * `VITE_SUPABASE_URL` → https://lcoxtanyckjzyxxcsjzz.supabase.co
   * `VITE_SUPABASE_ANON_KEY` → configured in `.env.local`
3. **Data Seed**

   * Ensure your staging DB has a full calendar year of transactions, device-health logs, brand surveys, etc.
   * Run:

     ```bash
     psql $SUPA_URL -f db/seeds/full_year_data.sql
     ```
   * Confirm row counts:

     ```sql
     select count(*) from transactions;    -- expect ~18,000
     select count(*) from devices;         -- expect 5 rows
     select count(*) from brand_performance; -- expect 5 rows
     ```

## 3. Test Data Validation

| Table                 | Expected Row Count | Query to Verify                              |
| --------------------- | ------------------ | -------------------------------------------- |
| transactions          | \~18,000           | `select count(*) from transactions;`         |
| basket\_substitutions | \~6,000            | `select count(*) from basket_substitutions;` |
| consumer\_insights    | z (demographic…)   | `select count(*) from consumer_insights;`    |
| device\_health        | 5                  | `select count(*) from device_health;`        |
| brand\_performance    | 5                  | `select count(*) from brand_performance;`    |

All counts must match client-provided dataset.

## 4. Test Scenarios

### 4.1 Overview Page

| Step | Action                                                                      | Expectation                                                                                  |
| ---- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1    | Navigate to `/overview`                                                     | Sidebar + header + filters show "06/12/2024 → 06/12/2025", "All Stores"                      |
| 2    | Click **Last Month** quick-filter                                           | Date inputs update; KPI cards recalc (check SQL: `where date >= now() - interval '1 month'`) |
| 3    | Verify KPI cards: Total Revenue, Transactions, Avg Basket, Active Customers | Values match:                                                                                |

```sql
select sum(total_amount), count(*), avg(items_count), count(distinct customer_id)
from transactions
where date between …;
```

| 4 | Inspect heatmap peak tooltip | Matches `max(count)` by day/hour from `transactions` |

### 4.2 Sales Explorer  
| Step | Action | Expectation |
|---|---|---|
| 1 | `/sales-explorer` loads | Table lists first 100 `transactions` sorted by newest |
| 2 | Search "Store 3" | Table filters down to only that store; chart updates |
| 3 | Sort by "Amount" descending | Table reorders; highest `total_amount` first |
| 4 | Verify Revenue Timeseries chart | Matches `select date, sum(total_amount) … group by date` |

### 4.3 Basket Analysis  
| Step | Action | Expectation |
|---|---|---|
| 1 | `/basket-analysis` loads | Histogram bars reflect `items_count` distribution from `transactions` |
| 2 | Check Top Combos | Top 3 SKUs by co-occurrence from `basket_substitutions` |

### 4.4 Consumer Insights  
| Step | Action | Expectation |
|---|---|---|
| 1 | `/consumer-insights` | Age pyramid bars reflect `age` column distribution |
| 2 | Click "Last Week" | Pyramid recalculates for `date >= now()-7` |

### 4.5 Device Health  
| Step | Action | Expectation |
|---|---|---|
| 1 | `/device-health` | Grid shows 5 devices offline/online flags from `device_health` |
| 2 | Click "Export Logs" | CSV download matching `select * from device_health where status <> 'ok'` |

### 4.6 Brand Performance  
| Step | Action | Expectation |
|---|---|---|
| 1 | `/brand-performance` | KPI cards match `brand_performance` table values |
| 2 | Change date filter to "Last 3 Months" | Charts reload via  
```sql
from brand_performance
where date >= now()- interval '3 months'
``` |

### 4.7 AI Console (AI-Genie)  
| Step | Action | Expectation |
|---|---|---|
| 1 | `/ai-console` loads | Quick Questions populate input and fire correct prompt to `/api/retail-chat` with real `transactions` context |
| 2 | Ask "Show best‐selling SKUs" | Response lists top SKUs from Supabase:  
```sql
select sku, count(*) as freq from transaction_items
group by sku order by freq desc limit 5
``` |

## 5. Acceptance Criteria  
- **100% data parity**: UI numbers match direct SQL from Supabase.  
- **No "No data" states** for populated date ranges.  
- **Filters and quick-filters** correctly drive the SQL queries.  
- **Export/download** features produce CSVs from live queries.  
- **AI recommendations** reflect live database snapshots.  
- **Page layout** consistency persists.

## 6. Reporting & Sign-Off  
- Record each step as **Pass** or **Fail** in your test-report spreadsheet.  
- Attach screenshots of SQL query vs. UI output.  
- Log any discrepancies as GitHub issues with label `UAT–bug`.  
- Obtain client sign-off once all reports are **Pass**.

## 7. Current Implementation Status

### ✅ Completed Components
- **Sales Explorer**: Full Supabase integration with real transaction data
- **Layout System**: Consistent sidebar navigation across all pages
- **Supabase Client**: Centralized client configuration at `src/lib/supabaseClient.ts`
- **Build System**: TypeScript + Vite production-ready build

### 🔄 Ready for Testing
- **Overview Page**: Uses `useAllTransactions` hook for real data
- **Brand Performance**: Real-time brand metrics from Supabase
- **AI Console**: Live data context for AI recommendations

### 📋 Test Execution Instructions

1. **Setup Environment**:
   ```bash
   cd /Users/tbwa/Documents/GitHub/ai-powered-retail-analytics
   npm install
   npm run build
   npm run preview
   ```

2. **Verify Supabase Connection**:
   ```bash
   # Check environment variables
   grep VITE_SUPABASE .env.local
   
   # Test connection
   npm run test:supabase
   ```

3. **Execute UAT Scenarios**:
   - Follow each test scenario step-by-step
   - Compare UI outputs with direct SQL queries
   - Document results in test report spreadsheet

4. **Performance Validation**:
   ```bash
   # Run performance benchmarks
   npm run test:performance
   
   # Check bundle size
   npm run build
   ls -la dist/assets/
   ```

---

With this plan, your testers will systematically verify *every* client requirement using only real Supabase data—no hard-coded mocks—ensuring full production readiness.