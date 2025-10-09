'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Package,
  Home,
  GraduationCap,
  ShoppingCart,
  Briefcase,
  Radio,
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Coaching', href: '/admin/coaching', icon: GraduationCap },
  { label: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { label: 'Radio Shows', href: '/admin/radio-shows', icon: Radio },
  {
    label: 'Orders',
    icon: ShoppingCart,
    subItems: [
      { label: 'Readings', href: '/admin/orders/readings', icon: BookOpen },
      { label: 'Sessions', href: '/admin/orders/sessions', icon: Calendar },
    ],
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemLabel)
        ? prev.filter((label) => label !== itemLabel)
        : [...prev, itemLabel]
    );
  };

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          bg-emerald-green/10 border-r border-white/10 min-h-screen
          transform transition-transform duration-300 ease-in-out
          shadow-2xl lg:shadow-none overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="p-4 pt-6 lg:pt-4">
          <ul className="space-y-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;

              if (hasSubItems) {
                const isParentActive = item.subItems.some(
                  (subItem) => pathname === subItem.href
                );
                const isExpanded =
                  expandedItems.includes(item.label) || isParentActive;
                const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

                return (
                  <li key={item.label}>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] touch-manipulation ${
                        isParentActive
                          ? 'bg-white/5 text-white'
                          : 'text-white hover:bg-white/10 hover:text-white'
                      }`}
                      aria-expanded={isExpanded}
                      aria-label={`Toggle ${item.label} menu`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium truncate">{item.label}</span>
                      </div>
                      <ChevronIcon className="h-4 w-4 flex-shrink-0" />
                    </button>
                    {isExpanded && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.subItems.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isActive = pathname === subItem.href;

                          return (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                onClick={handleLinkClick}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 min-h-[40px] touch-manipulation ${
                                  isActive
                                    ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black font-semibold'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                <SubIcon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{subItem.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              const isActive = item.href ? pathname === item.href : false;

              return (
                <li key={item.href || item.label}>
                  <Link
                    href={item.href || '#'}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] touch-manipulation ${
                      isActive
                        ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black font-semibold'
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;
