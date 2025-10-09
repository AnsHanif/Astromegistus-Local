'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  isLoading?: boolean;
  error?: any;
  searchTerm?: string;
  emptyState?: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  pagination?: {
    total: number;
    pages: number;
  };
  // External pagination control
  currentPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  // Custom styling
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  isLoading = false,
  error,
  searchTerm,
  emptyState,
  pagination,
  currentPage = 1,
  onPageChange,
  pageSize = 10,
  tableClassName,
  headerClassName,
  rowClassName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    // Disable internal pagination if external pagination is provided
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
  });

  // Loading state
  if (isLoading) {
    return (
      <Card className="bg-emerald-green/10 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            {title} ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-white/70">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="bg-emerald-green/10 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            {title} ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-red-400">
              Error loading data. Please try again.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <Card className="bg-emerald-green/10 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            {title} ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              {emptyState?.icon}
              <h3 className="text-lg font-medium text-white mb-2">
                {emptyState?.title || 'No data found'}
              </h3>
              <p className="text-white/50 mb-6">
                {emptyState?.description || 'No items to display.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-emerald-green/10 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">
          {title} ({pagination?.total || data.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table className={tableClassName}>
            <TableHeader className={headerClassName}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-white/10 hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-left py-3 px-4 text-white/70 font-medium h-auto"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`border-b border-white/5 hover:bg-white/5 ${rowClassName || ''}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-4 px-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-white/50"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                {row.getVisibleCells().map((cell) => {
                  const header = cell.column.columnDef.header;
                  const headerText = typeof header === 'string'
                    ? header
                    : typeof header === 'function'
                    ? 'Field'
                    : cell.column.id;

                  return (
                    <div key={cell.id} className="flex justify-between items-start py-2 border-b border-white/5 last:border-b-0">
                      <div className="font-medium text-white/70 text-sm min-w-[80px]">
                        {headerText}
                      </div>
                      <div className="text-white text-sm text-right flex-1 ml-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-white/50">
              No results.
            </div>
          )}
        </div>
      </CardContent>

      {/* External Pagination */}
      {pagination && pagination.pages > 1 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-white/10 bg-gradient-to-r from-emerald-green/5 to-emerald-green/10">
          <div className="text-xs sm:text-sm text-white/70 font-medium text-center sm:text-left">
            Showing{' '}
            <span className="text-white font-semibold">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="text-white font-semibold">
              {Math.min(currentPage * pageSize, pagination.total)}
            </span>{' '}
            of{' '}
            <span className="text-white font-semibold">{pagination.total}</span>{' '}
            results
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
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
                    onClick={() => onPageChange(pageNumber)}
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
              onClick={() => onPageChange(currentPage + 1)}
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
  );
}

// Helper function to create sortable column header
export function SortableHeader({
  column,
  children,
}: {
  column: any;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="h-auto p-0 text-white/70 hover:text-white hover:bg-transparent font-medium justify-start"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
