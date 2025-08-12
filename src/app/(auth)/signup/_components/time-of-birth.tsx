import React, { FC, memo } from 'react';
import { Label } from '@/components/ui/label';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import {
  TIME_OF_BIRTH_HOURS,
  TIME_OF_BIRTH_MINUTES,
  TIME_OF_BIRTH_PERIOD,
} from './signup.constant';

type TimeOfBirthProps = {
  hour: string;
  minute: string;
  timePeriod: string;
  onChange: (field: 'hour' | 'minute' | 'timePeriod', value: string) => void;
};

const TimeOfBirth: FC<TimeOfBirthProps> = ({
  hour,
  minute,
  timePeriod,
  onChange,
}) => {
  return (
    <div className="flex flex-col items-start space-y-3">
      {/* 1st */}
      <Label
        htmlFor="birth"
        className="text-size-tertiary sm:text-size-medium font-semibold"
      >
        Time of Birth
      </Label>
      <div className="flex gap-2 w-full items-center justify-between">
        <CustomSelect
          onSelect={(value) => onChange('hour', value)}
          options={TIME_OF_BIRTH_HOURS}
          // classNames={{}}
          variant="default"
          size="sm"
          showChevron={false}
          placeholder="Hour"
          selectedIcon={false}
          selectedValue={hour}
          className="w-full h-12 sm:h-15"
          triggerClassName="h-12 w-full sm:h-15 cursor-pointer bg-transparent border-grey"
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
          showChevron={false}
          selectedValue={minute}
          className="w-full h-12 sm:h-15"
          triggerClassName="h-12 w-full sm:h-15 cursor-pointer bg-transparent border-grey"
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
          showChevron={false}
          selectedValue={timePeriod}
          className="w-full h-12 sm:h-15"
          triggerClassName="h-12 sm:h-15 w-full cursor-pointer bg-transparent  border-grey"
          contentClassName="w-full max-h-60 overflow-y-auto"
        />
      </div>
    </div>
  );
};

export default memo(TimeOfBirth);
