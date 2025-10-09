'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/common/search-bar/search-bar';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import ConfirmationModal from '@/components/common/confirmation-modal';
import RadioShowFormModal from '@/components/common/radio-show-form-modal';
import { Plus, Edit, Trash2, Power, Loader2, Radio } from 'lucide-react';
import {
  useCreateRadioShow,
  useUpdateRadioShow,
  useDeleteRadioShow,
  useEnableRadioShow,
  useDisableRadioShow,
} from '@/hooks/mutation/admin-mutation/admin-mutations';
import { useAdminRadioShows } from '@/hooks/query/radio-show-queries';

export default function AdminRadioShowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddRadioShowModalOpen, setIsAddRadioShowModalOpen] = useState(false);
  const [isEditRadioShowModalOpen, setIsEditRadioShowModalOpen] = useState(false);
  const [isDeleteRadioShowModalOpen, setIsDeleteRadioShowModalOpen] = useState(false);
  const [editingRadioShow, setEditingRadioShow] = useState<any>(null);
  const [radioShowToDelete, setRadioShowToDelete] = useState<any>(null);
  const [togglingRadioShowId, setTogglingRadioShowId] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // React Query hooks
  const queryParams: any = {
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm || undefined,
  };

  if (filterStatus !== 'All') {
    queryParams.status = filterStatus === 'Active';
  }

  const {
    data: radioShowsResponse,
    isLoading,
    error,
    refetch,
  } = useAdminRadioShows(queryParams);

  const createRadioShowMutation = useCreateRadioShow();
  const updateRadioShowMutation = useUpdateRadioShow();
  const deleteRadioShowMutation = useDeleteRadioShow();
  const enableRadioShowMutation = useEnableRadioShow();
  const disableRadioShowMutation = useDisableRadioShow();

  // Extract radio shows array from response
  const radioShows = Array.isArray(radioShowsResponse)
    ? radioShowsResponse
    : Array.isArray((radioShowsResponse as any)?.data?.data?.radioShows)
      ? (radioShowsResponse as any).data.data.radioShows
      : Array.isArray(radioShowsResponse?.data)
        ? radioShowsResponse.data
        : [];

  const pagination = (radioShowsResponse as any)?.data?.data?.pagination;

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const handleAddRadioShow = (radioShowData: any) => {
    createRadioShowMutation.mutate(radioShowData, {
      onSuccess: () => {
        setIsAddRadioShowModalOpen(false);
        refetch();
      },
    });
  };

  const handleEditRadioShow = (radioShowData: any) => {
    if (!editingRadioShow) return;

    updateRadioShowMutation.mutate(
      { id: editingRadioShow.id, data: radioShowData },
      {
        onSuccess: () => {
          setIsEditRadioShowModalOpen(false);
          setEditingRadioShow(null);
          refetch();
        },
      }
    );
  };

  const handleDeleteRadioShow = () => {
    if (!radioShowToDelete) return;

    deleteRadioShowMutation.mutate(radioShowToDelete.id, {
      onSuccess: () => {
        setIsDeleteRadioShowModalOpen(false);
        setRadioShowToDelete(null);
        refetch();
      },
    });
  };

  const handleToggleRadioShowStatus = (radioShow: any) => {
    setTogglingRadioShowId(radioShow.id);
    const mutation = radioShow.isActive ? disableRadioShowMutation : enableRadioShowMutation;
    mutation.mutate(radioShow.id, {
      onSuccess: () => {
        refetch();
        setTogglingRadioShowId(null);
      },
      onError: () => {
        setTogglingRadioShowId(null);
      },
    });
  };

  const openEditModal = (radioShow: any) => {
    setEditingRadioShow(radioShow);
    setIsEditRadioShowModalOpen(true);
  };

  const openDeleteModal = (radioShow: any) => {
    setRadioShowToDelete(radioShow);
    setIsDeleteRadioShowModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Radio className="h-8 w-8" />
            Radio Show Management
          </h1>
          <p className="text-white/70 mt-2">Manage radio shows and broadcasts</p>
        </div>
        <Button
          className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black rounded-2xl"
          onClick={() => setIsAddRadioShowModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Radio Show
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search radio shows..."
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
                selectedValue={filterStatus}
                onSelect={(value) => setFilterStatus(value as 'All' | 'Active' | 'Inactive')}
                placeholder="All Status"
                variant="large"
                triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 sm:h-12 min-h-[40px] sm:min-h-[48px] rounded-lg min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
                contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
                itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radio Shows Table */}
      <Card className="bg-emerald-green/10 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            Radio Shows ({radioShows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-white/70">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading radio shows...
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-400">
                Error loading radio shows. Please try again.
              </div>
            </div>
          ) : radioShows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <Radio className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {searchTerm ? 'No radio shows found' : 'No radio shows yet'}
                </h3>
                <p className="text-white/50 mb-6">
                  {searchTerm
                    ? `No radio shows match "${searchTerm}". Try a different search term.`
                    : 'Get started by adding your first radio show to the system.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/70 font-medium">
                        Show
                      </th>
                      <th className="text-left py-3 px-4 text-white/70 font-medium">
                        Host
                      </th>
                      <th className="text-left py-3 px-4 text-white/70 font-medium">
                        Date & Time
                      </th>
                      <th className="text-left py-3 px-4 text-white/70 font-medium">
                        Link
                      </th>
                      <th className="text-left py-3 px-4 text-white/70 font-medium">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-white/70 font-medium">
                        Created Date
                      </th>
                      <th className="text-left py-3 px-4 text-white/70 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {radioShows.map((radioShow: any) => (
                      <tr
                        key={radioShow.id}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">
                            {radioShow.showTitle}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white/80">
                            {radioShow.hostName}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white/80">
                            <div>{formatDate(radioShow.date)}</div>
                            <div className="text-sm text-white/60">{radioShow.time}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <a
                            href={radioShow.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm underline break-all max-w-[200px] inline-block"
                          >
                            {radioShow.link}
                          </a>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(radioShow.isActive)}`}
                          >
                            {radioShow.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white/70">
                          {formatDate(radioShow.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/10 p-1"
                              onClick={() => openEditModal(radioShow)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={radioShow.isActive ? "text-green-400 hover:bg-green-500/10 p-1" : "text-red-400 hover:bg-red-500/10 p-1"}
                              onClick={() => handleToggleRadioShowStatus(radioShow)}
                              disabled={togglingRadioShowId === radioShow.id}
                            >
                              {togglingRadioShowId === radioShow.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-red-500/10 p-1"
                              onClick={() => openDeleteModal(radioShow)}
                              disabled={deleteRadioShowMutation.isPending}
                            >
                              {deleteRadioShowMutation.isPending ? (
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

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {radioShows.map((radioShow: any) => (
                  <div
                    key={radioShow.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 mr-3">
                        <h3 className="font-medium text-white text-sm">
                          {radioShow.showTitle}
                        </h3>
                        <p className="text-xs text-white/60 mt-1">
                          Host: {radioShow.hostName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/10 p-1.5"
                          onClick={() => openEditModal(radioShow)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={radioShow.isActive ? "text-green-400 hover:bg-green-500/10 p-1.5" : "text-red-400 hover:bg-red-500/10 p-1.5"}
                          onClick={() => handleToggleRadioShowStatus(radioShow)}
                          disabled={togglingRadioShowId === radioShow.id}
                        >
                          {togglingRadioShowId === radioShow.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Power className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:bg-red-500/10 p-1.5"
                          onClick={() => openDeleteModal(radioShow)}
                          disabled={deleteRadioShowMutation.isPending}
                        >
                          {deleteRadioShowMutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-2 py-1 rounded text-xs">
                        {formatDate(radioShow.date)} at {radioShow.time}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(radioShow.isActive)}`}
                      >
                        {radioShow.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="text-xs text-white/70 mb-2 break-all">
                      <span className="text-white/50">Link: </span>
                      <a
                        href={radioShow.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        {radioShow.link}
                      </a>
                    </div>

                    <div className="text-xs text-white/50">
                      Created: {formatDate(radioShow.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="border-white/10 text-white hover:bg-white/10"
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-white">
            Page {currentPage} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= pagination.pages}
            className="border-white/10 text-white hover:bg-white/10"
          >
            Next
          </Button>
        </div>
      )}

      {/* Modals */}
      <RadioShowFormModal
        isOpen={isAddRadioShowModalOpen}
        onClose={() => setIsAddRadioShowModalOpen(false)}
        onSubmit={handleAddRadioShow}
        title="Add New Radio Show"
        mode="add"
        isLoading={createRadioShowMutation.isPending}
        existingRadioShows={radioShows}
      />

      <RadioShowFormModal
        isOpen={isEditRadioShowModalOpen}
        onClose={() => {
          setIsEditRadioShowModalOpen(false);
          setEditingRadioShow(null);
        }}
        onSubmit={handleEditRadioShow}
        title="Edit Radio Show"
        mode="edit"
        initialData={editingRadioShow}
        isLoading={updateRadioShowMutation.isPending}
        existingRadioShows={radioShows}
      />

      <ConfirmationModal
        isOpen={isDeleteRadioShowModalOpen}
        onClose={() => {
          setIsDeleteRadioShowModalOpen(false);
          setRadioShowToDelete(null);
        }}
        onConfirm={handleDeleteRadioShow}
        title="Delete Radio Show"
        message={`Are you sure you want to delete "${radioShowToDelete?.showTitle}"? This action cannot be undone.`}
        isLoading={deleteRadioShowMutation.isPending}
      />
    </div>
  );
}