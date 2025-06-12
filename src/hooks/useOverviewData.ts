// Hook for overview data using existing transaction data
import useAllTransactions from './useAllTransactions';

export default function useOverviewData() {
  const { transactions, loading, error } = useAllTransactions();
  
  // Transform transaction data for overview metrics and heatmap
  const data = transactions.length > 0 ? {
    metrics: {
      totalTransactions: transactions.length,
      totalRevenue: transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0),
      averageBasketSize: transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0) / transactions.length,
      activeCustomers: new Set(transactions.map(t => t.customer_id)).size
    },
    heatmap: transactions
  } : null;

  return {
    data,
    loading,
    error
  };
}