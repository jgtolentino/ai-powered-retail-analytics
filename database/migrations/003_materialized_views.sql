-- =====================================================
-- Materialized Views for Pre-aggregated Analytics
-- Accelerates your Scout Dashboard performance
-- =====================================================

-- Create materialized views for frequently accessed aggregations
-- This reduces computation time for your 18K transaction dataset

-- =====================================================
-- HOURLY ANALYTICS VIEW
-- =====================================================

-- Pre-compute hourly statistics for faster TransactionTrends panel
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.hourly_stats AS
SELECT 
  DATE_TRUNC('hour', t.created_at) as hour_timestamp,
  EXTRACT(hour FROM t.created_at) as hour_of_day,
  EXTRACT(dow FROM t.created_at) as day_of_week,
  DATE_TRUNC('day', t.created_at) as date_part,
  COUNT(*) as transaction_count,
  SUM(t.total_amount) as total_revenue,
  AVG(t.total_amount) as avg_transaction_amount,
  COUNT(DISTINCT t.device_id) as unique_customers,
  COUNT(DISTINCT TRIM(SPLIT_PART(t.store_location, ',', 1))) as unique_regions,
  
  -- Payment method breakdown
  COUNT(*) FILTER (WHERE t.payment_method = 'cash') as cash_transactions,
  COUNT(*) FILTER (WHERE t.payment_method = 'card') as card_transactions,
  COUNT(*) FILTER (WHERE t.payment_method = 'gcash') as gcash_transactions,
  
  -- Age group breakdown
  COUNT(*) FILTER (WHERE t.customer_age BETWEEN 18 AND 25) as age_18_25,
  COUNT(*) FILTER (WHERE t.customer_age BETWEEN 26 AND 35) as age_26_35,
  COUNT(*) FILTER (WHERE t.customer_age BETWEEN 36 AND 50) as age_36_50,
  COUNT(*) FILTER (WHERE t.customer_age > 50) as age_over_50,
  
  -- Gender breakdown
  COUNT(*) FILTER (WHERE t.customer_gender = 'Male') as male_customers,
  COUNT(*) FILTER (WHERE t.customer_gender = 'Female') as female_customers,
  
  -- High-value transaction indicators
  COUNT(*) FILTER (WHERE t.total_amount > 500) as high_value_transactions,
  SUM(t.total_amount) FILTER (WHERE t.total_amount > 500) as high_value_revenue,
  
  -- Regional top performer
  mode() WITHIN GROUP (ORDER BY TRIM(SPLIT_PART(t.store_location, ',', 1))) as top_region_by_volume,
  
  -- Timestamp for cache invalidation
  NOW() as computed_at
FROM transactions t
WHERE t.created_at IS NOT NULL
GROUP BY 
  DATE_TRUNC('hour', t.created_at),
  EXTRACT(hour FROM t.created_at),
  EXTRACT(dow FROM t.created_at),
  DATE_TRUNC('day', t.created_at);

-- Create indexes for fast access
CREATE UNIQUE INDEX IF NOT EXISTS idx_hourly_stats_hour_timestamp ON analytics.hourly_stats(hour_timestamp);
CREATE INDEX IF NOT EXISTS idx_hourly_stats_date_part ON analytics.hourly_stats(date_part);
CREATE INDEX IF NOT EXISTS idx_hourly_stats_hour_of_day ON analytics.hourly_stats(hour_of_day);
CREATE INDEX IF NOT EXISTS idx_hourly_stats_day_of_week ON analytics.hourly_stats(day_of_week);

-- =====================================================
-- DAILY AGGREGATED VIEW
-- =====================================================

-- Pre-compute daily statistics for dashboard overview
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.daily_stats AS
SELECT 
  DATE_TRUNC('day', t.created_at) as date_part,
  EXTRACT(dow FROM t.created_at) as day_of_week,
  EXTRACT(week FROM t.created_at) as week_of_year,
  COUNT(*) as transaction_count,
  SUM(t.total_amount) as total_revenue,
  AVG(t.total_amount) as avg_transaction_amount,
  MIN(t.total_amount) as min_transaction,
  MAX(t.total_amount) as max_transaction,
  COUNT(DISTINCT t.device_id) as unique_customers,
  
  -- Customer retention metrics
  COUNT(DISTINCT t.device_id) FILTER (
    WHERE EXISTS (
      SELECT 1 FROM transactions t2 
      WHERE t2.device_id = t.device_id 
      AND t2.created_at::date = (t.created_at::date - INTERVAL '1 day')
    )
  ) as returning_customers,
  
  -- Revenue distribution
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY t.total_amount) as median_transaction,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY t.total_amount) as q3_transaction,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY t.total_amount) as p95_transaction,
  
  -- Peak hour for the day
  mode() WITHIN GROUP (ORDER BY EXTRACT(hour FROM t.created_at)) as peak_hour,
  
  -- Growth indicators (vs previous day)
  LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('day', t.created_at)) as prev_day_transactions,
  LAG(SUM(t.total_amount)) OVER (ORDER BY DATE_TRUNC('day', t.created_at)) as prev_day_revenue,
  
  NOW() as computed_at
