// ========================================
// SOLUTION 6: React Hook for Data Fetching
// ========================================

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Transaction {
  id?: number;
  store_id?: number;
  total_amount?: number;
  created_at: string;
  customer_id?: number;
  transaction_type?: string;
}

const useAllTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent multiple concurrent fetches
    if (hasFetched.current) return;
    
    const fetchAllData = async () => {
      console.log('🚀 useAllTransactions: Starting data fetch...');
      hasFetched.current = true;
      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        // Get total count first
        const { count, error: countError } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;
        
        console.log(`📊 Total records to fetch: ${count}`);

        if (!count || count === 0) {
          console.log('⚠️ No transactions found in database');
          setTransactions([]);
          return;
        }

        const batchSize = 1000;
        let allData: any[] = [];

        for (let offset = 0; offset < count; offset += batchSize) {
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .range(offset, offset + batchSize - 1);

          if (error) throw error;

          allData = [...allData, ...data];
          
          const progressPercent = Math.round((allData.length / count) * 100);
          setProgress(progressPercent);
          
          console.log(`📈 Progress: ${progressPercent}% (${allData.length}/${count})`);
          console.log('📦 Sample data:', data?.slice(0, 2));
        }

        setTransactions(allData);
        console.log(`✅ All ${allData.length} transactions loaded successfully!`);
        console.log('📊 Final transaction sample:', allData.slice(0, 3));
        console.log('💰 Sample amounts:', allData.slice(0, 5).map(t => t.total_amount));

      } catch (err: any) {
        console.error('❌ Error loading transactions:', err);
        setError(err.message || 'Failed to load transactions');
        hasFetched.current = false; // Allow retry on error
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { transactions, loading, error, progress };
};

export default useAllTransactions;
export { useAllTransactions };