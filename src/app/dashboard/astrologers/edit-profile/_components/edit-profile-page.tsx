'use client';
import React, { useState, useEffect, useLayoutEffect, Suspense } from 'react';
import { ChevronLeft, Edit } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EditProfileForm from './edit-profile-form';
import EditServicesIcon from '@/components/assets/svg-icons/edit-services-icon';
import { useGetUserProfile } from '@/hooks/query/profile-queries';
import FullScreenLoader from '@/components/common/full-screen-loader';
import { useGetProfileImageUrl } from '@/hooks/mutation/image-mutations';

// Category constants
const ASTROLOGY_CATEGORIES = [
  { label: 'Chart Reading', value: 'CHART_READING' },
  { label: 'Live Reading', value: 'LIVE_READING' },
  { label: 'Astrology Course', value: 'ASTROLOGY_COURSE' },
  { label: 'Consultation', value: 'CONSULTATION' },
  { label: 'Core Integrative', value: 'CORE_INTEGRATIVE' },
  { label: 'Natal Reading', value: 'NATAL_READING' },
  { label: 'Predictive', value: 'PREDICTIVE' },
  { label: 'Career', value: 'CAREER' },
  { label: 'Horary', value: 'HORARY' },
  { label: 'Synastry', value: 'SYNASTRY' },
  { label: 'Astrocartography', value: 'ASTROCARTOGRAPHY' },
  { label: 'Electional', value: 'ELECTIONAL' },
  { label: 'Solar Return', value: 'SOLAR_RETURN' },
  { label: 'Draconic Natal Overlay', value: 'DRACONIC_NATAL_OVERLAY' },
  { label: 'Natal', value: 'NATAL' },
  { label: 'Other', value: 'OTHER' },
];

const COACHING_CATEGORIES = [
  { label: 'Life Coaches', value: 'LIFE_COACHES' },
  { label: 'Career Coaches', value: 'CAREER_COACHES' },
  { label: 'Relationship Coaches', value: 'RELATIONSHIP_COACHES' },
];

const EditProfileContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<'main' | 'editProfile'>(
    'main'
  );

  // Check URL parameter to set initial view
  useLayoutEffect(() => {
    const view = searchParams.get('view');
    if (view === 'editProfile') {
      setCurrentView('editProfile');
    }
  }, [searchParams]);
  const { data: profileData, isLoading } = useGetUserProfile();
  const getProfileImageUrlMutation = useGetProfileImageUrl();
  const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(
    null
  );

  const userProfile = profileData?.data?.data;

  // Get categories based on user role
  const getUserCategories = () => {
    if (userProfile?.role === 'ASTROMEGISTUS') {
      return (userProfile.astrologyCategories || []).map((value: string) => {
        const category = ASTROLOGY_CATEGORIES.find((cat) => cat.value === value);
        return category ? category.label : value;
      });
    } else if (userProfile?.role === 'ASTROMEGISTUS_COACH') {
      return (userProfile.coachingCategories || []).map((value: string) => {
        const category = COACHING_CATEGORIES.find((cat) => cat.value === value);
        return category ? category.label : value;
      });
    }
    return [];
  };

  const categories = getUserCategories();

  // Load profile image when user profile is available
  useEffect(() => {
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
        <div className="flex items-center gap-3 mb-6 lg:mb-8 justify-start">
          <ChevronLeft
            onClick={() => router.push('/dashboard/astrologers/settings')}
            className="w-6 h-6 cursor-pointer hover:bg-gray-700 rounded p-1"
          />
          <div className="text-left">
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
                {userProfile?.role === 'ASTROMEGISTUS' ||
                userProfile?.role === 'ASTROMEGISTUS_COACH'
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

        {/* Services Section (Categories) */}
        <div>
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="text-lg lg:text-xl font-semibold text-white px-4 py-2">
              Services ({categories.length})
            </h3>
          </div>

          <div className="space-y-3 lg:space-y-4">
            {categories.length > 0 ? (
              <div className="bg-graphite py-6 px-4 sm:px-8 text-white shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="bg-emerald-green px-4 py-3 rounded-sm text-sm flex items-center justify-center text-white font-medium"
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-graphite py-12 px-4 sm:px-8 text-white shadow-lg">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <EditServicesIcon width="48" height="48" color="#D4AF37" />
                  </div>
                  <h4 className="font-semibold text-base lg:text-lg mb-2">
                    No Services Added Yet
                  </h4>
                  <p className="text-xs lg:text-sm text-gray-400 font-normal mb-4">
                    Start by adding your first service to showcase your expertise
                  </p>
                  <button
                    className="bg-gradient-to-r from-golden-glow via-pink-shade to-bronze text-black px-4 lg:px-6 py-2 rounded-none text-xs lg:text-sm font-semibold hover:opacity-90 transition-all duration-300 flex items-center gap-2 mx-auto"
                    onClick={() => setCurrentView('editProfile')}
                  >
                    <EditServicesIcon width="16" height="16" color="black" />
                    Add Your First Service
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProfilePage = () => {
  return (
    <Suspense fallback={<FullScreenLoader loading={true} />}>
      <EditProfileContent />
    </Suspense>
  );
};

export default EditProfilePage;
