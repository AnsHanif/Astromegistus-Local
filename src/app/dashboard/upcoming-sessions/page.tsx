import React from 'react';
import DashboardModeLayout from '../_components/dashboard-mode-layout';
import UpcomingSessionsPage from './_components/upcoming-sessions-page';

export default function UpcomingReadings() {
  return (
    <DashboardModeLayout>
      <UpcomingSessionsPage />
    </DashboardModeLayout>
  );
}
