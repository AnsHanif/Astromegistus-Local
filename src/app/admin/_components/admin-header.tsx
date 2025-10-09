'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import { logo } from '@/components/assets';
import Cookies from 'js-cookie';
import ConfirmationModal from '@/app/dashboard/_components/confirmation-modal';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

export default function AdminHeader({ onMenuToggle, sidebarOpen }: AdminHeaderProps) {
  const [isModal, setIsModal] = useState(false);

  const handleConfirmLogout = () => {
    // Clear authentication tokens
    Cookies.remove('adminToken');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminInfo');
    // Redirect to login
    window.location.href = '/admin/login';
  };

  return (
    <>
      <header className="bg-emerald-green text-white px-3 sm:px-6 py-4 shadow-md border-b border-white/10 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 lg:hidden transition-colors duration-200"
              onClick={onMenuToggle}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 rotate-0 transition-transform duration-200" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-200" />
              )}
            </Button>

            <Image
              src={logo}
              alt="Astromegistus Admin"
              width={32}
              height={32}
              className="object-contain sm:w-10 sm:h-10"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold">Admin Panel</h1>
              <p className="text-xs sm:text-sm text-white/70">Astromegistus Management</p>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-lg font-bold">Admin</h1>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 flex items-center gap-1 sm:gap-2 px-2 sm:px-4"
              onClick={() => setIsModal(true)}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <ConfirmationModal
        open={isModal}
        onClose={() => setIsModal(false)}
        title="Log Out"
        description="You will be signed out of your account. Unsaved changes may be lost."
        btn1Title="Log Out"
        btn2Title="Cancel"
        iconType="logout"
        classNames="!bg-black text-white"
        onSubmit={handleConfirmLogout}
      />
    </>
  );
}
