// components/auth/AuthLayout.tsx
'use client';
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AuthFormProps {
  heading: string;
  subheading?: string;
  buttonText: string;
  onButtonClick?: () => void;
  children: ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function AuthForm({
  heading,
  subheading,
  buttonText,
  onButtonClick,
  children,
  showBackButton = false,
  onBackClick,
}: AuthFormProps) {
  return (
    <div className="flex bg-transparent">
      <div
        className={`w-full space-y-6 py-6 ${
          showBackButton ? 'px-8' : 'px-6'
        } relative`}
      >
        {/* Back Button */}
        {showBackButton && (
          <button
            type="button"
            onClick={onBackClick}
            aria-label="Go back"
            className="text-white hover:text-yellow-400 transition cursor-pointer absolute left-0 py-3"
          >
            <ArrowLeft size={24} />
          </button>
        )}

        {/* Heading */}
        <div>
          <h1 className="text-white text-size-heading md:text-size-primary font-bold">
            {heading}
          </h1>
          {subheading && <p className="text-size-tertiary">{subheading}</p>}
        </div>

        {/* Input fields */}
        <div className="space-y-4">{children}</div>

        {/* Action button */}
        {/* <Button
          className="w-full py-5 rounded-sm bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button> */}
      </div>
    </div>
  );
}
