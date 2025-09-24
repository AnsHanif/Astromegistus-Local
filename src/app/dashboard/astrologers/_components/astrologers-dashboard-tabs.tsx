'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, FileText, Sparkles } from 'lucide-react';
interface Tab {
  label: string;
  href: string;
  icon: any;
}

interface AstrologersDashboardTabsProps {
  classNames?: string;
}

export default function AstrologersDashboardTabs({
  classNames,
}: AstrologersDashboardTabsProps) {
  const pathname = usePathname();

  const tabs: Tab[] = [
    {
      label: 'Booking Management',
      href: '/dashboard/astrologers/booking-management',
      icon: Sparkles,
    },
    {
      label: 'Availability Calendar',
      href: '/dashboard/astrologers/availability-calendar',
      icon: Calendar,
    },
    {
      label: 'Past Sessions',
      href: '/dashboard/astrologers/past-sessions',
      icon: FileText,
    },
  ];

  return (
    <div
      className={`flex flex-col lg:flex-row w-full gap-2 mb-4 md:mb-6 px-2 md:px-0 ${classNames}`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href || (pathname === '/dashboard/astrologers' && tab.href === '/dashboard/astrologers/booking-management');

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`h-12 md:h-16 flex items-center justify-center gap-2 md:gap-3 w-full transition-colors font-semibold
              ${
                isActive
                  ? 'text-black bg-gradient-to-r from-golden-glow via-pink-shade to-bronze'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
          >
            <Icon className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-sm md:text-base text-center">
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.label === 'Booking Management' ? 'Bookings' : 
                 tab.label === 'Availability Calendar' ? 'Calendar' : 
                 'Sessions'}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}