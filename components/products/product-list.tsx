"use client";

import { useCart } from '@/components/cart/cart-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { LoadingError, NoProductsFound } from '@/components/ui/empty-states';
import { ProductGridSkeleton } from '@/components/ui/loading-states';
import { useToast } from '@/hooks/use-toast';
import { highlightText, searchProducts } from '@/lib/search-utils';
import { useStore } from '@/lib/store';
import type { Product } from '@/types';
import { Heart, Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProductList() {
  const { data: products, error, mutate } = useSWR<Product[]>('/api/products', fetcher);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const { favorites, addFavorite, removeFavorite } = useStore();
  const isLoading = !products && !error;

  // Filter and sort products based on URL parameters
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = [...products];
    
    const category = searchParams.get('category');
    const onSale = searchParams.get('sale') === 'true';
    const newArrivals = searchParams.get('new') === 'true';
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort');
    
    // Apply category filter
    if (category) {
      result = result.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply sale filter
    if (onSale) {
      result = result.filter(product => product.isSale);
    }
    
    // Apply new arrivals filter
    if (newArrivals) {
      result = result.filter(product => product.isNew);
    }
    
    // Apply advanced search if search term exists
    if (search) {
      result = searchProducts(result, search);
    }
    
    // Apply sorting (if no search term, or search term but user specified sorting)
    if (sortBy && (!search || search.trim() === '')) {
      switch (sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
          result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
          break;
        default:
          break;
      }
    }
    
    return result;
  }, [products, searchParams]);

  const searchTerm = searchParams.get('search') || '';

  const toggleWishlist = (productId: number) => {
    if (favorites.includes(productId)) {
      removeFavorite(productId);
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist",
      });
    } else {
      addFavorite(productId);
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
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
  };

  // Loading state
  if (isLoading) {
    return <ProductGridSkeleton count={9} />;
  }

  // Error state
  if (error) {
    return (
      <LoadingError 
        message="Failed to load products"
        onRetry={() => mutate()}
      />
    );
  }

  // Empty state
  if (filteredProducts.length === 0) {
    return (
      <div className="space-y-6">
        {searchTerm && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Search size={20} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                No results found for "{searchTerm}"
              </span>
            </div>
          </div>
        )}
        <NoProductsFound />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      {searchTerm && (
        <div className="border-b pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Search size={18} className="text-pink-500" />
            <span className="text-sm text-muted-foreground">
              Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for
            </span>
            <span className="font-semibold text-pink-600 dark:text-pink-400">
              "{searchTerm}"
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Results are sorted by relevance. Use filters to narrow down your search.
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product: Product) => (
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
                {searchTerm && (
                  <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700">
                    Match
                  </Badge>
                )}
              </div>
              
              {/* Wishlist button */}
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-2 right-2 z-10 rounded-full bg-white/80 p-1.5 shadow-sm transition-all hover:bg-white hover:scale-110"
                aria-label={favorites.includes(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                tabIndex={0}
                type="button"
              >
                <Heart 
                  size={18} 
                  className={favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"} 
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
                    priority={false}
                  />
                </div>
              </Link>
            </div>
            
            <CardContent className="p-4">
              <div className="mb-1 text-sm text-muted-foreground">
                {searchTerm ? (
                  <span dangerouslySetInnerHTML={{ 
                    __html: highlightText(product.category, searchTerm) 
                  }} />
                ) : (
                  product.category
                )}
              </div>
              <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
                <h3 className="font-medium text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {searchTerm ? (
                    <span dangerouslySetInnerHTML={{ 
                      __html: highlightText(product.name, searchTerm) 
                    }} />
                  ) : (
                    product.name
                  )}
                </h3>
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
    </div>
  );
}