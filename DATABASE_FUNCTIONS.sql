-- =============================================================================
-- RetailBot Database Functions for Sari-Sari Analytics
-- Run these in your Supabase SQL Editor to replace mock data with real data
-- =============================================================================

-- 1. Daily KPIs Function
CREATE OR REPLACE FUNCTION get_daily_kpis(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE,
  store_id INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  current_stats RECORD;
  previous_stats RECORD;
BEGIN
  -- Current period stats
  SELECT 
    COALESCE(SUM(total_amount), 0) as total_revenue,
    COUNT(*) as total_transactions,
    COALESCE(AVG(
      (SELECT SUM(quantity) FROM transaction_items ti WHERE ti.transaction_id = t.id)
    ), 0) as avg_basket_size,
    COUNT(DISTINCT COALESCE(customer_age::text || customer_gender, 'unknown')) as active_customers
  INTO current_stats
  FROM transactions t
  WHERE 
    DATE(created_at) BETWEEN start_date AND end_date
    AND (store_id IS NULL OR t.store_id = get_daily_kpis.store_id);

  -- Previous period stats (same duration before start_date)
  SELECT 
    COALESCE(SUM(total_amount), 0) as total_revenue,
    COUNT(*) as total_transactions,
    COALESCE(AVG(
      (SELECT SUM(quantity) FROM transaction_items ti WHERE ti.transaction_id = t.id)
    ), 0) as avg_basket_size,
    COUNT(DISTINCT COALESCE(customer_age::text || customer_gender, 'unknown')) as active_customers
  INTO previous_stats
  FROM transactions t
  WHERE 
    DATE(created_at) BETWEEN 
      start_date - (end_date - start_date + INTERVAL '1 day') 
      AND start_date - INTERVAL '1 day'
    AND (store_id IS NULL OR t.store_id = get_daily_kpis.store_id);

  -- Calculate percentage changes
  SELECT json_build_object(
    'total_revenue', current_stats.total_revenue,
    'total_transactions', current_stats.total_transactions,
    'avg_basket_size', ROUND(current_stats.avg_basket_size, 1),
    'active_customers', current_stats.active_customers,
    'revenue_change', CASE 
      WHEN previous_stats.total_revenue > 0 
      THEN ROUND(((current_stats.total_revenue - previous_stats.total_revenue) / previous_stats.total_revenue * 100)::numeric, 1)
      ELSE 0 
    END,
    'transactions_change', CASE 
      WHEN previous_stats.total_transactions > 0 
      THEN ROUND(((current_stats.total_transactions - previous_stats.total_transactions) / previous_stats.total_transactions::numeric * 100), 1)
      ELSE 0 
    END,
    'basket_change', CASE 
      WHEN previous_stats.avg_basket_size > 0 
      THEN ROUND(((current_stats.avg_basket_size - previous_stats.avg_basket_size) / previous_stats.avg_basket_size * 100)::numeric, 1)
      ELSE 0 
    END,
    'customers_change', CASE 
      WHEN previous_stats.active_customers > 0 
      THEN ROUND(((current_stats.active_customers - previous_stats.active_customers) / previous_stats.active_customers::numeric * 100), 1)
      ELSE 0 
    END
  ) INTO result;

  RETURN result;
END;
$$;

-- 2. Hourly Trends Function  
CREATE OR REPLACE FUNCTION get_hourly_trends(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '7 days',
  end_date DATE DEFAULT CURRENT_DATE,
  store_id INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'hour', hour_of_day,
      'day_of_week', day_of_week,
      'transaction_count', transaction_count,
      'revenue', revenue,
      'avg_basket', avg_basket
    )
  )
  INTO result
  FROM (
    SELECT 
      EXTRACT(hour FROM created_at) as hour_of_day,
      EXTRACT(dow FROM created_at) as day_of_week,
      COUNT(*) as transaction_count,
      COALESCE(SUM(total_amount), 0) as revenue,
      COALESCE(AVG(total_amount), 0) as avg_basket
    FROM transactions t
    WHERE 
      DATE(created_at) BETWEEN start_date AND end_date
      AND (store_id IS NULL OR t.store_id = get_hourly_trends.store_id)
    GROUP BY 
      EXTRACT(hour FROM created_at),
      EXTRACT(dow FROM created_at)
    ORDER BY day_of_week, hour_of_day
  ) hourly_data;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- 3. Basket Summary Function
