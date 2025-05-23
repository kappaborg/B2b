"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    Download,
    Eye,
    Filter,
    Package,
    Search,
    ShoppingCart,
    Truck,
    X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    items: [
      { id: 1, name: 'Silk Lingerie Set', price: 89.99, quantity: 1, size: 'M', color: 'Black' },
      { id: 4, name: 'Rose Gold Choker', price: 45.00, quantity: 1, color: 'Gold' }
    ],
    total: 134.99,
    status: 'processing',
    createdAt: '2024-01-15T10:30:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      country: 'USA',
      zipCode: '10001'
    }
  },
  {
    id: 'ORD-2024-002',
    customerName: 'Sarah Smith',
    customerEmail: 'sarah@example.com',
    items: [
      { id: 2, name: 'Lace Bralette', price: 59.99, quantity: 2, size: 'S', color: 'White' }
    ],
    total: 119.98,
    status: 'shipped',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      country: 'USA',
      zipCode: '90210'
    }
  },
  {
    id: 'ORD-2024-003',
    customerName: 'Emma Wilson',
    customerEmail: 'emma@example.com',
    items: [
      { id: 3, name: 'Satin Chemise', price: 75.00, quantity: 1, size: 'L', color: 'Red' }
    ],
    total: 75.00,
    status: 'delivered',
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-16T11:30:00Z',
    shippingAddress: {
      street: '789 Pine St',
      city: 'Chicago',
      country: 'USA',
      zipCode: '60601'
    }
  },
  {
    id: 'ORD-2024-004',
    customerName: 'Lisa Brown',
    customerEmail: 'lisa@example.com',
    items: [
      { id: 5, name: 'Leather Harness', price: 120.00, quantity: 1, size: 'M', color: 'Black' }
    ],
    total: 120.00,
    status: 'pending',
    createdAt: '2024-01-16T12:15:00Z',
    shippingAddress: {
      street: '321 Elm St',
      city: 'Miami',
      country: 'USA',
      zipCode: '33101'
    }
  },
  {
    id: 'ORD-2024-005',
    customerName: 'Anna Garcia',
    customerEmail: 'anna@example.com',
    items: [
      { id: 6, name: 'Crystal Body Chain', price: 85.50, quantity: 1, color: 'Silver' }
    ],
    total: 85.50,
    status: 'cancelled',
    createdAt: '2024-01-12T08:30:00Z',
    updatedAt: '2024-01-13T10:00:00Z',
    shippingAddress: {
      street: '654 Maple Ave',
      city: 'Seattle',
      country: 'USA',
      zipCode: '98101'
    }
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: X,
};

export default function AdminOrders() {
  const { data: ordersFromAPI, error, mutate } = useSWR('/api/orders', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  // Use mock data if API data is not available
  const orders = ordersFromAPI || mockOrders;
  const isLoading = !orders && !error;

  // Filter orders based on search term and status
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter((order: Order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Calculate summary stats
  const stats = useMemo(() => {
    if (!orders) return { total: 0, pending: 0, processing: 0, revenue: 0 };
    
    return {
      total: orders.length,
      pending: orders.filter((o: Order) => o.status === 'pending').length,
      processing: orders.filter((o: Order) => o.status === 'processing').length,
      revenue: orders.reduce((sum: number, o: Order) => sum + o.total, 0),
    };
  }, [orders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Order Updated",
        description: `Order ${orderId} status updated to ${newStatus}.`,
      });
      
      // Refresh the data
      mutate();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating the order status.",
        variant: "destructive",
      });
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date'].join(','),
      ...filteredOrders.map((order: Order) => [
        order.id,
        order.customerName,
        order.customerEmail,
        order.total.toFixed(2),
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Orders have been exported to CSV file.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load orders</h2>
          <p className="text-muted-foreground mb-4">
            There was an error loading the orders. Please try again.
          </p>
          <Button onClick={() => mutate()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold elegant-text mb-2">Order Management</h1>
            <p className="text-muted-foreground">
              Track and manage customer orders
            </p>
          </div>
          <Button onClick={exportOrders} variant="outline">
            <Download size={16} className="mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From all orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            <p className="text-xs text-muted-foreground">
              Being prepared
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter Orders</CardTitle>
          <CardDescription>Find and filter orders by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          <CardDescription>
            {searchTerm || statusFilter !== 'all' 
              ? `Filtered results` 
              : 'All orders in your system'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: Order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.id}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.items[0]?.name}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${order.total.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[order.status]} flex items-center gap-1 w-fit`}>
                          <StatusIcon size={12} />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Select onValueChange={(value) => handleStatusUpdate(order.id, value)}>
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' ? 
                    'No orders match your current search and filter criteria.' :
                    'No orders have been placed yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>{selectedOrder.id}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span> {selectedOrder.customerName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span> {selectedOrder.customerEmail}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <div className="text-sm text-muted-foreground">
                  {selectedOrder.shippingAddress.street}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}<br />
                  {selectedOrder.shippingAddress.country}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                          {item.size && ` • Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </div>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Status & Dates */}
              <div>
                <h3 className="font-semibold mb-2">Order Status</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>{' '}
                    <Badge className={statusColors[selectedOrder.status]}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Order Date:</span>{' '}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                  {selectedOrder.updatedAt && (
                    <div>
                      <span className="text-muted-foreground">Last Updated:</span>{' '}
                      {new Date(selectedOrder.updatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 