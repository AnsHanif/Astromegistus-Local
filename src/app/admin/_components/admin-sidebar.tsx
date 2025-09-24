'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Package, Home, GraduationCap, ShoppingCart, BookOpen, Calendar, ChevronDown, ChevronRight } from 'lucide-react';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Coaching', href: '/admin/coaching', icon: GraduationCap },
  {
    label: 'Orders',
    icon: ShoppingCart,
    subItems: [
      { label: 'Readings', href: '/admin/orders/readings', icon: BookOpen },
      { label: 'Sessions', href: '/admin/orders/sessions', icon: Calendar },
    ]
  },
];

function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemLabel: string) => {
    setExpandedItems(prev =>
      prev.includes(itemLabel)
        ? prev.filter(label => label !== itemLabel)
        : [...prev, itemLabel]
    );
  };

  return (
    <aside className="w-64 bg-emerald-green/10 border-r border-white/10 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;

            if (hasSubItems) {
              const isParentActive = item.subItems.some(subItem => pathname === subItem.href);
              const isExpanded = expandedItems.includes(item.label) || isParentActive;
              const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

              return (
                <li key={item.label}>
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isParentActive
                        ? 'bg-white/5 text-white'
                        : 'text-white hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronIcon className="h-4 w-4" />
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
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black font-semibold'
                                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <SubIcon className="h-4 w-4" />
                              <span>{subItem.label}</span>
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black font-semibold'
                      : 'text-white hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
