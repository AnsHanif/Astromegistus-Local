import React, { FC, memo } from 'react';
import { Label } from '@/components/ui/label';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import {
  TIME_OF_BIRTH_HOURS,
  TIME_OF_BIRTH_MINUTES,
  TIME_OF_BIRTH_PERIOD,
} from './signup.constant';
import { useFormContext } from 'react-hook-form';

type TimeOfBirthProps = {
  name: string;
  hour: string;
  minute: string;
  timePeriod: string;
  className?: string;
  parentClassName?: string;
  selectClassNames?: string;
  onChange: (field: 'hour' | 'minute' | 'timePeriod', value: string) => void;
};

const TimeOfBirth: FC<TimeOfBirthProps> = ({
  name,
  hour,
  minute,
  timePeriod,
  onChange,
  className = '',
  parentClassName = '',
  selectClassNames = '',
}) => {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <div className={`flex flex-col items-start space-y-4 ${parentClassName}`}>
      {/* 1st */}
      <Label
        htmlFor="birth"
        className="text-size-tertiary sm:text-size-medium font-semibold"
      >
        Time of Birth
      </Label>
      <div
        className={`flex gap-2 w-full items-center justify-between ${selectClassNames}`}
      >
        <CustomSelect
          onSelect={(value) => onChange('hour', value)}
          options={TIME_OF_BIRTH_HOURS}
          // classNames={{}}
          variant="default"
          size="sm"
          showChevron={true}
          placeholder="Hour"
          selectedIcon={false}
          selectedValue={hour}
          className="w-full h-12 sm:h-15"
          triggerClassName={`h-12 w-full text-sm md:text-size-secondary sm:h-15 cursor-pointer bg-transparent border-grey ${className}`}
          contentClassName="w-full max-h-60 overflow-y-auto"
        />

        {/* 2nd */}
        <CustomSelect
          onSelect={(value) => onChange('minute', value)}
          options={TIME_OF_BIRTH_MINUTES}
          // classNames={{}}
          variant="default"
          size="sm"
          placeholder="Mint"
          showChevron={true}
          selectedValue={minute}
          className="w-full h-12 sm:h-15"
          triggerClassName={`h-12 w-full text-sm md:text-size-secondary sm:h-15 cursor-pointer bg-transparent border-grey ${className}`}
          contentClassName="w-full  max-h-60 overflow-y-auto"
        />

        {/* 3rd */}
        <CustomSelect
          onSelect={(value) => onChange('timePeriod', value)}
          options={TIME_OF_BIRTH_PERIOD}
          // classNames={{}}
          size="sm"
          variant="default"
          placeholder="Period"
          showChevron={true}
          selectedValue={timePeriod}
          className="w-full h-12 sm:h-15"
          triggerClassName={`h-12 w-full text-sm md:text-size-secondary sm:h-15 cursor-pointer bg-transparent border-grey ${className}`}
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
};

export default memo(TimeOfBirth);
