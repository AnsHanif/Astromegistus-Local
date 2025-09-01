'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, FileText, Sparkles } from 'lucide-react';

export default function DashboardTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      label: 'Booked Readings',
      href: '/dashboard/booked-readings',
      icon: Sparkles,
    },
    {
      label: 'Upcoming Sessions',
      href: '/dashboard/upcoming-sessions',
      icon: Calendar,
    },
    {
      label: 'Past Readings',
      href: '/dashboard/past-readings',
      icon: FileText,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row w-full">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`h-12 lg:h-15 flex items-center justify-center gap-2 sm:gap-3 font-semibold w-full transition-colors
              ${
                isActive
                  ? 'bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] text-black'
                  : 'bg-[var(--bg)] text-white hover:bg-[var(--bg-hover)]'
              }`}
          >
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-lg md:text-size-heading">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
