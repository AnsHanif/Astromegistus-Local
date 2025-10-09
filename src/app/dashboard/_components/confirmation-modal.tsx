'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import CustomModal from '@/components/common/custom-modal';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
  description: string;
  btn1Title: string;
  btn2Title: string;
  iconType: 'logout' | 'cancelSub';
  onSubmit: () => void;
  isLoading?: boolean;
  classNames?: string;
}

const ICON_URLS: Record<'logout' | 'cancelSub', string> = {
  logout:
    'https://lottie.host/e86357d3-2bb4-4282-aa6e-ec34a221b089/P6rzKY26M4.lottie',
  cancelSub:
    'https://lottie.host/b09be1b0-26f7-4c91-b4ad-62e073a34283/X61pZ7tPXX.lottie',
};

export default function ConfirmationModal({
  open,
  onClose,
  title,
  subTitle,
  description,
  btn1Title,
  btn2Title,
  iconType,
  onSubmit,
  isLoading = false,
  classNames = '',
}: ConfirmationModalProps) {
  const modalStyles = {
    modal: {
      maxHeight: '600px',
      borderRadius: '1rem',
      maxWidth: '35rem',
      width: '100%',
      background: '#fff',
      padding: 0,
    },
    closeIcon: {
      fill: '#444',
    },
  };

  return (
    <CustomModal
      isOpen={open}
      onClose={() => {
        if (!isLoading) onClose();
      }}
      styles={modalStyles}
      showCloseIcon={true}
    >
      <div
        className={`flex items-center justify-center bg-white ${classNames}`}
      >
        <div
          className="shadow-lg max-w-2xl w-full flex item-center justify-center px-4 md:px-8 py-8 md:py-12"
          style={{ background: 'var(--modal-bg)' }}
        >
          <div className="max-w-[470px] w-full text-center space-y-4">
            <div className="flex justify-center">
              <DotLottieReact
                src={ICON_URLS[iconType]}
                loop
                autoplay
                className={`w-32 h-32 ${
                  iconType === 'cancelSub' && 'scale-200'
                }`}
              />
            </div>

            <div>
              <h2 className="text-size-large md:text-size-heading font-semibold mb-2">
                {title}
              </h2>

              <p className="text-sm font-normal mb-3">{description}</p>

              <h2 className="text-size-medium md:text-size-large font-semibold">
                {subTitle}
              </h2>
            </div>

            <div className="space-y-4 pt-10">
              <Button
                onClick={onSubmit}
                disabled={isLoading}
                className="w-full bg-[#F80808] hover:bg-[#C90606] text-white outline-none focus-visible:ring-0 "
              >
                {isLoading ? 'Loading...' : btn1Title}
              </Button>

              <Button
                className="w-full bg-transparent text-golden-glow  border border-golden-glow hover:bg-golden-glow/20"
                onClick={onClose}
                disabled={isLoading}
              >
                {btn2Title}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
