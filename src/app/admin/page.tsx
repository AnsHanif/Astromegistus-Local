'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { useAdminDashboard } from '@/hooks/query/admin-queries';

export default function AdminDashboard() {
  const { data: dashboardResponse, isLoading, error } = useAdminDashboard();

  // Extract dashboard data from response, handle different response structures
  const dashboardData =
    dashboardResponse?.data?.data || dashboardResponse || {};

  console.log('Dashboard response:', dashboardResponse);
  console.log('Processed dashboard data:', dashboardData);

  const stats = [
    {
      title: 'Total Users',
      value: (dashboardData as any)?.totalUsers?.toString() || '0',
      change: '+12%',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      title: 'Total Products',
      value: (dashboardData as any)?.totalProducts?.toString() || '0',
      change: '+3',
      icon: Package,
      color: 'text-green-400',
    },
    {
      title: 'Active Users',
      value: (dashboardData as any)?.activeUsers?.toString() || '0',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-purple-400',
    },
    {
      title: 'Active Products',
      value: (dashboardData as any)?.activeProducts?.toString() || '0',
      change: '+1.5%',
      icon: DollarSign,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-white/70 mt-2">
          Welcome to the Astromegistus Admin Panel
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-white/70">
            <Loader2 className="h-6 w-6 animate-spin" />
            Loading dashboard...
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400">
            Error loading dashboard data. Please try again.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="bg-emerald-green/10 border-white/10"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/70">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <p className="text-xs text-green-400 mt-1">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-emerald-green/10 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">New user registration</p>
                  <p className="text-xs text-white/50">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Product updated</p>
                  <p className="text-xs text-white/50">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">New booking created</p>
                  <p className="text-xs text-white/50">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-green/10 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-white font-medium">Add New Product</p>
                <p className="text-xs text-white/50">
                  Create a new astrology reading
                </p>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-white font-medium">View User Reports</p>
                <p className="text-xs text-white/50">Analyze user engagement</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <p className="text-white font-medium">System Settings</p>
                <p className="text-xs text-white/50">
                  Configure platform settings
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
