import ReschedulingIcon from '@/components/assets/svg-icons/products/rescheduling-icon';
import CustomModal from '@/components/common/custom-modal';
import { Button } from '@/components/ui/button';
import { DialogProps } from '@/types';
import React, { FC } from 'react';

interface ConfirmRescheduleModalProps extends DialogProps {
  name: string;
  newDate: string;
  currentDate?: string;
  currentTime?: string;
  newTime?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
}

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

const ConfirmRescheduleModal: FC<ConfirmRescheduleModalProps> = ({
  isOpen,
  onClose,
  name,
  newDate,
  currentDate,
  currentTime,
  newTime,
  onConfirm,
  isLoading = false,
  classNames = '',
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      styles={modalStyles}
      showCloseIcon={true}
    >
      <div className="flex flex-col gap-6 p-8 py-12 items-center text-center max-w-[25rem] w-full mx-auto">
        {/* Icon */}
        <ReschedulingIcon className="w-16 h-16 text-emerald-green" />

        {/* Title */}
        <h2 className="text-size-large font-semibold md:text-size-heading">
          Confirm Reschedule
        </h2>

        {/* Subtitle */}
        <p className="text-sm">You are rescheduling your session with {name}</p>

        {/* New session info */}
        <div className="flex justify-between w-full text-sm font-medium">
          <span>New Session</span>
          <span className="font-semibold">{newDate} {newTime && `at ${newTime}`}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col w-full gap-3">
          <Button 
            className="bg-emerald-green hover:bg-emerald-green/90 text-white w-full disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Rescheduling...' : 'Confirm Rescheduling'}
          </Button>
          <Button
            variant="outline"
            className="w-full hover:bg-grey-light-50 text-emerald-green border-emerald-green"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ConfirmRescheduleModal;
