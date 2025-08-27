import React from 'react';
import SettingsModeLayout from '../_components/settings-mode-layout';
import EditPasswordPage from './_components/edit-password-page';

export default function EditPassword() {
  return (
    <SettingsModeLayout
      heading="Edit Password"
      subheading="Customize your experience and preferences."
    >
      <EditPasswordPage />
    </SettingsModeLayout>
  );
}
