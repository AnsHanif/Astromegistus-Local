'use client';
import { useEffect, useMemo, useState, type FC, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Plus } from 'lucide-react';
import DashboardTabs from './dashboard-tabs';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface DashboardModeLayoutProps {
  children: ReactNode;
}

const DashboardModeLayout: FC<DashboardModeLayoutProps> = ({ children }) => {
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.user.currentUser);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
    setIsLoading(false);
  }, []);

  const resolvedRole = useMemo(() => {
    if (userInfo) {
      if (userInfo.role === 'GUEST') return 'GUEST';

      if (userInfo.role === 'PAID') {
        if (
          Array.isArray(userInfo.subscriptions) &&
          userInfo.subscriptions.length > 0
        ) {
          const planName = userInfo.subscriptions[0]?.plan?.name;
          if (planName === 'CLASSIC') return 'CLASSIC';
          if (planName === 'PREMIER') return 'PREMIER';
        } else {
          if (userRole === 'CLASSIC') return 'CLASSIC';
          if (userRole === 'PREMIER') return 'PREMIER';
          return 'GUEST';
        }
      }
    } else {
      if (userRole === 'CLASSIC') return 'CLASSIC';
      if (userRole === 'PREMIER') return 'PREMIER';
      return 'GUEST';
    }
    return 'GUEST';
  }, [userInfo, userRole]);
  return (
    <div className="min-h-screen px-4 sm:px-8">
      <div className="flex justify-center mb-4 md:mb-0">
        <div className="relative tracking-widest px-10 py-1 rounded-b-3xl bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark shadow-card">
          <div
            className="absolute -left-6 top-0 w-0 h-0 border-t-transparent border-b-[14px] border-b-transparent
            border-r-[30px] border-r-[#DAB612]"
          />
          <div
            className="absolute -right-6 top-0 w-0 h-0 border-t-transparent border-b-[14px] border-b-transparent
            border-l-[30px] border-l-[#AB6A1C]"
          />

          <h1 className="text-black text-size-large md:text-size-heading font-semibold">
            {isLoading ? 'Loading..' : resolvedRole}
          </h1>
        </div>
      </div>

      <div className="relative flex justify-center md:justify-end items-center gap-5 mb-2 md:mb-0">
        <Button
          className="w-full max-w-44 md:max-w-60 flex items-center gap-2 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black px-2"
          onClick={() => router.push('/products')}
        >
          <Plus className="h-5 w-5" />
          Book Reading
        </Button>

        <Settings
          className="absolute right-[50px] md:relative md:right-auto h-6 w-6 transition-all duration-300 hover:rotate-90 cursor-pointer"
          onClick={() => router.push('/dashboard/settings')}
        />
      </div>

      <h1 className="text-size-heading md:text-size-primary font-bold mb-2">
        Welcome Back, {userInfo?.name ? userInfo.name : 'Loading...'}
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
