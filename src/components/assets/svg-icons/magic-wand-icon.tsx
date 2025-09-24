import React, { FC } from 'react';
import { SvgIconProps } from '@/types';

const MagicWandIcon: FC<SvgIconProps> = ({
  width,
  height,
  className = '',
}) => {
  return (
    <svg
      width={width || 20}
      height={height || 20}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.4098 8.34997L11.0523 5.99331L14.5882 2.45831C14.7445 2.30208 14.9564 2.21432 15.1773 2.21432C15.3983 2.21432 15.6102 2.30208 15.7665 2.45831L16.9457 3.63664C17.1019 3.79291 17.1897 4.00484 17.1897 4.22581C17.1897 4.44678 17.1019 4.6587 16.9457 4.81497L13.4098 8.34997ZM12.2315 9.52914L3.98151 17.7791C3.82524 17.9354 3.61332 18.0231 3.39235 18.0231C3.17138 18.0231 2.95945 17.9354 2.80318 17.7791L1.62485 16.6C1.46862 16.4437 1.38086 16.2318 1.38086 16.0108C1.38086 15.7898 1.46862 15.5779 1.62485 15.4216L9.87485 7.17164L12.2315 9.52914ZM8.10651 1.86914L9.26735 2.45581L10.4632 1.86914L9.89735 3.08581L10.464 4.22581L9.31068 3.67247L8.10651 4.22581L8.68068 3.04247L8.10651 1.86914ZM16.3565 7.76081L17.5173 8.34831L18.7132 7.76164L18.1465 8.97831L18.7132 10.1183L17.5598 9.56497L16.3557 10.1183L16.9307 8.93497L16.3557 7.76164L16.3565 7.76081Z"
        fill="url(#paint0_linear_2049_3294)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2049_3294"
          x1="1.38086"
          y1="9.94613"
          x2="18.7132"
          y2="9.94613"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DAB612"/>
          <stop offset="0.5" stopColor="#EED66C"/>
          <stop offset="1" stopColor="#AB6A1C"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MagicWandIcon;