'use client';
import type { FC, ReactNode } from 'react';
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AstrologersDashboardTabs from './astrologers-dashboard-tabs';

interface AstrologersDashboardLayoutProps {
  name?: string;
  children: ReactNode;
}

const AstrologersDashboardLayout: FC<AstrologersDashboardLayoutProps> = ({
  name = 'Jhon',
  children,
}) => {
  const router = useRouter();
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-end items-center gap-5 mb-4">
        <Settings
          className="text-white h-5 w-5 md:h-6 md:w-6 transition-all duration-300 hover:rotate-90 cursor-pointer"
          onClick={() => router.push('/dashboard/astrologers/settings')}
        />
      </div>

      <div className="text-white mb-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl mb-2 font-bold">
          Welcome Back, {name}
        </h1>

        <p className="text-xs md:text-sm mb-4 font-normal">
          Manage your astrology readings and upcoming sessions
        </p>
      </div>

      <AstrologersDashboardTabs />

      {children}
    </div>
  );
};

export default AstrologersDashboardLayout;