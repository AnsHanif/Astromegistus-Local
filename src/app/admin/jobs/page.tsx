'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/common/search-bar/search-bar';
import ConfirmationModal from '@/components/common/confirmation-modal';
import { Filter, Plus, Edit, Trash2, Power, Loader2, Briefcase } from 'lucide-react';
import {
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  useEnableJob,
  useDisableJob,
} from '@/hooks/mutation/admin-mutation/admin-mutations';
import { useAdminJobs } from '@/hooks/query/admin-queries';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import JobFormModal from '@/components/common/job-form-modal';

export default function AdminJobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'freelance' | 'employment'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [isDeleteJobModalOpen, setIsDeleteJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [jobToDelete, setJobToDelete] = useState<any>(null);
  const [togglingJobId, setTogglingJobId] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // React Query hooks
  const {
    data: jobsResponse,
    isLoading,
    error,
    refetch,
  } = useAdminJobs({
    page: currentPage,
    limit: 10,
    category: filterCategory === 'All' ? 'all' : filterCategory as 'freelance' | 'employment',
    search: debouncedSearchTerm || undefined,
  });

  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();
  const enableJobMutation = useEnableJob();
  const disableJobMutation = useDisableJob();

  // Extract jobs array from response
  const jobs = Array.isArray(jobsResponse)
    ? jobsResponse
    : Array.isArray((jobsResponse as any)?.data?.data?.jobs)
      ? (jobsResponse as any).data.data.jobs
      : Array.isArray(jobsResponse?.data)
        ? jobsResponse.data
        : [];

  const pagination = (jobsResponse as any)?.data?.data?.pagination;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'freelance':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'employment':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const handleAddJob = (jobData: any) => {
    createJobMutation.mutate(jobData, {
      onSuccess: () => {
        setIsAddJobModalOpen(false);
        refetch();
      },
    });
  };

  const handleEditJob = (jobData: any) => {
    if (!editingJob) return;

    updateJobMutation.mutate(
      { id: editingJob.id, data: jobData },
      {
        onSuccess: () => {
          setIsEditJobModalOpen(false);
          setEditingJob(null);
          refetch();
        },
      }
    );
  };

  const handleDeleteJob = () => {
    if (!jobToDelete) return;

    deleteJobMutation.mutate(jobToDelete.id, {
      onSuccess: () => {
        setIsDeleteJobModalOpen(false);
        setJobToDelete(null);
        refetch();
      },
    });
  };

  const handleToggleJobStatus = (job: any) => {
    setTogglingJobId(job.id);
    const mutation = job.isActive ? disableJobMutation : enableJobMutation;
    mutation.mutate(job.id, {
      onSuccess: () => {
        setTogglingJobId(null);
        refetch();
      },
      onError: () => setTogglingJobId(null),
    });
  };

  const openEditModal = (job: any) => {
    setEditingJob(job);
    setIsEditJobModalOpen(true);
  };

  const openDeleteModal = (job: any) => {
    setJobToDelete(job);
    setIsDeleteJobModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="h-8 w-8" />
            Job Management
          </h1>
          <p className="text-white/70 mt-2">Manage career opportunities and job postings</p>
        </div>
        <Button
          className="bg-gradient-to-r from-golden-glow via-pink-shade to-golden-glow-dark text-black rounded-2xl"
          onClick={() => setIsAddJobModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search jobs..."
                value={searchTerm}
                onSearch={setSearchTerm}
                className="[&_input]:bg-white/5 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_svg]:text-white/50 [&_input]:focus:border-white/40 [&_input]:focus:ring-0 [&_input]:focus:outline-none [&_input]:rounded-lg [&_input]:h-10 sm:[&_input]:h-12"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <CustomSelect
                options={[
                  { label: 'All Categories', value: 'All' },
                  { label: 'Freelance', value: 'freelance' },
                  { label: 'Employment', value: 'employment' },
                ]}
                selectedValue={filterCategory}
                onSelect={(value) => setFilterCategory(value as 'All' | 'freelance' | 'employment')}
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

      {/* Jobs Table */}
      <Card className="bg-emerald-green/10 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            Jobs ({jobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-white/70">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading jobs...
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-400">
                Error loading jobs. Please try again.
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <Briefcase className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {searchTerm ? 'No jobs found' : 'No jobs yet'}
                </h3>
                <p className="text-white/50 mb-6">
                  {searchTerm
                    ? `No jobs match "${searchTerm}". Try a different search term.`
                    : 'Get started by adding your first job to the system.'}
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
                        Job
                      </th>
                      <th className="text-left py-3 px-4 text-white/70 font-medium">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-white/70 font-medium">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-white/70 font-medium">
                        Tags
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
                    {jobs.map((job: any) => (
                      <tr
                        key={job.id}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-white">
                              {job.title}
                            </div>
                            <div className="text-sm text-white/50 line-clamp-2 whitespace-pre-line">
                              {job.description.split('\n').filter((line: string) => line.trim() !== '').join('\n')}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(job.category)}`}
                          >
                            {job.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.isActive)}`}
                          >
                            {job.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap items-center gap-1">
                            {job.tags?.slice(0, 3).map((tag: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded text-xs bg-white/10 text-white/80 border border-white/20 inline-flex items-center"
                              >
                                {tag}
                              </span>
                            ))}
                            {job.tags?.length > 3 && (
                              <span className="px-2 py-1 rounded text-xs bg-white/10 text-white/80 border border-white/20 inline-flex items-center">
                                +{job.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white/70">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/10 p-1"
                              onClick={() => openEditModal(job)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`p-1 ${job.isActive ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'}`}
                              onClick={() => handleToggleJobStatus(job)}
                              disabled={togglingJobId === job.id}
                            >
                              {togglingJobId === job.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-red-500/10 p-1"
                              onClick={() => openDeleteModal(job)}
                              disabled={deleteJobMutation.isPending}
                            >
                              {deleteJobMutation.isPending ? (
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
                {jobs.map((job: any) => (
                  <div
                    key={job.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 mr-3">
                        <h3 className="font-medium text-white text-sm">
                          {job.title}
                        </h3>
                        <p className="text-xs text-white/50 mt-1 line-clamp-2 whitespace-pre-line">
                          {job.description.split('\n').filter((line: string) => line.trim() !== '').join('\n')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/10 p-1.5"
                          onClick={() => openEditModal(job)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-1.5 ${job.isActive ? 'text-green-400 hover:bg-green-500/10' : 'text-red-400 hover:bg-red-500/10'}`}
                          onClick={() => handleToggleJobStatus(job)}
                          disabled={togglingJobId === job.id}
                        >
                          {togglingJobId === job.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Power className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:bg-red-500/10 p-1.5"
                          onClick={() => openDeleteModal(job)}
                          disabled={deleteJobMutation.isPending}
                        >
                          {deleteJobMutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(job.category)}`}
                      >
                        {job.category}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.isActive)}`}
                      >
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mb-2">
                        {job.tags?.slice(0, 2).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded text-xs bg-white/10 text-white/80 border border-white/20 inline-flex items-center"
                          >
                            {tag}
                          </span>
                        ))}
                        {job.tags?.length > 2 && (
                          <span className="px-2 py-1 rounded text-xs bg-white/10 text-white/80 border border-white/20 inline-flex items-center">
                            +{job.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-white/50">
                      Created: {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-white/10 bg-gradient-to-r from-emerald-green/5 to-emerald-green/10">
            <div className="text-xs sm:text-sm text-white/70 font-medium text-center sm:text-left">
              Showing{' '}
              <span className="text-white font-semibold">
                {(currentPage - 1) * 10 + 1}
              </span>{' '}
              to{' '}
              <span className="text-white font-semibold">
                {Math.min(currentPage * 10, pagination.total)}
              </span>{' '}
              of{' '}
              <span className="text-white font-semibold">{pagination.total}</span>{' '}
              results
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="!h-8 sm:!h-10 bg-white/5 border-white/20 text-white hover:bg-white/15 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>

              <div className="hidden sm:flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNumber;
                  if (pagination.pages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= pagination.pages - 2) {
                    pageNumber = pagination.pages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={
                        currentPage === pageNumber
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
                {currentPage} / {pagination.pages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= pagination.pages}
                className="!h-8 sm:!h-10 bg-white/5 border-white/20 text-white hover:bg-white/15 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg px-2 sm:px-4 py-1 sm:py-2 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <JobFormModal
        isOpen={isAddJobModalOpen}
        onClose={() => setIsAddJobModalOpen(false)}
        onSubmit={handleAddJob}
        title="Add New Job"
        mode="add"
        isLoading={createJobMutation.isPending}
      />

      <JobFormModal
        isOpen={isEditJobModalOpen}
        onClose={() => {
          setIsEditJobModalOpen(false);
          setEditingJob(null);
        }}
        onSubmit={handleEditJob}
        title="Edit Job"
        mode="edit"
        initialData={editingJob}
        isLoading={updateJobMutation.isPending}
      />

      <ConfirmationModal
        isOpen={isDeleteJobModalOpen}
        onClose={() => {
          setIsDeleteJobModalOpen(false);
          setJobToDelete(null);
        }}
        onConfirm={handleDeleteJob}
        title="Delete Job"
        message={`Are you sure you want to delete "${jobToDelete?.title}"? This action cannot be undone.`}
        isLoading={deleteJobMutation.isPending}
      />
    </div>
  );
}