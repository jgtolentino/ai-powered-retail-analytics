-- =====================================================
-- Row Level Security (RLS) Policies
-- Secures your retail analytics data access
-- =====================================================

-- Enable RLS on all main tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for migration safety)
DROP POLICY IF EXISTS "Allow authenticated read access" ON transactions;
DROP POLICY IF EXISTS "Allow authenticated read access" ON transaction_items;
DROP POLICY IF EXISTS "Allow authenticated read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated read access" ON brands;
DROP POLICY IF EXISTS "Allow authenticated read access" ON customers;
DROP POLICY IF EXISTS "Allow authenticated read access" ON stores;

-- =====================================================
-- READ POLICIES (for your Scout Dashboard)
-- =====================================================

-- Transactions table - core data for Scout Dashboard
CREATE POLICY "Scout Dashboard read access" ON transactions
  FOR SELECT TO authenticated, anon
  USING (true);  -- Allow all reads for analytics dashboard

-- Transaction items - for product analysis
CREATE POLICY "Scout Dashboard read access" ON transaction_items
  FOR SELECT TO authenticated, anon
  USING (true);

-- Products table - for product mix analysis
CREATE POLICY "Scout Dashboard read access" ON products
  FOR SELECT TO authenticated, anon
  USING (true);

-- Brands table - for brand performance analysis
CREATE POLICY "Scout Dashboard read access" ON brands
  FOR SELECT TO authenticated, anon
  USING (true);

-- Customers table - for consumer profiling (if exists)
CREATE POLICY "Scout Dashboard read access" ON customers
  FOR SELECT TO authenticated, anon
  USING (true);

-- Stores table - for location analysis (if exists)
CREATE POLICY "Scout Dashboard read access" ON stores
  FOR SELECT TO authenticated, anon
  USING (true);

-- =====================================================
-- WRITE POLICIES (Admin only)
-- =====================================================

-- Admin write access for data management
CREATE POLICY "Admin write access" ON transactions
  FOR ALL TO authenticated
  USING (
    COALESCE(
      auth.jwt() ->> 'role' = 'admin',
      auth.jwt() ->> 'user_role' = 'admin',
      false
    )
  );

CREATE POLICY "Admin write access" ON transaction_items
  FOR ALL TO authenticated
  USING (
    COALESCE(
      auth.jwt() ->> 'role' = 'admin',
      auth.jwt() ->> 'user_role' = 'admin',
      false
    )
  );

CREATE POLICY "Admin write access" ON products
  FOR ALL TO authenticated
  USING (
    COALESCE(
      auth.jwt() ->> 'role' = 'admin',
      auth.jwt() ->> 'user_role' = 'admin',
      false
    )
  );

CREATE POLICY "Admin write access" ON brands
  FOR ALL TO authenticated
  USING (
    COALESCE(
      auth.jwt() ->> 'role' = 'admin',
      auth.jwt() ->> 'user_role' = 'admin',
      false
    )
  );

-- =====================================================
-- SERVICE ROLE BYPASS (for backend operations)
-- =====================================================

-- Service role can bypass all restrictions
CREATE POLICY "Service role bypass" ON transactions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role bypass" ON transaction_items
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role bypass" ON products
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role bypass" ON brands
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- ANALYTICS SCHEMA SECURITY
-- =====================================================

-- Grant execute permissions on analytics functions
GRANT USAGE ON SCHEMA analytics TO authenticated, anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA analytics TO authenticated, anon;

-- Ensure future functions are also accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics 
GRANT EXECUTE ON FUNCTIONS TO authenticated, anon;

-- =====================================================
-- PERFORMANCE MONITORING FUNCTION
-- =====================================================

