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
      {tabs.map((tab, index) => {
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
                  : 'bg-emerald-green text-white hover:bg-emerald-green/90'
              }
              ${
                index < tabs.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-white/20' : ''
              }`}
          >
            <Icon className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-sm md:text-size-secondary">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
