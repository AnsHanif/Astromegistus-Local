'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import Modal from '@/components/common/modal';
import {
  User,
  Plus,
  Edit,
  Loader2,
  Upload,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import {
  useAdminUploadProfileImage,
  useAdminDeleteProfileImage,
} from '@/hooks/mutation/admin-mutation/admin-mutations';
import { useSnackbar } from 'notistack';
import { parsePhoneNumber, isValidPhoneNumber, AsYouType } from 'libphonenumber-js';

// Reusable Error Component
const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-sm text-red-400 mt-1">{message}</p>;
};

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
        className={`w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg px-3 py-2.5 text-left flex items-center justify-between min-h-[40px] ${className}`}
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
        <div className="absolute z-10 w-full mt-1 bg-emerald-green/40 border border-white/30 rounded-lg shadow-lg backdrop-blur-md max-h-60 overflow-y-auto">
          {/* All option */}
          <div
            className="flex items-center px-3 py-2 hover:bg-white/10 cursor-pointer border-b border-white/10"
            onClick={handleToggleAll}
          >
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() => {}} // Controlled by parent onClick
              className="mr-2 w-4 h-4 text-golden-glow bg-white/10 border-white/30 rounded focus:ring-golden-glow focus:ring-2"
            />
            <label className="text-white text-sm cursor-pointer flex-1 font-medium">
              All Categories
            </label>
          </div>

          {/* Individual options */}
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center px-3 py-2 hover:bg-white/10 cursor-pointer ${isAllSelected ? 'opacity-60' : ''}`}
              onClick={() => handleToggleOption(option.value)}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => {}} // Controlled by parent onClick
                disabled={isAllSelected}
                className="mr-2 w-4 h-4 text-golden-glow bg-white/10 border-white/30 rounded focus:ring-golden-glow focus:ring-2 disabled:opacity-60"
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
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;

  // Contact Information
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Professional Services
  languages?: string[];
  astrologyCategories?: string[];
  coachingCategories?: string[];

  // Service Offerings
  offerWebinars?: boolean;
  offerTalkShow?: boolean;
  talkShowDay?: string;
  talkShowTime?: string;

  // Financial Information
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  taxIdentification?: string;

  // Additional Information
  additionalComments?: string;
  adminNotes?: string;
}

// Yup validation schema - create function to handle add/edit mode differences
const createValidationSchema = (mode: 'add' | 'edit') => yup.object().shape({
  // Basic required fields
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim(),

  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .lowercase()
    .trim(),

  password: mode === 'add'
    ? yup
        .string()
        .optional()
        .when('dummyPassword', {
          is: false,
          then: (schema) =>
            schema
              .required('Password is required when not using dummy password')
              .min(8, 'Password must be at least 8 characters')
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                'Password must contain at least 1 uppercase letter, 1 lowercase letter, numbers and special character'
              ),
          otherwise: (schema) => schema.optional(),
        })
    : yup.string().optional(), // In edit mode, password is always optional

  role: yup
    .string()
    .required('Role is required')
    .oneOf(['ASTROMEGISTUS', 'ASTROMEGISTUS_COACH'], 'Invalid role selected'),

  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),

  verified: yup.boolean().default(true),
  status: yup.boolean().default(true),
  dummyPassword: yup.boolean().default(false),

  // Contact Information - required for professional profiles
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .test('valid-phone', 'Please enter a valid phone number with country code (e.g., +1 555-123-4567)', function(value) {
      if (!value) return false;

      try {
      
        const phoneNumber = parsePhoneNumber(value);
        
        // If parsing succeeds and number is valid, accept it
        if (phoneNumber && phoneNumber.isValid()) {
          return true;
        }
        
        // Fallback: basic format validation for international numbers
        const cleanValue = value.replace(/[^+\d]/g, '');
        return cleanValue.startsWith('+') && cleanValue.length >= 8 && cleanValue.length <= 18;
      } catch (error) {
        // If all parsing fails, do basic format check
        const cleanValue = value.replace(/[^+\d]/g, '');
        return cleanValue.startsWith('+') && cleanValue.length >= 8 && cleanValue.length <= 18;
      }
    }),

  address: yup
    .string()
    .required('Address is required')
    .max(200, 'Address must not exceed 200 characters'),

  city: yup
    .string()
    .required('City is required')
    .max(100, 'City must not exceed 100 characters'),

  state: yup
    .string()
    .required('State is required')
    .max(100, 'State must not exceed 100 characters'),

  zipCode: yup
    .string()
    .required('Zip code is required')
    .matches(/^[\d\-\s]*$/, 'Please enter a valid ZIP code'),

  // Professional Services - required
  languages: yup
    .array()
    .of(yup.string().trim())
    .required('At least one language is required')
    .min(1, 'At least one language is required'),

  astrologyCategories: yup
    .array()
    .of(yup.string().trim())
    .when('role', {
      is: 'ASTROMEGISTUS',
      then: (schema) =>
        schema
          .required('At least one astrology category is required')
          .min(1, 'At least one astrology category is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  coachingCategories: yup
    .array()
    .of(yup.string().trim())
    .when('role', {
      is: 'ASTROMEGISTUS_COACH',
      then: (schema) =>
        schema
          .required('At least one coaching category is required')
          .min(1, 'At least one coaching category is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

  // Service Offerings
  offerWebinars: yup.boolean().default(false),
  offerTalkShow: yup.boolean().default(false),

  talkShowDay: yup
    .string()
    .nullable()
    .when('offerTalkShow', {
      is: true,
      then: (schema) =>
        schema.required('Talk show day is required when offering talk shows'),
      otherwise: (schema) => schema.notRequired(),
    }),

  talkShowTime: yup
    .string()
    .nullable()
    .when('offerTalkShow', {
      is: true,
      then: (schema) =>
        schema.required('Talk show time is required when offering talk shows'),
      otherwise: (schema) => schema.notRequired(),
    }),

  // Financial Information - required
  bankAccountNumber: yup.string().required('Bank account number is required'),

  bankRoutingNumber: yup.string().required('Bank routing number is required'),

  taxIdentification: yup.string().required('Tax identification is required'),

  // Additional Information
  additionalComments: yup
    .string()
    .nullable()
    .max(1000, 'Additional comments must not exceed 1000 characters'),

  adminNotes: yup
    .string()
    .nullable()
    .max(1000, 'Admin notes must not exceed 1000 characters'),

  // Profile image
  profilePictureKey: yup.string().nullable(),
});

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
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm<UserData>({
    resolver: yupResolver(createValidationSchema(mode)) as any,
    defaultValues: {
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

      // Contact Information
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',

      // Professional Services
      languages: [],
      astrologyCategories: [],
      coachingCategories: [],

      // Service Offerings
      offerWebinars: false,
      offerTalkShow: false,
      talkShowDay: '',
      talkShowTime: '',

      // Financial Information
      bankAccountNumber: '',
      bankRoutingNumber: '',
      taxIdentification: '',

      // Additional Information
      additionalComments: '',
      adminNotes: '',
    },
    mode: 'onChange', // Validate on change for better UX
  });

  // Watch form values for conditional rendering
  const watchedValues = watch();
  const watchDummyPassword = watch('dummyPassword');
  const watchOfferTalkShow = watch('offerTalkShow');
  const watchRole = watch('role');

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        console.log('Initial user data:', initialData);
        reset(initialData);
        // Set languages state for edit mode
        setLanguages(
          initialData.languages?.length ? initialData.languages : ['']
        );
        // Set image preview for existing profile picture
        if (initialData.profilePic || initialData.profilePictureUrl) {
          setImagePreview(initialData.profilePic || initialData.profilePictureUrl || null);
        }
      } else {
        console.log('Resetting form for add mode in main useEffect');
        // Reset form for add mode
        reset({
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

          // Contact Information
          phoneNumber: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',

          // Professional Services
          languages: [],
          astrologyCategories: [],
          coachingCategories: [],

          // Service Offerings
          offerWebinars: false,
          offerTalkShow: false,
          talkShowDay: '',
          talkShowTime: '',

          // Financial Information
          bankAccountNumber: '',
          bankRoutingNumber: '',
          taxIdentification: '',

          // Additional Information
          additionalComments: '',
          adminNotes: '',
        });
        // Set languages state for add mode
        setLanguages(['']);
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
      reset();
      setShowPassword(false);
      setCopiedPassword(false);
      setImagePreview(null);
      setImageError(null);
      setLanguages(['']);
    }
  }, [isOpen, mode, initialData]);

  // Note: Simplified form reset with React Hook Form - no additional useEffect needed

  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copiedPassword, setCopiedPassword] = useState<boolean>(false);
  const [languages, setLanguages] = useState<string[]>(['']);
  const formResetKey = useRef(0);

  // React Query mutations
  const uploadProfileImageMutation = useAdminUploadProfileImage();
  const deleteProfileImageMutation = useAdminDeleteProfileImage();
  const { enqueueSnackbar } = useSnackbar();

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setImageError(null);

    try {
      const response = await uploadProfileImageMutation.mutateAsync(file);

      if (response.data.success && response.data.data?.imageKey) {
        // Just set the key - backend will generate the URL
        setValue('profilePictureKey', response.data.data.imageKey);

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
    const profilePictureKey = watch('profilePictureKey');
    if (profilePictureKey) {
      try {
        await deleteProfileImageMutation.mutateAsync(profilePictureKey);
      } catch (error) {
        console.error('Failed to delete image from server:', error);
        // Continue with local removal even if server deletion fails
      }
    }

    setValue('profilePic', '');
    setValue('profilePictureKey', null); // Set to null to signal removal
    setImagePreview(null);
    setImageError(null);
  };

  // Custom handlers for complex field types
  const handleLanguageChange = (index: number, value: string) => {
    const newLanguages = [...languages];
    newLanguages[index] = value;
    setLanguages(newLanguages);

    // Update form value with filtered non-empty languages
    const filteredLanguages = newLanguages.filter((lang) => lang.trim() !== '');
    setValue('languages', filteredLanguages);
  };

  const addLanguage = () => {
    setLanguages([...languages, '']);
  };

  const removeLanguage = (index: number) => {
    if (languages.length > 1) {
      const newLanguages = languages.filter((_, i) => i !== index);
      setLanguages(newLanguages);

      // Update form value with filtered non-empty languages
      const filteredLanguages = newLanguages.filter(
        (lang) => lang.trim() !== ''
      );
      setValue('languages', filteredLanguages);
    }
  };

  const handleImageError = (_error: string) => {};

  // Phone number formatting handler
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    try {
      // Try to format any input that looks like a phone number
      if (input.length >= 3) {
        const formatter = new AsYouType();
        const formatted = formatter.input(input);
        setValue('phoneNumber', formatted);
      } else {
        // For very short inputs, just use raw input
        setValue('phoneNumber', input);
      }
    } catch (error) {
      // If formatting fails, just use the raw input
      setValue('phoneNumber', input);
    }
  };

  // Generate random password function
  const generatePassword = () => {
    const length = 12;
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*';

    // Ensure at least one character from each required set
    let password = '';
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    // Fill the rest with random characters from all sets
    const allChars = lowercase + uppercase + numbers + specialChars;
    for (let i = password.length; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password to randomize positions
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    setValue('password', password);
  };

  // Copy password to clipboard
  const copyPassword = async () => {
    const password = watch('password');
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopiedPassword(true);
        enqueueSnackbar('Password copied to clipboard!', {
          variant: 'success',
        });
        setTimeout(() => setCopiedPassword(false), 2000);
      } catch (err) {
        console.error('Failed to copy password:', err);
        enqueueSnackbar('Failed to copy password', { variant: 'error' });
      }
    }
  };

  // Form submission handler using React Hook Form
  const onFormSubmit = (data: UserData) => {
    // Clean up null values - convert to undefined for optional fields that don't accept null
    const cleanedData = {
      ...data,
      // Convert null to undefined for optional string fields
      additionalComments: data.additionalComments === null ? undefined : data.additionalComments,
      adminNotes: data.adminNotes === null ? undefined : data.adminNotes,
      talkShowDay: data.talkShowDay === null ? undefined : data.talkShowDay,
      talkShowTime: data.talkShowTime === null ? undefined : data.talkShowTime,
      dateOfBirth: data.dateOfBirth === null ? undefined : data.dateOfBirth,
      timeOfBirth: data.timeOfBirth === null ? undefined : data.timeOfBirth,
      placeOfBirth: data.placeOfBirth === null ? undefined : data.placeOfBirth,
      // Handle profile picture key specially (this one CAN be null to signal removal)
      profilePictureKey:
        data.profilePictureKey === null
          ? null // Explicitly send null to remove image
          : data.profilePictureKey && data.profilePictureKey.trim() !== ''
            ? data.profilePictureKey
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

  // Form validation is now handled by React Hook Form and Yup
  // isValid from formState provides the validation status

  const getIcon = () => {
    return mode === 'add' ? (
      <User className="h-5 w-5 text-golden-glow" />
    ) : (
      <Edit className="h-5 w-5" />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} icon={getIcon()}>
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
            Personal Information
          </h3>

          <div className="space-y-3">
            <label className="text-sm font-medium text-white/90">
              Full Name
            </label>
            <Input
              {...register('name')}
              placeholder="Enter full name"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
            />
            <FormError message={errors.name?.message} />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-white/90">
              Email Address
            </label>
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter email address"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
            />
            <FormError message={errors.email?.message} />
          </div>

          {mode === 'add' && (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative">
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 pr-20 rounded-lg"
                    disabled={watchDummyPassword}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/30"
                      // disabled={formData.dummyPassword}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
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
                <FormError message={errors.password?.message} />
              </div>

              {/* <div className="flex items-center space-x-2">
              <input
                {...register('dummyPassword')}
                type="checkbox"
                id="dummyPassword"
                className="w-4 h-4 text-golden-glow bg-white/10 border-white/30 rounded focus:ring-golden-glow focus:ring-2"
              />
              <label htmlFor="dummyPassword" className="text-sm text-white/90">
                Use dummy password (user will be required to reset on first login)
              </label>
            </div>
            <FormError message={errors.dummyPassword?.message} /> */}

              {/* Password Display for Dummy Password */}
              {watchDummyPassword && watchedValues.password && (
                <div className="mt-4 p-4 bg-white/5 border border-white/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-white/90 block mb-2">
                        Generated Password (Copy this for the user):
                      </label>
                      <div className="flex items-center space-x-2">
                        <code className="px-3 py-2 bg-white/10 border border-white/30 rounded text-white font-mono text-sm">
                          {watchedValues.password}
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
                        <p className="text-xs text-green-400 mt-1">
                          Password copied to clipboard!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium text-white/90">Role</label>
            <CustomSelect
              options={[
                { label: 'ASTROLOGER', value: 'ASTROMEGISTUS' },
                { label: 'COACH', value: 'ASTROMEGISTUS_COACH' },
              ]}
              selectedValue={watchRole}
              onSelect={(value) => setValue('role', value as UserData['role'])}
              placeholder="Select role"
              variant="default"
              triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none rounded-lg"
              contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl backdrop-blur-md z-[10000]"
              itemClassName="text-white hover:bg-white/20 focus:bg-white/20 data-[highlighted]:bg-golden-glow/20 data-[state=checked]:bg-golden-glow/30 data-[state=checked]:text-black"
            />
            <FormError message={errors.role?.message} />
            {mode === 'add' && (
              <p className="text-xs text-white/50">
                Only ASTROLOGER and COACH users can be created
                via admin panel
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-white/90">Gender</label>
            <CustomSelect
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Other', value: 'other' },
              ]}
              selectedValue={watch('gender')}
              onSelect={(value) =>
                setValue('gender', value as UserData['gender'])
              }
              placeholder="Select gender"
              variant="default"
              triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none rounded-lg"
              contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl backdrop-blur-md z-[10000]"
              itemClassName="text-white hover:bg-white/20 focus:bg-white/20 data-[highlighted]:bg-golden-glow/20 data-[state=checked]:bg-golden-glow/30 data-[state=checked]:text-black"
            />
            <FormError message={errors.gender?.message} />
          </div>

          {mode === 'edit' && (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">
                  Status
                </label>
                <CustomSelect
                  options={[
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' },
                  ]}
                  selectedValue={watch('status') ? 'true' : 'false'}
                  onSelect={(value) => setValue('status', value === 'true')}
                  placeholder="Select status"
                  variant="default"
                  triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none rounded-lg"
                  contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl backdrop-blur-md z-[10000]"
                  itemClassName="text-white hover:bg-white/20 focus:bg-white/20 data-[highlighted]:bg-golden-glow/20 data-[state=checked]:bg-golden-glow/30 data-[state=checked]:text-black"
                />
                <FormError message={errors.status?.message} />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">
                  Verified
                </label>
                <CustomSelect
                  options={[
                    { label: 'Verified', value: 'true' },
                    { label: 'Not Verified', value: 'false' },
                  ]}
                  selectedValue={watch('verified') ? 'true' : 'false'}
                  onSelect={(value) => setValue('verified', value === 'true')}
                  placeholder="Select verification status"
                  variant="default"
                  triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none rounded-lg"
                  contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl backdrop-blur-md z-[10000]"
                  itemClassName="text-white hover:bg-white/20 focus:bg-white/20 data-[highlighted]:bg-golden-glow/20 data-[state=checked]:bg-golden-glow/30 data-[state=checked]:text-black"
                />
                <FormError message={errors.verified?.message} />
              </div>
            </>
          )}

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
              Professional Information
            </h3>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-white/90">
                Contact Information
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/90">
                    Phone Number
                  </label>
                  <Input
                    value={watch('phoneNumber') || ''}
                    onChange={handlePhoneNumberChange}
                    type="text"
                    placeholder="+1 555-123-4567"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                  <FormError message={errors.phoneNumber?.message} />
                  <p className="text-xs text-white/50">
                    Must include country code (e.g., +1 for US, +44 for UK)
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/90">
                    ZIP Code
                  </label>
                  <Input
                    {...register('zipCode')}
                    placeholder="ZIP code"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
                  />
                  <FormError message={errors.zipCode?.message} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">
                  Address
                </label>
                <Input
                  {...register('address')}
                  placeholder="Street address"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
                />
                <FormError message={errors.address?.message} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/90">
                    City
                  </label>
                  <Input
                    {...register('city')}
                    placeholder="City"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
                  />
                  <FormError message={errors.city?.message} />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/90">
                    State
                  </label>
                  <Input
                    {...register('state')}
                    placeholder="State"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
                  />
                  <FormError message={errors.state?.message} />
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-3 mt-4">
              <label className="text-sm font-medium text-white/90">
                Languages Spoken
              </label>
              <div className="space-y-2">
                {languages.map((language, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={language}
                      onChange={(e) =>
                        handleLanguageChange(index, e.target.value)
                      }
                      placeholder="e.g. English, Spanish, French"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg flex-1"
                    />
                    {languages.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-400 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addLanguage}
                  className="w-full flex items-center justify-center space-x-2 p-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Language</span>
                </Button>
              </div>
              <FormError message={errors.languages?.message} />
            </div>

            {/* Service Categories */}
            {watch('role') === 'ASTROMEGISTUS' && (
              <div className="space-y-3 mt-4">
                <label className="text-sm font-medium text-white/90">
                  Astrology Categories
                </label>
                <MultiSelect
                  options={ASTROLOGY_CATEGORIES}
                  selectedValues={watch('astrologyCategories') || []}
                  onChange={(selectedValues) =>
                    setValue('astrologyCategories', selectedValues)
                  }
                  placeholder="Select astrology categories..."
                />
                <FormError message={errors.astrologyCategories?.message} />
              </div>
            )}

            {watch('role') === 'ASTROMEGISTUS_COACH' && (
              <div className="space-y-3 mt-4">
                <label className="text-sm font-medium text-white/90">
                  Coaching Categories
                </label>
                <MultiSelect
                  options={COACHING_CATEGORIES}
                  selectedValues={watch('coachingCategories') || []}
                  onChange={(selectedValues) =>
                    setValue('coachingCategories', selectedValues)
                  }
                  placeholder="Select coaching categories..."
                />
                <FormError message={errors.coachingCategories?.message} />
              </div>
            )}

            {/* Service Offerings */}
            <div className="space-y-4 mt-4">
              <h4 className="text-md font-medium text-white/90">
                Service Offerings
              </h4>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="offerWebinars"
                  {...register('offerWebinars')}
                  className="w-4 h-4 text-golden-glow bg-white/10 border-white/30 rounded focus:ring-golden-glow focus:ring-2"
                />
                <label
                  htmlFor="offerWebinars"
                  className="text-sm text-white/90"
                >
                  Offers Webinars
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="offerTalkShow"
                  {...register('offerTalkShow')}
                  className="w-4 h-4 text-golden-glow bg-white/10 border-white/30 rounded focus:ring-golden-glow focus:ring-2"
                />
                <label
                  htmlFor="offerTalkShow"
                  className="text-sm text-white/90"
                >
                  Offers Talk Show
                </label>
              </div>

              {watch('offerTalkShow') && (
                <div className="grid grid-cols-2 gap-3 ml-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/90">
                      Talk Show Day
                    </label>
                    <Input
                      {...register('talkShowDay')}
                      placeholder="e.g. Monday"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
                    />
                    <FormError message={errors.talkShowDay?.message} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/90">
                      Talk Show Time
                    </label>
                    <Input
                      {...register('talkShowTime')}
                      placeholder="e.g. 8:00 PM EST"
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
                    />
                    <FormError message={errors.talkShowTime?.message} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
              Financial Information
            </h3>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-white/90">
                Banking Details (Admin Only)
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/90">
                    Bank Account Number
                  </label>
                  <Input
                    {...register('bankAccountNumber')}
                    type="text"
                    placeholder="Account number"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                  <FormError message={errors.bankAccountNumber?.message} />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/90">
                    Routing Number
                  </label>
                  <Input
                    {...register('bankRoutingNumber')}
                    type="text"
                    placeholder="Routing number"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                  <FormError message={errors.bankRoutingNumber?.message} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">
                  Tax Identification
                </label>
                <Input
                  {...register('taxIdentification')}
                  placeholder="Tax ID / SSN"
                  type="text"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-lg"
                />
                <FormError message={errors.taxIdentification?.message} />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
              Additional Information
            </h3>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">
                  Additional Comments
                </label>
                <textarea
                  {...register('additionalComments')}
                  placeholder="Any additional comments for public profile..."
                  rows={3}
                  className="w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-md px-3 py-2 resize-none"
                />
                <FormError message={errors.additionalComments?.message} />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">
                  Admin Notes
                </label>
                <textarea
                  {...register('adminNotes')}
                  placeholder="Internal admin notes (not visible to public)..."
                  rows={3}
                  className="w-full bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 rounded-md px-3 py-2 resize-none"
                />
                <FormError message={errors.adminNotes?.message} />
              </div>
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
              Profile Picture
            </h3>

            <div className="space-y-3">
              {watch('profilePic') ||
              watch('profilePictureKey') ||
              imagePreview ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={imagePreview || watch('profilePic')}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                      onError={(e) => {
                        console.error(
                          'Image failed to load:',
                          e.currentTarget.src
                        );
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
                      Profile image{' '}
                      {watch('profilePic') ? 'loaded' : 'uploaded'}
                    </p>
                    {watch('profilePic') ? (
                      <p className="text-xs text-white/50 truncate max-w-48">
                        URL: {watch('profilePic')}
                      </p>
                    ) : (
                      <p className="text-xs text-white/50 truncate max-w-48">
                        Key: {watch('profilePictureKey')}
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

              {imageError && (
                <p className="text-sm text-red-400">{imageError}</p>
              )}
            </div>
          </div>
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
            onClick={handleSubmit(onFormSubmit)}
            disabled={isLoading}
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
                ? 'Creating...'
                : 'Updating...'
              : mode === 'add'
                ? 'Create'
                : 'Update User'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
