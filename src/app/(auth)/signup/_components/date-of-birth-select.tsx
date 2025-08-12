import { Label } from '@/components/ui/label';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import { DATE_OPTIONS, MONTH_OPTIONS, YEAR_OPTIONS } from './signup.constant';
import React, { memo } from 'react';

type DateOfBirthProps = {
  day: string;
  month: string;
  year: string;
  onChange: (field: 'day' | 'month' | 'year', value: string) => void;
};

function DateOfBirthSelect({ day, month, year, onChange }: DateOfBirthProps) {
  return (
    <div className="flex flex-col items-start space-y-3">
      <Label className="text-size-tertiary sm:text-size-medium font-semibold">
        Date of Birth
      </Label>
      <div className="flex gap-2 w-full items-center justify-between">
        <CustomSelect
          onSelect={(value) => onChange('day', value)}
          options={DATE_OPTIONS}
          placeholder="Day"
          selectedValue={day}
          className="w-full h-12 sm:h-15"
          triggerClassName="h-12 w-full sm:h-15 cursor-pointer bg-transparent border-grey"
          contentClassName="w-full max-h-60 overflow-y-auto"
        />
        <CustomSelect
          onSelect={(value) => onChange('month', value)}
          options={MONTH_OPTIONS}
          placeholder="Month"
          selectedValue={month}
          className="w-full h-12 sm:h-15"
          triggerClassName="h-12 w-full sm:h-15 cursor-pointer bg-transparent border-grey"
          contentClassName="w-full max-h-60 overflow-y-auto"
        />
        <CustomSelect
          onSelect={(value) => onChange('year', value)}
          options={YEAR_OPTIONS}
          placeholder="Year"
          selectedValue={year}
          className="w-full h-12 sm:h-15"
          triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent  border-grey"
          contentClassName="w-full max-h-60 overflow-y-auto"
        />
      </div>
    </div>
  );
}

export default memo(DateOfBirthSelect);
