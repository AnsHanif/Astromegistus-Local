import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Package,
  GraduationCap,
} from 'lucide-react';

export interface AnalyticsData {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  completionRate: number;
}

interface AnalyticsCardsProps {
  analytics: AnalyticsData;
  pagination?: {
    total: number;
  };
  type: 'sessions' | 'readings';
}

export function AnalyticsCards({
  analytics,
  pagination,
  type,
}: AnalyticsCardsProps) {
  const Icon = type === 'sessions' ? GraduationCap : Package;
  const typeLabel = type === 'sessions' ? 'Sessions' : 'Orders';
  const activeLabel = type === 'sessions' ? 'Active sessions' : 'Active orders';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs sm:text-sm font-medium">
                Total {typeLabel}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {pagination?.total || analytics.totalOrders}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
            <span className="text-green-400">{activeLabel}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs sm:text-sm font-medium">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-400">
                {analytics.pendingOrders}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <AlertCircle className="h-3 w-3 text-yellow-400 mr-1" />
            <span className="text-yellow-400">Awaiting confirmation</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs sm:text-sm font-medium">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-green-400">
                {analytics.completedOrders}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-green-400">
              {analytics.completionRate.toFixed(1)}% completion rate
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-emerald-green/10 border-white/10">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs sm:text-sm font-medium">Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                ${analytics.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-emerald-400">
              Avg: ${analytics.avgOrderValue.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
