import React from 'react';
import SettingsModeLayout from '../_components/settings-mode-layout';
import ManageSubscriptionPage from './_components/manage-subscription-page';

export default function ManageSubscription() {
  return (
    <SettingsModeLayout
      heading="Manage Your Subscription"
      subheading="Choose a plan that suits your needs and upgrade anytime."
    >
      <ManageSubscriptionPage />
    </SettingsModeLayout>
  );
}
