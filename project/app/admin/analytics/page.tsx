"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    BarChart3,
    DollarSign,
    Download,
    Eye,
    Package,
    ShoppingCart,
    TrendingUp,
    Users
} from 'lucide-react';
import { useState } from 'react';

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalRevenue: 12459.50,
    totalOrders: 156,
    totalCustomers: 89,
    totalProducts: 24,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    customersGrowth: 15.2,
    productsGrowth: 4.2,
  },
  salesByMonth: [
    { month: 'Jan', sales: 2100, orders: 25 },
    { month: 'Feb', sales: 2500, orders: 32 },
    { month: 'Mar', sales: 1800, orders: 22 },
    { month: 'Apr', sales: 3200, orders: 45 },
    { month: 'May', sales: 2900, orders: 38 },
    { month: 'Jun', sales: 3400, orders: 52 },
  ],
  topProducts: [
    { id: 1, name: 'Silk Lingerie Set', sales: 145, revenue: 12905.50 },
    { id: 2, name: 'Lace Bralette', sales: 98, revenue: 5879.02 },
    { id: 3, name: 'Satin Chemise', sales: 76, revenue: 5700.00 },
    { id: 4, name: 'Rose Gold Choker', sales: 62, revenue: 2790.00 },
    { id: 5, name: 'Crystal Body Chain', sales: 45, revenue: 3847.50 },
  ],
  customerSegments: [
    { segment: 'New Customers', count: 34, percentage: 38.2 },
    { segment: 'Returning Customers', count: 42, percentage: 47.2 },
    { segment: 'VIP Customers', count: 13, percentage: 14.6 },
  ],
  ordersByStatus: [
    { status: 'completed', count: 89, percentage: 57.1 },
    { status: 'processing', count: 23, percentage: 14.7 },
    { status: 'shipped', count: 31, percentage: 19.9 },
    { status: 'pending', count: 13, percentage: 8.3 },
  ],
  topLocations: [
    { location: 'New York, NY', orders: 45, revenue: 4250.50 },
    { location: 'Los Angeles, CA', orders: 38, revenue: 3890.25 },
    { location: 'Chicago, IL', orders: 28, revenue: 2890.75 },
    { location: 'Miami, FL', orders: 25, revenue: 2650.00 },
    { location: 'Seattle, WA', orders: 20, revenue: 1980.00 },
  ]
};

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('last30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const analytics = mockAnalytics;

  const exportAnalytics = () => {
    // Create CSV content for analytics export
    const csvContent = [
      ['Metric', 'Value', 'Growth'].join(','),
      ['Total Revenue', analytics.overview.totalRevenue.toFixed(2), `${analytics.overview.revenueGrowth}%`],
      ['Total Orders', analytics.overview.totalOrders.toString(), `${analytics.overview.ordersGrowth}%`],
      ['Total Customers', analytics.overview.totalCustomers.toString(), `${analytics.overview.customersGrowth}%`],
      ['Total Products', analytics.overview.totalProducts.toString(), `${analytics.overview.productsGrowth}%`],
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold elegant-text mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your business performance and insights
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last90days">Last 90 Days</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportAnalytics} variant="outline">
              <Download size={16} className="mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.overview.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp size={12} className="text-green-600" />
              <span className="text-green-600">+{analytics.overview.revenueGrowth}%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp size={12} className="text-green-600" />
              <span className="text-green-600">+{analytics.overview.ordersGrowth}%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalCustomers}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp size={12} className="text-green-600" />
              <span className="text-green-600">+{analytics.overview.customersGrowth}%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalProducts}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp size={12} className="text-green-600" />
              <span className="text-green-600">+{analytics.overview.productsGrowth}%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} />
              Sales Trends
            </CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.salesByMonth.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {month.month.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{month.month}</div>
                      <div className="text-sm text-muted-foreground">{month.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${month.sales.toFixed(2)}</div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                        style={{ width: `${(month.sales / 3400) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              Top Products
            </CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.sales} sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${product.revenue.toFixed(2)}</div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        style={{ width: `${(product.revenue / 12905.50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Customer Segments
            </CardTitle>
            <CardDescription>Customer distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.customerSegments.map((segment, index) => (
                <div key={segment.segment} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{segment.segment}</span>
                    <span className="font-medium">{segment.count} ({segment.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart size={20} />
              Order Status
            </CardTitle>
            <CardDescription>Order distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.ordersByStatus.map((status, index) => (
                <div key={status.status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{status.status}</span>
                    <span className="font-medium">{status.count} ({status.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        status.status === 'completed' ? 'bg-green-500' :
                        status.status === 'processing' ? 'bg-blue-500' :
                        status.status === 'shipped' ? 'bg-purple-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye size={20} />
              Top Locations
            </CardTitle>
            <CardDescription>Orders by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topLocations.map((location, index) => (
                <div key={location.location} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{location.location}</div>
                      <div className="text-xs text-muted-foreground">{location.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">${location.revenue.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key business insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-400">Strong Performance</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Revenue is up {analytics.overview.revenueGrowth}% compared to last period. 
                  Customer acquisition is exceeding targets.
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/10">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 size={16} className="text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-400">Optimization Opportunity</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Consider increasing inventory for top-performing products. 
                  High demand indicates potential for revenue growth.
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-purple-600" />
                  <span className="font-medium text-purple-800 dark:text-purple-400">Customer Retention</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {analytics.customerSegments[1].percentage}% returning customers shows strong loyalty.
                  Focus on converting new customers to repeat buyers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 