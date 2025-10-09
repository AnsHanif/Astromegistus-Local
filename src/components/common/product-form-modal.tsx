'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import Modal from '@/components/common/modal';
import ImageUpload from '@/components/common/image-upload';
import { Package, Plus, Edit, Loader2 } from 'lucide-react';
import { s3ImageAPI } from '@/services/api/s3-image-api';

interface ProductData {
  id?: string;
  name: string;
  description: string;
  productType?: 'READING' | 'LIVE_SESSIONS' | 'BOTH';
  automatedPrice?: number;
  livePrice: number;
  categories: (
    | 'CORE_INTEGRATIVE'
    | 'NATAL_READING'
    | 'PREDICTIVE'
    | 'CAREER'
    | 'HORARY'
    | 'SYNASTRY'
    | 'ASTROCARTOGRAPHY'
    | 'ELECTIONAL'
    | 'SOLAR_RETURN'
    | 'DRACONIC_NATAL_OVERLAY'
    | 'NATAL'
  )[];
  duration: string;
  imageUrl: string;
  isActive: boolean;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: ProductData, imageFile?: File | null) => void;
  onImageFileChange?: (file: File | null) => void;
  title: string;
  mode: 'add' | 'edit';
  initialData?: ProductData;
  isLoading?: boolean;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  onImageFileChange,
  title,
  mode,
  initialData,
  isLoading = false,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    description: '',
    productType: 'BOTH',
    automatedPrice: undefined,
    livePrice: '' as any,
    categories: [],
    duration: '',
    imageUrl: '',
    isActive: true,
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      setShowValidationError(false);
      setImageError(null);
      if (mode === 'edit' && initialData) {
        // Extract price values - handle both number and object formats
        const automatedPrice = typeof initialData.automatedPrice === 'number'
          ? initialData.automatedPrice
          : (typeof (initialData as any).pricing?.automated === 'object'
              ? (initialData as any).pricing.automated.originalPrice
              : (initialData as any).pricing?.automated);

        const livePrice = typeof initialData.livePrice === 'number'
          ? initialData.livePrice
          : (typeof (initialData as any).pricing?.live === 'object'
              ? (initialData as any).pricing.live.originalPrice
              : (initialData as any).pricing?.live ?? 0);

        setFormData({
          ...initialData,
          productType: initialData.productType ?? 'BOTH',
          automatedPrice: automatedPrice ?? undefined,
          livePrice: livePrice,
          imageUrl: initialData.imageUrl || '', // Handle null imageUrl
        });
      } else {
        setFormData({
          name: '',
          description: '',
          productType: 'BOTH',
          automatedPrice: undefined,
          livePrice: '' as any,
          categories: [],
          duration: '',
          imageUrl: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, mode, initialData?.id, initialData?.livePrice]);


  const [imageError, setImageError] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [showValidationError, setShowValidationError] = useState(false);

  // Cleanup temporary blob URLs when modal closes or component unmounts
  useEffect(() => {
    return () => {
      if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(formData.imageUrl);
      }
    };
  }, [formData.imageUrl]);

  useEffect(() => {
    if (!isOpen) {
      setPendingImageFile(null);
      if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(formData.imageUrl);
        handleInputChange('imageUrl', '');
      }
    }
  }, [isOpen]);

  const handleInputChange = (
    field: keyof ProductData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      console.log('Handling image upload for product:', formData.id || 'new');

      // Clear any previous image error on successful upload
      setImageError(null);

      if (mode === 'add') {
        // For new products, store the file temporarily and notify parent
        setPendingImageFile(file);
        onImageFileChange?.(file);
        // Create temporary URL for preview and update form data
        const tempUrl = URL.createObjectURL(file);
        handleInputChange('imageUrl', tempUrl);
        return tempUrl;
      } else if (mode === 'edit') {
        // For existing products, store the file temporarily for multipart upload
        setPendingImageFile(file);
        onImageFileChange?.(file);
        // Create temporary URL for preview and update form data
        const tempUrl = URL.createObjectURL(file);
        handleInputChange('imageUrl', tempUrl);
        return tempUrl;
      }

      throw new Error('Invalid product state for image upload');
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleImageError = (error: string) => {
    setImageError(error);
  };

  const handleImageDelete = async () => {
    if (mode === 'edit' && formData.id) {
      try {
        // Use smart delete function that handles both key and ID deletion
        await s3ImageAPI.smartDeleteProductImage(
          formData.id,
          formData.imageUrl
        );
        console.log('Image deleted successfully');
        handleInputChange('imageUrl', '');
      } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('Failed to delete image');
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description || formData.livePrice <= 0 || formData.categories.length === 0) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);

    // For new products with pending image, submit without image URL
    // The parent will handle image upload after product creation
    const submitData =
      mode === 'add' && pendingImageFile
        ? { ...formData, imageUrl: '' }
        : formData;

    // Pass the image file to the parent for both add and edit modes
    onSubmit(submitData, pendingImageFile);
  };

  const isFormValid = () => {
    return formData.name && formData.description && formData.livePrice > 0 && formData.categories.length > 0;
  };

  const getIcon = () => {
    return mode === 'add' ? (
      <Package className="h-5 w-5 text-golden-glow" />
    ) : (
      <Edit className="h-5 w-5" />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} icon={getIcon()}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Product Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter product name"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Description
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter product description"
            rows={3}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Product Type
          </label>
          <CustomSelect
            options={[
              { label: 'Reading', value: 'READING' },
              { label: 'Live Sessions', value: 'LIVE_SESSIONS' },
              { label: 'Both', value: 'BOTH' },
            ]}
            selectedValue={formData.productType || 'BOTH'}
            onSelect={(value) => handleInputChange('productType', value as any)}
            placeholder="Select product type"
            variant="default"
            triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none"
            contentClassName="bg-emerald-green border-white/30 shadow-2xl z-[10000]"
            itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Product Image
          </label>
          <ImageUpload
            currentImageUrl={formData.imageUrl}
            onImageUpload={(imageUrl) =>
              handleInputChange('imageUrl', imageUrl)
            }
            onImageRemove={() => handleInputChange('imageUrl', '')}
            onError={handleImageError}
            handleImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
            showDeleteButton={mode === 'edit' && !!formData.id}
            placeholder="Upload product image"
            disabled={isLoading}
          />
          {imageError && <p className="text-sm text-red-400">{imageError}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">
              Automated Price ($){' '}
              <span className="text-white/50">(Optional)</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                value={
                  formData.automatedPrice === 0 ||
                  formData.automatedPrice == null
                    ? ''
                    : formData.automatedPrice
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleInputChange('automatedPrice', 0);
                  } else if (/^\d*\.?\d*$/.test(value)) {
                    handleInputChange('automatedPrice', parseFloat(value) || 0);
                  }
                }}
                placeholder="Enter automated price"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 pr-8"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none">
                $
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">
              Live Price ($)
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                value={formData.livePrice !== null && formData.livePrice !== undefined ? formData.livePrice : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleInputChange('livePrice', '');
                  } else if (/^\d*\.?\d*$/.test(value)) {
                    handleInputChange('livePrice', parseFloat(value));
                  }
                }}
                placeholder="Enter live price"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 pr-8"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none">
                $
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Categories
          </label>
          <div className="space-y-3">
            {/* Selected Categories Display */}
            {formData.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category) => {
                  const categoryLabels = {
                    CORE_INTEGRATIVE: 'Core / Integrative',
                    NATAL_READING: 'Natal Reading',
                    PREDICTIVE: 'Predictive',
                    CAREER: 'Career',
                    HORARY: 'Horary',
                    SYNASTRY: 'Synastry',
                    ASTROCARTOGRAPHY: 'Astrocartography',
                    ELECTIONAL: 'Electional',
                    SOLAR_RETURN: 'Solar Return',
                    DRACONIC_NATAL_OVERLAY: 'Draconic + Natal Overlay',
                    NATAL: 'Natal',
                  };
                  return (
                    <div
                      key={category}
                      className="flex items-center gap-2 bg-golden-glow/20 text-golden-glow border border-golden-glow/30 rounded-lg px-3 py-1 text-sm"
                    >
                      <span>{categoryLabels[category]}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newCategories = formData.categories.filter(
                            (c) => c !== category
                          );
                          setFormData((prev) => ({
                            ...prev,
                            categories: newCategories,
                          }));
                        }}
                        className="text-golden-glow hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Validation Error Message */}
            {showValidationError && formData.categories.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <svg className="h-4 w-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-400 text-sm">At least one category must be selected</span>
              </div>
            )}

            {/* Add Category Dropdown */}
            <CustomSelect
              options={[
                { label: 'Core / Integrative', value: 'CORE_INTEGRATIVE' },
                { label: 'Natal Reading', value: 'NATAL_READING' },
                { label: 'Predictive', value: 'PREDICTIVE' },
                { label: 'Career', value: 'CAREER' },
                { label: 'Horary', value: 'HORARY' },
                { label: 'Synastry', value: 'SYNASTRY' },
                { label: 'Astrocartography', value: 'ASTROCARTOGRAPHY' },
                { label: 'Electional', value: 'ELECTIONAL' },
                { label: 'Solar Return', value: 'SOLAR_RETURN' },
                {
                  label: 'Draconic + Natal Overlay',
                  value: 'DRACONIC_NATAL_OVERLAY',
                },
                { label: 'Natal', value: 'NATAL' },
              ].filter(
                (option) => !formData.categories.includes(option.value as any)
              )}
              selectedValue=""
              onSelect={(value) => {
                if (value && !formData.categories.includes(value as any)) {
                  const newCategories = [...formData.categories, value as any];
                  setFormData((prev) => ({
                    ...prev,
                    categories: newCategories,
                  }));
                }
              }}
              placeholder="Add category"
              variant="default"
              triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none"
              contentClassName="bg-emerald-green border-white/30 shadow-2xl z-[10000]"
              itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Duration</label>
          <CustomSelect
            options={[
              { label: '15-30 min', value: '15-30 min' },
              { label: '30-45 min', value: '30-45 min' },
              { label: '30-60 min', value: '30-60 min' },
              { label: '45-60 min', value: '45-60 min' },
              { label: '60-75 min', value: '60-75 min' },
              { label: '60-90 min', value: '60-90 min' },
              { label: '75-90 min', value: '75-90 min' },
              { label: '90-120 min', value: '90-120 min' },
            ]}
            selectedValue={formData.duration}
            onSelect={(value) => {
              handleInputChange('duration', value);
            }}
            placeholder="Select duration"
            variant="default"
            triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:ring-0 focus:outline-none"
            contentClassName="bg-emerald-green border-white/30 shadow-2xl z-[10000] [&_.selected-item]:bg-white/20 [&_.selected-item]:text-white [&_.selected-item]:font-normal"
            itemClassName="text-white hover:bg-white/10 focus:bg-white/10 [&[data-state=checked]]:bg-white/20 [&[data-state=checked]]:text-white [&[data-state=checked]]:font-normal"
          />
        </div>

        {mode === 'edit' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Status</label>
            <CustomSelect
              options={[
                { label: 'Active', value: 'true' },
                { label: 'Inactive', value: 'false' },
              ]}
              selectedValue={formData.isActive ? 'true' : 'false'}
              onSelect={(value) =>
                handleInputChange('isActive', value === 'true')
              }
              placeholder="Select status"
              variant="default"
              triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none"
              contentClassName="bg-emerald-green border-white/30 shadow-2xl z-[10000]"
              itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
            />
          </div>
        )}

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
                ? 'Add Product'
                : 'Update Product'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
