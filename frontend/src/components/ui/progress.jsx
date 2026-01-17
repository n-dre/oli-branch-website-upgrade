import React from 'react';

export const Progress = ({ value = 0, className = '', indicatorClassName = '' }) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className={`h-full rounded-full transition-all duration-300 ease-in-out ${indicatorClassName || 'bg-blue-600'}`}
        style={{ width: `${clampedValue}%` }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default Progress;