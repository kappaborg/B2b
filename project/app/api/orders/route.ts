import { NextRequest, NextResponse } from 'next/server';

// Mock orders data
const mockOrders = [
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
  }
];

export async function GET(request: NextRequest) {
  // Simulate some delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(mockOrders);
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Here you would typically save to database
    const newOrder = {
      id: `ORD-2024-${String(mockOrders.length + 1).padStart(3, '0')}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    mockOrders.push(newOrder);
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
} 