import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef(({ 
  className, 
  checked, 
  onCheckedChange,
  disabled,
  ...props 
}, ref) => {
  const handleChange = (e) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-primary shadow",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked && "bg-primary",
          className
        )}
        {...props}
      />
      {checked && (
        <Check className="absolute left-0.5 top-0.5 h-3 w-3 text-primary-foreground pointer-events-none" />
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };