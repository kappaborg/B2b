"use client";

import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted before accessing router
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Form states
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
  });
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [saveInfo, setSaveInfo] = useState(false);
  
  const KDV_RATE = 0.17; // Bosna Hersek KDV oranı
  const subtotal = totalPrice / (1 + KDV_RATE);
  const kdvAmount = totalPrice - subtotal;
  const shippingCost = totalPrice > 50 ? 0 : 4.99;
  const finalTotal = totalPrice + shippingCost;
  
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const orderData = {
        userId: 1, // örnek kullanıcı, gerçek uygulamada oturumdan alınmalı
        items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
        total: finalTotal,
        contactInfo,
        shippingInfo,
        paymentMethod,
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error('Order failed');
      toast({
        title: 'Order placed successfully!',
        description: 'Thank you for your purchase. Your order has been confirmed.',
      });
      clearCart();
      if (mounted) {
        router.push('/order-confirmation');
      }
    } catch (err) {
      toast({
        title: 'Order failed',
        description: 'There was a problem placing your order.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cart empty state after mount
  useEffect(() => {
    if (mounted && itemCount === 0) {
      router.push('/cart');
    }
  }, [mounted, itemCount, router]);
  
  // Loading state while mounting
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Return early if cart is empty
  if (itemCount === 0) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder}>
            {/* Contact Information */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      required 
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Shipping Information */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      required 
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      required 
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      required 
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      required 
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        required 
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input 
                        id="zip" 
                        required 
                        value={shippingInfo.zip}
                        onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <Checkbox 
                    id="saveInfo" 
                    checked={saveInfo}
                    onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                  />
                  <label htmlFor="saveInfo" className="text-sm">
                    Save this information for future orders
                  </label>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Method */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <Tabs defaultValue="card" onValueChange={setPaymentMethod} value={paymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="pt-4">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="000" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input id="nameOnCard" placeholder="John Doe" />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="paypal" className="pt-4">
                    <div className="text-center py-8">
                      <p className="mb-4">You will be redirected to PayPal to complete your purchase securely.</p>
                      <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                        Proceed with PayPal
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="bank" className="pt-4">
                    <div className="space-y-4">
                      <p>Please use the following details to make a bank transfer:</p>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="font-medium">Account Name:</span>
                          <span>Luxe Intimates Ltd</span>
                          <span className="font-medium">Account Number:</span>
                          <span>1234567890</span>
                          <span className="font-medium">Routing Number:</span>
                          <span>987654321</span>
                          <span className="font-medium">Bank:</span>
                          <span>International Bank</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Please use your order number as the payment reference. Your order will be shipped once the funds are cleared in our account.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="lg:hidden">
              <OrderSummary items={items} totalPrice={totalPrice} shippingCost={shippingCost} />
              <Button 
                type="submit" 
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Place Order - $${finalTotal.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <OrderSummary items={items} totalPrice={totalPrice} shippingCost={shippingCost} />
            <Button 
              onClick={handlePlaceOrder} 
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Place Order - $${finalTotal.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrderSummaryProps {
  items: any[];
  totalPrice: number;
  shippingCost: number;
}

function OrderSummary({ items, totalPrice, shippingCost }: OrderSummaryProps) {
  const KDV_RATE = 0.17; // Bosna Hersek KDV oranı
  const subtotal = totalPrice / (1 + KDV_RATE);
  const kdvAmount = totalPrice - subtotal;
  const finalTotal = totalPrice + shippingCost;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <span className="text-sm">{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal (excl. VAT)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT (17%)</span>
              <span>${kdvAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total (incl. VAT)</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}