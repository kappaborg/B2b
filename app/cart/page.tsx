"use client";

import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { EmptyCart } from '@/components/ui/empty-states';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { items, itemCount, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  
  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };
  
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };
  
  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoCode.trim()) return;
    const res = await fetch('/api/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: promoCode }),
    });
    if (!res.ok) {
      setPromoDiscount(0);
      setPromoError('Invalid or expired promo code');
      toast({
        title: 'Invalid promo code',
        description: 'The promo code you entered is invalid or expired',
        variant: 'destructive',
      });
      setPromoCode('');
      return;
    }
    const data = await res.json();
    setPromoDiscount(data.discount);
    toast({
      title: 'Promo code applied',
      description: `You received a ${(data.discount * 100).toFixed(0)}% discount!`,
    });
    setPromoCode('');
  };
  
  const KDV_RATE = 0.17; // Bosna Hersek KDV oranı
  const discountAmount = totalPrice * promoDiscount;
  const discountedTotal = totalPrice - discountAmount;
  const subtotal = discountedTotal / (1 + KDV_RATE);
  const kdvAmount = discountedTotal - subtotal;
  const shippingCost = totalPrice > 50 ? 0 : 4.99;
  const finalTotal = discountedTotal + shippingCost;
  
  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyCart />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-lg border">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted rounded-t-lg">
              <div className="col-span-6 font-medium">Product</div>
              <div className="col-span-2 font-medium text-center">Price</div>
              <div className="col-span-2 font-medium text-center">Quantity</div>
              <div className="col-span-2 font-medium text-right">Total</div>
            </div>
            
            {/* Cart Items */}
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Product */}
                  <div className="col-span-6 flex items-center gap-4">
                    <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-sm text-red-500 flex items-center mt-1"
                      >
                        <Trash2 size={14} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden font-medium">Price:</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                  
                  {/* Quantity */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden font-medium">Quantity:</span>
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-7 w-7" 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end">
                    <span className="md:hidden font-medium">Total:</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button asChild variant="outline">
              <Link href="/products">
                <ArrowRight size={16} className="mr-2 rotate-180" /> Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
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
              {promoDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <form onSubmit={handleApplyPromo} className="pt-2">
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Promo code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button type="submit" variant="outline">Apply</Button>
                </div>
              </form>
              
              {promoError && (
                <div className="text-red-500 text-sm">{promoError}</div>
              )}
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total (incl. VAT)</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
              
              <Button asChild className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                <Link href="/checkout">
                  Checkout <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              
              <div className="text-xs text-muted-foreground text-center mt-4">
                <p>Secure payment processing</p>
                <p>Free shipping on orders over $50</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}