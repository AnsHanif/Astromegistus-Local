import React from 'react';
import DashboardModeLayout from '../_components/dashboard-mode-layout';
import BookedReadingsPage from './_components/booked-readings-page';

export default function BookedReadings() {
  return (
    <DashboardModeLayout>
      <BookedReadingsPage />
    </DashboardModeLayout>
  );
}
