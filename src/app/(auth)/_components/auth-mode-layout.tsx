'use client';

import React, { FC, ReactNode } from 'react';
import PrimaryImage from '@/components/common/primary-image/primary-image';
import Header from './header';
import AuthTabs from './auth-tabs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { logo } from '@/components/assets';

interface AuthModeLayoutProps {
  children: ReactNode;
}

const AuthModeLayout: FC<AuthModeLayoutProps> = ({ children }) => {
  const router = useRouter();
  return (
    <div className="text-white min-h-screen h-full bg-gradient-to-b from-black to-emerald-green relative">
      <Header />

      <div className="h-24 w-24 md:w-32 md:h-32 mx-auto absolute left-0 right-0 top-[100px] z-[1]">
        <Image
          src={logo}
          alt="Astromegistus Logo"
          width={128}
          height={128}
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => router.push('/')}
        />
      </div>

      {/* Background Image */}
      <PrimaryImage
        width={1920}
        height={400}
        alt="Star Background"
        src="/test-stars.png"
        className="object-contain w-full h-full absolute inset-0"
      />

      {/* Centered White Box */}
      <div className="w-full p-4 h-full flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xs backdrop-saturate-150 w-full p-4 min-h-[800px] h-full mt-[200px] md:mt-[250px] border-4 border-white/10">
          <AuthTabs />
          {/* mt-[-200px] sm:mt-[-350px] md:mt-[-500px] lg:mt-[-700px] xl:mt-[-770px] 2xl:mt-[-1500px] */}
          {/* You can place your content here */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthModeLayout;
