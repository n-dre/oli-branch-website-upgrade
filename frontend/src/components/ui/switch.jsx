import React from "react";

const Switch = React.forwardRef(({ 
  className = "", 
  checked, 
  onCheckedChange, 
  defaultChecked = false, 
  disabled = false,
  id,
  name,
  ...props 
}, ref) => {
  const [isChecked, setIsChecked] = React.useState(defaultChecked);
  const actualChecked = checked !== undefined ? checked : isChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !actualChecked;
    if (checked === undefined) {
      setIsChecked(newValue);
    }
    if (onCheckedChange) {
      onCheckedChange(newValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={actualChecked}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
          ${actualChecked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'} 
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          ${className}
        `}
        ref={ref}
        id={id}
        {...props}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 
            transition duration-200 ease-in-out
            ${actualChecked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      {name && (
        <input
          type="hidden"
          name={name}
          value={actualChecked ? "on" : "off"}
        />
      )}
    </>
  );
});

Switch.displayName = "Switch";

export { Switch };