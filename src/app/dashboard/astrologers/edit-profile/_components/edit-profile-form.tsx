'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, Edit2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import FormInput from '@/components/common/form-input';
import { FormProvider, useForm } from 'react-hook-form';
import { useUpdateAstrologerProfile, useUpdateProfileImage, useUpdateTimezone, useUpdateCategories } from '@/hooks/mutation/profile-mutation/profile';
import FullScreenLoader from '@/components/common/full-screen-loader';
import { UpdateAstrologerProfile, UserProfile } from '@/hooks/mutation/profile-mutation/profile-service.type';
import { useUploadProfileImage, useGetProfileImageUrl } from '@/hooks/mutation/image-mutations';
import { validateImageFile } from '@/services/api/s3-image-api';
import { TIMEZONES } from '@/constants/timezones';
import { CustomSelect } from '@/components/common/custom-select/custom-select';

// Category constants from backend
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

// Multi-select component for categories
interface MultiSelectProps {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MultiSelect = ({
  options,
  selectedValues,
  onChange,
  placeholder,
  className,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if all categories are selected
  const isAllSelected =
    selectedValues.length === options.length &&
    options.every((option) => selectedValues.includes(option.value));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleAll = () => {
    if (isAllSelected) {
      // If all selected, deselect all
      onChange([]);
    } else {
      // Select all categories
      onChange(options.map((option) => option.value));
    }
  };

  const handleToggleOption = (value: string) => {
    if (isAllSelected) {
      // If "All" is currently selected, clicking any individual option should deselect all and select only that option
      onChange([value]);
    } else {
      const newSelection = selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value];
      onChange(newSelection);
    }
  };

  const selectedLabels = isAllSelected
    ? 'All Categories'
    : selectedValues
        .map((value) => options.find((option) => option.value === value)?.label)
        .filter(Boolean)
        .join(', ');

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`w-full bg-transparent border border-gray-600 text-white placeholder:text-white/50 focus:border-golden-glow rounded-md px-3 py-2.5 text-left flex items-center justify-between min-h-[40px] hover:border-gray-500 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={selectedValues.length ? 'text-white' : 'text-white/50'}
        >
          {selectedLabels || placeholder || 'Select options...'}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* All option */}
          <div
            className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
            onClick={handleToggleAll}
          >
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() => {}} // Controlled by parent onClick
              className="mr-2 w-4 h-4 text-golden-glow bg-transparent border-gray-600 rounded focus:ring-golden-glow focus:ring-2"
            />
            <label className="text-white text-sm cursor-pointer flex-1 font-medium">
              All Categories
            </label>
          </div>

          {/* Individual options */}
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer ${isAllSelected ? 'opacity-60' : ''}`}
              onClick={() => handleToggleOption(option.value)}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => {}} // Controlled by parent onClick
                disabled={isAllSelected}
                className="mr-2 w-4 h-4 text-golden-glow bg-transparent border-gray-600 rounded focus:ring-golden-glow focus:ring-2 disabled:opacity-60"
              />
              <label
                className={`text-white text-sm cursor-pointer flex-1 ${isAllSelected ? 'cursor-default' : ''}`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


interface EditProfileFormProps {
  onBack: () => void;
  userProfile?: UserProfile;
}

const EditProfileForm = ({ onBack, userProfile }: EditProfileFormProps) => {
  const updateAstrologerProfileMutation = useUpdateAstrologerProfile();
  const uploadProfileImageMutation = useUploadProfileImage();
  const getProfileImageUrlMutation = useGetProfileImageUrl();
  const updateProfileImageMutation = useUpdateProfileImage();
  const updateTimezoneMutation = useUpdateTimezone();
  const updateCategoriesMutation = useUpdateCategories();
  const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [currentImageKey, setCurrentImageKey] = React.useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = React.useState<string>(userProfile?.timeZone || 'America/New_York');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const methods = useForm<UpdateAstrologerProfile>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: userProfile?.name || '',
      email: userProfile?.email || ''
    }
  });

  // Update form when userProfile changes
  useEffect(() => {
    if (userProfile) {
      methods.reset({
        name: userProfile.name || '',
        email: userProfile.email || ''
      });

      // Set timezone
      if (userProfile.timeZone) {
        setSelectedTimezone(userProfile.timeZone);
      }

      // Set categories based on role
      if (userProfile.role === 'ASTROMEGISTUS' && userProfile.astrologyCategories) {
        setSelectedCategories(userProfile.astrologyCategories);
      } else if (userProfile.role === 'ASTROMEGISTUS_COACH' && userProfile.coachingCategories) {
        setSelectedCategories(userProfile.coachingCategories);
      }

      // Load profile image if available
      if (userProfile.profilePic) {
        setCurrentImageKey(userProfile.profilePic);
        loadProfileImage(userProfile.profilePic);
      }
    }
  }, [userProfile, methods]);

  const loadProfileImage = async (imageKey: string) => {
    try {
      setIsImageLoading(true);
      const response = await getProfileImageUrlMutation.mutateAsync(imageKey);
      setProfileImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Failed to load profile image:', error);
      setProfileImageUrl(null);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file, 5); // 5MB limit
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    try {
      setIsImageLoading(true);

      // Step 1: Upload image to S3 and get imageKey
      const uploadResponse = await uploadProfileImageMutation.mutateAsync(file);
      const imageKey = uploadResponse.data.imageKey;

      // Step 2: Save imageKey to database immediately (like admin panel)
      await updateProfileImageMutation.mutateAsync(imageKey);

      // Step 3: Store the new image key locally
      setCurrentImageKey(imageKey);

      // Step 4: Load the uploaded image URL for display
      const urlResponse = await getProfileImageUrlMutation.mutateAsync(imageKey);
      setProfileImageUrl(urlResponse.data.imageUrl);

      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleTimezoneChange = (newTimezone: string) => {
    setSelectedTimezone(newTimezone);
    updateTimezoneMutation.mutate(newTimezone);
  };

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);

    // Update categories based on role
    const updateData = userProfile?.role === 'ASTROMEGISTUS'
      ? { astrologyCategories: categories }
      : { coachingCategories: categories };

    updateCategoriesMutation.mutate(updateData);
  };

  const onSubmit = async (data: UpdateAstrologerProfile) => {
    try {
      // Profile image is now saved immediately after upload, so just update name/email
      await updateAstrologerProfileMutation.mutateAsync(data);
      onBack();
    } catch {
      // Error handling is done in the mutation hook
    }
  };

  return (
    <>
      <FullScreenLoader loading={updateAstrologerProfileMutation.isPending} />
      <FormProvider {...methods}>
      <div className="min-h-screen bg-black text-white">
        {/* Header - Left positioned */}
        <div className="w-full p-4 lg:p-8 pt-8 lg:pt-12">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <ChevronLeft
              className="w-5 h-5 lg:w-6 lg:h-6 cursor-pointer hover:bg-gray-700 rounded p-1"
              onClick={onBack}
            />
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">Edit Profile</h1>
              <p className="text-gray-400 text-xs lg:text-sm">Customize your experience and preferences</p>
            </div>
          </div>
        </div>

        {/* Content - Centered */}
        <div className="w-full max-w-2xl mx-auto px-4 lg:px-8">
          {/* Profile Avatar Section */}
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="relative">
              <div 
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-xl lg:text-2xl font-bold text-black bg-gradient-to-br from-golden-glow via-pink-shade to-golden-glow-dark cursor-pointer overflow-hidden"
                onClick={handleImageClick}
              >
                {isImageLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                ) : profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(userProfile?.name || 'User')
                )}
              </div>
              <div 
                className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-7 lg:h-7 bg-black rounded-full flex items-center justify-center border-2 border-gray-600 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={handleImageClick}
              >
                <Edit2 className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Form Fields */}
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  rules={{
                    required: 'Full name is required',
                    validate: (value) =>
                      value.trim().length >= 3 ||
                      'Full name must be at least 3 characters long.',
                    maxLength: {
                      value: 100,
                      message: 'Full name must be at most 100 characters long.',
                    },
                  }}
                  className="focus:ring-golden-glow"
                  labelClassName="font-semibold"
                />

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Select email"
                  className="w-full focus:ring-golden-glow !opacity-100 !cursor-default"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                    maxLength: {
                      value: 254,
                      message: 'Email must be at most 254 characters long.',
                    },
                  }}
                  labelClassName="font-semibold"
                  readOnly={true}
                />
              </div>

              {/* Timezone Field */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm lg:text-base font-semibold">
                  Timezone
                </Label>
                <CustomSelect
                  onSelect={handleTimezoneChange}
                  options={TIMEZONES.map((tz) => ({
                    label: tz.label,
                    value: tz.value,
                  }))}
                  size="md"
                  variant="default"
                  placeholder="Select timezone"
                  selectedValue={selectedTimezone}
                  className="w-full"
                  triggerClassName="h-12 w-full text-sm cursor-pointer bg-transparent text-white border-gray-600 focus:border-golden-glow hover:border-gray-500"
                  contentClassName="w-full max-h-60 overflow-y-auto bg-gray-800 text-white"
                  itemClassName="text-white hover:bg-gray-700 cursor-pointer"
                  chevronClassName="text-gray-400"
                />
              </div>

              {/* Categories Section */}
              {userProfile?.role === 'ASTROMEGISTUS' && (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm lg:text-base font-semibold">
                    Astrology Services
                  </Label>
                  <MultiSelect
                    options={ASTROLOGY_CATEGORIES}
                    selectedValues={selectedCategories}
                    onChange={handleCategoriesChange}
                    placeholder="Select astrology categories..."
                  />
                </div>
              )}

              {userProfile?.role === 'ASTROMEGISTUS_COACH' && (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm lg:text-base font-semibold">
                    Coaching Services
                  </Label>
                  <MultiSelect
                    options={COACHING_CATEGORIES}
                    selectedValues={selectedCategories}
                    onChange={handleCategoriesChange}
                    placeholder="Select coaching categories..."
                  />
                </div>
              )}
            </div>

            <div className="flex justify-start">
              <Button
                type="submit"
                disabled={updateAstrologerProfileMutation.isPending}
                className="md:w-56 w-full text-black mt-4 md:mt-8 hover:opacity-90 font-semibold bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark disabled:opacity-50"
              >
                {updateAstrologerProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
    </>
  );
};

export default EditProfileForm;