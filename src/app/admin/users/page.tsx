'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/common/search-bar/search-bar';
import ConfirmationModal from '@/components/common/confirmation-modal';
import UserFormModal from '@/components/common/user-form-modal';
import { Filter, Plus, Edit, Trash2, Eye, Loader2, Users } from 'lucide-react';
import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useEnableUser,
  useDisableUser,
} from '@/hooks/mutation/admin-mutation/admin-mutations';
import { useAdminUsers as useAdminUsersQuery } from '@/hooks/query/admin-queries';
import { CustomSelect } from '@/components/common/custom-select/custom-select';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // React Query hooks
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useAdminUsersQuery({
    search: debouncedSearchTerm || undefined,
    status: filterStatus === 'All' ? undefined : filterStatus === 'Active',
  });

  // Debug: Log when data changes
  useEffect(() => {
    console.log('Users data updated:', usersResponse);
  }, [usersResponse]);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const enableUserMutation = useEnableUser();
  const disableUserMutation = useDisableUser();

  // Extract users array from response, handle different response structures
  const users = Array.isArray(usersResponse)
    ? usersResponse
    : Array.isArray((usersResponse as any)?.data?.data?.users)
      ? (usersResponse as any).data.data.users
      : Array.isArray(usersResponse?.data)
        ? usersResponse.data
        : [];

  // No need for frontend filtering since API handles search and status filtering
  const filteredUsers = users;

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black';
      case 'ASTROMEGISTUS':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ASTROMEGISTUS_COACH':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PAID':
        return 'bg-emerald-green text-white';
      case 'GUEST':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getDummyPasswordColor = (dummyPassword: boolean) => {
    return dummyPassword
      ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      : 'bg-green-500/20 text-green-400 border-green-500/30';
  };

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

  const handleDeleteUser = (user: any) => {
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

  const handleEnableUser = (userId: string) => {
    enableUserMutation.mutate(userId);
  };

  const handleDisableUser = (userId: string) => {
    disableUserMutation.mutate(userId);
  };

  const handleEditUser = (user: any) => {
    if (user && user.id) {
      setEditingUser(user);
      setIsEditUserModalOpen(true);
    }
  };

  const handleUpdateUser = (userData: any) => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-white/70 mt-2">Manage and monitor user accounts</p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black rounded-2xl"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search users..."
                value={searchTerm}
                onSearch={setSearchTerm}
                className="[&_input]:bg-white/5 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_svg]:text-white/50 [&_input]:focus:border-white/40 [&_input]:focus:ring-0 [&_input]:focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <CustomSelect
                options={[
                  { label: 'All Status', value: 'All' },
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
                selectedValue={filterStatus}
                onSelect={setFilterStatus}
                placeholder="All Status"
                variant="large"
                triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 min-h-[40px]"
                contentClassName="bg-emerald-green/20 border-white/20 shadow-lg"
                itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-emerald-green/10 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-white/70">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading users...
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-400">
                Error loading users. Please try again.
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <Users className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {searchTerm ? 'No users found' : 'No users yet'}
                </h3>
                <p className="text-white/50 mb-6">
                  {searchTerm
                    ? `No users match "${searchTerm}". Try a different search term.`
                    : 'Get started by adding your first user to the system.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Password
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Join Date
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: any) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden">
                            {user.profilePic ? (
                              <img
                                src={user.profilePic || '/astrologist.png'}
                                alt={user.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error(
                                    'User profile image failed to load:',
                                    e.currentTarget.src
                                  );
                                  // Show fallback when image fails to load
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget
                                    .nextElementSibling as HTMLElement;
                                  if (fallback) {
                                    fallback.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            {/* Fallback dummy image - always present but hidden when real image loads */}
                            <div
                              className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ${
                                user.profilePic ? 'hidden' : 'flex'
                              }`}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-white/50">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            user.status || user.isActive
                          )}`}
                        >
                          {user.status || user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getDummyPasswordColor(
                            user.dummyPassword || false
                          )}`}
                        >
                          {user.dummyPassword ? 'Dummy' : 'Real'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white/70">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/10 p-1"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-yellow-400 hover:bg-yellow-500/10 p-1"
                              onClick={() => handleDisableUser(user.id)}
                              disabled={disableUserMutation.isPending}
                            >
                              {disableUserMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-400 hover:bg-green-500/10 p-1"
                              onClick={() => handleEnableUser(user.id)}
                              disabled={enableUserMutation.isPending}
                            >
                              {enableUserMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-500/10 p-1"
                            onClick={() => handleDeleteUser(user)}
                            disabled={deleteUserMutation.isPending}
                          >
                            {deleteUserMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
        }}
        onSubmit={handleUpdateUser}
        title="Edit User"
        mode="edit"
        initialData={editingUser}
        isLoading={updateUserMutation.isPending}
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
