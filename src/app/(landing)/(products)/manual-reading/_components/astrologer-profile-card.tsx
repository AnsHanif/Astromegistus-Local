'use client';

import Image from 'next/image';
import CustomCheckbox from '@/components/common/custom-checkbox/custom-checkbox';

interface AstrologerProfileCardProps {
  name: string;
  role: string;
  availability: string;
  imageUrl: string;
  isChecked?: boolean;
  onSelect: () => void;
}

export default function AstrologerProfileCard({
  name,
  role,
  availability,
  imageUrl,
  isChecked = false,
  onSelect,
}: AstrologerProfileCardProps) {
  return (
    <div
      onClick={onSelect}
      className="flex items-center cursor-pointer relative max-w-[380px] rounded-full w-full"
    >
      {/* Profile Image */}

      <div className="p-[4px] absolute -left-6 z-10 rounded-full bg-gradient-to-r from-[#DAB612] via-[#EED66C] to-[#AB6A1C] inline-block">
        <Image
          src={imageUrl}
          alt={name}
          width={50}
          height={50}
          className="h-[50px] md:h-[80px] max-w-[50px] md:max-w-[80px] w-full object-cover rounded-full bg-white"
        />
      </div>

      {/* Card Container */}
      <div className="relative">
        {/* Shape Image */}
        <Image
          width={260}
          height={100}
          src="/astrologer-card-shape.png"
          alt="Astrologer Card Shape"
          className="max-w-[400px] w-full min-h-[120px] min-w-[220px] h-[180px] object-contain"
        />

        {/* Centered Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="flex items-start gap-2 ml-12">
            <CustomCheckbox
              checked={isChecked}
              onChange={onSelect}
              className="mt-1 min-w-[20px]"
            />
            <div className="text-left">
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm">{role}</p>
              <p className="text-xs">Availability: {availability}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
