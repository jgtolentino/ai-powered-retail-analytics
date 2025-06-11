import React from 'react';
import { EnhancedScoutPanel } from '../enhanced/EnhancedScoutPanel';
import { useEnhancedFiltering } from '../../hooks/useEnhancedFiltering';

interface EnhancedConsumerBehaviorProps {
  className?: string;
}

export const EnhancedConsumerBehavior: React.FC<EnhancedConsumerBehaviorProps> = ({ 
  className = '' 
}) => {
  const { filters } = useEnhancedFiltering();
  
  return (
    <EnhancedScoutPanel 
      panelType="behavior"
      filters={filters}
      className={`${className} h-full`}
    />
  );
};

export default EnhancedConsumerBehavior;