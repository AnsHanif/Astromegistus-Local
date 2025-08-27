'use client';

import { useState } from 'react';
import { CustomSelect } from '@/components/common/custom-select/custom-select';
import SearchBar from '@/components/common/search-bar/search-bar';
import {
  PRICE_RANGES,
  PRODUCT_CATEGORIES,
  PRODUCT_TYPES,
  TIME_DURATIONS,
} from './product.contant';

export default function AstrologyReadingsHeader() {
  const [searchValue, setSearchValue] = useState('');
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [timeDuration, setTimeDuration] = useState('');

  return (
    <section className="w-full py-10">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-size-primary sm:text-[52px] md:text-[72px] font-bold">
          All Astrology Readings
        </h1>
        <p className="text-grey text-sm">
          Explore our complete collection of manual and automated sessions
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <SearchBar
          value={searchValue}
          placeholder="Search Product"
          onSearch={(value) => setSearchValue(value)}
        />

        <div className="flex flex-row flex-wrap justify-center sm:flex-nowrap gap-3 w-full">
          <CustomSelect
            onSelect={(value) => setCategory(value)}
            options={PRODUCT_CATEGORIES}
            placeholder="All Categories"
            selectedValue={category}
            className="w-[150px] h-12 sm:h-15"
            triggerClassName="h-12 w-full sm:h-15 cursor-pointer focus:border-black hover:border-grey border-grey text-black"
            chevronClassName="text-black"
            contentClassName="w-full text-black max-h-60 overflow-y-auto"
          />

          <CustomSelect
            onSelect={(value) => setProductType(value)}
            options={PRODUCT_TYPES}
            placeholder="Select Type"
            selectedValue={productType}
            className="w-[150px] h-12 sm:h-15"
            triggerClassName="h-12 w-full sm:h-15 cursor-pointer focus:border-black hover:border-grey border-grey text-black"
            chevronClassName="text-black"
            contentClassName="w-full text-black max-h-60 overflow-y-auto"
          />

          <CustomSelect
            onSelect={(value) => setProductPrice(value)}
            options={PRICE_RANGES}
            placeholder="Price"
            selectedValue={productPrice}
            className="w-[150px] h-12 sm:h-15"
            triggerClassName="h-12 w-full sm:h-15 cursor-pointer focus:border-black hover:border-grey border-grey text-black"
            chevronClassName="text-black"
            contentClassName="w-full text-black max-h-60 overflow-y-auto"
          />

          <CustomSelect
            onSelect={(value) => setTimeDuration(value)}
            options={TIME_DURATIONS}
            placeholder="Time Duration"
            selectedValue={timeDuration}
            className="w-[150px] h-12 sm:h-15"
            triggerClassName="h-12 w-full sm:h-15 cursor-pointer focus:border-black hover:border-grey border-grey text-black"
            chevronClassName="text-black"
            contentClassName="w-full text-black max-h-60 overflow-y-auto"
          />
        </div>
      </div>
    </section>
  );
}
