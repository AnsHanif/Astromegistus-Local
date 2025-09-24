import React from 'react';
import AstrologerSettingsPage from './_components/astrologer-settings-page';
import SettingsModeLayout from '../../_components/settings-mode-layout';

const AstrologerSettings = () => {
  return (
    <SettingsModeLayout
      heading="Settings"
      subheading="Customize your experience and preferences."
      classNames="text-white"
    >
      <AstrologerSettingsPage />
    </SettingsModeLayout>
  );
};

export default AstrologerSettings;
