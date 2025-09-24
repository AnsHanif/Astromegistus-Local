"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

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
        <ScrollArea className="w-full">
          <div className="min-w-[1200px]">
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
                      data-state={row.getIsSelected() && "selected"}
                      className={`border-b border-white/5 hover:bg-white/5 ${rowClassName || ''}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="py-4 px-4 whitespace-nowrap"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-white/50">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>

      {/* External Pagination */}
      {pagination && pagination.pages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <div className="text-sm text-white/70">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total}{' '}
            results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
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
                    variant={currentPage === pageNumber ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                    className={
                      currentPage === pageNumber
                        ? "bg-emerald-500 text-white"
                        : "text-white hover:bg-white/10"
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= pagination.pages}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              Next
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
  children
}: {
  column: any;
  children: React.ReactNode
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 text-white/70 hover:text-white hover:bg-transparent font-medium justify-start"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}