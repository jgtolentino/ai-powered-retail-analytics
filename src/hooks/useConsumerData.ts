// Hook for consumer behavior data using existing transaction data
import useAllTransactions from './useAllTransactions';

export default function useConsumerData() {
  const { transactions, loading, error } = useAllTransactions();
  
  // Transform transaction data for request behavior and consumer profiles
  const data = transactions.length > 0 ? {
    requests: transactions,
    profile: transactions
  } : null;

  return {
    data,
    loading,
    error
  };
}