'use client';
import type { FC, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Plus } from 'lucide-react';
import DashboardTabs from './dashboard-tabs';
import { useRouter } from 'next/navigation';

interface DashboardModeLayoutProps {
  children: ReactNode;
}

const DashboardModeLayout: FC<DashboardModeLayoutProps> = ({ children }) => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-8">
      <div className="flex justify-center mb-4 md:mb-0">
        <div
          className="relative bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] tracking-widest px-10 py-1 rounded-b-3xl 
          shadow-[0_2px_6px_rgba(218,182,18,0.35),0_2px_8px_rgba(171,106,28,0.35)]"
        >
          <div
            className="absolute -left-6 top-0 w-0 h-0 border-t-transparent border-b-[14px] border-b-transparent 
            border-r-[30px] border-r-[#DAB612]"
          />
          <div
            className="absolute -right-6 top-0 w-0 h-0 border-t-transparent border-b-[14px] border-b-transparent 
            border-l-[30px] border-l-[#AB6A1C]"
          />

          <h1 className="text-black text-size-large md:text-size-heading font-semibold">
            CLASSIC
          </h1>
        </div>
      </div>

      <div className="flex justify-end items-center gap-5 mb-2 md:mb-0">
        <Button className="bg-emerald-green text-white w-full max-w-60 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Book Reading
        </Button>

        <Settings
          className="h-6 w-6 transition-all duration-300 hover:rotate-90 cursor-pointer"
          onClick={() => router.push('/dashboard/settings')}
        />
      </div>

      <h1 className="text-size-heading md:text-size-primary font-bold mb-2">
        Welcome Back, Jhon
      </h1>

      <p className="text-sm font-normal mb-4">
        Manage your astrology readings and upcoming sessions
      </p>

      <DashboardTabs />

      {children}
    </div>
  );
};

export default DashboardModeLayout;
