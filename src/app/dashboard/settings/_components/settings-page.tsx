'use client';
import React from 'react';
import { Pencil, Lock, RefreshCw, LogOut, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  return (
    <div>
      <h1 className="text-size-heading md:text-size-primary font-bold mb-5">
        Security
      </h1>
      <div className="space-y-4">
        <div
          className="flex items-center justify-between bg-[#3F3F3F] px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => router.push('/dashboard/edit-profile')}
        >
          <h1 className="text-size-large md:text-size-heading font-semibold flex items-center gap-3 md:gap-5">
            <Pencil className="h-5 w-5 md:h-6 md:w-6" /> Edit Profile
          </h1>
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </div>

        <div
          className="flex items-center justify-between bg-[#3F3F3F] px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => router.push('/dashboard/edit-password')}
        >
          <h1 className="text-size-large md:text-size-heading font-semibold flex items-center gap-3 md:gap-5">
            <Lock className="h-5 w-5 md:h-6 md:w-6" /> Edit Password
          </h1>
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>

      <h1 className="text-size-heading md:text-size-primary font-bold mt-6 mb-5">
        Subscription & Billing
      </h1>
      <div className="space-y-4">
        <div
          className="flex items-center justify-between bg-[#3F3F3F] px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => router.push('/dashboard/manage-subscription')}
        >
          <h1 className="text-size-large md:text-size-heading font-semibold flex items-center gap-3 md:gap-5">
            <RefreshCw className="h-5 w-5 md:h-6 md:w-6" /> Manage Subscription
          </h1>
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>

      <h1 className="text-size-heading md:text-size-primary font-bold mt-6 mb-5">
        Account Management
      </h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-[#3F3F3F] px-4 py-4 md:px-8 md:py-6 cursor-pointer">
          <h1 className="text-size-large md:text-size-heading font-semibold flex items-center gap-3 md:gap-5">
            <LogOut className="h-5 w-5 md:h-6 md:w-6" /> Logout
          </h1>
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>
    </div>
  );
}
