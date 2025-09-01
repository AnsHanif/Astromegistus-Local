import { Label } from '@/components/ui/label';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import { DATE_OPTIONS, MONTH_OPTIONS, YEAR_OPTIONS } from './signup.constant';
import React, { memo } from 'react';
import { useFormContext } from 'react-hook-form';

type DateOfBirthProps = {
  name: string;
  day: string;
  month: string;
  year: string;
  className?: string;
  selectClassNames?: string;
  onChange: (field: 'day' | 'month' | 'year', value: string) => void;
};

function DateOfBirthSelect({
  name,
  day,
  month,
  year,
  onChange,
  className = '',
  selectClassNames = '',
}: DateOfBirthProps) {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <div className="flex flex-col items-start space-y-4">
      <Label className="text-size-tertiary sm:text-size-medium font-semibold">
        Date of Birth
      </Label>
      <div
        className={`flex gap-2 w-full items-center justify-between ${selectClassNames}`}
      >
        <CustomSelect
          onSelect={(value) => onChange('day', value)}
          options={DATE_OPTIONS}
          placeholder="Day"
          selectedValue={day}
          className="w-full h-12 sm:h-15"
          triggerClassName={`h-12 w-full sm:h-15 cursor-pointer bg-transparent border-grey ${className}`}
          contentClassName="w-full max-h-60 overflow-y-auto"
        />
        <CustomSelect
          onSelect={(value) => onChange('month', value)}
          options={MONTH_OPTIONS}
          placeholder="Month"
          selectedValue={month}
          className="w-full h-12 sm:h-15"
          triggerClassName={`h-12 w-full sm:h-15 cursor-pointer bg-transparent border-grey ${className}`}
          contentClassName="w-full max-h-60 overflow-y-auto"
        />
        <CustomSelect
          onSelect={(value) => onChange('year', value)}
          options={YEAR_OPTIONS}
          placeholder="Year"
          selectedValue={year}
          className="w-full h-12 sm:h-15"
          triggerClassName={`h-12 w-full sm:h-15 cursor-pointer bg-transparent border-grey ${className}`}
          contentClassName="w-full max-h-60 overflow-y-auto"
        />
      </div>

      {errors?.[name] && (
        <p className="text-red-500 text-sm">
          {errors?.[name]?.message as string}
        </p>
      )}
    </div>
  );
}

export default memo(DateOfBirthSelect);
