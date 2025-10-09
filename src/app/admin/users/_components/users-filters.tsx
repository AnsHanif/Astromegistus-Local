import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SearchBar from '@/components/common/search-bar/search-bar';
import { CustomSelect } from '@/components/common/custom-select/custom-select';

export type UserStatusFilter = 'All' | 'Active' | 'Inactive';
export type UserRoleFilter =
  | 'All'
  | 'GUEST'
  | 'PAID'
  | 'ASTROMEGISTUS'
  | 'ASTROMEGISTUS_COACH'
  | 'ADMIN';
export type UserVerifiedFilter = 'All' | 'Approved' | 'Pending';

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: UserStatusFilter;
  onStatusChange: (status: UserStatusFilter) => void;
  filterRole: UserRoleFilter;
  onRoleChange: (role: UserRoleFilter) => void;
  filterVerified: UserVerifiedFilter;
  onVerifiedChange: (verified: UserVerifiedFilter) => void;
  searchPlaceholder?: string;
}

const statusOptions: { label: string; value: UserStatusFilter }[] = [
  { label: 'All Status', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

const roleOptions: { label: string; value: UserRoleFilter }[] = [
  { label: 'All Roles', value: 'All' },
  { label: 'Guest', value: 'GUEST' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Astrologer', value: 'ASTROMEGISTUS' },
  { label: 'Coach', value: 'ASTROMEGISTUS_COACH' },
  { label: 'Admin', value: 'ADMIN' },
];

const verifiedOptions: { label: string; value: UserVerifiedFilter }[] = [
  { label: 'All', value: 'All' },
  { label: 'Verified', value: 'Approved' },
  { label: 'Pending', value: 'Pending' },
];

export function UsersFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterRole,
  onRoleChange,
  filterVerified,
  onVerifiedChange,
  searchPlaceholder = 'Search by user name, email...',
}: UsersFiltersProps) {
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
              options={statusOptions}
              selectedValue={filterStatus}
              onSelect={(value) => onStatusChange(value as UserStatusFilter)}
              placeholder="All Status"
              variant="large"
              triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 sm:h-12 min-h-[40px] sm:min-h-[48px] rounded-lg min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
              contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
              itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
            />

            <CustomSelect
              options={roleOptions}
              selectedValue={filterRole}
              onSelect={(value) => onRoleChange(value as UserRoleFilter)}
              placeholder="All Roles"
              variant="large"
              maxHeight="max-h-56 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 sm:h-12 min-h-[40px] sm:min-h-[48px] rounded-lg min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
              contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
              itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
            />

            <CustomSelect
              options={verifiedOptions}
              selectedValue={filterVerified}
              onSelect={(value) =>
                onVerifiedChange(value as UserVerifiedFilter)
              }
              placeholder="All Approval"
              variant="large"
              triggerClassName="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-white/40 focus:ring-0 focus:outline-none h-10 sm:h-12 min-h-[40px] sm:min-h-[48px] rounded-lg min-w-[120px] sm:min-w-[140px] w-full sm:w-auto"
              contentClassName="bg-emerald-green border-white/20 shadow-lg rounded-lg"
              itemClassName="text-white hover:bg-white/10 focus:bg-white/10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
