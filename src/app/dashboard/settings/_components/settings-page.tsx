'use client';
import React, { useState } from 'react';
import { Pencil, Lock, RefreshCw, LogOut, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '../../_components/confirmation-modal';

export default function SettingsPage() {
  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  return (
    <div>
      <h1 className="text-size-heading md:text-size-primary font-bold mb-5">
        Security
      </h1>
      <div className="space-y-4">
        <div
          className="flex items-center justify-between bg-[var(--bg)] text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => router.push('/dashboard/edit-profile')}
        >
          <h1 className="text-size-large md:text-size-heading font-semibold flex items-center gap-3 md:gap-5">
            <Pencil className="h-5 w-5 md:h-6 md:w-6" /> Edit Profile
          </h1>
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </div>

        <div
          className="flex items-center justify-between bg-[var(--bg)] text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
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
          className="flex items-center justify-between bg-[var(--bg)] text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
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
        <div
          className="flex items-center justify-between bg-[var(--bg)] text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => setIsModal(true)}
        >
          <h1 className="text-size-large md:text-size-heading font-semibold flex items-center gap-3 md:gap-5">
            <LogOut className="h-5 w-5 md:h-6 md:w-6" /> Logout
          </h1>
          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>

      <ConfirmationModal
        open={isModal}
        setOpen={setIsModal}
        title="Log Out"
        description="You will be signed out of your account. Unsaved changes may be lost."
        btn1Title="Log Out"
        btn2Title="Cancel"
        iconType="logout"
      />
    </div>
  );
}
