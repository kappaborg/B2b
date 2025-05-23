"use client";

import { useCart } from '@/components/cart/cart-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { EmptyWishlist, LoadingError } from '@/components/ui/empty-states';
import { ProductGridSkeleton } from '@/components/ui/loading-states';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';
import type { Product } from '@/types';
import { Heart, Share2, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function WishlistPage() {
  const { data: products, error, mutate } = useSWR<Product[]>('/api/products', fetcher);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { 
    favorites, 
    wishlistItems, 
    removeFavorite, 
    clearWishlist, 
    getFavoriteCount 
  } = useStore();

  const isLoading = !products && !error;

  // Get wishlist products with added dates
  const wishlistProducts = useMemo(() => {
    if (!products || !wishlistItems.length) return [];
    
    return wishlistItems
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        return product ? { ...product, addedAt: item.addedAt } : null;
      })
      .filter(Boolean) as (Product & { addedAt: Date })[];
  }, [products, wishlistItems]);

  const handleRemoveFromWishlist = (productId: number, productName: string) => {
    removeFavorite(productId);
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist`,
    });
  };

  const handleAddToCart = (product: Product & { addedAt: Date }) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wishlist - Luxe Intimates',
          text: `Check out my wishlist with ${getFavoriteCount()} amazing products!`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Wishlist link has been copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Unable to share wishlist",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold elegant-text">My Wishlist</h1>
        </div>
        <ProductGridSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold elegant-text">My Wishlist</h1>
        </div>
        <LoadingError 
          message="Failed to load wishlist products"
          onRetry={() => mutate()}
        />
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyWishlist />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold elegant-text">My Wishlist</h1>
            <p className="text-muted-foreground mt-2">
              You have {getFavoriteCount()} item{getFavoriteCount() !== 1 ? 's' : ''} in your wishlist
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="hidden sm:flex"
            >
              <Share2 size={16} className="mr-2" />
              Share Wishlist
            </Button>
            {wishlistProducts.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearWishlist}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 size={16} className="mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg hover-lift">
            <div className="relative">
              {/* Product badges */}
              <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                {product.isNew && (
                  <Badge className="bg-purple-600 hover:bg-purple-700">New</Badge>
                )}
                {product.isSale && (
                  <Badge className="bg-pink-600 hover:bg-pink-700">Sale</Badge>
                )}
                <Badge variant="outline" className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                  <Heart size={12} className="mr-1 fill-current" />
                  Loved
                </Badge>
              </div>
              
              {/* Remove from wishlist button */}
              <button 
                onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                className="absolute top-2 right-2 z-10 rounded-full bg-red-500 text-white p-1.5 shadow-sm transition-all hover:bg-red-600 hover:scale-110"
                aria-label="Remove from wishlist"
                type="button"
              >
                <Trash2 size={16} />
              </button>
              
              {/* Product image */}
              <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  />
                </div>
              </Link>
            </div>
            
            <CardContent className="p-4">
              <div className="mb-1 text-sm text-muted-foreground">{product.category}</div>
              <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
                <h3 className="font-medium text-lg group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
              </Link>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Added {new Date(product.addedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0 space-y-2">
              <Button 
                onClick={() => handleAddToCart(product)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold border-0 hover-lift shadow-lg"
                type="button"
              >
                <ShoppingCart size={16} className="mr-2" /> Add to Cart
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Heart size={14} className="mr-1" />
                  Remove
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                  className="hidden sm:flex"
                >
                  <Share2 size={14} className="mr-1" />
                  Share
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Wishlist Statistics */}
      <div className="mt-12 p-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/10 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 elegant-text">Wishlist Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-pink-600">{getFavoriteCount()}</div>
            <div className="text-sm text-muted-foreground">Items Saved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              ${wishlistProducts.reduce((total, product) => total + product.price, 0).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-500">
              {wishlistProducts.filter(product => product.isSale).length}
            </div>
            <div className="text-sm text-muted-foreground">On Sale</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-6 elegant-text">You Might Also Like</h3>
        <p className="text-muted-foreground text-center">
          Based on your wishlist, we think you'll love these products too.
        </p>
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/products">Explore More Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 