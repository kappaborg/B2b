"use client";

import { Button } from '@/components/ui/button';
import { AlertCircle, Heart, RefreshCw, Search, ShoppingBag, Wifi } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 text-muted-foreground/60">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <Button asChild={!!action.href} onClick={action.onClick}>
          {action.href ? (
            <Link href={action.href}>{action.label}</Link>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  );
}

// No Products Found
export function NoProductsFound() {
  return (
    <EmptyState
      icon={<Search size={64} />}
      title="No products found"
      description="We couldn't find any products matching your search criteria. Try adjusting your filters or search terms."
      action={{
        label: "Browse all products",
        href: "/products",
      }}
    />
  );
}

// Empty Cart
export function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingBag size={64} />}
      title="Your cart is empty"
      description="Start shopping and add some amazing products to your cart."
      action={{
        label: "Start shopping",
        href: "/products",
      }}
    />
  );
}

// Empty Wishlist
export function EmptyWishlist() {
  return (
    <EmptyState
      icon={<Heart size={64} />}
      title="Your wishlist is empty"
      description="Save products you love by clicking the heart icon. Create your perfect collection of desires."
      action={{
        label: "Explore products",
        href: "/products",
      }}
    />
  );
}

// No Categories
export function NoCategories() {
  return (
    <EmptyState
      icon={<ShoppingBag size={64} />}
      title="No Categories Available"
      description="We're currently updating our product categories. Please check back soon for new collections."
      action={{
        label: "View Products",
        href: "/products"
      }}
    />
  );
}

// Network Error
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<Wifi size={64} />}
      title="Connection Problem"
      description="We're having trouble connecting to our servers. Please check your internet connection and try again."
      action={{
        label: "Try Again",
        onClick: onRetry || (() => window.location.reload())
      }}
    />
  );
}

// Generic Error
export function GenericError({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<AlertCircle size={64} />}
      title="Something Went Wrong"
      description="We encountered an unexpected error. Our team has been notified and is working to fix this issue."
      action={{
        label: "Refresh Page",
        onClick: onRetry || (() => window.location.reload())
      }}
    />
  );
}

// Loading Error with Retry
export function LoadingError({ 
  message = "Failed to load content", 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void; 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-muted-foreground/25 rounded-lg bg-muted/10">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h4 className="text-lg font-medium mb-2">Loading Failed</h4>
      <p className="text-muted-foreground mb-4 text-sm max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="hover:bg-pink-50 dark:hover:bg-pink-950/20"
        >
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}

// Out of Stock
export function OutOfStock() {
  return (
    <div className="text-center py-8 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-950/20 rounded-full mb-4">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h4 className="text-lg font-semibold mb-2">Out of Stock</h4>
      <p className="text-muted-foreground text-sm">
        This item is currently unavailable. Check back soon or browse similar products.
      </p>
    </div>
  );
}
