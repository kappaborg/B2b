"use client";

import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-states';
import {
    BarChart3,
    DollarSign,
    Eye,
    Heart,
    Package,
    Plus,
    Settings,
    ShoppingCart,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Mock analytics data
const analyticsData = {
  totalRevenue: 12459.50,
  totalOrders: 156,
  totalCustomers: 89,
  totalProducts: 24,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
  productsGrowth: 4.2,
};

const recentOrders = [
  { id: 'ORD-001', customer: 'Jane Doe', amount: 89.99, status: 'completed' },
  { id: 'ORD-002', customer: 'Sarah Smith', amount: 129.50, status: 'processing' },
  { id: 'ORD-003', customer: 'Emma Wilson', amount: 67.25, status: 'pending' },
];

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const { data: products } = useSWR('/api/products', fetcher);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={<Settings size={64} />}
          title="Access Denied"
          description="You need admin privileges to access this area. Please sign in with an admin account."
          action={{
            label: "Go to Homepage",
            href: "/",
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold elegant-text mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here's what's happening with your store today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analyticsData.revenueGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analyticsData.ordersGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analyticsData.customersGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || analyticsData.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{analyticsData.productsGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Button asChild className="h-24 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
          <Link href="/admin/products/new" className="flex flex-col items-center gap-2">
            <Plus size={24} />
            <span>Add Product</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-24 hover:bg-pink-50 dark:hover:bg-pink-950/20">
          <Link href="/admin/products" className="flex flex-col items-center gap-2">
            <Package size={24} />
            <span>Manage Products</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-24 hover:bg-purple-50 dark:hover:bg-purple-950/20">
          <Link href="/admin/orders" className="flex flex-col items-center gap-2">
            <ShoppingCart size={24} />
            <span>View Orders</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-24 hover:bg-blue-50 dark:hover:bg-blue-950/20">
          <Link href="/admin/customers" className="flex flex-col items-center gap-2">
            <Users size={24} />
            <span>Manage Users</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart size={20} />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{order.id}</div>
                    <div className="text-sm text-muted-foreground">{order.customer}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${order.amount}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/admin/orders">
                <Eye size={16} className="mr-2" />
                View All Orders
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} />
              Performance Overview
            </CardTitle>
            <CardDescription>Key metrics for your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-sm">Revenue Growth</span>
                </div>
                <span className="font-medium text-green-600">+{analyticsData.revenueGrowth}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  <span className="text-sm">Customer Growth</span>
                </div>
                <span className="font-medium text-blue-600">+{analyticsData.customersGrowth}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={16} className="text-purple-600" />
                  <span className="text-sm">Order Growth</span>
                </div>
                <span className="font-medium text-purple-600">+{analyticsData.ordersGrowth}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart size={16} className="text-pink-600" />
                  <span className="text-sm">Customer Satisfaction</span>
                </div>
                <span className="font-medium text-pink-600">98.5%</span>
              </div>
            </div>
            
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/admin/analytics">
                <BarChart3 size={16} className="mr-2" />
                View Detailed Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 