'use client';

import React, { useState } from 'react';
import ConfirmationModal from '@/app/dashboard/_components/confirmation-modal';
import Link from '@/components/common/custom-link/custom-link';
import { ArrowRight, Lock, LogOut, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AstrologerSettingsPage() {
  const [isModal, setIsModal] = useState(false);
  const router = useRouter();

  const handleConfirmLogout = () => {
    Cookies.remove('temp-tk-astro');
    router.push('/login');
  };

  return (
    <div className="text-white">
      <h1 className="text-size-heading md:text-size-primary font-bold mb-5">
        Security
      </h1>
      <div className="space-y-4 w-full">
        <Link
          href="/dashboard/astrologers/edit-profile"
          className="flex w-full items-center justify-between bg-graphite text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
        >
          <h1 className="text-size-large md:text-size-heading font-semibold flex items-center gap-3 md:gap-5">
            <Pencil className="h-5 w-5 md:h-6 md:w-6" /> Edit Profile
          </h1>
          <div>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </Link>

        <Link
          href="/dashboard/astrologers/edit-password"
          className="flex w-full items-center justify-between bg-graphite text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
        >
          <h1 className="text-size-large md:text-size-heading font-semibold flex items-center gap-3 md:gap-5">
            <Lock className="h-5 w-5 md:h-6 md:w-6" /> Edit Password
          </h1>

          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
      </div>

      <h1 className="text-size-heading md:text-size-primary font-bold mt-6 mb-5">
        Account Management
      </h1>
      <div className="space-y-4">
        <div
          className="flex items-center justify-between bg-graphite text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => setIsModal(true)}
        >
          <h1 className="text-size-large md:text-size-heading font-semibold flex items-center gap-3 md:gap-5">
            <LogOut className="h-5 w-5 md:h-6 md:w-6" /> Logout
          </h1>
          <div>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>
      </div>

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
    </div>
  );
}
