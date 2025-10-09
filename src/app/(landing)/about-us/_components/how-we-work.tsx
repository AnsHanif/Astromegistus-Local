'use client';
import Image from 'next/image';
import {
  Number1,
  Number2,
  Number3,
  Number4,
} from '@/components/assets';

export default function HowWeWork() {
  return (
    <div className="px-4 sm:px-12 py-12">
      <h2 className="text-5xl text-center font-bold mb-12">
        How We Work
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
        <div className="flex">
          <div className="max-w-80 flex flex-col justify-end">
            <h2 className="text-xl md:text-2xl font-bold">
              Book Your Reading
            </h2>
            <p className="text-base font-normal">
              Choose the type of reading that suits you—natal, relationship,
              tarot, or coaching.
            </p>
          </div>
          <Image src={Number1} alt="Step 1" className="w-16 h-44" />
        </div>

        <div className="mx-auto">
          <div className="flex">
            <div className="max-w-86 flex flex-col justify-end">
              <h2 className="text-xl md:text-2xl font-bold">
                Share Your Birth Data
              </h2>
              <p className="text-base font-normal">
                Securely enter your birth details (if required) so we can
                prepare your personalized chart.
              </p>
            </div>
            <Image src={Number3} alt="Step 3" className="w-26 h-44" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center lg:-mt-5 lg:px-12">
        <div className="w-full h-auto aspect-[1092/274] bg-contain bg-center bg-no-repeat bg-[url('/how-work-img.png')]" />
      </div>

      <div className="flex flex-col lg:flex-row justify-end lg:-mt-12 gap-8 lg:gap-0">
        <div className="flex mx-auto">
          <div className="max-w-86 flex flex-col justify-end">
            <h2 className="text-xl md:text-2xl font-bold">
              Select Your Astrologer
            </h2>
            <p className="text-base font-normal">
              Browse our vetted experts and pick the astrologer or coach you
              feel most connected with.
            </p>
          </div>
          <Image src={Number2} alt="Step 2" className="w-28 h-44" />
        </div>

        <div className="flex">
          <div className="max-w-92 flex flex-col justify-end">
            <h2 className="text-xl md:text-2xl font-bold">
              Discuss with Astrologer
            </h2>
            <p className="text-base font-normal">
              Have a live or chat-based discussion with your astrologer to ask
              questions and explore your results in depth.
            </p>
          </div>
          <Image src={Number4} alt="Step 4" className="w-26 h-44" />
        </div>
      </div>
    </div>
  );
}
