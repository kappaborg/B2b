"use client";

import { useCart } from '@/components/cart/cart-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { LoadingError, NoProductsFound } from '@/components/ui/empty-states';
import { ProductGridSkeleton } from '@/components/ui/loading-states';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types';
import { Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';

export default function FeaturedProducts() {
  const { data: products, error, mutate } = useSWR<Product[]>('/api/products', (url: string) => fetch(url).then(res => res.json()));
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const isLoading = !products && !error;

  // Loading state
  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our best-selling products, curated for your pleasure and satisfaction.
          </p>
        </div>
        <ProductGridSkeleton count={4} />
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our best-selling products, curated for your pleasure and satisfaction.
          </p>
        </div>
        <LoadingError 
          message="Failed to load featured products"
          onRetry={() => mutate()}
        />
      </section>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our best-selling products, curated for your pleasure and satisfaction.
          </p>
        </div>
        <NoProductsFound />
      </section>
    );
  }

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist",
      });
    } else {
      setWishlist([...wishlist, productId]);
      toast({
        title: "Added to wishlist",
        description: "The item has been added to your wishlist",
      });
    }
  };

  const handleAddToCart = (product: any) => {
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

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our best-selling products, curated for your pleasure and satisfaction.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
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
              </div>
              
              {/* Wishlist button */}
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-2 right-2 z-10 rounded-full bg-white/80 p-1.5 shadow-sm transition-all hover:bg-white hover:scale-110"
                aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                tabIndex={0}
                type="button"
              >
                <Heart 
                  size={18} 
                  className={wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"} 
                  aria-hidden="true"
                />
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
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <Button 
                onClick={() => handleAddToCart(product)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold border-0 hover-lift shadow-lg"
                aria-label={`Add ${product.name} to cart`}
                type="button"
              >
                <ShoppingCart size={16} className="mr-2" aria-hidden="true" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button asChild size="lg" variant="outline" className="hover:bg-pink-50 dark:hover:bg-pink-950/20">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </section>
  );
}