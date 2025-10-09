'use client';

import Image from 'next/image';
import { AboutHeroBG } from '@/components/assets';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function AboutUsHero() {
  const router = useRouter();
  return (
    <section className="px-4 sm:px-12 py-12">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
        <div className="max-w-[800px] space-y-8 text-center lg:text-left">
          <h1 className="text-size-heading-2xl font-bold leading-tight">
            <span>✨ Modern Astrology. <br /> Real Guidance.</span>
          </h1>
          <p className="text-base font-semibold">
            At Astromegistus, We Combine The Timeless Wisdom Of The Stars With
            Modern Insight And Technology To Help You Understand Yourself, Your
            Relationships, And Your Path Forward.
          </p>
          <div className="flex justify-center lg:justify-start">
            <Button
              variant="default"
              className="bg-emerald-green text-white mt-2 md:mt-7 min-w-44 md:min-w-60 flex items-center justify-center gap-3"
              onClick={() => router.push('/products')}
            >
              Get Started
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </div>
        </div>

        <div className="flex-shrink-0 w-full max-w-[320px] md:max-w-[400px]">
          <Image
            src={AboutHeroBG}
            alt="Astrology Illustration"
            width={400}
            height={500}
            className="object-contain w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
