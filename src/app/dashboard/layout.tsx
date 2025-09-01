'use client';
import React, { FC, ReactNode, useState } from 'react';

type ThemeKey = 'guest' | 'classic' | 'premier';

const themeMap: Record<
  ThemeKey,
  { cssVars: Record<string, string>; rootClass?: string; id: string }
> = {
  classic: {
    id: 'classic',
    rootClass: 'bg-black text-white',
    cssVars: {
      '--bg': '#3F3F3F',
      '--bg-hover': '#555',
      '--tier-bg': 'linear-gradient(to right, #DAB612, #EED66C, #AB6A1C)',
      '--tier-text': '#000000',
      '--tier-b-r': '#DAB612',
      '--tier-b-l': '#AB6A1C',
      '--button-bg': '#093B1D',
      '--button-text': '#FFFFFF',
      '--modal-bg': '#212121',
    },
  },
  premier: {
    id: 'premier',
    rootClass: 'bg-emerald-green text-white',
    cssVars: {
      '--bg': '#000000',
      '--bg-hover': '#1A1A1A',
      '--tier-bg': 'linear-gradient(to right, #DAB612, #EED66C, #AB6A1C)',
      '--tier-text': '#000000',
      '--tier-b-r': '#DAB612',
      '--tier-b-l': '#AB6A1C',
      '--button-bg': 'linear-gradient(to right, #DAB612, #EED66C, #AB6A1C)',
      '--button-text': '#000000',
      '--modal-bg': '#093B1D',
    },
  },
  guest: {
    id: 'guest',
    rootClass: 'bg-white text-black',
    cssVars: {
      '--bg': '#093B1D',
      '--bg-hover': '#0F5C2E',
      '--tier-bg': '#093B1D',
      '--tier-text': '#FFFFFF',
      '--tier-b-r': '#093B1D',
      '--tier-b-l': '#093B1D',
      '--button-bg': '#093B1D',
      '--button-text': '#FFFFFF',
      '--modal-bg': '#FFFFFF',
    },
  },
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [userType] = useState<'classic' | 'premier' | 'guest'>('classic');

  const theme = themeMap[userType];
  const styleVars: React.CSSProperties = Object.fromEntries(
    Object.entries(theme.cssVars).map(([k, v]) => [k, v])
  ) as React.CSSProperties;

  return (
    <div
      id="dashboard-root"
      data-theme={theme.id}
      className={`${theme.rootClass}`}
      style={styleVars}
    >
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;
