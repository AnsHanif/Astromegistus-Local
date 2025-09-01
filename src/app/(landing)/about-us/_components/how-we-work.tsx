'use client';
import Image from 'next/image';
import {
  AboutHowWorkImg,
  Number1,
  Number2,
  Number3,
  Number4,
} from '@/components/assets';

export default function HowWeWork() {
  return (
    <div className="px-4 sm:px-12 py-12">
      <h1 className="text-size-heading md:text-size-primary text-center font-bold mb-12">
        How We Work
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
        <div className="flex">
          <div className="max-w-80 flex flex-col justify-end">
            <h1 className="text-size-heading md:text-size-primary font-bold">
              Book Your Reading
            </h1>
            <p className="text-size-tertiary font-normal">
              Choose the type of reading that suits you—natal, relationship,
              tarot, or coaching.
            </p>
          </div>
          <Image src={Number1} alt="Step 1" className="w-16 h-44" />
        </div>

        <div className="mx-auto">
          <div className="flex">
            <div className="max-w-86 flex flex-col justify-end">
              <h1 className="text-size-heading md:text-size-primary font-bold">
                Share Your Birth Data
              </h1>
              <p className="text-size-tertiary font-normal">
                Securely enter your birth details (if required) so we can
                prepare your personalized chart.
              </p>
            </div>
            <Image src={Number3} alt="Step 3" className="w-26 h-44" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center lg:-mt-5 lg:px-12">
        <Image
          src={AboutHowWorkImg}
          alt="Astrology Illustration"
          className="object-contain w-full h-full"
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-end lg:-mt-12 gap-8 lg:gap-0">
        <div className="flex mx-auto">
          <div className="max-w-86 flex flex-col justify-end">
            <h1 className="text-size-heading md:text-size-primary font-bold">
              Select Your Astrologer
            </h1>
            <p className="text-size-tertiary font-normal">
              Browse our vetted experts and pick the astrologer or coach you
              feel most connected with.
            </p>
          </div>
          <Image src={Number2} alt="Step 2" className="w-28 h-44" />
        </div>

        <div className="flex">
          <div className="max-w-92 flex flex-col justify-end">
            <h1 className="text-size-heading md:text-size-primary font-bold">
              Discuss with Astrologer
            </h1>
            <p className="text-size-tertiary font-normal">
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
