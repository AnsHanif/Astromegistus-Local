import React from 'react';
import DashboardModeLayout from '../_components/dashboard-mode-layout';
import PastReadingsPage from './_components/past-readings-page';

export default function PastReadings() {
  return (
    <DashboardModeLayout>
      <PastReadingsPage />
    </DashboardModeLayout>
  );
}
