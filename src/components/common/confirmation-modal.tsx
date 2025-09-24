'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import Modal from '@/components/common/modal';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'delete' | 'warning' | 'info';
  itemName?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'delete',
  itemName,
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (variant) {
      case 'delete':
        return <Trash2 className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (variant) {
      case 'delete':
        return 'flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl h-10 min-h-[40px]';
      case 'warning':
        return 'flex-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-2xl h-10 min-h-[40px]';
      default:
        return 'flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-10 min-h-[40px]';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} icon={getIcon()}>
      <div className="space-y-4">
        <p className="text-white/80">
          {message}
          {itemName && (
            <>
              {' '}
              <span className="font-semibold text-white">{itemName}</span>
            </>
          )}
          ? This action cannot be undone.
        </p>

        <div className="flex gap-3 pt-4">
          <Button
            variant="default"
            className="flex-1 border border-white/20 text-white hover:bg-white/10 bg-transparent rounded-2xl h-10 min-h-[40px]"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant="default"
            className={getConfirmButtonStyle()}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              getIcon()
            )}
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
