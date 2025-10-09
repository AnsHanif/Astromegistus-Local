import React from 'react';
import { Users } from 'lucide-react';
import { DataTable } from '@/components/common/data-table';
import { createUsersColumns, type User } from './users-columns';

interface UsersTableProps {
  users: User[];
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
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export function UsersTable({
  users,
  isLoading,
  error,
  searchTerm,
  pagination,
  currentPage,
  onPageChange,
  pageSize,
  onEdit,
  onDelete,
  onToggleStatus,
}: UsersTableProps) {
  const columns = createUsersColumns({
    onEdit,
    onDelete,
    onToggleStatus,
  });

  return (
    <DataTable
      columns={columns}
      data={users}
      title="Users"
      isLoading={isLoading}
      error={error}
      searchTerm={searchTerm}
      pagination={pagination}
      currentPage={currentPage}
      onPageChange={onPageChange}
      pageSize={pageSize}
      emptyState={{
        icon: <Users className="h-16 w-16 text-white/30 mx-auto mb-4" />,
        title: searchTerm ? 'No users found' : 'No users yet',
        description: searchTerm
          ? `No users match "${searchTerm}". Try a different search term.`
          : 'Get started by adding your first user to the system.',
      }}
    />
  );
}

export type { User };
