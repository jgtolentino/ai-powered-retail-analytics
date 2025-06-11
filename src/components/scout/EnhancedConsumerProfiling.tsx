import React from 'react';
import { EnhancedScoutPanel } from '../enhanced/EnhancedScoutPanel';
import { useEnhancedFiltering } from '../../hooks/useEnhancedFiltering';

interface EnhancedConsumerProfilingProps {
  className?: string;
}

export const EnhancedConsumerProfiling: React.FC<EnhancedConsumerProfilingProps> = ({ 
  className = '' 
}) => {
  const { filters } = useEnhancedFiltering();
  
  return (
    <EnhancedScoutPanel 
      panelType="profiling"
      filters={filters}
      className={`${className} h-full`}
    />
  );
};

export default EnhancedConsumerProfiling;