'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import {
  STATUS_COLORS,
  COACHING_CATEGORY_COLORS,
  COACHING_CATEGORY_LABELS,
} from '@/constants/orders';
import { SortableHeader } from '@/components/common/data-table';
import { SessionOrder } from './sessions-table';

export function createSessionsColumns(
  onViewDetails: (session: SessionOrder) => React.ReactNode
): ColumnDef<SessionOrder>[] {
  const getStatusColor = (status: string) => {
    return (
      STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
      'bg-gray-500/20 text-gray-400 border-gray-500/30'
    );
  };

  const getCategoryColor = (category: string) => {
    return (
      COACHING_CATEGORY_COLORS[
        category as keyof typeof COACHING_CATEGORY_COLORS
      ] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    );
  };

  const formatCategoryLabel = (category: string) => {
    return (
      COACHING_CATEGORY_LABELS[
        category as keyof typeof COACHING_CATEGORY_LABELS
      ] || category
    );
  };

  return [
    {
      accessorKey: 'user',
      header: ({ column }) => (
        <SortableHeader column={column}>Customer</SortableHeader>
      ),
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/30 overflow-hidden">
              {session.user.profilePic ? (
                <img
                  src={session.user.profilePic}
                  alt={session.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                  {session.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-white text-sm">
                {session.user.name}
              </div>
              <div className="text-xs text-white/50">{session.user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'session',
      header: ({ column }) => (
        <SortableHeader column={column}>Session</SortableHeader>
      ),
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div>
            <div className="font-medium text-white text-sm">
              {session.session.title}
            </div>
            <div className="text-xs text-white/50">
              {session.session.duration}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {session.session.features.slice(0, 2).map((feature: string) => (
                <span
                  key={feature}
                  className="px-1 py-0.5 bg-white/10 text-white/60 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'session.category',
      header: ({ column }) => (
        <SortableHeader column={column}>Category</SortableHeader>
      ),
      cell: ({ row }) => {
        const session = row.original;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
              session.session.category
            )}`}
          >
            {formatCategoryLabel(session.session.category)}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <SortableHeader column={column}>Status</SortableHeader>
      ),
      cell: ({ row }) => {
        const session = row.original;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              session.status
            )}`}
          >
            {session.status}
          </span>
        );
      },
    },
    {
      accessorKey: 'session.price',
      header: ({ column }) => (
        <SortableHeader column={column}>Price</SortableHeader>
      ),
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="font-medium text-white">
            ${session.session.price.toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: 'provider',
      header: 'Provider',
      cell: ({ row }) => {
        const session = row.original;
        return session.provider ? (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border border-white/30 overflow-hidden">
              {session.provider.profilePic ? (
                <img
                  src={session.provider.profilePic}
                  alt={session.provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-xs">
                  {session.provider.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-white text-sm font-medium">
              {session.provider.name}
            </div>
          </div>
        ) : (
          <span className="text-white/40 text-sm">Not assigned</span>
        );
      },
    },
    {
      accessorKey: 'selectedDate',
      header: ({ column }) => (
        <SortableHeader column={column}>Scheduled</SortableHeader>
      ),
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="text-white/70 text-sm">
            {session.selectedDate ? (
              <>
                <div>{new Date(session.selectedDate).toLocaleDateString()}</div>
                <div className="text-xs text-white/50">
                  {session.selectedTime} ({session.timezone})
                </div>
              </>
            ) : (
              <span className="text-white/40">Not scheduled</span>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const session = row.original;
        return (
          <div className="flex items-center gap-2">
            {onViewDetails(session)}
          </div>
        );
      },
    },
  ];
}
