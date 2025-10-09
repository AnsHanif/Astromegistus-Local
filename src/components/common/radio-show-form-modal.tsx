'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Modal from '@/components/common/modal';
import { Radio, Plus, Edit, Loader2, Calendar } from 'lucide-react';

interface RadioShowData {
  id?: string;
  showTitle: string;
  hostName: string;
  date: string;
  time: string;
  link: string;
  isActive: boolean;
}

interface RadioShowFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (radioShowData: RadioShowData) => void;
  title: string;
  mode: 'add' | 'edit';
  initialData?: RadioShowData;
  isLoading?: boolean;
  existingRadioShows?: RadioShowData[];
}

export default function RadioShowFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  mode,
  initialData,
  isLoading = false,
  existingRadioShows = [],
}: RadioShowFormModalProps) {
  const [formData, setFormData] = useState<RadioShowData>({
    showTitle: '',
    hostName: '',
    date: '',
    time: '',
    link: '',
    isActive: true,
  });
  const [dateError, setDateError] = useState<string>('');

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        // Format date for input field (YYYY-MM-DD)
        const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '';

        setFormData({
          showTitle: initialData.showTitle || '',
          hostName: initialData.hostName || '',
          date: formattedDate,
          time: initialData.time || '',
          link: initialData.link || '',
          isActive: initialData.isActive ?? true,
        });
      } else {
        setFormData({
          showTitle: '',
          hostName: '',
          date: '',
          time: '',
          link: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleInputChange = (field: keyof RadioShowData, value: any) => {
    // Validate hostName to only allow letters and spaces
    if (field === 'hostName') {
      const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [field]: sanitizedValue,
      }));
    } else if (field === 'date') {
      // Check if a show already exists on this date
      setDateError('');
      const selectedDate = new Date(value).toISOString().split('T')[0];
      const isDuplicate = existingRadioShows.some(show => {
        const showDate = new Date(show.date).toISOString().split('T')[0];
        // In edit mode, exclude the current show being edited
        if (mode === 'edit' && initialData && show.id === initialData.id) {
          return false;
        }
        return showDate === selectedDate;
      });

      if (isDuplicate) {
        setDateError('A radio show already exists for this date. Only one show per day is allowed.');
      }

      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.showTitle.trim() || !formData.hostName.trim() || !formData.date || !formData.time.trim() || !formData.link.trim()) {
      return;
    }

    // Check for date error
    if (dateError) {
      return;
    }

    onSubmit(formData);
  };

  const isFormValid = formData.showTitle.trim() && formData.hostName.trim() && formData.date && formData.time.trim() && formData.link.trim() && !dateError;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={mode === 'add' ? <Plus className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Show Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Show Title *
          </label>
          <Input
            value={formData.showTitle}
            onChange={(e) => handleInputChange('showTitle', e.target.value)}
            placeholder="Enter show title"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
            disabled={isLoading}
          />
        </div>

        {/* Host Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Host Name *
          </label>
          <Input
            value={formData.hostName}
            onChange={(e) => handleInputChange('hostName', e.target.value)}
            placeholder="Enter host name"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
            disabled={isLoading}
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Date *
          </label>
          <div className="relative">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20 pr-10 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer ${dateError ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isLoading}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
          </div>
          {dateError && (
            <p className="text-red-400 text-xs mt-1">{dateError}</p>
          )}
        </div>

        {/* Time */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Time *
          </label>
          <Input
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            placeholder="e.g., 11:00 AM EST"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
            disabled={isLoading}
          />
        </div>

        {/* Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">
            Show Link *
          </label>
          <Input
            type="url"
            value={formData.link}
            onChange={(e) => handleInputChange('link', e.target.value)}
            placeholder="e.g., https://example.com/listen"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-golden-glow focus:ring-golden-glow/20"
            disabled={isLoading}
          />
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
            Active (visible on about us page)
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
                ? 'Create Radio Show'
                : 'Update Radio Show'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}