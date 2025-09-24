'use client';
import React from 'react';
import { ChevronLeft, Edit, Lock, LogOut, Settings, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();
  
  const handleBack = () => {
    router.push('/dashboard/astrologers/edit-profile');
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Add logout logic here
    // router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full max-w-lg mx-auto p-4 lg:p-8 pt-8 lg:pt-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <ChevronLeft 
            className="w-5 h-5 lg:w-6 lg:h-6 cursor-pointer hover:bg-gray-700 rounded p-1"
            onClick={handleBack}
          />
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Settings</h1>
            <p className="text-gray-400 text-xs lg:text-sm">Customize your experience and preferences</p>
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Security</h2>
          
          <div className="space-y-2">
            {/* Edit Profile */}
            <div 
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => router.push('/dashboard/astrologers/edit-profile')}
            >
              <div className="flex items-center gap-3">
                <Edit className="w-4 h-4 text-gray-400" />
                <span className="text-white text-sm">Edit Profile</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </div>

            {/* Edit Password */}
            <div 
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => router.push('/dashboard/astrologers/edit-password')}
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-white text-sm">Edit Password</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </div>
          </div>
        </div>

        {/* Subscription & Billing Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Subscription &</h2>
          
          <div className="space-y-2">
            {/* Manage Subscription */}
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-white text-sm">Manage Subscription</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </div>
          </div>
        </div>

        {/* Account Management Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Account Management</h2>
          
          <div className="space-y-2">
            {/* Logout */}
            <div 
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-gray-400" />
                <span className="text-white text-sm">Logout</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="space-y-3 mt-8">
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors"
          >
            Logout
          </button>

          {/* Cancel Button */}
          <button 
            onClick={handleBack}
            className="w-full bg-transparent border border-gray-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;