'use client';
import React, { useState, useEffect } from 'react';
import { useAdminSessionOrders } from '@/hooks/query/admin-queries';
import { SessionOrderQueryParams } from '@/services/api/admin-api';
import {
  type StatusFilter,
  type CoachingCategoryFilter,
} from '@/constants/orders';
import { handleFileClick, extractS3Key } from '@/utils/file-utils';

// Import modular components
import {
  AnalyticsCards,
  type AnalyticsData,
} from '../_components/analytics-cards';
import { OrdersFilters } from '../_components/orders-filters';
import { SessionsTable, type SessionOrder } from './_components/sessions-table';
import { SessionDetailSheet } from './_components/session-detail-sheet';

export default function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('All');
  const [filterCategory, setFilterCategory] =
    useState<CoachingCategoryFilter>('All');
  const [page, setPage] = useState(1);
  const [loadingFiles, setLoadingFiles] = useState<Set<string>>(new Set());
  const limit = 10;

  // Build query parameters
  const queryParams: SessionOrderQueryParams = {
    page,
    limit,
    ...(filterStatus !== 'All' && { status: filterStatus }),
    ...(filterCategory !== 'All' && { category: filterCategory }),
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
  };

  // Fetch session orders using React Query
  const {
    data: sessionOrdersResponse,
    isLoading,
    error,
    refetch,
  } = useAdminSessionOrders(queryParams);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterStatus, filterCategory, debouncedSearchTerm]);

  // Extract sessions and pagination from response
  const sessions = sessionOrdersResponse?.data?.data?.sessions || [];
  const pagination = sessionOrdersResponse?.data?.data?.pagination;

  // Calculate analytics data
  const analytics: AnalyticsData = React.useMemo(() => {
    const totalOrders = sessions.length;
    const pendingOrders = sessions.filter((s) => s.status === 'PENDING').length;
    const confirmedOrders = sessions.filter(
      (s) => s.status === 'CONFIRMED'
    ).length;
    const completedOrders = sessions.filter(
      (s) => s.status === 'COMPLETED'
    ).length;
    const cancelledOrders = sessions.filter(
      (s) => s.status === 'CANCELLED'
    ).length;

    const totalRevenue = sessions
      .filter((s) => s.status === 'COMPLETED')
      .reduce((sum, s) => sum + s.session.price, 0);

    const avgOrderValue =
      completedOrders > 0 ? totalRevenue / completedOrders : 0;

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      avgOrderValue,
      completionRate:
        totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    };
  }, [sessions]);

  const handleMaterialFileClick = async (file: any, index: number) => {
    const fileKey = extractS3Key(file);
    if (!fileKey) {
      console.error('Could not extract S3 key from file:', file);
      return;
    }

    const loadingKey = `${fileKey}-${index}`;

    await handleFileClick(fileKey, {
      onStart: () => {
        setLoadingFiles((prev) => new Set(prev).add(loadingKey));
      },
      onError: (error) => {
        console.error('Failed to open file:', error);
        // You could show a toast notification here
      },
      onFinally: () => {
        setLoadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(loadingKey);
          return newSet;
        });
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Coaching Session Orders
          </h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">
            Manage and monitor coaching session bookings
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <AnalyticsCards
        analytics={analytics}
        pagination={pagination}
        type="sessions"
      />

      {/* Filters */}
      <OrdersFilters
        type="sessions"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        searchPlaceholder="Search by customer name, email, or session title..."
      />

      {/* Sessions Table */}
      <SessionsTable
        sessions={sessions as SessionOrder[]}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        pagination={pagination && {
          total: pagination.total,
          pages: pagination.pages
        }}
        currentPage={page}
        onPageChange={setPage}
        pageSize={limit}
        onViewDetails={(session) => (
          <SessionDetailSheet
            session={session}
            loadingFiles={loadingFiles}
            onFileClick={handleMaterialFileClick}
          />
        )}
      />

    </div>
  );
}
