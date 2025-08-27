'use client';
import type { FC, ReactNode } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SettingsModeLayoutProps {
  heading: string;
  subheading: string;
  children: ReactNode;
}

const SettingsModeLayout: FC<SettingsModeLayoutProps> = ({
  heading,
  subheading,
  children,
}) => {
  const router = useRouter();
  return (
    <div className="min-h-screen px-4 sm:px-8 py-8 flex flex-col md:flex-row">
      <div className="px-0 md:px-2">
        <ArrowLeft
          className="h-6 w-6 md:h-8 md:w-8 my-2 cursor-pointer"
          onClick={() => router.back()}
        />
      </div>

      <div className="flex-1">
        <h1 className="text-size-heading md:text-size-primary font-bold">
          {heading}
        </h1>
        <p className="text-sm">{subheading}</p>

        <div className="py-8">{children}</div>
      </div>

      <div className="px-2 hidden md:block">
        <Settings className="h-6 w-6" />
      </div>
    </div>
  );
};

export default SettingsModeLayout;
