'use client';
import React from 'react';
import GradientLockIcon from '@/components/assets/svg-icons/auth/gradient-lock-icon';
import { UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthSelectionPage() {
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-8 md:space-y-12 text-center">
      {/* Title */}
      <div>
        <h1 className="text-size-heading md:text-size-primary font-bold">
          How Would You Like To Continue?
        </h1>
        <p className="text-gray-300 mt-2">
          Choose your mode of access to explore astrology and insights.
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col items-center md:flex-row gap-6 md:gap-8 w-full justify-center">
        {/* Continue as Guest */}
        <div
          className="!flex flex-col items-center justify-center bg-white/5 border border-white hover:border-white/50 transition-all max-w-[395px] w-full px-4 py-10 md:py-20 cursor-pointer"
          onClick={() => {
            sessionStorage.setItem('signup-type', 'guest');
            router.push('/signup');
          }}
        >
          <UserRound className="w-12 h-12" color="#fff" />
          <h2 className="text-size-heading md:text-size-primary font-bold">
            Continue As Guest
          </h2>
          <p className="text-size-tertiary font-medium text-white mt-2">
            Enter directly to explore.
          </p>
        </div>

        {/* Sign Up */}

        <div
          className="!flex flex-col items-center justify-center bg-gradient-to-r from-[#DAB612]/10 via-[#EED66C]/10 to-[#AB6A1C]/10 border border-yellow-500/50 hover:border-yellow-500 transition-all max-w-[395px] w-full py-10 px-4 md:py-20 cursor-pointer"
          onClick={() => {
            sessionStorage.setItem('signup-type', 'normal');
            router.push('/signup');
          }}
        >
          <GradientLockIcon />
          <h2 className="text-size-heading mx-auto md:text-size-primary font-bold text-yellow-400">
            Sign Up
          </h2>
          <p className="text-size-tertiary font-medium text-white mt-2">
            Create an account for better experience.
          </p>
        </div>
      </div>
    </div>
  );
}
