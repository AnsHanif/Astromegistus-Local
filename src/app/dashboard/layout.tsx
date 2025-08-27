import React, { FC, ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="bg-[#000000] text-white">
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;
