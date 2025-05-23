"use client";
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';

export default function OrderConfirmationPage() {
  // Son siparişi backend'den çek
  const { data: orders, error } = useSWR('/api/orders', (url) => fetch(url).then(res => res.json()));
  const order = orders && orders.length > 0 ? orders[orders.length - 1] : null;
  const isLoading = !orders && !error;

  if (isLoading) return <div>Loading...</div>;
  if (error || !order) return <div>Order not found.</div>;

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
      </div>
      
      <div className="bg-card rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Order Number:</span>
            <span>{order.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Date:</span>
            <span>{new Date(order.date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Payment Method:</span>
            <span>{order.paymentMethod || 'Credit Card'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Shipping Method:</span>
            <span>Standard Shipping</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Estimated Delivery:</span>
            <span>{order.shippingInfo?.estimatedDelivery || '3-7 business days'}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>Total:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <span>You will receive an order confirmation email with your order details.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <span>Once your order is shipped, you will receive a shipping confirmation email with tracking information.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <span>Your order will be delivered in discreet packaging for your privacy.</span>
          </li>
        </ul>
      </div>
      
      <div className="text-center space-y-4">
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          If you have any questions about your order, please contact our customer service.
        </p>
      </div>
    </div>
  );
}