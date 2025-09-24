'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import MagicWandIcon from '@/components/assets/svg-icons/magic-wand-icon';
import SessionTypeIcon from '@/components/assets/svg-icons/session-type-icon';
import ClockIcon from '@/components/assets/svg-icons/clock-icon';

export default function ViewReadingPage() {
  const router = useRouter();

  return (
    <div className="py-10">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button 
          onClick={() => router.back()}
          className="hover:text-golden-glow transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-size-heading md:text-size-primary font-semibold">
            Reading Details
          </h1>
          <p className="text-size-tertiary font-normal">
            Automatically generated insights, charts, and narration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Panel - Astrologer Info */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg)] p-4 sm:p-6 text-white">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/astrologist.png"
                  alt="Pauline Nader"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-size-large font-semibold">Pauline Nader</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MagicWandIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-size-secondary font-normal">Booked Reading</span>
                </div>
                <span className="text-size-secondary font-normal text-white">Life Coaching</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SessionTypeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-size-secondary font-normal">Session Type</span>
                </div>
                <span className="text-size-secondary font-normal text-white">Live Session</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-size-secondary font-normal">Time</span>
                </div>
                <span className="text-size-secondary font-normal text-white">30 + 60 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Narration & Complete Reading */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Narration Section */}
          <div className="bg-[var(--bg)] p-4 sm:p-6 text-white">
            <h2 className="text-size-heading font-semibold mb-4">Narration & Transcript</h2>
            
            <div className="space-y-4 text-size-secondary font-normal leading-relaxed">
              <p>
                Lorem ipsum dolor sit amet consectetur. Et fermentum in tortor mattis. Vitae volutpat pharetra purus duis consequat 
                consequat faucibus faucibus. Sed lorem ridiculus faucibus nunc tortor tempor. Nunc molestie cursus euismod 
                aliquam. Purus mauris tellus eu integer. Eu ornare morbi sed aliquaet eleifend nulla nulla in. Massa felis in quam enim 
                tortor nulla nam laoreet in. Non venenatis volutpat commodo pellentesque placerat tristique proin lacus lacus. Eget 
                felis sed non faucibus id.
              </p>

              <p>
                Nisl integer bibendum ut dui tellus vitae molestisada dictum. Mauris ut morbi pharetra neque gravida enim 
                porttitor eu dolor dictum. Ut non eu quam nunc aliquaet urna facilisis purus.
              </p>

              <p>
                In sit lorem mattis sit nulla. Libero tempor nulla ac et euismod. Urna in ut tellus diam lorem mattis. Non sit egestas id 
                vel. In id ornare laoreet commodo risus id pulvinar ipsum. Odio fames lobortis amet feugiat blandit at etul. Sed id 
                morbi risus massa mauris massa ultricies. Mattis id ut ridiculus tellus.
              </p>

              <p>
                Lacus consequat amet maecenas orci. Auctor amet gravida faucibus ornare molestie fermentum. Aliquam morbi sociis 
                tortor interdum sit diam aliquaet a. Arcu metus laoreet nisl massa nulla.
              </p>

              <p>
                Odio fringilla ut morbi ipsum nullam felis. Arcu massa adipiscing est nam libero diam vel. Sit vitae vel justo vitae. Amet 
                in ultricies dignissim egestas sagittis aliquaet id purus. Sit faucibus dolor velit.
              </p>
            </div>

            <button className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark bg-clip-text text-transparent text-size-secondary font-semibold mt-6 transition-colors">
              Show Full Transcript
            </button>
          </div>

          {/* Complete Reading Section */}
          <div className="bg-[var(--bg)] p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-size-heading font-semibold mb-2">Complete Reading</h2>
                <p className="text-size-secondary font-normal">
                  Narration, charts, and data in one comprehensive file
                </p>
              </div>
              
              <Button className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3 font-semibold text-size-tertiary sm:text-size-secondary bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black">
                Download Reading
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}