import React from 'react';
import { GraduationCap } from 'lucide-react';
// import { DataTable } from './data-table';
import { createSessionsColumns } from './sessions-columns';
import { DataTable } from '@/components/common/data-table';

export interface SessionOrder {
  id: string;
  userId: string;
  sessionId: string;
  providerId?: string;
  selectedDate?: string;
  selectedTime?: string;
  timezone?: string;
  status: string;
  completedAt?: string;
  notes?: string;
  materialFiles?: any[];
  createdAt: string;
  updatedAt: string;
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
  session: {
    id: string;
    title: string;
    description?: string;
    shortDescription?: string;
    duration: string;
    price: number;
    category: string;
    features: string[];
    packages?: any;
    imageUrl?: string;
    imageUrlKey?: string;
  };
}

interface SessionsTableProps {
  sessions: SessionOrder[];
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
  onViewDetails: (session: SessionOrder) => React.ReactNode;
}

export function SessionsTable({
  sessions,
  isLoading,
  error,
  searchTerm,
  pagination,
  currentPage,
  onPageChange,
  pageSize,
  onViewDetails,
}: SessionsTableProps) {
  const columns = createSessionsColumns(onViewDetails);

  return (
    <DataTable
      columns={columns}
      data={sessions}
      title="Coaching Session Orders"
      isLoading={isLoading}
      error={error}
      searchTerm={searchTerm}
      pagination={pagination}
      currentPage={currentPage}
      onPageChange={onPageChange}
      pageSize={pageSize}
      emptyState={{
        icon: (
          <GraduationCap className="h-16 w-16 text-white/30 mx-auto mb-4" />
        ),
        title: searchTerm
          ? 'No sessions found'
          : 'No coaching session orders yet',
        description: searchTerm
          ? `No sessions match "${searchTerm}". Try a different search term.`
          : 'Coaching session bookings will appear here when users book sessions.',
      }}
    />
  );
}
