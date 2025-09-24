'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import Modal from '@/components/common/modal';
import { User, Plus, Edit, Loader2, Upload, X, Eye, EyeOff, RefreshCw, Copy, Check } from 'lucide-react';
import {
  useUploadProfileImage,
  useDeleteProfileImage,
} from '@/hooks/mutation/admin-mutation/admin-mutations';
import { useSnackbar } from 'notistack';

interface UserData {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'ASTROMEGISTUS' | 'ASTROMEGISTUS_COACH' | 'ADMIN' | 'PAID' | 'GUEST';
  gender: 'male' | 'female' | 'other';
  verified: boolean;
  status: boolean;
  dummyPassword?: boolean;
  profilePictureUrl?: string;
  profilePic?: string;
  profilePictureKey?: string | null;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserData) => void;
  onImageFileChange?: (file: File | null) => void;
  title: string;
  mode: 'add' | 'edit';
  initialData?: UserData;
  isLoading?: boolean;
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  onImageFileChange,
  title,
  mode,
  initialData,
  isLoading = false,
}: UserFormModalProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
    role: 'ASTROMEGISTUS',
    gender: 'male',
    verified: true,
    status: true,
    dummyPassword: false,
    profilePictureUrl: '',
    profilePic: '',
    profilePictureKey: '',
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        console.log('Initial user data:', initialData);
        setFormData(initialData);
      } else {
        console.log('Resetting form for add mode in main useEffect');
        // Completely reset form data for add mode
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'ASTROMEGISTUS',
          gender: 'male',
          verified: true,
          status: true,
          dummyPassword: false,
          profilePictureUrl: '',
          profilePic: '',
          profilePictureKey: '',
        });
      }
      // Reset password visibility when modal opens
      setShowPassword(false);
      // Reset copied password state
      setCopiedPassword(false);
      // Reset image preview and error
      setImagePreview(null);
      setImageError(null);
    } else {
      console.log('Modal closed, resetting form');
      // Reset form when modal closes
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'ASTROMEGISTUS',
        gender: 'male',
        verified: true,
        status: true,
        dummyPassword: false,
        profilePictureUrl: '',
        profilePic: '',
        profilePictureKey: '',
      });
      setShowPassword(false);
      setCopiedPassword(false);
      setImagePreview(null);
      setImageError(null);
    }
  }, [isOpen, mode, initialData]);

  // Additional effect to ensure form is reset when modal opens in add mode
  useEffect(() => {
    if (isOpen && mode === 'add') {
      console.log('Resetting form for add mode - Current formData:', formData);
      // Force reset form data with a slight delay to ensure it takes effect
      setTimeout(() => {
        formResetKey.current += 1; // Force re-render
        const resetFormData = {
          name: '',
          email: '',
          password: '',
          role: 'ASTROMEGISTUS' as const,
          gender: 'male' as const,
          verified: true,
          status: true,
          dummyPassword: false,
          profilePictureUrl: '',
          profilePic: '',
          profilePictureKey: '',
        };
        setFormData(resetFormData);
        setShowPassword(false);
        setCopiedPassword(false);
        setImagePreview(null);
        setImageError(null);
        console.log('Form reset completed with key:', formResetKey.current, 'New formData:', resetFormData);
      }, 0);
    }
  }, [isOpen, mode]);

  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copiedPassword, setCopiedPassword] = useState<boolean>(false);
  const formResetKey = useRef(0);

  // React Query mutations
  const uploadProfileImageMutation = useUploadProfileImage();
  const deleteProfileImageMutation = useDeleteProfileImage();
  const { enqueueSnackbar } = useSnackbar();

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setImageError(null);

    try {
      const response = await uploadProfileImageMutation.mutateAsync(file);

      if (response.data.success && response.data.data?.imageKey) {
        // Just set the key - backend will generate the URL
        setFormData((prev) => ({
          ...prev,
          profilePictureKey: response.data.data.imageKey,
        }));

        // Create a temporary preview URL
        const tempUrl = URL.createObjectURL(file);
        setImagePreview(tempUrl);
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setImageError(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('Please select an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size must be less than 5MB');
        return;
      }

      handleImageUpload(file);
    }
  };

  // Remove image
  const handleRemoveImage = async () => {
    if (formData.profilePictureKey) {
      try {
        await deleteProfileImageMutation.mutateAsync(
          formData.profilePictureKey
        );
      } catch (error) {
        console.error('Failed to delete image from server:', error);
        // Continue with local removal even if server deletion fails
      }
    }

    setFormData((prev) => ({
      ...prev,
      profilePic: '',
      profilePictureKey: null, // Set to null to signal removal
    }));
    setImagePreview(null);
    setImageError(null);
  };

  const handleInputChange = (
    field: keyof UserData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageError = (_error: string) => {};

  // Generate random password function
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData((prev) => ({
      ...prev,
      password: password,
    }));
  };

  // Copy password to clipboard
  const copyPassword = async () => {
    if (formData.password) {
      try {
        await navigator.clipboard.writeText(formData.password);
        setCopiedPassword(true);
        enqueueSnackbar('Password copied to clipboard!', { variant: 'success' });
        setTimeout(() => setCopiedPassword(false), 2000);
      } catch (err) {
        console.error('Failed to copy password:', err);
        enqueueSnackbar('Failed to copy password', { variant: 'error' });
      }
    }
  };

  const handleSubmit = () => {
    if (
      mode === 'add' &&
      (!formData.name || !formData.email || (!formData.password && !formData.dummyPassword))
    ) {
      return;
    }
    if (mode === 'edit' && (!formData.name || !formData.email)) {
      return;
    }

    // Clean up empty strings and handle null values
    const cleanedData = {
      ...formData,
      profilePictureKey:
        formData.profilePictureKey === null
          ? null // Explicitly send null to remove image
          : formData.profilePictureKey &&
              formData.profilePictureKey.trim() !== ''
            ? formData.profilePictureKey
            : undefined,
    };

    // Remove profilePic from submission - backend will generate it
    delete cleanedData.profilePic;

    console.log('Submitting user data:', cleanedData);
    console.log(
      'ProfilePictureKey value:',
      cleanedData.profilePictureKey,
      'Type:',
      typeof cleanedData.profilePictureKey
    );
    onSubmit(cleanedData);
  };

  const isFormValid = () => {
    if (mode === 'add') {
      return formData.name && formData.email && (formData.password || formData.dummyPassword);
    }
    return formData.name && formData.email;
  };

  const getIcon = () => {
    return mode === 'add' ? (
      <User className="h-5 w-5 text-golden-glow" />
    ) : (
      <Edit className="h-5 w-5" />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} icon={getIcon()}>
      <div className="space-y-4">
        {/* Profile picture input removed as requested */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Full Name</label>
          <Input
            key={`name-${formResetKey.current}`}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter full name"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Email Address
          </label>
          <Input
            key={`email-${formResetKey.current}`}
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
          />
        </div>

        {mode === 'add' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Password
              </label>
              <div className="relative">
                <Input
                  key={`password-${formResetKey.current}`}
                  type={showPassword ? "text" : "password"}
                  value={formData.password || ''}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 pr-20"
                  disabled={formData.dummyPassword}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 borderborder-white/30"
                    // disabled={formData.dummyPassword}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200   border border-white/30"
                    // disabled={formData.dummyPassword}
                    title="Generate random password"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="dummyPassword"
                checked={formData.dummyPassword || false}
                onChange={(e) => handleInputChange('dummyPassword', e.target.checked)}
                className="w-4 h-4 text-golden-glow bg-white/10 border-white/30 rounded focus:ring-golden-glow focus:ring-2"
              />
              <label htmlFor="dummyPassword" className="text-sm text-white/90">
                Use dummy password (user will be required to reset on first login)
              </label>
            </div>

            {/* Password Display for Dummy Password */}
            {formData.dummyPassword && formData.password && (
              <div className="mt-4 p-4 bg-white/5 border border-white/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white/90 block mb-2">
                      Generated Password (Copy this for the user):
                    </label>
                    <div className="flex items-center space-x-2">
                      <code className="px-3 py-2 bg-white/10 border border-white/30 rounded text-white font-mono text-sm">
                        {formData.password}
                      </code>
                      <button
                        type="button"
                        onClick={copyPassword}
                        className="p-2 rounded-md bg-golden-glow/20 hover:bg-golden-glow/30 text-golden-glow transition-all duration-200"
                        title="Copy password"
                      >
                        {copiedPassword ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {copiedPassword && (
                      <p className="text-xs text-green-400 mt-1">Password copied to clipboard!</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Role</label>
          <CustomSelect
            options={[
              { label: 'Astromegistus', value: 'ASTROMEGISTUS' },
              { label: 'Astromegistus Coach', value: 'ASTROMEGISTUS_COACH' }
            ]}
            selectedValue={formData.role}
            onSelect={(value) => handleInputChange('role', value)}
            placeholder="Select role"
            variant="default"
            triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none"
            contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl backdrop-blur-md z-[10000]"
            itemClassName="text-white hover:bg-white/20 focus:bg-white/20 data-[highlighted]:bg-golden-glow/20 data-[state=checked]:bg-golden-glow/30 data-[state=checked]:text-black"
          />
          {mode === 'add' && (
            <p className="text-xs text-white/50">
              Only Astromegistus and Astromegistus Coach users can be created via admin panel
            </p>
          )}
        </div>


        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Gender</label>
          <CustomSelect
            options={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ]}
            selectedValue={formData.gender}
            onSelect={(value) => handleInputChange('gender', value)}
            placeholder="Select gender"
            variant="default"
            triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none"
            contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl backdrop-blur-md z-[10000]"
            itemClassName="text-white hover:bg-white/20 focus:bg-white/20 data-[highlighted]:bg-golden-glow/20 data-[state=checked]:bg-golden-glow/30 data-[state=checked]:text-black"
          />
        </div>

        {mode === 'edit' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Status
              </label>
              <CustomSelect
                options={[
                  { label: 'Active', value: 'true' },
                  { label: 'Inactive', value: 'false' },
                ]}
                selectedValue={formData.status ? 'true' : 'false'}
                onSelect={(value) =>
                  handleInputChange('status', value === 'true')
                }
                placeholder="Select status"
                variant="default"
                triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none"
                contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl backdrop-blur-md z-[10000]"
                itemClassName="text-white hover:bg-white/20 focus:bg-white/20 data-[highlighted]:bg-golden-glow/20 data-[state=checked]:bg-golden-glow/30 data-[state=checked]:text-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">
                Verified
              </label>
              <CustomSelect
                options={[
                  { label: 'Verified', value: 'true' },
                  { label: 'Not Verified', value: 'false' },
                ]}
                selectedValue={formData.verified ? 'true' : 'false'}
                onSelect={(value) =>
                  handleInputChange('verified', value === 'true')
                }
                placeholder="Select verification status"
                variant="default"
                triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none"
                contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl backdrop-blur-md z-[10000]"
                itemClassName="text-white hover:bg-white/20 focus:bg-white/20 data-[highlighted]:bg-golden-glow/20 data-[state=checked]:bg-golden-glow/30 data-[state=checked]:text-black"
              />
            </div>
          </>
        )}

        {/* Profile Picture Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Profile Picture
          </label>

          {formData.profilePic || formData.profilePictureKey || imagePreview ? (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={imagePreview || formData.profilePic}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                  onError={(e) => {
                    console.error('Image failed to load:', e.currentTarget.src);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="text-sm text-white/70">
                <p>
                  Profile image {formData.profilePic ? 'loaded' : 'uploaded'}
                </p>
                {formData.profilePic ? (
                  <p className="text-xs text-white/50 truncate max-w-48">
                    URL: {formData.profilePic}
                  </p>
                ) : (
                  <p className="text-xs text-white/50 truncate max-w-48">
                    Key: {formData.profilePictureKey}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profile-image-upload"
                disabled={uploadProfileImageMutation.isPending}
              />
              <label
                htmlFor="profile-image-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                {uploadProfileImageMutation.isPending ? (
                  <Loader2 className="h-8 w-8 text-white/50 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-white/50" />
                )}
                <span className="text-sm text-white/70">
                  {uploadProfileImageMutation.isPending
                    ? 'Uploading...'
                    : 'Click to upload profile image'}
                </span>
                <span className="text-xs text-white/50">
                  PNG, JPG, GIF up to 5MB
                </span>
              </label>
            </div>
          )}

          {imageError && <p className="text-sm text-red-400">{imageError}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="default"
            className="flex-1 border border-white/20 text-white hover:bg-white/10 bg-transparent rounded-2xl h-10 min-h-[40px]"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black rounded-2xl h-10 min-h-[40px]"
            onClick={handleSubmit}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : mode === 'add' ? (
              <Plus className="h-4 w-4 mr-2" />
            ) : (
              <Edit className="h-4 w-4 mr-2" />
            )}
            {isLoading
              ? mode === 'add'
                ? 'Adding...'
                : 'Updating...'
              : mode === 'add'
                ? 'Add User'
                : 'Update User'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
