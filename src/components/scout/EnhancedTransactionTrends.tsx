import React from 'react';
import { EnhancedScoutPanel } from '../enhanced/EnhancedScoutPanel';
import { useEnhancedFiltering } from '../../hooks/useEnhancedFiltering';

interface EnhancedTransactionTrendsProps {
  className?: string;
}

export const EnhancedTransactionTrends: React.FC<EnhancedTransactionTrendsProps> = ({ 
  className = '' 
}) => {
  const { filters } = useEnhancedFiltering();
  
  return (
    <EnhancedScoutPanel 
      panelType="trends"
      filters={filters}
      className={`${className} h-full`}
    />
  );
};

export default EnhancedTransactionTrends;