'use client';
import React from 'react';
import AstrologerSettingsPage from './_components/astrologer-settings-page';
import SettingsModeLayout from '../../_components/settings-mode-layout';
import { useRouter } from 'next/navigation';

const AstrologerSettings = () => {
  const router = useRouter();
  const onBack = () => router.push('/dashboard/astrologers');
  return (
    <SettingsModeLayout
      heading="Settings"
      subheading="Customize your experience and preferences."
      classNames="text-white"
      onBack={onBack}
    >
      <AstrologerSettingsPage />
    </SettingsModeLayout>
  );
};

export default AstrologerSettings;
