import { Suspense } from 'react';
import ProductList from '@/components/products/product-list';
import ProductFilter from '@/components/products/product-filter';
import ProductSorter from '@/components/products/product-sorter';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Shop All Products</h1>
      <p className="text-muted-foreground mb-8">
        Browse our full collection of premium intimate products.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilter />
        </div>
        
        <div className="lg:col-span-3">
          <ProductSorter />
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-64 w-full" />
          <div className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-6 w-4/5 mb-4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}