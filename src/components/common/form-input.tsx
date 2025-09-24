'use client';

import React, { useState } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import EyePasswordIcon from '../assets/svg-icons/auth/eye-password-icon';
import EyeOffPasswordIcon from '../assets/svg-icons/auth/eye-off-password-icon';

interface FormInputProps {
  name: string;
  type?: string;
  placeholder: string;
  className?: string;
  maxLength?: number;
  rules?: RegisterOptions;
  index?: number;
  onMoveToNext?: (nextIndex: number) => void;
  readOnly?: boolean;
  disabled?: boolean;
  leftText?: string;
  label?: string;
  labelClassName?: string;
  style?: React.CSSProperties;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  type = 'text',
  placeholder,
  className = '',
  maxLength,
  rules = {},
  index,
  onMoveToNext,
  readOnly,
  disabled,
  leftText,
  label,
  labelClassName = '',
  style,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordType = type === 'password';
  const inputType = isPasswordType
    ? showPassword
      ? 'text'
      : 'password'
    : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // register(name).onChange(e);

    if (value.length === maxLength && onMoveToNext && index !== undefined) {
      onMoveToNext(index + 1);
    }
  };

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

      <div className="relative">
        <Input
          {...register(name, rules)}
          id={name}
          type={inputType}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={handleChange}
          readOnly={readOnly}
          disabled={disabled}
          style={style}
          className={`!w-full border border-grey h-13 md:h-15 mt-2 pr-10 placeholder:text-grey ${className} ${
            readOnly || disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />

        {/* Right text (optional) */}
        {leftText && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none select-none">
            {leftText}
          </div>
        )}

        {/* Password toggle */}
        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 outline-none"
          >
            {showPassword ? (
              <EyePasswordIcon className="h-5 w-5 cursor-pointer" />
            ) : (
              <EyeOffPasswordIcon className="h-5 w-5 cursor-pointer" />
            )}
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
          </button>
        )}
      </div>

      {/* Validation error */}
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors?.[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default FormInput;