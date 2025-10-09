'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/common/confirmation-modal';
import UserFormModal from '@/app/admin/users/_components/user-form-modal';
import { Plus } from 'lucide-react';
import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useEnableUser,
  useDisableUser,
} from '@/hooks/mutation/admin-mutation/admin-mutations';
import { useAdminUsers as useAdminUsersQuery, useAdminUser } from '@/hooks/query/admin-queries';

// Import modular components
import {
  UserAnalyticsCards,
  type UserAnalyticsData,
} from './_components/analytics-cards';
import {
  UsersFilters,
  type UserStatusFilter,
  type UserRoleFilter,
  type UserVerifiedFilter,
} from './_components/users-filters';
import { UsersTable, type User } from './_components/users-table';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<UserStatusFilter>('All');
  const [filterRole, setFilterRole] = useState<UserRoleFilter>('All');
  const [filterVerified, setFilterVerified] =
    useState<UserVerifiedFilter>('All');
  const [page, setPage] = useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const limit = 10;

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterStatus, filterRole, filterVerified, debouncedSearchTerm]);

  // Build query parameters
  const queryParams = {
    page,
    limit,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(filterStatus !== 'All' && { status: filterStatus === 'Active' }),
    ...(filterRole !== 'All' && { role: filterRole }),
    ...(filterVerified !== 'All' && {
      verified: filterVerified === 'Approved',
    }),
  };

  // React Query hooks
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useAdminUsersQuery(queryParams);

  // Fetch comprehensive user data when editing
  const {
    data: comprehensiveUserResponse,
    isLoading: isLoadingComprehensiveUser,
  } = useAdminUser(editingUserId || '');

  // Debug: Log when data changes
  useEffect(() => {
    console.log('Users data updated:', usersResponse);
  }, [usersResponse]);

  // Debug: Log comprehensive user data when editing
  useEffect(() => {
    if (comprehensiveUserResponse?.data?.data?.user) {
      console.log('Comprehensive user data for editing:', comprehensiveUserResponse.data.data.user);
    }
  }, [comprehensiveUserResponse]);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const enableUserMutation = useEnableUser();
  const disableUserMutation = useDisableUser();

  // Extract users and pagination from response
  const users = Array.isArray(usersResponse)
    ? usersResponse
    : Array.isArray((usersResponse as any)?.data?.data?.users)
      ? (usersResponse as any).data.data.users
      : Array.isArray(usersResponse?.data)
        ? usersResponse.data
        : [];

  const pagination = (usersResponse as any)?.data?.data?.pagination;

  // Calculate analytics data
  const analytics: UserAnalyticsData = React.useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u: any) => u.status || u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;

    // Calculate new users this month (approximate from current data)
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const newUsersThisMonth = users.filter((u: any) => {
      const userDate = new Date(u.createdAt);
      return userDate >= firstDayOfMonth;
    }).length;

    const adminUsers = users.filter((u: any) => u.role === 'ADMIN').length;
    const professionalUsers = users.filter(
      (u: any) => u.role === 'ASTROMEGISTUS' || u.role === 'ASTROMEGISTUS_COACH'
    ).length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersThisMonth,
      adminUsers,
      professionalUsers,
    };
  }, [users]);

  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  const handleAddUser = (userData: any) => {
    createUserMutation.mutate(userData, {
      onSuccess: () => {
        // Small delay to ensure data is refreshed before closing modal
        setTimeout(() => {
          setIsAddUserModalOpen(false);
          setPendingImageFile(null);
        }, 100);
      },
    });
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteUserModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete.id);
        setIsDeleteUserModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEditUser = (user: User) => {
    if (user && user.id) {
      setEditingUser(user);
      setEditingUserId(user.id); // This will trigger the comprehensive user data fetch
      setIsEditUserModalOpen(true);
    }
  };

  const handleToggleStatus = (user: User) => {
    const isActive = user.status || user.isActive;
    if (isActive) {
      disableUserMutation.mutate(user.id);
    } else {
      enableUserMutation.mutate(user.id);
    }
  };

  const handleUpdateUser = (userData: any) => {
    if (!editingUser) return;

    updateUserMutation.mutate(
      { id: editingUser.id, data: userData },
      {
        onSuccess: () => {
          // Force refetch as fallback
          refetch();
          // Small delay to ensure data is refreshed before closing modal
          setTimeout(() => {
            setIsEditUserModalOpen(false);
            setEditingUser(null);
          }, 100);
        },
      }
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">Manage and monitor user accounts</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark hover:from-golden-glow-dark hover:via-golden-glow hover:to-pink-shade text-black font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="text-sm sm:text-base">Add User</span>
          </Button>
        </div>
      </div>

      {/* Analytics Section */}
      <UserAnalyticsCards analytics={analytics} pagination={pagination} />

      {/* Filters */}
      <UsersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterRole={filterRole}
        onRoleChange={setFilterRole}
        filterVerified={filterVerified}
        onVerifiedChange={setFilterVerified}
        searchPlaceholder="Search by user name, email..."
      />

      {/* Users Table */}
      <UsersTable
        users={users as User[]}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        pagination={
          pagination && {
            total: pagination.total,
            pages: pagination.pages,
          }
        }
        currentPage={page}
        onPageChange={setPage}
        pageSize={limit}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
      />

      {/* Add User Modal */}
      <UserFormModal
        key={isAddUserModalOpen ? 'add-modal' : 'add-modal-closed'}
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
        onImageFileChange={setPendingImageFile}
        title="Add New User"
        mode="add"
        isLoading={createUserMutation.isPending}
      />

      {/* Edit User Modal */}
      <UserFormModal
        key={editingUser?.id || 'edit-modal-closed'}
        isOpen={isEditUserModalOpen && !!editingUser}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setEditingUser(null);
          setEditingUserId(null);
        }}
        onSubmit={handleUpdateUser}
        title="Edit User"
        mode="edit"
        initialData={comprehensiveUserResponse?.data?.data?.user as any}
        isLoading={updateUserMutation.isPending || isLoadingComprehensiveUser}
      />

      {/* Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteUserModalOpen}
        onClose={() => {
          setIsDeleteUserModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete"
        confirmText="Delete User"
        cancelText="Cancel"
        isLoading={deleteUserMutation.isPending}
        variant="delete"
        itemName={userToDelete?.name || userToDelete?.email}
      />
    </div>
  );
}
