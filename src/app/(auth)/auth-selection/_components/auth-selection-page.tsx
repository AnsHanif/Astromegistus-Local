import React from 'react';
import GradientLockIcon from '@/components/assets/svg-icons/auth/gradient-lock-icon';
import { UserRound } from 'lucide-react';
import Link from '@/components/common/custom-link/custom-link';

export default function AuthSelectionPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-8 md:space-y-12 text-center">
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
        <Link
          href="/guest"
          className="!flex flex-col items-center justify-center bg-white/5 border border-white hover:border-white/50 transition-all max-w-[395px] w-full px-4 py-10 md:py-20 cursor-pointer"
        >
          <UserRound className="w-12 h-12" color="#fff" />
          <h2 className="text-size-heading md:text-size-primary font-bold">
            Continue As Guest
          </h2>
          <p className="text-size-tertiary font-medium text-white mt-2">
            Enter directly to explore.
          </p>
        </Link>

        {/* Sign Up */}

        <Link
          href="/signup"
          className="!flex flex-col items-center justify-center bg-gradient-to-r from-[#DAB612]/10 via-[#EED66C]/10 to-[#AB6A1C]/10 border border-yellow-500/50 hover:border-yellow-500 transition-all max-w-[395px] w-full py-10 px-4 md:py-20 cursor-pointer"
        >
          <GradientLockIcon />
          <h2 className="text-size-heading mx-auto md:text-size-primary font-bold text-yellow-400">
            Sign Up
          </h2>
          <p className="text-size-tertiary font-medium text-white mt-2">
            Create an account for better experience.
          </p>
        </Link>
      </div>
    </div>
  );
}
