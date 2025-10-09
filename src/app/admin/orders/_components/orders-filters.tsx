import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SearchBar from '@/components/common/search-bar/search-bar';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import {
  STATUS_FILTER_OPTIONS,
  READING_TYPE_FILTER_OPTIONS,
  COACHING_CATEGORY_FILTER_OPTIONS,
  type StatusFilter,
  type ReadingTypeFilter,
  type CoachingCategoryFilter,
} from '@/constants/orders';

interface BaseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  searchPlaceholder: string;
}

interface SessionFiltersProps extends BaseFiltersProps {
  type: 'sessions';
  filterCategory: CoachingCategoryFilter;
  onCategoryChange: (value: CoachingCategoryFilter) => void;
}

interface ReadingFiltersProps extends BaseFiltersProps {
  type: 'readings';
  filterType: ReadingTypeFilter;
  onTypeChange: (value: ReadingTypeFilter) => void;
}

type OrdersFiltersProps = SessionFiltersProps | ReadingFiltersProps;

export function OrdersFilters(props: OrdersFiltersProps) {
  const {
    searchTerm,
    onSearchChange,
    filterStatus,
    onStatusChange,
    searchPlaceholder,
    type,
  } = props;

  return (
    <Card className="bg-emerald-green/10 border-white/10">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder={searchPlaceholder}
              value={searchTerm}
              onSearch={onSearchChange}
              className="[&_input]:bg-white/5 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/50 [&_svg]:text-white/50 [&_input]:focus:border-white/40 [&_input]:focus:ring-0 [&_input]:focus:outline-none [&_input]:rounded-lg [&_input]:h-10 sm:[&_input]:h-12"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <CustomSelect
              options={STATUS_FILTER_OPTIONS}
              selectedValue={filterStatus}
              onSelect={(value) => onStatusChange(value as StatusFilter)}
              placeholder="All Status"
              variant="large"
              triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-12 min-h-[48px] rounded-lg min-w-[140px]"
              contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
              itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
            />

            {type === 'sessions' ? (
              <CustomSelect
                options={COACHING_CATEGORY_FILTER_OPTIONS}
                selectedValue={(props as SessionFiltersProps).filterCategory}
                onSelect={(value) =>
                  (props as SessionFiltersProps).onCategoryChange(
                    value as CoachingCategoryFilter
                  )
                }
                placeholder="All Categories"
                variant="large"
                triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-12 min-h-[48px] rounded-lg min-w-[180px]"
                contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
                itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
              />
            ) : (
              <CustomSelect
                options={READING_TYPE_FILTER_OPTIONS}
                selectedValue={(props as ReadingFiltersProps).filterType}
                onSelect={(value) =>
                  (props as ReadingFiltersProps).onTypeChange(
                    value as ReadingTypeFilter
                  )
                }
                placeholder="All Types"
                variant="large"
                triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-12 min-h-[48px] rounded-lg min-w-[140px]"
                contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
                itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
