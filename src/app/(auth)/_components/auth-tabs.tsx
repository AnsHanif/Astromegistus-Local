'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function AuthTabs() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [bgStyle, setBgStyle] = useState<React.CSSProperties | undefined>();

  const tabs = [
    { id: 'login', label: 'Login', href: '/login' },
    { id: 'create', label: 'Create Your Account', href: '/signup' },
    { id: 'reset', label: 'Reset Password', href: '/reset-password' },
  ];

  const borderColor = 'rgba(255,255,255,0.95)'; // tweak to match your design
  const lineHeight = 1; // px

  // compute background-image that draws a full line but with a transparent gap
  const updateGap = useCallback(() => {
    const cont = containerRef.current;
    if (!cont) return;

    // find the active tab element inside the container by data attribute
    const activeEl = cont.querySelector<HTMLElement>(
      '[data-tab-active="true"]'
    );

    // fallback: draw a full line if no active element found
    if (!activeEl) {
      setBgStyle({
        backgroundImage: `linear-gradient(to right, ${borderColor} 0 100%)`,
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        backgroundSize: `100% ${lineHeight}px`,
      });
      return;
    }

    const contRect = cont.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();

    // start and end in px relative to container
    const start = Math.max(0, Math.round(elRect.left - contRect.left));
    const end = Math.max(start, start + Math.round(elRect.width));

    // Build a gradient: left solid -> transparent gap -> right solid
    // We use px values so it matches exactly even on responsive layouts
    const bg = `linear-gradient(
      to right,
      ${borderColor} 0 ${start}px,
      transparent ${start}px ${end}px,
      ${borderColor} ${end}px 100%
    )`;

    setBgStyle({
      backgroundImage: bg,
      backgroundPosition: 'bottom',
      backgroundRepeat: 'no-repeat',
      backgroundSize: `100% ${lineHeight}px`,
    });
  }, [borderColor]);

  // update when pathname changes and on mount
  useEffect(() => {
    updateGap();
  }, [pathname, updateGap]);

  // recompute on resize and when layout changes (ResizeObserver)
  useEffect(() => {
    const handleResize = () => updateGap();
    window.addEventListener('resize', handleResize);

    const ro = new ResizeObserver(() => updateGap());
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
    };
  }, [updateGap]);

  if (pathname === '/auth-selection') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      // inline bgStyle controls the continuous bottom line with gap
      style={bgStyle}
      className="relative overflow-hidden w-full"
    >
      <div className="flex gap-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              href={tab.href}
              key={tab.id}
              // mark active for the JS selector
              data-tab-active={isActive ? 'true' : 'false'}
              // styling: active vs inactive text + visual lift so it reads as selected
              className={`relative flex items-center text-center px-4 py-2 border-t border-l border-r border-transparent cursor-pointer text-sm font-medium transition-colors duration-200 outline-none ${
                isActive
                  ? 'z-10 text-golden-yellow border-t border-l border-r border-white border-b-transparent -mb-[1px]' // bring active above the line
                  : 'hover:text-golden-yellow'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
