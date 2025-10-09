import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowUpDown, Power } from 'lucide-react';
import { SortableHeader } from '@/components/common/data-table';
import { UserDetailSheet } from './user-detail-sheet';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
  isActive?: boolean;
  verified: boolean;
  dummyPassword?: boolean;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  languages?: string[];
  astrologyCategories?: string[];
  coachingCategories?: string[];
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  taxIdentification?: string;
  additionalComments?: string;
  adminNotes?: string;
}

interface UsersColumnsProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black';
    case 'ASTROMEGISTUS':
      return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case 'ASTROMEGISTUS_COACH':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'PAID':
      return 'bg-emerald-green text-white';
    case 'GUEST':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusColor = (isActive: boolean) => {
  return isActive
    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
    : 'bg-red-500/20 text-red-400 border border-red-500/30';
};

const getActionStatusColor = (isActive: boolean) => {
  return isActive
    ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
    : 'text-red-400 hover:text-red-300 hover:bg-red-500/10';
};

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'ASTROMEGISTUS':
      return 'ASTROLOGER';
    case 'ASTROMEGISTUS_COACH':
      return 'COACH';
    default:
      return role;
  }
};

const getTypeColor = (type: 'AUTOMATED' | 'MANUAL') => {
  return type === 'AUTOMATED'
    ? 'bg-green-500/20 text-green-400'
    : 'bg-blue-500/20 text-blue-400';
};

export function createUsersColumns({
  onEdit,
  onDelete,
  onToggleStatus,
}: UsersColumnsProps): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <SortableHeader column={column}>Customer</SortableHeader>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3 py-2">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full border border-white/30 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center text-white font-semibold text-xs ${
                    user.profilePic ? 'hidden' : 'flex'
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-white text-sm truncate">
                {user.name}
              </div>
              <div className="text-xs text-white/50 truncate">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <SortableHeader column={column}>Role</SortableHeader>
      ),
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
          >
            {getRoleDisplayName(role)}
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
        const user = row.original;
        const isActive = Boolean(user.status || user.isActive);
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(isActive)}`}
          >
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        );
      },
    },
    {
      accessorKey: 'verified',
      header: ({ column }) => (
        <SortableHeader column={column}>Approval</SortableHeader>
      ),
      cell: ({ row }) => {
        const verified = row.getValue('verified') as boolean;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              verified
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}
          >
            {verified ? 'VERIFIED' : 'PENDING'}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <SortableHeader column={column}>Joined</SortableHeader>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt') as string);
        return (
          <div className="text-white/70 text-sm">
            {date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            <div className="text-xs text-white/40">
              {date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/New_York',
              })}
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        const isActive = Boolean(user.status || user.isActive);

        return (
          <div className="flex items-center space-x-1">
            <UserDetailSheet user={user} onToggleStatus={onToggleStatus} />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(user)}
              className={`h-8 w-8 p-0 transition-colors ${getActionStatusColor(isActive)}`}
              title={isActive ? 'Deactivate user' : 'Activate user'}
            >
              <Power className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(user)}
              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              title="Delete user"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            {(user.role === 'ASTROMEGISTUS' ||
              user.role === 'ASTROMEGISTUS_COACH') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(user)}
                className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                title="Edit user"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
