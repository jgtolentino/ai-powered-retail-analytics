// Hook for product mix data using existing transaction data
import useAllTransactions from './useAllTransactions';

export default function useProductData() {
  const { transactions, loading, error } = useAllTransactions();
  
  // Transform transaction data for categories and SKUs
  const data = transactions.length > 0 ? {
    categories: transactions,
    skus: transactions
  } : null;

  return {
    data,
    loading,
    error
  };
}