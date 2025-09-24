'use client';

import React from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import { Label } from '../ui/label';

interface FormTextareaProps {
  name: string;
  placeholder: string;
  className?: string;
  maxLength?: number;
  rules?: RegisterOptions;
  readOnly?: boolean;
  disabled?: boolean;
  label?: string;
  labelClassName?: string;
  rows?: number;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  placeholder,
  className = '',
  maxLength,
  rules = {},
  readOnly,
  disabled,
  label,
  labelClassName = '',
  rows = 4,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 w-full">
      {label && (
        <Label
          htmlFor={name}
          className={`block text-size-secondary md:text-size-medium font-semibold ${labelClassName}`}
        >
          {label}
        </Label>
      )}

      <textarea
        {...register(name, rules)}
        id={name}
        placeholder={placeholder}
        maxLength={maxLength}
        readOnly={readOnly}
        disabled={disabled}
        rows={rows}
        className={`!w-full border border-grey mt-2 placeholder:text-grey px-5 py-3 resize-none ${className} ${
          readOnly || disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />

      {/* Validation error */}
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors?.[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default FormTextarea;
