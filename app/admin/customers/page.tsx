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
    Calendar,
    Download,
    Eye,
    Filter,
    Mail,
    Search,
    ShoppingBag,
    Star,
    UserCheck,
    Users
} from 'lucide-react';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Customer {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  role: 'user' | 'admin';
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive' | 'banned';
}

// Mock customer data from AuthService + additional info
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    createdAt: new Date('2024-01-15'),
    role: 'user',
    totalOrders: 5,
    totalSpent: 425.50,
    lastOrderDate: '2024-01-20',
    status: 'active'
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    createdAt: new Date('2024-02-10'),
    role: 'user',
    totalOrders: 3,
    totalSpent: 189.99,
    lastOrderDate: '2024-02-15',
    status: 'active'
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    createdAt: new Date('2024-01-08'),
    role: 'user',
    totalOrders: 8,
    totalSpent: 680.25,
    lastOrderDate: '2024-01-22',
    status: 'active'
  },
  {
    id: 5,
    name: 'Lisa Brown',
    email: 'lisa@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    createdAt: new Date('2024-01-25'),
    role: 'user',
    totalOrders: 1,
    totalSpent: 120.00,
    lastOrderDate: '2024-01-26',
    status: 'active'
  },
  {
    id: 6,
    name: 'Anna Garcia',
    email: 'anna@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna',
    createdAt: new Date('2024-01-12'),
    role: 'user',
    totalOrders: 2,
    totalSpent: 150.75,
    lastOrderDate: '2024-01-18',
    status: 'inactive'
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  banned: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

export default function AdminCustomers() {
  const { data: customersFromAPI, error, mutate } = useSWR('/api/users', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  // Use mock data if API data is not available
  const customers = customersFromAPI || mockCustomers;
  const isLoading = !customers && !error;

  // Filter customers based on search term and status
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    
    return customers.filter((customer: Customer) => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // Calculate summary stats
  const stats = useMemo(() => {
    if (!customers) return { total: 0, active: 0, totalRevenue: 0, avgOrderValue: 0 };
    
    const totalRevenue = customers.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0);
    const totalOrders = customers.reduce((sum: number, c: Customer) => sum + c.totalOrders, 0);
    
    return {
      total: customers.length,
      active: customers.filter((c: Customer) => c.status === 'active').length,
      totalRevenue,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }, [customers]);

  const handleStatusUpdate = async (customerId: number, newStatus: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Customer Updated",
        description: `Customer status updated to ${newStatus}.`,
      });
      
      // Refresh the data
      mutate();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating the customer status.",
        variant: "destructive",
      });
    }
  };

  const exportCustomers = () => {
    const csvContent = [
      ['Name', 'Email', 'Status', 'Total Orders', 'Total Spent', 'Member Since'].join(','),
      ...filteredCustomers.map((customer: Customer) => [
        customer.name,
        customer.email,
        customer.status,
        customer.totalOrders,
        customer.totalSpent.toFixed(2),
        customer.createdAt.toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Customer data has been exported to CSV file.",
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
          <h2 className="text-xl font-semibold mb-2">Failed to load customers</h2>
          <p className="text-muted-foreground mb-4">
            There was an error loading the customer data. Please try again.
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
            <h1 className="text-3xl font-bold elegant-text mb-2">Customer Management</h1>
            <p className="text-muted-foreground">
              Manage your customer base and relationships
            </p>
          </div>
          <Button onClick={exportCustomers} variant="outline">
            <Download size={16} className="mr-2" />
            Export Customers
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From all customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Per order average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter Customers</CardTitle>
          <CardDescription>Find and filter customers by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          <CardDescription>
            {searchTerm || statusFilter !== 'all' 
              ? `Filtered results` 
              : 'All customers in your system'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Member Since</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer: Customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {customer.avatar ? (
                          <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail size={12} />
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[customer.status]}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{customer.totalOrders}</div>
                      <div className="text-xs text-muted-foreground">orders</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${customer.totalSpent.toFixed(2)}</div>
                    </TableCell>
                    <TableCell>
                      {customer.lastOrderDate ? (
                        <div className="text-sm">
                          {new Date(customer.lastOrderDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm flex items-center gap-1">
                        <Calendar size={12} />
                        {customer.createdAt.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Select onValueChange={(value) => handleStatusUpdate(customer.id, value)}>
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No customers found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== 'all' ? 
                    'No customers match your current search and filter criteria.' :
                    'No customers have registered yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedCustomer.avatar ? (
                    <img
                      src={selectedCustomer.avatar}
                      alt={selectedCustomer.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        {selectedCustomer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <CardTitle>{selectedCustomer.name}</CardTitle>
                    <CardDescription>{selectedCustomer.email}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Status */}
              <div>
                <h3 className="font-semibold mb-2">Account Status</h3>
                <Badge className={statusColors[selectedCustomer.status]}>
                  {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                </Badge>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="font-semibold mb-3">Customer Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">{selectedCustomer.totalOrders}</div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">
                      ${selectedCustomer.totalOrders > 0 ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Order Value</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl font-bold">
                      {selectedCustomer.lastOrderDate ? 
                        Math.floor((new Date().getTime() - new Date(selectedCustomer.lastOrderDate).getTime()) / (1000 * 3600 * 24)) :
                        'N/A'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Days Since Last Order</div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div>
                <h3 className="font-semibold mb-2">Account Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Member Since:</span>{' '}
                    {selectedCustomer.createdAt.toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Order:</span>{' '}
                    {selectedCustomer.lastOrderDate ? 
                      new Date(selectedCustomer.lastOrderDate).toLocaleDateString() : 
                      'No orders yet'
                    }
                  </div>
                  <div>
                    <span className="text-muted-foreground">Role:</span>{' '}
                    <Badge variant="outline">
                      {selectedCustomer.role.charAt(0).toUpperCase() + selectedCustomer.role.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 