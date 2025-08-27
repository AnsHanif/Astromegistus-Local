import React from 'react';
import SettingsPage from './_components/settings-page';
import SettingsModeLayout from '../_components/settings-mode-layout';

export default function Settings() {
  return (
    <SettingsModeLayout
      heading="Settings"
      subheading="Customize your experience and preferences."
    >
      <SettingsPage />
    </SettingsModeLayout>
  );
}
