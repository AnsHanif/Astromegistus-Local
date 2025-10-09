'use client';

import { CustomSelect } from '@/components/common/custom-select/custom-select';
import SearchBar from '@/components/common/search-bar/search-bar';
import {
  PRICE_RANGES,
  PRICE_RANGE_MAPPING,
  PRODUCT_CATEGORIES,
  PRODUCT_TYPES,
  TIME_DURATIONS,
} from './product.contant';
import { Button } from '@/components/ui/button';

interface AstrologyReadingsHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  filters: {
    category?: string;
    productType?: string;
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
  };
  setFilters: (filters: any) => void;
}

export default function AstrologyReadingsHeader({
  search,
  setSearch,
  filters,
  setFilters,
}: AstrologyReadingsHeaderProps) {
  return (
    <section className="w-full py-10">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold">
          All Astrology Readings
        </h1>
        <p className="text-grey text-base pt-4">
          Explore our complete collection of manual and automated sessions
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <SearchBar
          value={search}
          placeholder="Search Product"
          onSearch={setSearch}
        />

        <div className="flex flex-row flex-wrap justify-center sm:flex-nowrap gap-3 w-full">
          <CustomSelect
            onSelect={(value) => setFilters({ ...filters, category: value })}
            options={PRODUCT_CATEGORIES}
            placeholder="All Categories"
            selectedValue={filters.category || ''}
            className="w-[150px] h-12 sm:h-15"
            triggerClassName="h-12 w-full sm:h-15 cursor-pointer focus:border-black hover:border-grey border-grey text-black"
            chevronClassName="text-black"
            contentClassName="w-full text-black max-h-60 overflow-y-auto"
          />

          {/* <CustomSelect
            onSelect={(value) => setFilters({ ...filters, productType: value })}
            options={PRODUCT_TYPES}
            placeholder="Select Type"
            selectedValue={filters.productType || ''}
            className="w-[150px] h-12 sm:h-15"
            triggerClassName="h-12 w-full sm:h-15 cursor-pointer focus:border-black hover:border-grey border-grey text-black"
            chevronClassName="text-black"
            contentClassName="w-full text-black max-h-60 overflow-y-auto"
          /> */}

          <CustomSelect
            onSelect={(value) => {
              const priceRange =
                PRICE_RANGE_MAPPING[value as keyof typeof PRICE_RANGE_MAPPING];
              if (priceRange) {
                setFilters({
                  ...filters,
                  minPrice: priceRange.minPrice.toString(),
                  maxPrice: priceRange.maxPrice?.toString() || '',
                });
              } else {
                setFilters({
                  ...filters,
                  minPrice: '',
                  maxPrice: '',
                });
              }
            }}
            options={PRICE_RANGES}
            placeholder="Price"
            selectedValue={
              filters.minPrice
                ? Object.keys(PRICE_RANGE_MAPPING).find((key) => {
                    const range =
                      PRICE_RANGE_MAPPING[
                        key as keyof typeof PRICE_RANGE_MAPPING
                      ];
                    return (
                      range.minPrice.toString() === filters.minPrice &&
                      (range.maxPrice?.toString() === filters.maxPrice ||
                        (!range.maxPrice && filters.maxPrice === ''))
                    );
                  }) || ''
                : ''
            }
            className="w-[150px] h-12 sm:h-15"
            triggerClassName="h-12 w-full sm:h-15 cursor-pointer focus:border-black hover:border-grey border-grey text-black"
            chevronClassName="text-black"
            contentClassName="w-full text-black max-h-60 overflow-y-auto"
          />

          <CustomSelect
            onSelect={(value) => setFilters({ ...filters, duration: value })}
            options={TIME_DURATIONS}
            placeholder="Time Duration"
            selectedValue={filters.duration || ''}
            className="w-[150px] h-12 sm:h-15"
            triggerClassName="h-12 w-full sm:h-15 cursor-pointer focus:border-black hover:border-grey border-grey text-black"
            chevronClassName="text-black"
            contentClassName="w-full text-black max-h-60 overflow-y-auto"
          />

          <Button
            className="h-12 md:h-15"
            onClick={() => {
              setFilters({});
              setSearch('');
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </section>
  );
}
