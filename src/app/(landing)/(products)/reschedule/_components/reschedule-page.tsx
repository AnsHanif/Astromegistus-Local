'use client';

import React, { useState } from 'react';
import ProductInfoHeader from '../../_components/product-info-header';
import RescheduleCard from './reshedule-card';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import {
  TIME_SLOTS,
  TIME_ZONES,
} from '../../manual-reading/_components/manual-reading.constant';
import CustomCalendar from '@/components/common/custom-calendar/custom-calendar';
import moment from 'moment';
import ConfirmResheduleModal from './confirm-reschedule-modal';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const ReschedulePage = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [value, onChange] = useState<Value>(new Date());
  const [timezone, setTimezone] = useState('Pacific Time (UTC -8)');
  const [isConfirmReschedule, setIsConfirmReschedule] = useState(false);

  return (
    <ProductInfoHeader title="Rescheduling">
      <div className="flex flex-col gap-6 md:gap-8">
        <RescheduleCard
          title="Current Scheduling"
          name="Dennis Kris"
          avatar="/astrologist-2.jpg" // put image inside /public
          sessionType="Astrology + Life Coaching"
          date="Mon 22 Sept, 2025"
          time="5:00 PM (60 minutes)"
          fee="$120"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
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
                  onSelect={setTimezone}
                  options={TIME_ZONES}
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
          </div>
        </div>

        <RescheduleCard
          title="Scheduling"
          name="Dennis Kris"
          avatar="/astrologist-2.jpg" // put image inside /public
          date="Mon 22 Sept, 2025"
          time="5:00 PM (60 minutes)"
        />

        <Button
          onClick={() => setIsConfirmReschedule(true)}
          className="bg-emerald-green hover:bg-emerald-green/90 text-white max-w-[20rem] w-full mx-auto"
        >
          Confirm Resheduling
        </Button>
      </div>

      <ConfirmResheduleModal
        isOpen={isConfirmReschedule}
        onClose={() => setIsConfirmReschedule(false)}
        name="Dennish"
        newDate="Mon 24 Sept, 2025"
      />
    </ProductInfoHeader>
  );
};

export default ReschedulePage;
