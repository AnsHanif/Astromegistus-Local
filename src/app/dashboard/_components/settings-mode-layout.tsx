'use client';
import type { FC, ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SettingsModeLayoutProps {
  heading: string;
  subheading: string;
  children: ReactNode;
  classNames?: string;
}

const SettingsModeLayout: FC<SettingsModeLayoutProps> = ({
  heading,
  subheading,
  children,
  classNames = '',
}) => {
  const router = useRouter();
  return (
    <div
      className={`min-h-screen px-2 sm:px-8 py-8 flex flex-col ${classNames}`}
    >
      {/* Arrow + Heading in one row */}
      <div className="flex items-center mb-2 -ml-1 md:-ml-2">
        <ArrowLeft
          className="h-6 w-6 md:h-8 md:w-8 mr-2 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-size-large md:text-size-heading font-bold">
          {heading}
        </h1>
      </div>

      {/* Subheading */}
      <p className="text-sm">{subheading}</p>

      {/* Main content */}
      <div className="py-8">{children}</div>
    </div>
  );
};

export default SettingsModeLayout;
