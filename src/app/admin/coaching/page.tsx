'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/common/search-bar/search-bar';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import ConfirmationModal from '@/components/common/confirmation-modal';
import CoachingFormModal from '@/components/common/coaching-form-modal';
import {
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  Loader2,
  X,
  EyeOff,
  Eye,
} from 'lucide-react';
import { useAdminCoachingSessions } from '@/hooks/query/coaching-queries';
import {
  useCreateCoachingSessionWithImage,
  useUpdateCoachingSessionWithImage,
  useDeleteCoachingSession,
  useEnableCoachingSession,
  useDisableCoachingSession,
} from '@/hooks/mutation/coaching-mutations';
import { CoachingSession } from '@/types/coaching';

const CoachingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CoachingSession | null>(
    null
  );
  const [sessionToDelete, setSessionToDelete] =
    useState<CoachingSession | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Queries
  const {
    data: sessions,
    isLoading,
    error,
  } = useAdminCoachingSessions({
    search: debouncedSearchTerm || undefined,
    status: statusFilter === 'All' ? undefined : (statusFilter as any),
    category: categoryFilter === 'All' ? undefined : (categoryFilter as any),
  });

  // Mutations
  const createSessionMutation = useCreateCoachingSessionWithImage();
  const updateSessionMutation = useUpdateCoachingSessionWithImage();
  const deleteSessionMutation = useDeleteCoachingSession();
  const enableSessionMutation = useEnableCoachingSession();
  const disableSessionMutation = useDisableCoachingSession();

  const filteredSessions =
    sessions?.filter((session) => {
      const matchesStatus =
        statusFilter === 'All' ||
        (session.isActive ? 'Active' : 'Inactive') === statusFilter;
      return matchesStatus;
    }) || [];

  const handleDeleteSession = (session: CoachingSession) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSession = () => {
    if (sessionToDelete) {
      deleteSessionMutation.mutate(sessionToDelete.id);
      setIsDeleteModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleToggleActive = (session: CoachingSession) => {
    if (session.isActive) {
      disableSessionMutation.mutate(session.id);
    } else {
      enableSessionMutation.mutate(session.id);
    }
  };

  const handleCreateSession = async (data: any, imageFile?: File | null) => {
    try {
      if (imageFile) {
        await createSessionMutation.mutateAsync({ ...data, image: imageFile });
      } else {
        await createSessionMutation.mutateAsync(data);
      }
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleUpdateSession = async (data: any, imageFile?: File | null) => {
    if (editingSession) {
      try {
        if (imageFile) {
          await updateSessionMutation.mutateAsync({
            id: editingSession.id,
            data: { ...data, image: imageFile },
          });
        } else {
          await updateSessionMutation.mutateAsync({
            id: editingSession.id,
            data,
          });
        }
        setIsEditModalOpen(false);
        setEditingSession(null);
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }
  };

  const handleEditSession = (session: CoachingSession) => {
    setEditingSession(session);
    setIsEditModalOpen(true);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'LIFE_COACHES':
        return 'Life Coaches';
      case 'CAREER_COACHES':
        return 'Career Coaches';
      case 'RELATIONSHIP_COACHES':
        return 'Relationship Coaches';
      default:
        return category;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'LIFE_COACHES':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'CAREER_COACHES':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'RELATIONSHIP_COACHES':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Coaching Management</h1>
          <p className="text-white/70 mt-2">
            Manage coaching sessions and services
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Session
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search coaching sessions..."
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
                selectedValue={statusFilter}
                onSelect={setStatusFilter}
                placeholder="All Status"
                triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 min-h-[40px]"
                contentClassName="bg-emerald-green/20 border-white/20 shadow-lg"
                itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
              />
              <CustomSelect
                options={[
                  { label: 'All Categories', value: 'All' },
                  { label: 'Life Coaches', value: 'LIFE_COACHES' },
                  { label: 'Career Coaches', value: 'CAREER_COACHES' },
                  {
                    label: 'Relationship Coaches',
                    value: 'RELATIONSHIP_COACHES',
                  },
                ]}
                selectedValue={categoryFilter}
                onSelect={setCategoryFilter}
                placeholder="All Categories"
                triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 min-h-[40px]"
                contentClassName="bg-emerald-green/20 border-white/20 shadow-lg"
                itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden-glow"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session: CoachingSession) => (
            <Card
              key={session.id}
              className="bg-emerald-green/10 border-white/10 hover:bg-emerald-green/20 transition-all duration-300 h-full flex flex-col"
            >
              {/* Header Image */}
              <div className="w-full h-48 bg-gradient-to-br from-golden-glow/20 to-pink-shade/20 flex items-center justify-center rounded-t-lg relative overflow-hidden">
                {session.imageUrl ? (
                  <img
                    src={session.imageUrl}
                    alt={session.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextSibling = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (nextSibling) {
                        nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    session.imageUrl ? 'hidden' : 'flex'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-white/50" />
                    </div>
                    <p className="text-white/70 text-sm">No Image</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      session.isActive
                    )}`}
                  >
                    {session.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  {/* Title and Category */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white/50 bg-white/10 px-3 py-1 rounded-lg text-xs">
                        {getCategoryLabel(session.category)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {session.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {session.features &&
                      session.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20"
                        >
                          {feature}
                        </span>
                      ))}
                    {session.features && session.features.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20">
                        +{session.features.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Price and Duration */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold text-lg">
                      ${session.price}
                    </span>
                    <span className="text-white/70 text-sm">
                      {session.duration}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8 border border-white/20 text-white hover:bg-white/10 bg-transparent"
                      onClick={() => handleEditSession(session)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 border border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                      onClick={() => handleDeleteSession(session)}
                      disabled={deleteSessionMutation.isPending}
                    >
                      {deleteSessionMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>

                  {/* Toggle Active/Inactive */}
                  <div className="flex items-center gap-2">
                    {session.isActive ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8 border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 bg-transparent"
                        onClick={() => handleToggleActive(session)}
                        disabled={disableSessionMutation.isPending}
                      >
                        {disableSessionMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <EyeOff className="h-3 w-3 mr-1" />
                        )}
                        Disable
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8 border border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
                        onClick={() => handleToggleActive(session)}
                        disabled={enableSessionMutation.isPending}
                      >
                        {enableSessionMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <Eye className="h-3 w-3 mr-1" />
                        )}
                        Enable
                      </Button>
                    )}
                    <div className="text-white/50 text-xs">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Session Modal */}
      <CoachingFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSession}
        title="Add New Coaching Session"
        mode="add"
        isLoading={createSessionMutation.isPending}
      />

      {/* Edit Session Modal */}
      <CoachingFormModal
        isOpen={isEditModalOpen && !!editingSession}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSession(null);
        }}
        onSubmit={handleUpdateSession}
        title="Edit Coaching Session"
        mode="edit"
        initialData={editingSession || undefined}
        isLoading={updateSessionMutation.isPending}
      />

      {/* Delete Session Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteSession}
        title="Delete Coaching Session"
        message={`Are you sure you want to delete "${sessionToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CoachingPage;
