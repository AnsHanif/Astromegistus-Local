'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  icon,
  maxWidth = 'max-w-2xl',
}: ModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4"
      onClick={onClose} // Close on outside click
    >
      <div
        className={`bg-emerald-green border-white/30 shadow-2xl w-full ${maxWidth} max-h-[90vh] rounded-lg flex flex-col`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex flex-row items-center justify-between border-b border-white/10 p-6 flex-shrink-0">
          <h2 className="text-white flex items-center gap-2 text-lg font-semibold">
            {icon}
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gradient-to-r hover:from-golden-glow hover:via-pink-shade hover:to-golden-glow-dark hover:text-black transition-all duration-200 p-1 h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
