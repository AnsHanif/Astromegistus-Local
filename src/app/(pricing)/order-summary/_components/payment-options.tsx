'use client';

import React from 'react';
import { PaymentOption } from './order-summary.types';

interface PaymentOptionCardProps {
  option: PaymentOption;
  selected: boolean;
  onSelect: () => void;
  classNames?: string;
  disabled?: boolean;
}

const PaymentOptionCard = ({
  option,
  selected,
  onSelect,
  classNames = '',
  disabled = false,
}: PaymentOptionCardProps) => {
  return (
    <div
      onClick={disabled ? undefined : onSelect}
      className={`p-4 w-full border bg-grey-light-50 flex items-center gap-3 transition-all
      ${selected ? 'border-bronze text-bronze' : 'border-[#D9D9D9] text-black'}
      ${
        disabled
          ? 'opacity-50 cursor-not-allowed pointer-events-none'
          : 'cursor-pointer'
      }
      ${classNames}`}
    >
      <p
        className={`transition-colors ${
          selected ? 'text-bronze' : 'text-black'
        }`}
      >
        {option.icon}
      </p>
      <h3 className="text-size-secondary font-medium md:text-size-large">
        {option.label}
      </h3>
    </div>
  );
};

export default PaymentOptionCard;
