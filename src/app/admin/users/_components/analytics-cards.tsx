import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  TrendingUp,
  UserCheck,
  Users,
  UserPlus,
  DollarSign,
  Shield,
} from 'lucide-react';

export interface UserAnalyticsData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  adminUsers: number;
  professionalUsers: number;
}

interface UserAnalyticsCardsProps {
  analytics: UserAnalyticsData;
  pagination?: {
    total: number;
  };
}

export function UserAnalyticsCards({
  analytics,
  pagination,
}: UserAnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs sm:text-sm font-medium">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {pagination?.total || analytics.totalUsers}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
            <span className="text-green-400">Active users</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs sm:text-sm font-medium">Active</p>
              <p className="text-xl sm:text-2xl font-bold text-green-400">
                {analytics.activeUsers}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-green-400">
              {analytics.totalUsers > 0
                ? (
                    (analytics.activeUsers / analytics.totalUsers) *
                    100
                  ).toFixed(1)
                : 0}
              % of total users
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs sm:text-sm font-medium">Professionals</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-400">
                {analytics.professionalUsers}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-purple-400">Astrologers & Coaches</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs sm:text-sm font-medium">
                New This Month
              </p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                {analytics.newUsersThisMonth}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-emerald-400">Recent registrations</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
