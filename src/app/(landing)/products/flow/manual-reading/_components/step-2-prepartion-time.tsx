'use client';

import React, { FC, useState } from 'react';
import { ManualReading } from './manual-reading.interfaces';
import CustomCheckbox from '@/components/common/custom-checkbox/custom-checkbox';
import { Button } from '@/components/ui/button';
import { useBooking } from '../../_components/booking-context';

interface Step2PreparationTimeProps extends ManualReading {}

const Step2PreparationTime: FC<Step2PreparationTimeProps> = ({
  onNext,
  onPrev,
}) => {
  // Get booking context to store data and initialize state
  const { data: bookingData, updateData } = useBooking();

  const [isChecked, setIsChecked] = useState(
    bookingData.preparationTimeAgreed || false
  );
  const [validationError, setValidationError] = useState('');

  const handleNext = () => {
    if (!isChecked) {
      setValidationError(
        'You must agree to the preparation time terms to continue'
      );
      return;
    }

    // Store agreement in booking context
    updateData({ preparationTimeAgreed: true });

    setValidationError('');
    onNext?.();
  };

  return (
    <div>
      <h2 className="text-size-large md:text-size-heading font-semibold mb-2">
        Preparation Time Required
      </h2>
      <p className="mb-6 text-justify">
        Please review the following information before proceeding with your
        natal reading booking.
      </p>

      <h3 className="md:text-size-large font-semibold mb-2">
        Astrologer Preparation Time
      </h3>
      <p className="mb-2 text-justify">
        Our astrologer needs 20–30 minutes to prepare your personalized natal
        chart and review your birth details before the consultation. This
        ensures you receive the most accurate and insightful reading possible.
      </p>

      <ul className="list-disc list-inside space-y-2 mb-6 md:mb-8 px-2">
        <li>Chart customization and analysis</li>
        <li>Preparation of key talking points</li>
        <li>Review of your specific questions</li>
        <li>Customized reading materials</li>
      </ul>

      <CustomCheckbox
        checked={isChecked}
        onChange={(checked) => {
          setIsChecked(checked);
          if (checked) setValidationError('');
        }}
        className="mb-20 md:mb-48"
        labelClassNames="font-normal mt-1"
        label="I understand and  agree that my selected astrologer will need preparation time before our consultation. I will provide accurate birth information and any specific questions in advance."
      />

      {validationError && (
        <p className="text-red-500 text-sm mb-4">{validationError}</p>
      )}

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <Button
          onClick={onPrev}
          variant={'outline'}
          className="border-black hover:bg-grey-light-50 md:max-w-[10rem] w-full px-2"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          variant={'outline'}
          className="bg-emerald-green hover:bg-emerald-green/90 md:max-w-[10rem] w-full px-2 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step2PreparationTime;
