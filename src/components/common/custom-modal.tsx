import { DialogProps } from '@/types';
import React, { CSSProperties, FC, ReactNode, useEffect } from 'react';
import ReactResponsiveModal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

interface CustomModalStyles {
  modal?: CSSProperties;
  closeIcon?: CSSProperties;
  modalContainer?: CSSProperties;
}

interface CustomModalProps extends DialogProps {
  children: ReactNode;
  showCloseIcon?: boolean;
  styles: CustomModalStyles;
  allowBackgroundScroll?: boolean;
}

const CustomModal: FC<CustomModalProps> = ({
  isOpen,
  onClose,
  children,
  styles,
  classNames,
  showCloseIcon = true,
  allowBackgroundScroll = true,
}) => {
  // useEffect(() => {
  //   if (isOpen) {
  //     // Save current scroll position
  //     const scrollY = window.scrollY;
  //     const body = document.body;
  //     const html = document.documentElement;

  //     // Lock scroll without position shift
  //     body.style.overflow = 'hidden';
  //     html.style.overflow = 'hidden';
  //     body.style.position = 'fixed';
  //     body.style.top = `-${scrollY}px`;
  //     body.style.width = '100%';
  //     body.style.touchAction = 'none'; // Disable iOS touch scrolling

  //     // Store scroll position in data attribute for cleanup
  //     body.dataset.scrollY = scrollY.toString();

  //     return () => {
  //       // Restore original styles
  //       body.style.overflow = '';
  //       // html.style.overflow = '';
  //       body.style.position = '';
  //       body.style.top = '';
  //       body.style.width = '';
  //       body.style.touchAction = '';

  //       // Restore scroll position from stored value
  //       const savedScrollY = parseInt(body.dataset.scrollY || '0', 10);
  //       window.scrollTo(0, savedScrollY);
  //       delete body.dataset.scrollY;
  //     };
  //   }
  // }, [isOpen]);

  return (
    <ReactResponsiveModal
      classNames={{
        modal: `m-0 p-0 !rounded-none ${classNames}`,
        closeButton: 'outline-none',
      }}
      blockScroll={allowBackgroundScroll}
      styles={{
        modal: {
          maxWidth: 'unset',
          padding: 'unset',
          margin: 'unset',
          background: 'transparent',
          width: '100%',
          ...styles?.modal,
        },
        modalContainer: {
          ...styles?.modalContainer,
        },
        closeIcon: {
          fill: styles?.closeIcon?.fill || '#000',
          marginTop: '.5rem',
        },
      }}
      open={isOpen}
      onClose={onClose}
      showCloseIcon={showCloseIcon}
      center
    >
      {children}
    </ReactResponsiveModal>
  );
};

export default CustomModal;
