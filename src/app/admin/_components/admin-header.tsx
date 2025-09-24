'use client';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Bell } from 'lucide-react';
import { logo } from '@/components/assets';
import Cookies from 'js-cookie';

export default function AdminHeader() {
  return (
    <header className="bg-emerald-green text-white px-6 py-4 shadow-md border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={logo}
            alt="Astromegistus Admin"
            width={40}
            height={40}
            className="object-contain"
          />
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-sm text-white/70">Astromegistus Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 flex items-center gap-2"
            onClick={() => {
              // Clear authentication tokens
              Cookies.remove('adminToken');
              sessionStorage.removeItem('isAdmin');
              sessionStorage.removeItem('adminInfo');
              // Redirect to login
              window.location.href = '/admin/login';
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
