'use client';
import React, { FC, useState } from 'react';
import CustomCheckbox from '@/components/common/custom-checkbox/custom-checkbox';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CoachProfileCard from './coach-profile-card';
import CoachingInfoHeader from '../../_components/coaching-info-header';
import { useRouter } from 'next/navigation';

interface Step1CoachingSelectionProps {
  isAutoMatch: boolean;
  setIsAutoMatch: (isAutoMatch: boolean) => void;
  onNext: (step: number) => void;
}

const Step1CoachingSelection: FC<Step1CoachingSelectionProps> = ({
  isAutoMatch,
  setIsAutoMatch,
  onNext,
}) => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const coaches = [
    {
      name: 'Poline Nader',
      role: 'Astrology + Life Coaching',
      availability: 'Mon, Wed, Fri',
      imageUrl: '/astrologist.png',
    },
    {
      name: 'Jane Doe',
      role: 'Numerology',
      availability: 'Tue, Thu',
      imageUrl: '/product-card-2.png',
    },

    {
      name: 'Poline Nader',
      role: 'Astrology + Life Coaching',
      availability: 'Mon, Wed, Fri',
      imageUrl: '/product-card-2.png',
    },
  ];

  const onPrev = () => {
    router.back();
  };

  return (
    <CoachingInfoHeader title="Coaching">
      <section className="w-full">
        <header className="mb-3">
          <h2 className="text-size-large md:text-size-heading font-semibold">
            Choose Your Coach
          </h2>
          <p className="text-sm">
            You need to select 1 coach for your reading.
          </p>
        </header>

        <div className="border flex flex-col gap-4 md:flex-row items-center justify-between border-gray-200 bg-grey-light-50 p-8">
          <div>
            <CustomCheckbox
              checked={isAutoMatch}
              onChange={setIsAutoMatch}
              label="Auto-Match Me With Available Coaches"
              labelClassNames="font-semibold text-size-secondary"
            />

            <p className="mt-2 text-sm leading-5 ml-7">
              Let our system automatically assign the best available coaches
              based on your reading type and preferred time slots.
            </p>
          </div>

          <button className="border-emerald-green cursor-pointer p-3 pb-2 uppercase text-white font-medium text-sm bg-emerald-green hover:bg-emerald-green/90 transition px-3">
            Recommended
          </button>
        </div>
        <div>
          <h3 className="font-semibold my-6 text-size-large md:text-size-heading">
            Or choose manually
          </h3>

          <div className={`flex flex-wrap justify-center gap-4 md:gap-[5rem] mx-auto mb-12 ${isAutoMatch ? 'opacity-50 pointer-events-none' : ''}`}>
            {coaches.map((coach, index) => (
              <CoachProfileCard
                key={index}
                {...coach}
                isChecked={selectedIndex === index}
                onSelect={() => !isAutoMatch && setSelectedIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <Button
            onClick={onPrev}
            variant={'outline'}
            className="border-black hover:bg-grey-light-50 md:max-w-[10rem] w-full px-2"
          >
            Back
          </Button>
          <Button
            onClick={() => onNext(2)}
            variant={'outline'}
            className="bg-emerald-green hover:bg-emerald-green/90 md:max-w-[10rem] w-full px-2 text-white"
          >
            Next
          </Button>
        </div>
      </section>
    </CoachingInfoHeader>
  );
};

export default Step1CoachingSelection;
