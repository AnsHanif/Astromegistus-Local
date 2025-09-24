'use client';
import React, { useEffect } from 'react';
import { ChevronLeft, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import FormInput from '@/components/common/form-input';
import { FormProvider, useForm } from 'react-hook-form';
import AddIcon from '@/components/assets/svg-icons/add-icon';
import { useUpdateAstrologerProfile } from '@/hooks/mutation/profile-mutation/profile';
import FullScreenLoader from '@/components/common/full-screen-loader';
import { UpdateAstrologerProfile, UserProfile } from '@/hooks/mutation/profile-mutation/profile-service.type';
import { useUploadProfileImage, useGetProfileImageUrl } from '@/hooks/mutation/image-mutations';
import { validateImageFile } from '@/services/api/s3-image-api';
import { useRouter } from 'next/navigation';
import { useGetAllServices } from '@/hooks/query/service-queries';


interface EditProfileFormProps {
  onBack: () => void;
  userProfile?: UserProfile;
}

const EditProfileForm = ({ onBack, userProfile }: EditProfileFormProps) => {
  const router = useRouter();
  const updateAstrologerProfileMutation = useUpdateAstrologerProfile();
  const uploadProfileImageMutation = useUploadProfileImage();
  const getProfileImageUrlMutation = useGetProfileImageUrl();
  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useGetAllServices();
  const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
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
      
      // Load profile image if available
      if (userProfile.profilePic) {
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
      const uploadResponse = await uploadProfileImageMutation.mutateAsync(file);
      
      // Load the uploaded image URL
      const urlResponse = await getProfileImageUrlMutation.mutateAsync(uploadResponse.data.imageKey);
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

  const onSubmit = async (data: UpdateAstrologerProfile) => {
    try {
      await updateAstrologerProfileMutation.mutateAsync(data);
      onBack();
    } catch {
      // Error handling is done in the mutation hook
    }
  };

  const navigateToAddServicePage = () => {
    router.push('/dashboard/astrologers/edit-services');
  };

  // Get user services, handle loading and error states gracefully
  const userServices = servicesError ? [] : (servicesData?.data || []);

  return (
    <>
      <FullScreenLoader loading={updateAstrologerProfileMutation.isPending} />
      <FormProvider {...methods}>
      <div className="min-h-screen bg-black text-white">
        <div className="w-full max-w-2xl mx-auto p-4 lg:p-8 pt-8 lg:pt-12">
          {/* Header */}
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
                  className="w-full focus:ring-golden-glow"
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
                />
              </div>

              <div className="flex flex-col gap-4">
                <Label
                  htmlFor="services"
                  className="text-sm lg:text-base font-semibold"
                >
                  Services Provided
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
                  {servicesLoading ? (
                    // Loading skeleton
                    <>
                      <div className="animate-pulse bg-gray-700 rounded-sm w-full sm:w-auto lg:w-44 h-12 lg:h-15"></div>
                      <div className="animate-pulse bg-gray-700 rounded-sm w-full sm:w-auto lg:w-44 h-12 lg:h-15"></div>
                      <div className="animate-pulse bg-gray-700 rounded-sm w-full sm:w-auto lg:w-44 h-12 lg:h-15"></div>
                    </>
                  ) : (
                    // Render user services or empty state
                    <>
                      {userServices.map((service) => (
                        <span 
                          key={service.id}
                          className="text-white px-4 py-3 rounded-sm text-sm flex items-center justify-center w-full sm:w-auto lg:w-44 h-12 lg:h-15 bg-emerald-green"
                          title={service.description || service.title}
                        >
                          {service.title}
                        </span>
                      ))}
                      <Button 
                        onClick={navigateToAddServicePage}
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2 justify-center rounded-sm text-sm w-full sm:w-auto lg:w-44 h-12 lg:h-15 text-white bg-transparent border border-white"
                      >
                        <AddIcon width="16" height="16" color="white" />
                        {userServices.length === 0 ? 'Add Services' : 'Edit Services'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
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