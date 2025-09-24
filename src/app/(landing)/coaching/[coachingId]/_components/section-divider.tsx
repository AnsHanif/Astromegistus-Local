import React, { FC } from 'react';

interface SectionDividerProps {
  text?: string;
  classNames?: string;
}

const SectionDivider: FC<SectionDividerProps> = ({
  text = 'Read more',
  classNames,
}) => {
  return (
    <div className={`flex items-center w-full ${classNames}`}>
      {/* Left Line */}
      <div className="flex-1 max-w-18 h-px bg-bronze"></div>

      {/* Center Content */}
      <div className="flex items-center gap-3 mx-4">
        {/* Left Dots */}
        <span className="w-1.5 h-1.5 rounded-full bg-bronze"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-bronze"></span>

        {/* Text */}
        <span className="text-sm font-medium text-black">{text}</span>

        {/* Right Dots */}
        <span className="w-2.5 h-2.5 rounded-full bg-bronze"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-bronze"></span>
      </div>

      {/* Right Line */}
      <div className="flex-1 h-px bg-bronze"></div>
    </div>
  );
};

export default SectionDivider;
