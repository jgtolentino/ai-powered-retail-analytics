// ========================================
// SOLUTION 6: React Hook for Data Fetching
// ========================================

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Use direct client to bypass enhanced client limits
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lcoxtanyckjzyxxcsjzz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3h0YW55Y2tqenl4eGNzanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDUzMjcsImV4cCI6MjA2MzkyMTMyN30.W2JgvZdXubvWpKCNZ7TfjLiKANZO1Hlb164fBEKH2dA';
const supabase = createClient(supabaseUrl, supabaseKey);

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

  useEffect(() => {
    const fetchAllData = async () => {
      console.log('🚀 useAllTransactions: Starting data fetch...');
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