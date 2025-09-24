'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { STATUS_COLORS, READING_TYPE_COLORS } from '@/constants/orders';
import { SortableHeader } from '@/components/common/data-table';
import { ReadingOrder } from './readings-table';

export function createReadingsColumns(
  onViewDetails: (reading: ReadingOrder) => React.ReactNode
): ColumnDef<ReadingOrder>[] {
  const getStatusColor = (status: string) => {
    return (
      STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
      'bg-gray-500/20 text-gray-400 border-gray-500/30'
    );
  };

  const getTypeColor = (type: string) => {
    return (
      READING_TYPE_COLORS[type as keyof typeof READING_TYPE_COLORS] ||
      'bg-gray-500/20 text-gray-400 border-gray-500/30'
    );
  };

  const formatPrice = (reading: ReadingOrder) => {
    const price =
      reading.type === 'AUTOMATED'
        ? reading.product.automatedPrice
        : reading.product.livePrice;
    return `$${price.toFixed(2)}`;
  };

  return [
    {
      accessorKey: 'user',
      header: ({ column }) => (
        <SortableHeader column={column}>Customer</SortableHeader>
      ),
      cell: ({ row }) => {
        const reading = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/30 overflow-hidden">
              {reading.user.profilePic ? (
                <img
                  src={reading.user.profilePic}
                  alt={reading.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                  {reading.user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-white text-sm">
                {reading.user.name}
              </div>
              <div className="text-xs text-white/50">{reading.user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'product',
      header: ({ column }) => (
        <SortableHeader column={column}>Product</SortableHeader>
      ),
      cell: ({ row }) => {
        const reading = row.original;
        return (
          <div>
            <div className="font-medium text-white text-sm">
              {reading.product.name}
            </div>
            <div className="text-xs text-white/50">
              {reading.product.duration}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {reading.product.categories
                .slice(0, 2)
                .map((category: string) => (
                  <span
                    key={category}
                    className="px-1 py-0.5 bg-white/10 text-white/60 rounded text-xs"
                  >
                    {category.replace('_', ' ')}
                  </span>
                ))}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <SortableHeader column={column}>Type</SortableHeader>
      ),
      cell: ({ row }) => {
        const reading = row.original;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
              reading.type
            )}`}
          >
            {reading.type}
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
        const reading = row.original;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              reading.status
            )}`}
          >
            {reading.status}
          </span>
        );
      },
    },
    {
      id: 'price',
      header: ({ column }) => (
        <SortableHeader column={column}>Price</SortableHeader>
      ),
      cell: ({ row }) => {
        const reading = row.original;
        return (
          <div className="font-medium text-white">{formatPrice(reading)}</div>
        );
      },
    },
    {
      accessorKey: 'provider',
      header: 'Provider',
      cell: ({ row }) => {
        const reading = row.original;
        return reading.provider ? (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border border-white/30 overflow-hidden">
              {reading.provider.profilePic ? (
                <img
                  src={reading.provider.profilePic}
                  alt={reading.provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-xs">
                  {reading.provider.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-white text-sm font-medium">
              {reading.provider.name}
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
        const reading = row.original;
        return (
          <div className="text-white/70 text-sm">
            {reading.selectedDate ? (
              <>
                <div>{new Date(reading.selectedDate).toLocaleDateString()}</div>
                <div className="text-xs text-white/50">
                  {reading.selectedTime} ({reading.timezone})
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
        const reading = row.original;
        return (
          <div className="flex items-center gap-2">
            {onViewDetails(reading)}
          </div>
        );
      },
    },
  ];
}
