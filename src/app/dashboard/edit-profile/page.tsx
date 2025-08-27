import React from 'react';
import SettingsModeLayout from '../_components/settings-mode-layout';
import EditProfilePage from './_components/edit-profile-page';

export default function EditProfile() {
  return (
    <SettingsModeLayout
      heading="Edit Profile"
      subheading="Customize your experience and preferences."
    >
      <EditProfilePage />
    </SettingsModeLayout>
  );
}
