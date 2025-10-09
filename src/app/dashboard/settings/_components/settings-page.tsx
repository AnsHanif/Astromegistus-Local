'use client';
import React, { useState } from 'react';
import {
  Pencil,
  Lock,
  RefreshCw,
  LogOut,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '../../_components/confirmation-modal';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { clearCurrentUser } from '@/store/slices/user-slice';
import { useQueryClient } from '@tanstack/react-query';

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isModal, setIsModal] = useState(false);

  const handleConfirmLogout = () => {
    Cookies.remove('astro-tk');
    Cookies.remove('temp-nutk-astro');
    localStorage.removeItem('role');
    localStorage.removeItem('cart');
    localStorage.removeItem('final-cart');
    dispatch(clearCurrentUser());
    queryClient.clear();
    window.location.href = '/';
  };

  return (
    <div>
      <h1 className="text-size-large md:text-size-heading font-bold mb-5">
        Security
      </h1>
      <div className="space-y-4">
        <div
          className="flex items-center justify-between bg-[var(--bg)] text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => router.push('/dashboard/edit-profile')}
        >
          <h1 className="text-size-medium md:text-size-large font-semibold flex items-center gap-2 md:gap-3">
            <Pencil className="h-4 w-4 md:h-5 md:w-5" /> Edit Profile
          </h1>
          <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
        </div>

        <div
          className="flex items-center justify-between bg-[var(--bg)] text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => router.push('/dashboard/edit-password')}
        >
          <h1 className="text-size-medium md:text-size-large font-semibold flex items-center gap-2 md:gap-3">
            <Lock className="h-4 w-4 md:h-5 md:w-5" /> Edit Password
          </h1>
          <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
        </div>
      </div>

      <h1 className="text-size-large md:text-size-heading font-bold mt-6 mb-5">
        Subscription & Billing
      </h1>
      <div className="space-y-4">
        <div
          className="flex items-center justify-between bg-[var(--bg)] text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => router.push('/dashboard/manage-subscription')}
        >
          <h1 className="text-size-medium md:text-size-large font-semibold flex items-center gap-2 md:gap-3">
            <RefreshCw className="h-4 w-4 md:h-5 md:w-5" /> Manage Subscription
          </h1>
          <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
        </div>
      </div>

      <h1 className="text-size-large md:text-size-heading font-bold mt-6 mb-5">
        Customer Support
      </h1>
      <div className="space-y-4">
        <div
          className="flex items-center justify-between bg-[var(--bg)] text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => router.push('/dashboard/contact-us')}
        >
          <h1 className="text-size-medium md:text-size-large font-semibold flex items-center gap-2 md:gap-3">
            <MessageCircle className="h-4 w-4 md:h-5 md:w-5" /> Contact Us
          </h1>
          <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
        </div>
      </div>

      <h1 className="text-size-large md:text-size-heading font-bold mt-6 mb-5">
        Account Management
      </h1>
      <div className="space-y-4">
        <div
          className="flex items-center justify-between bg-[var(--bg)] text-white px-4 py-4 md:px-8 md:py-6 cursor-pointer"
          onClick={() => setIsModal(true)}
        >
          <h1 className="text-size-medium md:text-size-large font-semibold flex items-center gap-2 md:gap-3">
            <LogOut className="h-4 w-4 md:h-5 md:w-5" /> Logout
          </h1>
          <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
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
        classNames="!bg-[#212121] text-white"
        onSubmit={handleConfirmLogout}
      />
    </div>
  );
}
