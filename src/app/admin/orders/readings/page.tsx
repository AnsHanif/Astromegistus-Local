'use client';
import React, { useState, useEffect } from 'react';
import { useAdminReadingOrders } from '@/hooks/query/admin-queries';
import { ReadingOrderQueryParams } from '@/services/api/admin-api';
import { type StatusFilter, type ReadingTypeFilter } from '@/constants/orders';

// Import modular components
import {
  AnalyticsCards,
  type AnalyticsData,
} from '../_components/analytics-cards';
import { OrdersFilters } from '../_components/orders-filters';
import { ReadingsTable, type ReadingOrder } from './_components/readings-table';
import { ReadingDetailSheet } from './_components/reading-detail-sheet';

export default function ReadingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('All');
  const [filterType, setFilterType] = useState<ReadingTypeFilter>('All');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Build query parameters
  const queryParams: ReadingOrderQueryParams = {
    page,
    limit,
    ...(filterStatus !== 'All' && { status: filterStatus }),
    ...(filterType !== 'All' && { type: filterType }),
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
  };

  // Fetch reading orders using React Query
  const {
    data: readingOrdersResponse,
    isLoading,
    error,
    refetch,
  } = useAdminReadingOrders(queryParams);

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
  }, [filterStatus, filterType, debouncedSearchTerm]);

  // Extract readings and pagination from response
  const readings = readingOrdersResponse?.data?.data?.readings || [];
  const pagination = readingOrdersResponse?.data?.data?.pagination;

  // Calculate analytics data
  const analytics: AnalyticsData = React.useMemo(() => {
    const totalOrders = readings.length;
    const pendingOrders = readings.filter((r) => r.status === 'PENDING').length;
    const confirmedOrders = readings.filter(
      (r) => r.status === 'CONFIRMED'
    ).length;
    const completedOrders = readings.filter(
      (r) => r.status === 'COMPLETED'
    ).length;
    const cancelledOrders = readings.filter(
      (r) => r.status === 'CANCELLED'
    ).length;

    const automatedReadings = readings.filter(
      (r) => r.type === 'AUTOMATED'
    ).length;
    const manualReadings = readings.filter((r) => r.type === 'MANUAL').length;

    const totalRevenue = readings
      .filter((r) => r.status === 'COMPLETED')
      .reduce((sum, r) => {
        const price =
          r.type === 'AUTOMATED'
            ? r.product.automatedPrice
            : r.product.livePrice;
        return sum + price;
      }, 0);

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
  }, [readings]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Reading Orders</h1>
          <p className="text-white/70 mt-2">
            Manage and monitor reading bookings
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <AnalyticsCards
        analytics={analytics}
        pagination={pagination}
        type="readings"
      />

      {/* Filters */}
      <OrdersFilters
        type="readings"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterType={filterType}
        onTypeChange={setFilterType}
        searchPlaceholder="Search by customer name, email, or product name..."
      />

      {/* Readings Table */}
      <ReadingsTable
        readings={readings as ReadingOrder[]}
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
        onViewDetails={(reading) => <ReadingDetailSheet reading={reading} />}
      />

    </div>
  );
}