CREATE OR REPLACE FUNCTION get_basket_summary(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE,
  store_id INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  avg_basket NUMERIC;
BEGIN
  -- Calculate average basket size
  SELECT AVG(basket_size) INTO avg_basket
  FROM (
    SELECT SUM(quantity) as basket_size
    FROM transaction_items ti
    JOIN transactions t ON ti.transaction_id = t.id
    WHERE 
      DATE(t.created_at) BETWEEN start_date AND end_date
      AND (store_id IS NULL OR t.store_id = get_basket_summary.store_id)
    GROUP BY ti.transaction_id
  ) baskets;

  SELECT json_build_object(
    'avg_basket_size', ROUND(COALESCE(avg_basket, 0), 1),
    'basket_distribution', basket_dist.distribution,
    'top_products', top_prods.products
  ) INTO result
  FROM (
    -- Basket size distribution
    SELECT json_agg(
      json_build_object(
        'size', basket_size,
        'count', transaction_count,
        'percentage', ROUND((transaction_count * 100.0 / SUM(transaction_count) OVER())::numeric, 0)
      )
    ) as distribution
    FROM (
      SELECT 
        CASE 
          WHEN basket_size = 1 THEN 1
          WHEN basket_size = 2 THEN 2  
          WHEN basket_size = 3 THEN 3
          WHEN basket_size = 4 THEN 4
          WHEN basket_size = 5 THEN 5
          ELSE 6
        END as basket_size,
        COUNT(*) as transaction_count
      FROM (
        SELECT 
          ti.transaction_id,
          LEAST(SUM(quantity), 6) as basket_size
        FROM transaction_items ti
        JOIN transactions t ON ti.transaction_id = t.id
        WHERE 
          DATE(t.created_at) BETWEEN start_date AND end_date
          AND (store_id IS NULL OR t.store_id = get_basket_summary.store_id)
        GROUP BY ti.transaction_id
      ) basket_sizes
      GROUP BY 
        CASE 
          WHEN basket_size = 1 THEN 1
          WHEN basket_size = 2 THEN 2  
          WHEN basket_size = 3 THEN 3
          WHEN basket_size = 4 THEN 4
          WHEN basket_size = 5 THEN 5
          ELSE 6
        END
      ORDER BY basket_size
    ) dist
  ) basket_dist,
  (
    -- Top products by frequency
    SELECT json_agg(
      json_build_object(
        'product_name', product_name,
        'frequency', frequency,
        'category', category
      )
    ) as products
    FROM (
      SELECT 
        p.name as product_name,
        p.category,
        ROUND((COUNT(*) * 100.0 / total_transactions.total)::numeric, 0) as frequency
      FROM transaction_items ti
      JOIN transactions t ON ti.transaction_id = t.id
      JOIN products p ON ti.product_id = p.id
      CROSS JOIN (
        SELECT COUNT(DISTINCT t2.id)::numeric as total
        FROM transactions t2
        WHERE DATE(t2.created_at) BETWEEN start_date AND end_date
          AND (store_id IS NULL OR t2.store_id = get_basket_summary.store_id)
      ) total_transactions
      WHERE 
        DATE(t.created_at) BETWEEN start_date AND end_date
        AND (store_id IS NULL OR t.store_id = get_basket_summary.store_id)
      GROUP BY p.id, p.name, p.category, total_transactions.total
      ORDER BY COUNT(*) DESC
      LIMIT 5
    ) top_products
  ) top_prods;

  RETURN COALESCE(result, '{}'::json);
END;
$$;

-- 4. Brand Performance Function
CREATE OR REPLACE FUNCTION get_brand_performance(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE,
  store_id INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'tbwa_vs_competitors', tbwa_comp.comparison,
    'top_brands', top_brands.brands,
    'category_performance', cat_perf.categories
  ) INTO result
  FROM (
    -- TBWA vs Competitors
    SELECT json_build_object(
      'tbwa_share', ROUND((tbwa_revenue * 100.0 / NULLIF(total_revenue, 0))::numeric, 1),
      'tbwa_revenue', tbwa_revenue,
      'competitor_revenue', total_revenue - tbwa_revenue,
      'tbwa_brands', tbwa_brands,
      'total_brands', total_brands
    ) as comparison
    FROM (
      SELECT 
        COALESCE(SUM(CASE WHEN b.is_tbwa THEN ti.price * ti.quantity ELSE 0 END), 0) as tbwa_revenue,
        COALESCE(SUM(ti.price * ti.quantity), 0) as total_revenue,
        COUNT(DISTINCT CASE WHEN b.is_tbwa THEN b.id END) as tbwa_brands,
        COUNT(DISTINCT b.id) as total_brands
      FROM transaction_items ti
      JOIN transactions t ON ti.transaction_id = t.id
      JOIN products p ON ti.product_id = p.id
      JOIN brands b ON p.brand_id = b.id
      WHERE 
        DATE(t.created_at) BETWEEN start_date AND end_date
        AND (store_id IS NULL OR t.store_id = get_brand_performance.store_id)
    ) brand_totals
  ) tbwa_comp,
  (
    -- Top brands
    SELECT json_agg(
      json_build_object(
        'brand_name', brand_name,
        'is_tbwa', is_tbwa,
        'revenue', revenue,
        'market_share', market_share,
        'growth_rate', COALESCE(growth_rate, 0)
      )
    ) as brands
    FROM (
      SELECT 
        b.name as brand_name,
        b.is_tbwa,
        COALESCE(SUM(ti.price * ti.quantity), 0) as revenue,
        ROUND((SUM(ti.price * ti.quantity) * 100.0 / total_rev.total)::numeric, 1) as market_share,
        -- Mock growth rate (replace with actual previous period comparison)
        (RANDOM() * 30 - 10)::numeric as growth_rate
      FROM transaction_items ti
      JOIN transactions t ON ti.transaction_id = t.id
      JOIN products p ON ti.product_id = p.id
      JOIN brands b ON p.brand_id = b.id
      CROSS JOIN (
        SELECT SUM(ti2.price * ti2.quantity) as total
        FROM transaction_items ti2
        JOIN transactions t2 ON ti2.transaction_id = t2.id
        WHERE DATE(t2.created_at) BETWEEN start_date AND end_date
          AND (store_id IS NULL OR t2.store_id = get_brand_performance.store_id)
      ) total_rev
      WHERE 
        DATE(t.created_at) BETWEEN start_date AND end_date
        AND (store_id IS NULL OR t.store_id = get_brand_performance.store_id)
      GROUP BY b.id, b.name, b.is_tbwa, total_rev.total
      ORDER BY revenue DESC
      LIMIT 5
    ) brand_data
  ) top_brands,
  (
    -- Category performance
    SELECT json_agg(
      json_build_object(
        'category', category,
        'tbwa_revenue', tbwa_revenue,
        'total_revenue', total_revenue,
        'tbwa_share', ROUND((tbwa_revenue * 100.0 / NULLIF(total_revenue, 0))::numeric, 1)
      )
    ) as categories
    FROM (
      SELECT 
        p.category,
        COALESCE(SUM(CASE WHEN b.is_tbwa THEN ti.price * ti.quantity ELSE 0 END), 0) as tbwa_revenue,
        COALESCE(SUM(ti.price * ti.quantity), 0) as total_revenue
      FROM transaction_items ti
      JOIN transactions t ON ti.transaction_id = t.id
      JOIN products p ON ti.product_id = p.id
      JOIN brands b ON p.brand_id = b.id
      WHERE 
        DATE(t.created_at) BETWEEN start_date AND end_date
        AND (store_id IS NULL OR t.store_id = get_brand_performance.store_id)
        AND p.category IS NOT NULL
      GROUP BY p.category
      HAVING SUM(ti.price * ti.quantity) > 0
      ORDER BY total_revenue DESC
      LIMIT 5
    ) category_data
  ) cat_perf;

  RETURN COALESCE(result, '{}'::json);
END;
$$;

-- 5. Grant permissions (adjust as needed for your setup)
-- GRANT EXECUTE ON FUNCTION get_daily_kpis TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_hourly_trends TO authenticated; 
-- GRANT EXECUTE ON FUNCTION get_basket_summary TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_brand_performance TO authenticated;

-- 6. Test the functions
-- SELECT get_daily_kpis();
-- SELECT get_hourly_trends();
-- SELECT get_basket_summary();
-- SELECT get_brand_performance();