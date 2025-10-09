'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import Modal from '@/components/common/modal';
import { Briefcase, Plus, Edit, Loader2, X } from 'lucide-react';

interface JobData {
  id?: string;
  title: string;
  description: string;
  category: 'freelance' | 'employment';
  tags: string[];
  isActive: boolean;
}

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: JobData) => void;
  title: string;
  mode: 'add' | 'edit';
  initialData?: JobData;
  isLoading?: boolean;
}

export default function JobFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  mode,
  initialData,
  isLoading = false,
}: JobFormModalProps) {
  const [formData, setFormData] = useState<JobData>({
    title: '',
    description: '',
    category: 'freelance',
    tags: [],
    isActive: true,
  });

  const [tagInput, setTagInput] = useState('');

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          category: initialData.category || 'freelance',
          tags: initialData.tags || [],
          isActive: initialData.isActive ?? true,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          category: 'freelance',
          tags: [],
          isActive: true,
        });
      }
      setTagInput('');
    }
  }, [isOpen, mode, initialData]);

  const handleInputChange = (field: keyof JobData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && formData.tags.length < 10) {
      handleInputChange('tags', [...formData.tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || formData.tags.length === 0) {
      return;
    }

    // Remove excessive blank lines - keep single line breaks but remove multiple consecutive ones
    const cleanedDescription = formData.description
      .split('\n')
      .filter((line: string) => line.trim() !== '')
      .join('\n');

    onSubmit({
      ...formData,
      description: cleanedDescription,
    });
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.tags.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={mode === 'add' ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Job Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter job title"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
            disabled={isLoading}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Category *
          </label>
          <CustomSelect
            options={[
              { label: 'Freelance', value: 'freelance' },
              { label: 'Employment', value: 'employment' },
            ]}
            selectedValue={formData.category}
            onSelect={(value) => handleInputChange('category', value)}
            placeholder="Select category"
            disabled={isLoading}
            className="bg-white/10 border-white/30 text-white"
            triggerClassName="bg-white/10 border-white/30 text-white hover:bg-white/20 focus:border-golden-glow focus:ring-golden-glow/20"
            contentClassName="bg-emerald-green border-white/30 shadow-2xl z-[10000]"
            itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Description *
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter job description"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 min-h-[100px]"
            disabled={isLoading}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Tags * ({formData.tags.length}/10)
          </label>
          <div className="space-y-3">
            {/* Selected Tags Display */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-golden-glow/20 text-golden-glow border border-golden-glow/30 rounded-lg px-3 py-1 text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-golden-glow hover:text-red-400 transition-colors"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Tag Input */}
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag and press Enter"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
                disabled={isLoading || formData.tags.length >= 10}
              />
              <Button
                type="button"
                onClick={addTag}
                className="bg-golden-glow/20 text-golden-glow border border-golden-glow/30 hover:bg-golden-glow/30"
                disabled={isLoading || !tagInput.trim() || formData.tags.length >= 10}
              >
                Add
              </Button>
            </div>

            {/* Validation message for tags */}
            {formData.tags.length === 0 && (
              <div className="text-sm text-white/50">
                Add at least one tag to describe this job position
              </div>
            )}
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            className="w-4 h-4 text-golden-glow bg-white/10 border-white/30 rounded focus:ring-golden-glow focus:ring-2"
            disabled={isLoading}
          />
          <label htmlFor="isActive" className="text-sm text-white/90">
            Active (visible on career page)
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="default"
            className="flex-1 border border-white/20 text-white hover:bg-white/10 bg-transparent rounded-2xl h-10 min-h-[40px]"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="flex-1 bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black rounded-2xl h-10 min-h-[40px]"
            disabled={isLoading || !isFormValid}
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
                ? 'Create Job'
                : 'Update Job'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}