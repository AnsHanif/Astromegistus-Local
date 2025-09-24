import Image from 'next/image';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import KeyFeaturesCard from '../products/flow/_components/key-features-card';

const LandingFeatures = () => {
  return (
    <section className="w-full flex flex-col items-center text-center px-4 sm:px-12 py-10">
      <h2 className="text-size-heading md:text-size-primary font-medium mb-6">
        Soul =&gt; life path =&gt; current situation =&gt; path forward
      </h2>

      <div className="relative w-fullw w-full h-[400px]">
        <Image
          src={'/product-features.png'}
          alt="Banner"
          fill
          priority
          className="object-contain md:object-cover object-center"
        />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-stretch md:justify-between 2xl:justify-around gap-4 md:gap-8 w-full py-6">
        <KeyFeaturesCard
          classNames="max-w-[500px] w-full py-8 px-12"
          features={[
            'Lorem ipsum dolor sit amet consectetur.',
            'Lorem ipsum dolor sit amet consectetur.',
            'Lorem ipsum dolor sit amet consectetur.',
            'Lorem ipsum dolor sit amet consectetur.',
            'Lorem ipsum dolor sit amet consectetur.',
            'Lorem ipsum dolor sit amet consectetur.',
            'Lorem ipsum dolor sit amet consectetur.',
          ]}
        />

        <div className="flex flex-col bg-grey-light-50 max-w-[500px] w-full p-6">
          <p className="self-end bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark px-3 py-1.5 text-xs font-semibold mb-4">
            Core / Integrative
          </p>

          <p className="text-justify text-sm mb-4">
            Full karmic-to-present arc incl. draconic, evolutionary, traditional
            + psychological charts, predictive cycles, fixed stars + 2 automated
            readings + 1 follow up live-session + 30 min coaching
          </p>

          <div className="flex items-center gap-2 text-sm mb-6">
            <Clock className="w-5 h-5" />
            <p className="mt-0.5">120 min + 60 min prep</p>
          </div>

          <div className="flex flex-col items-center justify-end h-full">
            <Button className="bg-transparent border border-golden-glow-dark text-golden-glow-dark max-w-[300px] w-full mb-0">
              Book Live Session
            </Button>
            <Button className="bg-transparent max-w-[300px] w-full mb-0">
              View Details
            </Button>
          </div>
        </div>
      </div>

      <p className="text-sm">
        For our entire product selection click the "readings" button!
      </p>

      <Button className="xs:max-w-[300px] w-full m-auto my-4 flex items-center justify-center gap-3">
        Readings
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </section>
  );
};

export default LandingFeatures;
