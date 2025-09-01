'use client';
import React from 'react';

interface CustomCheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  labelClassNames?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label = '',
  checked,
  onChange,
  id,
  className = '',
  labelClassNames = '',
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex items-center space-x-2 cursor-pointer select-none ${className}`}
    >
      {/* Hidden default checkbox */}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />

      {/* Custom checkbox */}
      <div
        className={`max-w-5 h-5 w-full border-2 flex items-center justify-center 
        transition-colors duration-200 
        ${
          checked
            ? 'bg-emerald-green border-emerald-green'
            : 'border-grey bg-white'
        }`}
      >
        {checked && (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Label text */}
      {label && (
        <span className={`text-sm font-medium ${labelClassNames}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default CustomCheckbox;
