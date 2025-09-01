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
    <div className="min-h-screen px-4 sm:px-8">
      <div className="flex justify-center mb-4 md:mb-0">
        <div
          className="relative tracking-widest px-10 py-1 rounded-b-3xl"
          style={{
            background: 'var(--tier-bg)',
            boxShadow:
              '0 0 3px 1px rgba(255,255,255,0.4), 0 0 6px 2px rgba(255,255,255,0.3)',
          }}
        >
          <div
            className="absolute -left-6 top-0 w-0 h-0 border-t-transparent border-b-[14px] border-b-transparent 
            border-r-[30px] border-r-[var(--tier-b-r)]"
          />
          <div
            className="absolute -right-6 top-0 w-0 h-0 border-t-transparent border-b-[14px] border-b-transparent 
            border-l-[30px] border-l-[var(--tier-b-l)]"
          />

          <h1 className="text-[var(--tier-text)] text-size-large md:text-size-heading font-semibold">
            CLASSIC
          </h1>
        </div>
      </div>

      <div className="flex justify-end items-center gap-5 mb-2 md:mb-0">
        <Button
          className="w-full max-w-60 flex items-center gap-2"
          style={{
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
          }}
        >
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
