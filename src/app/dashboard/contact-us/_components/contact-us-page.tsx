'use client';
import React from 'react';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ContactUsPage() {
  const router = useRouter();

  return (
    <div className="mt-14 relative">
      {/* Contact Cards Container */}
      <div className="flex max-w-4xl mx-auto overflow-hidden items-center">
        {/* Left Column - Icons */}
        <div className="bg-golden-glow w-32 md:w-40 flex flex-col h-[526px]">
          {/* Phone Icon Section */}
          <div className="flex-1 flex items-center justify-center">
            <Phone className="h-8 w-8 md:h-10 md:w-10 text-black" />
          </div>

          {/* Email Icon Section */}
          <div className="flex-1 flex items-center justify-center">
            <Mail className="h-8 w-8 md:h-10 md:w-10 text-black" />
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="!bg-[var(--bg)] flex-1 flex flex-col h-[497px]">
          {/* Phone Content Section */}
          <div className="flex-1 px-8 flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
              Phone:
            </h2>
            <p className="text-gray-200 text-lg">Will be provided at launch</p>
          </div>

          {/* Email Content Section */}
          <div className="flex-1 px-8 flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
              Email:
            </h2>
            <p className="text-gray-200 text-lg underline">
              info@astromegistus.com
            </p>
          </div>
        </div>
      </div>

      {/* Decorative squares */}
      <div className="absolute -top-6 right-8 md:right-90">
        <div className="relative">
          <div className="w-18 h-18 md:w-20 md:h-20 border-2 border-golden-glow"></div>
          <div className="w-18 h-18 md:w-20 md:h-20 border-2 border-golden-glow absolute top-13 left-6 rotate-90"></div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsPage;
