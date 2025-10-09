'use client';
import React, { FC, ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminHeader from './_components/admin-header';
import AdminSidebar from './_components/admin-sidebar';
import AdminAuthGuard from './_components/admin-auth-guard';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't apply auth guard to login page
  const isAuthPage = pathname === '/admin/login';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen w-full bg-black text-white">
        <AdminHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="flex w-full">
          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 w-full min-w-0 p-3 sm:p-6 transition-all duration-300">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminLayout;
