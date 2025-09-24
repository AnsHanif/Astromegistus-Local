'use client';
import React, { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AdminHeader from './_components/admin-header';
import AdminSidebar from './_components/admin-sidebar';
import AdminAuthGuard from './_components/admin-auth-guard';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Don't apply auth guard to login page
  const isAuthPage = pathname === '/admin/login';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-black text-white">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminLayout;
