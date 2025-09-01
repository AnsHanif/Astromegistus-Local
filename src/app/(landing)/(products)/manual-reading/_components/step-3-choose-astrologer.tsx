import React, { FC, useState } from 'react';
import { ManualReading } from './manual-reading.interfaces';
import CustomCheckbox from '@/components/common/custom-checkbox/custom-checkbox';
import Image from 'next/image';
import AstrologerProfileCard from './astrologer-profile-card';
import { Button } from '@/components/ui/button';

interface Step3ChooseAstrologerProps {
  onPrev?: () => void;
  onNext: (choice: 'auto' | 'manual') => void;
}

const Step3ChooseAstrologer: FC<Step3ChooseAstrologerProps> = ({
  onNext,
  onPrev,
}) => {
  const [isAutoMatch, setIsAutoMatch] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const astrologers = [
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
      imageUrl: '/astrologist.jpg',
    },

    {
      name: 'Poline Nader',
      role: 'Astrology + Life Coaching',
      availability: 'Mon, Wed, Fri',
      imageUrl: '/product-card-2.png',
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
    {
      name: 'Jane Doe',
      role: 'Numerology',
      availability: 'Tue, Thu',
      imageUrl: '/product-card-2.png',
    },
    // add more here...
  ];

  return (
    <section className="w-full">
      <header className="mb-3">
        <h2 className="text-size-large md:text-size-heading font-semibold">
          Choose Your Astrologer
        </h2>
        <p className="text-sm">
          You need to select 1 astrologer for your reading.
        </p>
      </header>

      <div className="border flex flex-col gap-4 md:flex-row items-center justify-between border-gray-200 bg-grey-light-50 p-8">
        <div>
          <CustomCheckbox
            checked={isAutoMatch}
            onChange={setIsAutoMatch}
            label="Auto-Match Me With Available Astrologers"
            labelClassNames="font-semibold text-size-secondary"
          />

          <p className="mt-2 text-sm leading-5 ml-7">
            Let our system automatically assign the best available astrologers
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

        <div className="grid grid-cols-1 md:gap-x-12 md:gap-y-4 mb-12 place-items-center md:grid-cols-2">
          {astrologers.map((astro, index) => (
            <AstrologerProfileCard
              key={index}
              {...astro}
              isChecked={selectedIndex === index}
              onSelect={() => setSelectedIndex(index)}
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
          onClick={isAutoMatch ? () => onNext('auto') : () => onNext('manual')}
          variant={'outline'}
          className="bg-emerald-green hover:bg-emerald-green/90 md:max-w-[10rem] w-full px-2 text-white"
        >
          Next
        </Button>
      </div>
    </section>
  );
};

export default Step3ChooseAstrologer;