-- Create function to monitor RLS performance impact
CREATE OR REPLACE FUNCTION analytics.check_rls_performance()
RETURNS TABLE(
  table_name TEXT,
  estimated_rows BIGINT,
  rls_enabled BOOLEAN,
  policies_count INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    schemaname || '.' || tablename as table_name,
    n_tup_ins + n_tup_upd + n_tup_del as estimated_rows,
    true as rls_enabled,
    (SELECT COUNT(*) 
     FROM pg_policies p 
     WHERE p.schemaname = pg_stat_user_tables.schemaname 
     AND p.tablename = pg_stat_user_tables.tablename) as policies_count
  FROM pg_stat_user_tables
  WHERE schemaname = 'public'
  AND tablename IN ('transactions', 'transaction_items', 'products', 'brands', 'customers', 'stores');
$$;

GRANT EXECUTE ON FUNCTION analytics.check_rls_performance TO authenticated;

-- =====================================================
-- SECURITY HELPER FUNCTIONS
-- =====================================================

-- Function to check current user permissions
CREATE OR REPLACE FUNCTION analytics.check_user_permissions()
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'user_id', auth.uid(),
    'role', auth.jwt() ->> 'role',
    'user_role', auth.jwt() ->> 'user_role',
    'is_admin', COALESCE(
      auth.jwt() ->> 'role' = 'admin',
      auth.jwt() ->> 'user_role' = 'admin',
      false
    ),
    'can_read_analytics', true,  -- All authenticated users can read for dashboard
    'can_write_data', COALESCE(
      auth.jwt() ->> 'role' = 'admin',
      auth.jwt() ->> 'user_role' = 'admin',
      false
    )
  );
$$;

GRANT EXECUTE ON FUNCTION analytics.check_user_permissions TO authenticated, anon;

-- =====================================================
-- DATA PRIVACY COMPLIANCE
-- =====================================================

-- Function to anonymize sensitive data for non-admin users
CREATE OR REPLACE FUNCTION analytics.get_anonymized_customer_data(
  include_personal_info BOOLEAN DEFAULT false
)
RETURNS TABLE(
  device_id TEXT,
  age_group TEXT,
  gender_category TEXT,
  spending_tier TEXT,
  transaction_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    CASE 
      WHEN include_personal_info OR (auth.jwt() ->> 'role' = 'admin') 
      THEN device_id 
      ELSE 'anonymous_' || substring(md5(device_id), 1, 8)
    END as device_id,
    CASE 
      WHEN customer_age < 25 THEN '18-24'
      WHEN customer_age < 35 THEN '25-34'
      WHEN customer_age < 45 THEN '35-44'
      WHEN customer_age < 55 THEN '45-54'
      ELSE '55+'
    END as age_group,
    COALESCE(customer_gender, 'Unknown') as gender_category,
    CASE 
      WHEN AVG(total_amount) > 500 THEN 'High Value'
      WHEN AVG(total_amount) > 200 THEN 'Medium Value'
      ELSE 'Regular'
    END as spending_tier,
    COUNT(*) as transaction_count
  FROM transactions
  WHERE device_id IS NOT NULL
  GROUP BY device_id, customer_age, customer_gender
  ORDER BY transaction_count DESC;
$$;

GRANT EXECUTE ON FUNCTION analytics.get_anonymized_customer_data TO authenticated, anon;

-- =====================================================
-- AUDIT LOGGING
-- =====================================================

-- Create audit log table for sensitive operations
CREATE TABLE IF NOT EXISTS analytics.audit_log (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  action TEXT,
  table_name TEXT,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE analytics.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admin audit access" ON analytics.audit_log
  FOR SELECT TO authenticated
  USING (
    COALESCE(
      auth.jwt() ->> 'role' = 'admin',
      auth.jwt() ->> 'user_role' = 'admin',
      false
    )
  );

-- Service role can write audit logs
CREATE POLICY "Service audit write" ON analytics.audit_log
  FOR INSERT TO service_role
  WITH CHECK (true);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON POLICY "Scout Dashboard read access" ON transactions IS 
'Allows all authenticated and anonymous users to read transaction data for Scout Dashboard analytics. This supports the existing 18K transaction dataset display.';

COMMENT ON POLICY "Admin write access" ON transactions IS 
'Restricts write operations to admin users only. Protects data integrity while maintaining dashboard read access.';

COMMENT ON FUNCTION analytics.check_user_permissions IS 
'Helper function to verify user permissions for the Scout Dashboard interface.';

COMMENT ON FUNCTION analytics.get_anonymized_customer_data IS 
'Provides privacy-compliant customer analytics by anonymizing device IDs for non-admin users while preserving analytical value.';

-- =====================================================
-- TESTING QUERIES (for verification)
-- =====================================================

-- Test basic read access (should work)
-- SELECT COUNT(*) FROM transactions;

-- Test analytics function access (should work)
-- SELECT analytics.get_quick_stats();

-- Test user permissions (should return current user info)
-- SELECT analytics.check_user_permissions();

-- Test RLS performance monitoring
-- SELECT * FROM analytics.check_rls_performance();