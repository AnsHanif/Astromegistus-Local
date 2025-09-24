'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import Modal from '@/components/common/modal';
import ImageUpload from '@/components/common/image-upload';
import { GraduationCap, Plus, Edit, Loader2, Trash2 } from 'lucide-react';

interface CoachingPackage {
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  description: string;
}

interface CoachingData {
  id?: string;
  title: string;
  description: string;
  shortDescription: string;
  duration: string;
  price: number;
  category: 'LIFE_COACHES' | 'CAREER_COACHES' | 'RELATIONSHIP_COACHES';
  isActive: boolean;
  features: string[];
  packages: CoachingPackage[];
  imageUrl?: string;
}

interface CoachingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coachingData: CoachingData, imageFile?: File | null) => void;
  title: string;
  mode: 'add' | 'edit';
  initialData?: CoachingData;
  isLoading?: boolean;
}

export default function CoachingFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  mode,
  initialData,
  isLoading = false,
}: CoachingFormModalProps) {
  const [formData, setFormData] = useState<CoachingData>({
    title: '',
    description: '',
    shortDescription: '',
    duration: '',
    price: 0,
    category: 'LIFE_COACHES',
    isActive: true,
    features: [],
    packages: [
      {
        name: '1 Hour Package',
        duration: '1 Hour',
        price: 0,
        description: 'Single session coaching',
      },
      {
        name: '5 Hour Package',
        duration: '5 Hours',
        price: 0,
        originalPrice: 0,
        description: '5 sessions with 10% discount',
      },
      {
        name: '10 Hour Package',
        duration: '10 Hours',
        price: 0,
        originalPrice: 0,
        description: '10 sessions with 20% discount',
      },
    ],
    imageUrl: '',
  });

  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          title: '',
          description: '',
          shortDescription: '',
          duration: '',
          price: 0,
          category: 'LIFE_COACHES',
          isActive: true,
          features: [],
          packages: [
            {
              name: '1 Hour Package',
              duration: '1 Hour',
              price: 0,
              description: 'Single session coaching',
            },
            {
              name: '5 Hour Package',
              duration: '5 Hours',
              price: 0,
              originalPrice: 0,
              description: '5 sessions with 10% discount',
            },
            {
              name: '10 Hour Package',
              duration: '10 Hours',
              price: 0,
              originalPrice: 0,
              description: '10 sessions with 20% discount',
            },
          ],
          imageUrl: '',
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleInputChange = (field: keyof CoachingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File) => {
    setPendingImageFile(file);
    const tempUrl = URL.createObjectURL(file);
    handleInputChange('imageUrl', tempUrl);
    return tempUrl;
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      handleInputChange('features', [...formData.features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    handleInputChange('features', newFeatures);
  };

  const updatePackage = (
    index: number,
    field: keyof CoachingPackage,
    value: any
  ) => {
    const newPackages = [...formData.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    handleInputChange('packages', newPackages);
  };

  const addPackage = () => {
    const newPackage: CoachingPackage = {
      name: '',
      duration: '',
      price: 0,
      description: '',
    };
    handleInputChange('packages', [...formData.packages, newPackage]);
  };

  const removePackage = (index: number) => {
    const newPackages = formData.packages.filter((_, i) => i !== index);
    handleInputChange('packages', newPackages);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || formData.price <= 0) return;
    onSubmit(formData, pendingImageFile);
  };

  const isFormValid = () => {
    return formData.title && formData.description && formData.price > 0;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={<GraduationCap className="h-5 w-5 text-golden-glow" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter coaching session title"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Short Description
          </label>
          <Input
            value={formData.shortDescription}
            onChange={(e) =>
              handleInputChange('shortDescription', e.target.value)
            }
            placeholder="Enter brief description"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Full Description
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter detailed description"
            rows={3}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Image</label>
          <ImageUpload
            currentImageUrl={formData.imageUrl}
            onImageUpload={(imageUrl) =>
              handleInputChange('imageUrl', imageUrl)
            }
            onImageRemove={() => handleInputChange('imageUrl', '')}
            handleImageUpload={handleImageUpload}
            placeholder="Upload coaching session image"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">
              Price ($)
            </label>
            <Input
              type="number"
              value={formData.price || ''}
              onChange={(e) =>
                handleInputChange('price', parseFloat(e.target.value) || 0)
              }
              placeholder="Enter price"
              min="0"
              step="0.01"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">
              Duration
            </label>
            <Input
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="e.g., 60 + 30 min"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Category</label>
          <CustomSelect
            options={[
              { label: 'Life Coaches', value: 'LIFE_COACHES' },
              { label: 'Career Coaches', value: 'CAREER_COACHES' },
              { label: 'Relationship Coaches', value: 'RELATIONSHIP_COACHES' },
            ]}
            selectedValue={formData.category}
            onSelect={(value) => handleInputChange('category', value)}
            placeholder="Select category"
            triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none"
            contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl z-[10000]"
            itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Features</label>
          <div className="space-y-3">
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-golden-glow/20 text-golden-glow border border-golden-glow/30 rounded-lg px-3 py-1 text-sm"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-golden-glow hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button
                type="button"
                onClick={addFeature}
                className="bg-golden-glow/20 text-golden-glow border border-golden-glow/30 hover:bg-golden-glow/30"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Pricing Packages
          </label>
          <div className="space-y-3">
            {formData?.packages?.map((pkg, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/20 rounded-lg p-4"
              >
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input
                    value={pkg.name}
                    onChange={(e) =>
                      updatePackage(index, 'name', e.target.value)
                    }
                    placeholder="Package name"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
                  />
                  <Input
                    value={pkg.duration}
                    onChange={(e) =>
                      updatePackage(index, 'duration', e.target.value)
                    }
                    placeholder="Duration"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input
                    type="number"
                    value={pkg.price || ''}
                    onChange={(e) =>
                      updatePackage(
                        index,
                        'price',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Price"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
                  />
                  <Input
                    type="number"
                    value={pkg.originalPrice || ''}
                    onChange={(e) =>
                      updatePackage(
                        index,
                        'originalPrice',
                        parseFloat(e.target.value) || undefined
                      )
                    }
                    placeholder="Original price (optional)"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
                  />
                </div>
                <Input
                  value={pkg.description}
                  onChange={(e) =>
                    updatePackage(index, 'description', e.target.value)
                  }
                  placeholder="Package description"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 mb-3"
                />
                <Button
                  type="button"
                  onClick={() => removePackage(index)}
                  className="w-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Package
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={addPackage}
              className="w-full bg-golden-glow/20 text-golden-glow border border-golden-glow/30 hover:bg-golden-glow/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>
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
              triggerClassName="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-0 focus:outline-none"
              contentClassName="bg-emerald-green/40 border-white/30 shadow-2xl z-[10000]"
              itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            variant="default"
            className="flex-1 border border-white/20 text-white hover:bg-white/10 bg-transparent rounded-2xl h-10"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black rounded-2xl h-10"
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
                ? 'Add Session'
                : 'Update Session'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