FROM transactions t
WHERE t.created_at IS NOT NULL
GROUP BY 
  DATE_TRUNC('day', t.created_at),
  EXTRACT(dow FROM t.created_at),
  EXTRACT(week FROM t.created_at);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_stats_date ON analytics.daily_stats(date_part);
CREATE INDEX IF NOT EXISTS idx_daily_stats_week ON analytics.daily_stats(week_of_year);

-- =====================================================
-- BRAND PERFORMANCE VIEW
-- =====================================================

-- Pre-compute brand analytics for ProductMixSKU panel
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.brand_performance AS
SELECT 
  b.id as brand_id,
  b.name as brand_name,
  b.category as brand_category,
  b.is_tbwa,
  
  -- Transaction metrics
  COUNT(t.id) as transaction_count,
  SUM(t.total_amount) as total_revenue,
  AVG(t.total_amount) as avg_transaction_amount,
  COUNT(DISTINCT t.device_id) as unique_customers,
  
  -- Market share calculations
  ROUND(
    (SUM(t.total_amount) / (SELECT SUM(total_amount) FROM transactions) * 100)::numeric, 
    2
  ) as market_share_percentage,
  
  -- Customer loyalty metrics
  AVG(customer_frequency.transaction_count) as avg_customer_frequency,
  COUNT(*) FILTER (WHERE customer_frequency.transaction_count > 1) as repeat_customers,
  
  -- Geographic performance
  COUNT(DISTINCT TRIM(SPLIT_PART(t.store_location, ',', 1))) as regions_present,
  mode() WITHIN GROUP (ORDER BY TRIM(SPLIT_PART(t.store_location, ',', 1))) as top_region,
  
  -- Time patterns
  mode() WITHIN GROUP (ORDER BY EXTRACT(hour FROM t.created_at)) as peak_hour,
  mode() WITHIN GROUP (ORDER BY EXTRACT(dow FROM t.created_at)) as peak_day_of_week,
  
  -- Growth trends (last 30 days vs previous 30 days)
  COUNT(*) FILTER (WHERE t.created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_transactions,
  COUNT(*) FILTER (WHERE t.created_at >= CURRENT_DATE - INTERVAL '60 days' 
                   AND t.created_at < CURRENT_DATE - INTERVAL '30 days') as prev_period_transactions,
  
  -- Revenue trends
  SUM(t.total_amount) FILTER (WHERE t.created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_revenue,
  SUM(t.total_amount) FILTER (WHERE t.created_at >= CURRENT_DATE - INTERVAL '60 days' 
                              AND t.created_at < CURRENT_DATE - INTERVAL '30 days') as prev_period_revenue,
  
  -- Performance ranking
  RANK() OVER (ORDER BY SUM(t.total_amount) DESC) as revenue_rank,
  RANK() OVER (ORDER BY COUNT(t.id) DESC) as transaction_rank,
  
  NOW() as computed_at
FROM brands b
LEFT JOIN products p ON b.id = p.brand_id
LEFT JOIN transaction_items ti ON p.id = ti.product_id
LEFT JOIN transactions t ON ti.transaction_id = t.id
LEFT JOIN (
  -- Customer frequency subquery
  SELECT 
    ti2.product_id,
    t2.device_id,
    COUNT(*) as transaction_count
  FROM transactions t2
  JOIN transaction_items ti2 ON t2.id = ti2.transaction_id
  GROUP BY ti2.product_id, t2.device_id
) customer_frequency ON p.id = customer_frequency.product_id AND t.device_id = customer_frequency.device_id
GROUP BY b.id, b.name, b.category, b.is_tbwa;

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_performance_brand_id ON analytics.brand_performance(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_performance_is_tbwa ON analytics.brand_performance(is_tbwa);
CREATE INDEX IF NOT EXISTS idx_brand_performance_category ON analytics.brand_performance(brand_category);
CREATE INDEX IF NOT EXISTS idx_brand_performance_revenue_rank ON analytics.brand_performance(revenue_rank);

-- =====================================================
-- CUSTOMER SEGMENTATION VIEW
-- =====================================================

-- Pre-compute customer analytics for ConsumerProfiling panel
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.customer_segments AS
SELECT 
  t.device_id,
  
  -- Demographics
  CASE 
    WHEN AVG(t.customer_age) < 25 THEN '18-24'
    WHEN AVG(t.customer_age) < 35 THEN '25-34'
    WHEN AVG(t.customer_age) < 45 THEN '35-44'
    WHEN AVG(t.customer_age) < 55 THEN '45-54'
    ELSE '55+'
  END as age_group,
  
  mode() WITHIN GROUP (ORDER BY t.customer_gender) as primary_gender,
  mode() WITHIN GROUP (ORDER BY TRIM(SPLIT_PART(t.store_location, ',', 1))) as primary_region,
  mode() WITHIN GROUP (ORDER BY t.payment_method) as preferred_payment,
  
  -- Transaction behavior
  COUNT(*) as total_transactions,
  SUM(t.total_amount) as total_spent,
  AVG(t.total_amount) as avg_transaction_amount,
  MIN(t.total_amount) as min_spent,
  MAX(t.total_amount) as max_spent,
  
  -- Frequency patterns
  COUNT(DISTINCT DATE_TRUNC('day', t.created_at)) as active_days,
  COUNT(DISTINCT DATE_TRUNC('week', t.created_at)) as active_weeks,
  COUNT(DISTINCT DATE_TRUNC('month', t.created_at)) as active_months,
  
  -- Temporal patterns
  mode() WITHIN GROUP (ORDER BY EXTRACT(hour FROM t.created_at)) as preferred_hour,
  mode() WITHIN GROUP (ORDER BY EXTRACT(dow FROM t.created_at)) as preferred_day_of_week,
  
  -- Loyalty indicators
  MIN(t.created_at) as first_transaction,
  MAX(t.created_at) as last_transaction,
  MAX(t.created_at) - MIN(t.created_at) as customer_lifetime,
  
  -- Value segmentation
  CASE 
    WHEN SUM(t.total_amount) > 2000 AND COUNT(*) > 10 THEN 'VIP'
    WHEN SUM(t.total_amount) > 1000 OR COUNT(*) > 5 THEN 'High Value'
    WHEN COUNT(*) > 1 THEN 'Regular'
    ELSE 'One-time'
  END as customer_segment,
  
  -- Recency, Frequency, Monetary (RFM) scores
  NTILE(5) OVER (ORDER BY MAX(t.created_at) DESC) as recency_score,
  NTILE(5) OVER (ORDER BY COUNT(*)) as frequency_score,
  NTILE(5) OVER (ORDER BY SUM(t.total_amount)) as monetary_score,
  
  -- Growth trend
  COUNT(*) FILTER (WHERE t.created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_transactions,
  SUM(t.total_amount) FILTER (WHERE t.created_at >= CURRENT_DATE - INTERVAL '30 days') as recent_spending,
  
  NOW() as computed_at
FROM transactions t
WHERE t.device_id IS NOT NULL
GROUP BY t.device_id;

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_segments_device_id ON analytics.customer_segments(device_id);
CREATE INDEX IF NOT EXISTS idx_customer_segments_age_group ON analytics.customer_segments(age_group);
CREATE INDEX IF NOT EXISTS idx_customer_segments_segment ON analytics.customer_segments(customer_segment);
CREATE INDEX IF NOT EXISTS idx_customer_segments_rfm ON analytics.customer_segments(recency_score, frequency_score, monetary_score);

-- =====================================================
-- LOCATION PERFORMANCE VIEW
-- =====================================================

-- Pre-compute location analytics for geographic insights
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.location_performance AS
SELECT 
  TRIM(SPLIT_PART(t.store_location, ',', 1)) as region,
  TRIM(SPLIT_PART(t.store_location, ',', 2)) as city,
  t.store_location as full_location,
  
  -- Basic metrics
  COUNT(*) as transaction_count,
  SUM(t.total_amount) as total_revenue,
  AVG(t.total_amount) as avg_transaction_amount,
  COUNT(DISTINCT t.device_id) as unique_customers,
  
  -- Customer demographics
  AVG(t.customer_age) as avg_customer_age,
  COUNT(*) FILTER (WHERE t.customer_gender = 'Male') as male_customers,
  COUNT(*) FILTER (WHERE t.customer_gender = 'Female') as female_customers,
  
  -- Payment preferences by location
  COUNT(*) FILTER (WHERE t.payment_method = 'cash') as cash_transactions,
  COUNT(*) FILTER (WHERE t.payment_method = 'card') as card_transactions,
  COUNT(*) FILTER (WHERE t.payment_method = 'gcash') as gcash_transactions,
  
  -- Temporal patterns
  mode() WITHIN GROUP (ORDER BY EXTRACT(hour FROM t.created_at)) as peak_hour,
  mode() WITHIN GROUP (ORDER BY EXTRACT(dow FROM t.created_at)) as peak_day,
  
  -- Performance ranking
  RANK() OVER (ORDER BY SUM(t.total_amount) DESC) as revenue_rank,
  RANK() OVER (ORDER BY COUNT(*) DESC) as transaction_rank,
  RANK() OVER (ORDER BY COUNT(DISTINCT t.device_id) DESC) as customer_rank,
  
  -- Market penetration
  ROUND(
    (COUNT(DISTINCT t.device_id)::numeric / COUNT(*) * 100), 
    2
  ) as customer_diversity_score,
  
  NOW() as computed_at
FROM transactions t
WHERE t.store_location IS NOT NULL
GROUP BY 
  TRIM(SPLIT_PART(t.store_location, ',', 1)),
  TRIM(SPLIT_PART(t.store_location, ',', 2)),
  t.store_location;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_location_performance_region ON analytics.location_performance(region);
CREATE INDEX IF NOT EXISTS idx_location_performance_revenue_rank ON analytics.location_performance(revenue_rank);
CREATE INDEX IF NOT EXISTS idx_location_performance_full_location ON analytics.location_performance(full_location);

-- =====================================================
-- REFRESH FUNCTIONS
-- =====================================================

-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION analytics.refresh_all_views()
RETURNS TABLE(
  view_name TEXT,
  refresh_duration INTERVAL,
  rows_affected BIGINT,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  start_time TIMESTAMP;
  end_time TIMESTAMP;
  view_record RECORD;
  views_to_refresh TEXT[] := ARRAY[
    'analytics.hourly_stats',
    'analytics.daily_stats', 
    'analytics.brand_performance',
    'analytics.customer_segments',
    'analytics.location_performance'
  ];
BEGIN
  FOR view_name IN SELECT unnest(views_to_refresh)
  LOOP
    BEGIN
      start_time := clock_timestamp();
      
      -- Use concurrent refresh if possible, fallback to regular refresh
      BEGIN
        EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY %I', view_name);
      EXCEPTION WHEN OTHERS THEN
        EXECUTE format('REFRESH MATERIALIZED VIEW %I', view_name);
      END;
      
      end_time := clock_timestamp();
      
      -- Get row count
      EXECUTE format('SELECT COUNT(*) FROM %I', view_name) INTO rows_affected;
      
      RETURN QUERY SELECT 
        view_name::TEXT,
        (end_time - start_time)::INTERVAL,
        rows_affected::BIGINT,
        'SUCCESS'::TEXT;
        
    EXCEPTION WHEN OTHERS THEN
      RETURN QUERY SELECT 
        view_name::TEXT,
        '00:00:00'::INTERVAL,
        0::BIGINT,
        format('ERROR: %s', SQLERRM)::TEXT;
    END;
  END LOOP;
END;
$$;

-- Function to refresh views based on data freshness
CREATE OR REPLACE FUNCTION analytics.smart_refresh_views()
RETURNS TABLE(
  view_name TEXT,
  action_taken TEXT,
  reason TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_transaction TIMESTAMP;
  view_record RECORD;
BEGIN
  -- Get the latest transaction timestamp
  SELECT MAX(created_at) INTO last_transaction FROM transactions;
  
  -- Check each view's freshness and refresh if needed
  FOR view_record IN 
    SELECT 
      schemaname || '.' || matviewname as full_name,
      matviewname
    FROM pg_matviews 
    WHERE schemaname = 'analytics'
  LOOP
    -- Check if view needs refresh (if computed_at is older than latest transaction)
    DECLARE
      view_computed_at TIMESTAMP;
    BEGIN
      EXECUTE format('SELECT MAX(computed_at) FROM %I', view_record.full_name) 
      INTO view_computed_at;
      
      IF view_computed_at IS NULL OR view_computed_at < last_transaction THEN
        -- Refresh the view
        EXECUTE format('REFRESH MATERIALIZED VIEW %I', view_record.full_name);
        
        RETURN QUERY SELECT 
          view_record.full_name::TEXT,
          'REFRESHED'::TEXT,
          format('View was stale (computed: %s, latest data: %s)', 
                 COALESCE(view_computed_at::TEXT, 'never'), 
                 last_transaction::TEXT)::TEXT;
      ELSE
        RETURN QUERY SELECT 
          view_record.full_name::TEXT,
          'SKIPPED'::TEXT,
          'View is up to date'::TEXT;
      END IF;
    END;
  END LOOP;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION analytics.refresh_all_views TO authenticated;
GRANT EXECUTE ON FUNCTION analytics.smart_refresh_views TO authenticated;

-- =====================================================
-- AUTOMATED REFRESH SCHEDULE
-- =====================================================

-- Create function to schedule periodic refreshes
-- Note: This requires pg_cron extension to be enabled
CREATE OR REPLACE FUNCTION analytics.setup_auto_refresh()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to schedule automatic refresh every 4 hours
  -- This will only work if pg_cron extension is available
  BEGIN
    PERFORM cron.schedule(
      'refresh-analytics-views',
      '0 */4 * * *',  -- Every 4 hours
      'SELECT analytics.smart_refresh_views();'
    );
    RETURN 'Auto-refresh scheduled successfully for every 4 hours';
  EXCEPTION WHEN OTHERS THEN
    RETURN format('Could not schedule auto-refresh: %s. Please refresh views manually or enable pg_cron extension.', SQLERRM);
  END;
END;
$$;

-- =====================================================
-- VIEW PERFORMANCE MONITORING
-- =====================================================

-- Function to check view performance and freshness
CREATE OR REPLACE FUNCTION analytics.view_health_check()
RETURNS TABLE(
  view_name TEXT,
  row_count BIGINT,
  size_mb NUMERIC,
  last_computed TIMESTAMP,
  freshness_status TEXT,
  index_count INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    schemaname || '.' || matviewname as view_name,
    (xpath('//row_count/text()', 
           query_to_xml(format('SELECT COUNT(*) as row_count FROM %I.%I', 
                              schemaname, matviewname), false, true, ''))
    )[1]::text::bigint as row_count,
    ROUND((pg_total_relation_size(schemaname||'.'||matviewname) / 1024.0 / 1024.0)::numeric, 2) as size_mb,
    (xpath('//computed_at/text()', 
           query_to_xml(format('SELECT MAX(computed_at) as computed_at FROM %I.%I', 
                              schemaname, matviewname), false, true, ''))
    )[1]::text::timestamp as last_computed,
    CASE 
      WHEN (xpath('//computed_at/text()', 
                  query_to_xml(format('SELECT MAX(computed_at) as computed_at FROM %I.%I', 
                                     schemaname, matviewname), false, true, ''))
           )[1]::text::timestamp > (SELECT MAX(created_at) - INTERVAL '1 hour' FROM transactions)
      THEN 'FRESH'
      ELSE 'STALE'
    END as freshness_status,
    (SELECT COUNT(*) 
     FROM pg_indexes 
     WHERE schemaname = pg_matviews.schemaname 
     AND tablename = pg_matviews.matviewname) as index_count
  FROM pg_matviews 
  WHERE schemaname = 'analytics';
$$;

GRANT EXECUTE ON FUNCTION analytics.view_health_check TO authenticated;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON MATERIALIZED VIEW analytics.hourly_stats IS 
'Pre-computed hourly analytics for the Scout Dashboard TransactionTrends panel. Significantly improves performance for time-series analysis of 18K+ transactions.';

COMMENT ON MATERIALIZED VIEW analytics.brand_performance IS 
'Pre-computed brand analytics for the ProductMixSKU panel. Includes TBWA vs competitor analysis and market share calculations.';

COMMENT ON MATERIALIZED VIEW analytics.customer_segments IS 
'Pre-computed customer segmentation for the ConsumerProfiling panel. Includes RFM analysis and behavioral patterns.';

COMMENT ON FUNCTION analytics.refresh_all_views IS 
'Refreshes all analytics materialized views. Use this function to update pre-computed data after significant data changes.';

COMMENT ON FUNCTION analytics.smart_refresh_views IS 
'Intelligently refreshes only stale materialized views based on data freshness. Optimizes refresh operations for better performance.';

-- =====================================================
-- INITIAL REFRESH
-- =====================================================

-- Refresh all views to populate with current data
SELECT analytics.refresh_all_views();