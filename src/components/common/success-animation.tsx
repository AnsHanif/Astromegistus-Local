import React, { FC } from 'react';
import Lottie from 'lottie-react';
import successAnimation from '@/components/assets/lottie/success-lottie.json';

interface SuccessAnimationProps {
  classNames?: string;
}

const SuccessAnimation: FC<SuccessAnimationProps> = ({ classNames = '' }) => {
  return (
    <div
      className={`flex justify-center items-center h-[200px] w-[200px] mx-auto ${classNames}`}
    >
      <Lottie
        animationData={successAnimation}
        loop={false} // false means it plays once
        autoplay={true}
      />
    </div>
  );
};

export default SuccessAnimation;
