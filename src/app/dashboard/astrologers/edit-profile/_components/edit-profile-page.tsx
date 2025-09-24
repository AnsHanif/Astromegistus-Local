'use client';
import React, { useState } from 'react';
import { ChevronLeft, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EditProfileForm from './edit-profile-form';
import EditServicesIcon from '@/components/assets/svg-icons/edit-services-icon';
import { useGetUserProfile } from '@/hooks/query/profile-queries';
import FullScreenLoader from '@/components/common/full-screen-loader';
import { useGetProfileImageUrl } from '@/hooks/mutation/image-mutations';

const EditProfilePage = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'main' | 'editProfile'>(
    'main'
  );
  const { data: profileData, isLoading } = useGetUserProfile();
  const getProfileImageUrlMutation = useGetProfileImageUrl();
  const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(null);

  const userProfile = profileData?.data?.data;

  // Load profile image when user profile is available
  React.useEffect(() => {
    if (userProfile?.profilePic) {
      loadProfileImage(userProfile.profilePic);
    }
  }, [userProfile?.profilePic]);

  const loadProfileImage = async (imageKey: string) => {
    try {
      const response = await getProfileImageUrlMutation.mutateAsync(imageKey);
      setProfileImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Failed to load profile image:', error);
      setProfileImageUrl(null);
    }
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const onBack = () => {
    setCurrentView('main');
  };

  if (currentView === 'editProfile') {
    return <EditProfileForm onBack={onBack} userProfile={userProfile} />;
  }

  if (isLoading) {
    return <FullScreenLoader loading={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-semibold">
      <div className="w-full p-4 lg:p-8 pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <ChevronLeft onClick={() => router.back()} className="w-6 h-6 cursor-pointer hover:bg-gray-700 rounded p-1" />
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Edit Profile</h1>
            <p className="text-gray-400 text-xs lg:text-sm">
              Customize your experience and preferences
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-golden-glow via-pink-shade to-bronze rounded-none p-4 lg:p-6 mb-6 lg:mb-8 relative">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-xl lg:text-2xl font-bold text-black bg-gradient-to-r from-golden-glow via-pink-shade to-bronze overflow-hidden">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(userProfile?.name || 'Unknown User')
              )}
            </div>
            <div className="text-black">
              <h2 className="text-lg lg:text-xl font-bold">
                {userProfile?.name || 'Unknown User'}
              </h2>
              <p className="text-xs lg:text-sm font-semibold">
                {userProfile?.role === 'ASTROLOGER'
                  ? 'Professional Astrologer'
                  : userProfile?.role || 'User'}
                {userProfile?.astrologerType &&
                  ` • ${userProfile.astrologerType}`}
              </p>
              <p className="text-xs mt-1 hidden sm:block font-medium">
                {userProfile?.email}
              </p>
            </div>
          </div>
          <Edit
            className="absolute top-4 right-4 lg:top-6 lg:right-6 w-5 h-5 lg:w-6 lg:h-6 text-black cursor-pointer hover:bg-black/10 rounded p-1"
            onClick={() => setCurrentView('editProfile')}
          />
        </div>

        {/* Services Section */}
        <div>
          <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-white px-4 py-2">
            Services
          </h3>

          <div className="space-y-3 lg:space-y-4">
            {/* Service 1 */}
            <div className="flex items-center justify-between bg-graphite py-6 px-4 sm:px-8 text-white shadow-lg gap-4">
              <div className="flex items-center gap-3 lg:gap-4 flex-1">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm lg:text-base">
                    Tarot Reading
                  </h4>
                  <p className="text-xs lg:text-sm text-gray-400 font-normal">
                    Comprehensive tarot card reading with detailed insights
                  </p>
                  <div className="flex flex-col md:flex-row md:items-center items-start gap-2 lg:gap-4 mt-1 lg:mt-2">
                    <span className="text-xs bg-transparent px-2 py-1 rounded font-normal">
                      ⏱️ 45 mins
                    </span>
                    <span className="text-xs bg-transparent px-2 py-1 rounded font-normal">
                      $ 75
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 w-full sm:w-auto">
                <button
                  className="bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black px-3 lg:px-4 py-2 rounded-none text-xs lg:text-sm font-semibold hover:opacity-90 transition-all duration-300 flex-1 sm:flex-none flex items-center gap-2"
                  onClick={() =>
                    router.push('/dashboard/astrologers/edit-services')
                  }
                >
                  <EditServicesIcon width="16" height="16" color="black" />
                  Edit Services
                </button>
              </div>
            </div>

            {/* Service 2 */}
            <div className="flex items-center justify-between bg-graphite py-6 px-4 sm:px-8 text-white shadow-lg gap-4">
              <div className="flex items-center gap-3 lg:gap-4 flex-1">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm lg:text-base">
                    Tarot Reading
                  </h4>
                  <p className="text-xs lg:text-sm text-gray-400 font-normal">
                    Comprehensive tarot card reading with detailed insights
                  </p>
                  <div className="flex flex-col md:flex-row md:items-center items-start gap-2 lg:gap-4 mt-1 lg:mt-2">
                    <span className="text-xs bg-transparent px-2 py-1 rounded font-normal">
                      ⏱️ 45 mins
                    </span>
                    <span className="text-xs bg-transparent px-2 py-1 rounded font-normal">
                      $ 75
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 w-full sm:w-auto">
                <button
                  className="bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black px-3 lg:px-4 py-2 rounded-none text-xs lg:text-sm font-semibold hover:opacity-90 transition-all duration-300 flex-1 sm:flex-none flex items-center gap-2"
                  onClick={() =>
                    router.push('/dashboard/astrologers/edit-services')
                  }
                >
                  <EditServicesIcon width="16" height="16" color="black" />
                  Edit Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
