'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  validateImageFile,
  uploadFileToS3,
  formatFileSize,
} from '@/services/api/s3-image-api';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove?: () => void;
  onError?: (error: string) => void;
  handleImageUpload: (file: File) => Promise<string>;
  onImageDelete?: () => Promise<void>;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  showDeleteButton?: boolean;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  onError,
  handleImageUpload,
  onImageDelete,
  className = '',
  disabled = false,
  placeholder = 'Click to upload image',
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  showDeleteButton = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );

  // Update preview when currentImageUrl changes (for edit mode)
  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [currentImageUrl]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Validate file
      const validation = validateImageFile(file, maxSize);
      if (!validation.isValid) {
        onError?.(validation.error || 'Invalid file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      try {
        setIsUploading(true);
        setUploadProgress(0);

        // Use the handleImageUpload function directly
        const imageUrl = await handleImageUpload(file);

        // Simulate progress for better UX
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(i);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        onImageUpload(imageUrl);
      } catch (error) {
        console.error('Upload failed:', error);
        onError?.(error instanceof Error ? error.message : 'Upload failed');
        setPreviewUrl(currentImageUrl || null);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [handleImageUpload, onImageUpload, onError, currentImageUrl]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async () => {
    if (!onImageDelete) return;

    try {
      setIsDeleting(true);
      await onImageDelete();
      setPreviewUrl(null);
      onImageRemove?.();
    } catch (error) {
      console.error('Error deleting image:', error);
      onError?.(
        error instanceof Error ? error.message : 'Failed to delete image'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${
            previewUrl
              ? 'border-golden-glow/50 bg-golden-glow/5'
              : 'border-white/30 hover:border-golden-glow/50 hover:bg-white/5'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isUploading ? 'cursor-wait' : ''}
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            {!disabled && !isUploading && (
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  title="Remove from form"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {isUploading ? (
              <div className="space-y-2">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-golden-glow" />
                <p className="text-sm text-white/70">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-golden-glow h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="h-8 w-8 mx-auto text-white/50" />
                <div>
                  <p className="text-sm font-medium text-white/90">
                    {placeholder}
                  </p>
                  <p className="text-xs text-white/50">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-xs text-white/40">
                    Max {maxSize}MB •{' '}
                    {acceptedTypes
                      .map((type) => type.split('/')[1].toUpperCase())
                      .join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {currentImageUrl && !previewUrl && (
        <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4 text-white/50" />
            <span className="text-sm text-white/70">Current image</span>
          </div>
          {!disabled && !isUploading && onImageRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
