import React, { FC, useState } from 'react';
import moment from 'moment';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import { Button } from '@/components/ui/button';
import CustomCalendar from '@/components/common/custom-calendar/custom-calendar';
import { TIME_SLOTS, TIME_ZONES } from './manual-coaching.constant';
import CoachingInfoHeader from '../../_components/coaching-info-header';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Step2SetCoachTimeProps {
  onNext: (step: number) => void;
  onPrev: (step: number) => void;
}

const Step2SetCoachTime: FC<Step2SetCoachTimeProps> = ({ onNext, onPrev }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [value, onChange] = useState<Value>(new Date());
  const [timezone, setTimezone] = useState('Pacific Time (UTC -8)');

  return (
    <CoachingInfoHeader title="Coaching Sessions">
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
          {/* Left Side - Calendar (dummy for now) */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Pick A Time</h2>
            <div className="w-full flex items-center justify-center">
              <CustomCalendar
                value={value}
                onChange={onChange}
                className={'text-sm md:text-size-secondary'}
              />
            </div>
          </div>

          {/* Right Side - Time Slots + Timezone */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Available Time Slots For{' '}
              {value ? moment(value.toString()).format('MMMM Do, YYYY') : ''}
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {TIME_SLOTS.map((slot) => (
                <Button
                  variant={'outline'}
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`px-4 py-2 border cursor-pointer h-12 md:h-15 text-sm ${
                    selectedTime === slot
                      ? 'bg-green-800 text-white border-green-800'
                      : 'border-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {slot}
                </Button>
              ))}
            </div>

            {/* Timezone Dropdown */}
            <div>
              <label className="block mb-2 md:text-size-medium font-semibold">
                Timezone
              </label>
              <CustomSelect
                //   onSelect={(value) => onChange('timePeriod', value)}
                onSelect={setTimezone}
                options={TIME_ZONES}
                // classNames={{}}
                size="sm"
                variant="default"
                placeholder="Period"
                selectedValue={timezone}
                className="w-full h-12 sm:h-15"
                triggerClassName={`h-12 w-full text-size-secondary sm:h-15 cursor-pointer bg-transparent border-grey focus:border-black hover:border-black`}
                contentClassName="w-full max-h-60 overflow-y-auto"
                chevronClassName="text-black"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row self-start gap-4 md:gap-8">
            <Button
              onClick={() => onPrev(1)}
              variant={'outline'}
              className="border-black hover:bg-grey-light-50 md:max-w-[10rem] w-full px-2"
            >
              Back
            </Button>
            <Button
              onClick={() => onNext(3)}
              variant={'outline'}
              className="bg-emerald-green hover:bg-emerald-green/90 border-emerald-green md:max-w-[10rem] w-full px-2 text-white"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </CoachingInfoHeader>
  );
};

export default Step2SetCoachTime;
