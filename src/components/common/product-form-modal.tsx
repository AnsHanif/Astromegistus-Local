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
    livePrice: 0,
    categories: ['NATAL_READING'],
    duration: '',
    imageUrl: '',
    isActive: true,
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          ...initialData,
          productType: initialData.productType ?? 'BOTH',
          automatedPrice: initialData.automatedPrice ?? undefined,
          livePrice: initialData.livePrice ?? 0,
          imageUrl: initialData.imageUrl || '', // Handle null imageUrl
        });
      } else {
        setFormData({
          name: '',
          description: '',
          productType: 'BOTH',
          automatedPrice: undefined,
          livePrice: 0,
          categories: ['NATAL_READING'],
          duration: '',
          imageUrl: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const [imageError, setImageError] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

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
    if (!formData.name || !formData.description || formData.livePrice <= 0) {
      return;
    }

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
    return formData.name && formData.description && formData.livePrice > 0;
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
            contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl z-[10000]"
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
                type="number"
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
                  } else {
                    handleInputChange('automatedPrice', parseFloat(value) || 0);
                  }
                }}
                placeholder="Enter automated price"
                min="0"
                step="0.01"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] pr-8"
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
                type="number"
                value={
                  formData.livePrice === 0 || formData.livePrice == null
                    ? ''
                    : formData.livePrice
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    handleInputChange('livePrice', 0);
                  } else {
                    handleInputChange('livePrice', parseFloat(value) || 0);
                  }
                }}
                placeholder="Enter live price"
                min="0"
                step="0.01"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] pr-8"
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
            {formData.categories.length > 0 && (
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
              contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl z-[10000]"
              itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Duration</label>
          <Input
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="e.g., 60 + 30 min"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
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
              contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl z-[10000]"
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
