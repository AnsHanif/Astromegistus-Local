import React from 'react';
import { Package } from 'lucide-react';
import { DataTable } from '@/components/common/data-table';
import { createReadingsColumns } from './readings-columns';

export interface ReadingOrder {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  completedAt?: string;
  notes?: string;
  providerId?: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
    role: string;
  } | null;
  product: {
    id: string;
    name: string;
    description?: string;
    categories: string[];
    automatedPrice: number;
    livePrice: number;
    duration?: string;
    productType: string;
  };
  persons: {
    id: string;
    fullName: string;
    dateOfBirth: string;
    timeOfBirth?: string;
    placeOfBirth?: string;
  }[];
}

interface ReadingsTableProps {
  readings: ReadingOrder[];
  isLoading: boolean;
  error?: any;
  searchTerm: string;
  pagination?: {
    total: number;
    pages: number;
  };
  currentPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onViewDetails: (reading: ReadingOrder) => React.ReactNode;
}

export function ReadingsTable({
  readings,
  isLoading,
  error,
  searchTerm,
  pagination,
  currentPage,
  onPageChange,
  pageSize,
  onViewDetails,
}: ReadingsTableProps) {
  const columns = createReadingsColumns(onViewDetails);

  return (
    <DataTable
      columns={columns}
      data={readings}
      title="Reading Orders"
      isLoading={isLoading}
      error={error}
      searchTerm={searchTerm}
      pagination={pagination}
      currentPage={currentPage}
      onPageChange={onPageChange}
      pageSize={pageSize}
      emptyState={{
        icon: <Package className="h-16 w-16 text-white/30 mx-auto mb-4" />,
        title: searchTerm ? 'No readings found' : 'No reading orders yet',
        description: searchTerm
          ? `No readings match "${searchTerm}". Try a different search term.`
          : 'Reading orders will appear here when users book astrology readings.',
      }}
    />
  );
}
