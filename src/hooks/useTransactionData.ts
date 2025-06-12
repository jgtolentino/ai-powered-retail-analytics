// Hook for transaction trends data using existing transaction data
import useAllTransactions from './useAllTransactions';

export default function useTransactionData() {
  const { transactions, loading, error } = useAllTransactions();
  
  // Transform transaction data for volume over time and location heatmap
  const data = transactions.length > 0 ? {
    volumeOverTime: transactions,
    locationHeatmap: transactions
  } : null;

  return {
    data,
    loading,
    error
  };
}