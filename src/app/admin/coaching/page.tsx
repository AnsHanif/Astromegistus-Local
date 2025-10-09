'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/common/search-bar/search-bar';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import ConfirmationModal from '@/components/common/confirmation-modal';
import CoachingFormModal from '@/components/common/coaching-form-modal';
import CoachingSectionsModal from '@/components/common/coaching-sections-modal';
import {
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  Loader2,
  X,
  EyeOff,
  Eye,
  FileText,
} from 'lucide-react';
import { useAdminCoachingSessions } from '@/hooks/query/coaching-queries';
import {
  useCreateCoachingSessionWithImage,
  useUpdateCoachingSessionWithImage,
  useDeleteCoachingSession,
  useEnableCoachingSession,
  useDisableCoachingSession,
} from '@/hooks/mutation/coaching-mutations';
import {
  useUpdateCoachingSections,
  useGetAdminCoachingSections as useGetCoachingSectionsForAdmin
} from '@/hooks/mutation/coaching-sections-mutations';
import { CoachingSession } from '@/types/coaching';

const CoachingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSectionsModalOpen, setIsSectionsModalOpen] = useState(false);
  const [selectedCoachingForSections, setSelectedCoachingForSections] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<CoachingSession | null>(
    null
  );
  const [sessionToDelete, setSessionToDelete] =
    useState<CoachingSession | null>(null);
  const [togglingSessionId, setTogglingSessionId] = useState<string | null>(null);
  const limit = 6;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, categoryFilter, debouncedSearchTerm]);

  // Build query parameters
  const queryParams = {
    page,
    limit,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(statusFilter !== 'All' && { status: statusFilter as 'Active' | 'Inactive' }),
    ...(categoryFilter !== 'All' && { category: categoryFilter as 'LIFE_COACHES' | 'CAREER_COACHES' | 'RELATIONSHIP_COACHES' }),
  };

  // Queries
  const {
    data: sessions,
    isLoading,
    error,
  } = useAdminCoachingSessions(queryParams);

  // Get coaching sections data for the selected coaching session
  const {
    data: coachingSectionsData,
    isLoading: sectionsLoading,
    error: sectionsError
  } = useGetCoachingSectionsForAdmin(selectedCoachingForSections || '');

  console.log('💾 Coaching sections data:', {
    selectedCoaching: selectedCoachingForSections,
    data: coachingSectionsData,
    loading: sectionsLoading,
    error: sectionsError
  });

  // Mutations
  const createSessionMutation = useCreateCoachingSessionWithImage();
  const updateSessionMutation = useUpdateCoachingSessionWithImage();
  const deleteSessionMutation = useDeleteCoachingSession();
  const enableSessionMutation = useEnableCoachingSession();
  const disableSessionMutation = useDisableCoachingSession();
  const updateCoachingSectionsMutation = useUpdateCoachingSections();

  // Extract coaching sessions from response - backend returns { sessions: [], pagination: {} }
  const coachingSessions: CoachingSession[] = Array.isArray(sessions)
    ? sessions
    : (sessions as any)?.sessions || [];

  const pagination = (sessions as any)?.pagination;

  console.log('Sessions response:', sessions);
  console.log('Processed coaching sessions array:', coachingSessions);
  console.log('Pagination:', pagination);

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
    setTogglingSessionId(session.id);
    if (session.isActive) {
      disableSessionMutation.mutate(session.id, {
        onSettled: () => setTogglingSessionId(null)
      });
    } else {
      enableSessionMutation.mutate(session.id, {
        onSettled: () => setTogglingSessionId(null)
      });
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

  const handleManageSections = (coachingId: string) => {
    console.log('🎯 Selected coaching ID for sections:', coachingId);
    setSelectedCoachingForSections(coachingId);
    setIsSectionsModalOpen(true);
  };

  const handleSectionsSubmit = async (sections: any) => {
    if (!selectedCoachingForSections) return;

    try {
      await updateCoachingSectionsMutation.mutateAsync({
        coachingId: selectedCoachingForSections,
        sections,
      });
      // Don't close modal immediately - let user see the updated data
    } catch (error) {
      console.error('Error saving sections:', error);
    }
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Coaching Management</h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">
            Manage coaching sessions and services
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark hover:from-golden-glow-dark hover:via-golden-glow hover:to-pink-shade text-black font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="text-sm sm:text-base">Add Session</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search coaching sessions..."
                value={searchTerm}
                onSearch={setSearchTerm}
                className="[&_input]:bg-white/5 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_svg]:text-white/50 [&_input]:focus:border-white/40 [&_input]:focus:ring-0 [&_input]:focus:outline-none [&_input]:rounded-lg [&_input]:h-10 sm:[&_input]:h-12"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <CustomSelect
                options={[
                  { label: 'All Status', value: 'All' },
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
                selectedValue={statusFilter}
                onSelect={setStatusFilter}
                placeholder="All Status"
                variant="large"
                triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 sm:h-12 min-h-[40px] sm:min-h-[48px] rounded-lg min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
                contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
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
                variant="large"
                triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 sm:h-12 min-h-[40px] sm:min-h-[48px] rounded-lg min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
                contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {coachingSessions.map((session: CoachingSession) => (
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
                      className="border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent h-8 px-3"
                      onClick={() => handleManageSections(session.id)}
                      title="Manage Detail Page Sections"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Detail Page
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
                        disabled={togglingSessionId === session.id}
                      >
                        {togglingSessionId === session.id ? (
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
                        disabled={togglingSessionId === session.id}
                      >
                        {togglingSessionId === session.id ? (
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

          {/* Pagination - Exact same as users page */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-white/10 bg-gradient-to-r from-emerald-green/5 to-emerald-green/10">
              <div className="text-xs sm:text-sm text-white/70 font-medium text-center sm:text-left">
                Showing{' '}
                <span className="text-white font-semibold">
                  {(page - 1) * limit + 1}
                </span>{' '}
                to{' '}
                <span className="text-white font-semibold">
                  {Math.min(page * limit, pagination.totalSessions)}
                </span>{' '}
                of{' '}
                <span className="text-white font-semibold">{pagination.totalSessions}</span>{' '}
                results
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="!h-8 sm:!h-10 bg-white/5 border-white/20 text-white hover:bg-white/15 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>

                <div className="hidden sm:flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (page <= 3) {
                      pageNumber = i + 1;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNumber = pagination.totalPages - 4 + i;
                    } else {
                      pageNumber = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant="ghost"
                        size="sm"
                        onClick={() => setPage(pageNumber)}
                        className={
                          page === pageNumber
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg border border-emerald-400/50 rounded-lg min-w-[40px] h-10 hover:from-emerald-600 hover:to-emerald-700'
                            : 'bg-white/5 border border-white/20 text-white hover:bg-white/15 hover:border-white/30 rounded-lg min-w-[40px] h-10 transition-all duration-200'
                        }
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                {/* Mobile page indicator */}
                <div className="sm:hidden mx-2 text-xs text-white/70">
                  {page} / {pagination.totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.totalPages}
                  className="!h-8 sm:!h-10 bg-white/5 border-white/20 text-white hover:bg-white/15 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                </Button>
              </div>
            </div>
          )}
        </>
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

      {/* Coaching Sections Modal */}
      <CoachingSectionsModal
        isOpen={isSectionsModalOpen}
        onClose={() => {
          setIsSectionsModalOpen(false);
          setSelectedCoachingForSections(null);
        }}
        coachingId={selectedCoachingForSections || ''}
        onSubmit={handleSectionsSubmit}
        initialData={coachingSectionsData}
        isLoading={updateCoachingSectionsMutation.isPending || sectionsLoading}
      />
    </div>
  );
};

export default CoachingPage;
