'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CustomSelectProps {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  selectedValue?: string;
  placeholder?: string;
  disabled?: boolean;
  selectedIcon?: ReactNode;
  triggerTextClassName?: string;
  showChevron?: boolean;

  // Styling props
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  chevronClassName?: string;

  // Size and variant presets
  variant?: 'default' | 'compact' | 'large';
  size?: 'sm' | 'md' | 'lg';

  // Content customization
  contentWidth?: string | 'auto'; // "auto" will match trigger width
  maxHeight?: string;
  align?: 'start' | 'center' | 'end';
}

const variants = {
  default: {
    trigger:
      'inline-flex items-center gap-2 px-4 py-2 border border-gray bg-white text-sm font-medium hover:border-white transition-colors focus:border-gradient',
    content: 'bg-white border border-gray-200 shadow-lg rounded-md',
    item: 'cursor-pointer px-3 py-2 text-sm text-gray-900',
  },
  compact: {
    trigger:
      'inline-flex items-center gap-1 px-3 py-1 border border-gray-300 bg-white text-xs font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-colors whitespace-nowrap focus:border-gradient',
    content: 'bg-white border border-gray-200 shadow-lg rounded-md',
    item: 'cursor-pointer px-2 py-1.5 text-xs hover:bg-gray-100 text-gray-900',
  },
  large: {
    trigger:
      'inline-flex items-center gap-3 px-6 py-4 border border-gray-300 bg-white text-base font-medium text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-colors w-full focus:border-gradient',
    content: 'bg-white border border-gray-200 shadow-lg rounded-lg',
    item: 'cursor-pointer px-4 py-3 text-base hover:bg-gray-100 text-gray-900',
  },
};

const sizes = {
  sm: {
    trigger: 'h-8 text-xs',
    chevron: 'h-3 w-3',
  },
  md: {
    trigger: 'h-10 text-sm',
    chevron: 'h-4 w-4',
  },
  lg: {
    trigger: 'h-12 text-base',
    chevron: 'h-5 w-5',
  },
};

export function CustomSelect({
  options,
  onSelect,
  selectedValue,
  placeholder = 'Select option',
  disabled = false,
  className,
  selectedIcon,
  triggerClassName,
  contentClassName,
  itemClassName,
  triggerTextClassName = '',
  showChevron = true,
  chevronClassName,
  variant = 'default',
  size = 'md',
  contentWidth = 'auto', // Default to auto to match trigger width
  maxHeight = 'max-h-56',
  align = 'start',
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState<number>(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((o) => o.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  // Update trigger width when component mounts or when open state changes
  useEffect(() => {
    if (triggerRef.current && contentWidth === 'auto') {
      const rect = triggerRef.current.getBoundingClientRect();
      setTriggerWidth(rect.width);
    }
  }, [open, contentWidth]);

  // Determine content width style
  const getContentWidthStyle = () => {
    if (contentWidth === 'auto') {
      return { width: `${triggerWidth}px` };
    }
    return {};
  };

  const getContentWidthClass = () => {
    if (contentWidth === 'auto') {
      return ''; // We'll use inline style for auto width
    }
    return contentWidth || 'w-[200px]';
  };

  return (
    <div className={cn('relative', className)}>
      <DropdownMenu open={open} modal={false} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button
            ref={triggerRef}
            type="button"
            className={cn(
              variantStyles.trigger,
              sizeStyles.trigger,
              disabled && 'opacity-50 cursor-not-allowed',
              'outline-none ',
              triggerClassName
            )}
          >
            <span
              className={`truncate flex items-center flex-1 text-left ${triggerTextClassName}`}
            >
              {selectedIcon && <span className="mr-2">{selectedIcon}</span>}
              {displayText}
            </span>
            {showChevron && (
              <ChevronDown
                className={cn(
                  'shrink-0 transition-transform',
                  sizeStyles.chevron,
                  // open && 'rotate-180',
                  chevronClassName
                )}
              />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className={cn(
            variantStyles.content,
            getContentWidthClass(),
            contentClassName
          )}
          style={getContentWidthStyle()}
        >
          <div className={cn('overflow-y-auto', maxHeight)}>
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-400 text-sm">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <DropdownMenuItem
                    key={option.value}
                    onSelect={() => {
                      onSelect(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      variantStyles.item,
                      isSelected && 'bg-golden-glow text-black font-semibold',
                      itemClassName
                    )}
                  >
                    {option.label}
                  </DropdownMenuItem>
                );
              })
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
