import React from 'react';
import { EnhancedScoutPanel } from '../enhanced/EnhancedScoutPanel';
import { useEnhancedFiltering } from '../../hooks/useEnhancedFiltering';

interface EnhancedProductMixSKUProps {
  className?: string;
}

export const EnhancedProductMixSKU: React.FC<EnhancedProductMixSKUProps> = ({ 
  className = '' 
}) => {
  const { filters } = useEnhancedFiltering();
  
  return (
    <EnhancedScoutPanel 
      panelType="products"
      filters={filters}
      className={`${className} h-full`}
    />
  );
};

export default EnhancedProductMixSKU;