"use client";
import { Card } from '@/components/ui/card';
import { LoadingError, NoCategories } from '@/components/ui/empty-states';
import { CategoriesGridSkeleton } from '@/components/ui/loading-states';
import Link from 'next/link';
import useSWR from 'swr';

const categoryDetails: Record<string, { description: string; image: string; href: string }> = {
  'Lingerie': {
    description: 'Sensual lingerie that captivates',
    image: 'https://images.pexels.com/photos/6311377/pexels-photo-6311377.jpeg?auto=compress&cs=tinysrgb&w=1600',
    href: '/products?category=lingerie',
  },
  'Toys': {
    description: 'Intimate toys for ultimate pleasure',
    image: 'https://images.pexels.com/photos/5641973/pexels-photo-5641973.jpeg?auto=compress&cs=tinysrgb&w=1600',
    href: '/products?category=toys',
  },
  'Accessories': {
    description: 'Seductive accessories for passionate moments',
    image: 'https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&w=1600',
    href: '/products?category=accessories',
  },
  'Wellness': {
    description: 'Intimate wellness for body and soul',
    image: 'https://images.pexels.com/photos/7759816/pexels-photo-7759816.jpeg?auto=compress&cs=tinysrgb&w=1600',
    href: '/products?category=wellness',
  },
  'Gift Sets': {
    description: 'Romantic gift sets for special occasions',
    image: 'https://images.pexels.com/photos/6311603/pexels-photo-6311603.jpeg?auto=compress&cs=tinysrgb&w=1600',
    href: '/products?category=gift-sets',
  },
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Categories() {
  const { data: categories, error, mutate } = useSWR('/api/categories', fetcher);
  const isLoading = !categories && !error;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6 elegant-text">
          <span className="gradient-text">Explore</span> Our Categories
        </h2>
        <p className="text-foreground/70 max-w-2xl mx-auto text-lg leading-relaxed">
          Discover our carefully curated categories of premium intimate products designed to 
          <span className="text-pink-500 font-semibold"> enhance your passion</span> and 
          <span className="text-purple-500 font-semibold"> awaken your desires</span>.
        </p>
      </div>

      {/* Loading state */}
      {isLoading && <CategoriesGridSkeleton count={4} />}

      {/* Error state */}
      {error && (
        <LoadingError 
          message="Failed to load categories"
          onRetry={() => mutate()}
        />
      )}

      {/* Empty state */}
      {categories && categories.length === 0 && <NoCategories />}

      {/* Categories grid */}
      {categories && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category: any) => {
            const details = categoryDetails[category.name] || { description: '', image: '', href: '#' };
            return (
              <Link key={category.id} href={details.href} className="group">
                <Card className="overflow-hidden border-0 shadow-lg transition-all duration-500 hover:shadow-2xl hover-lift h-full bg-gradient-to-br from-white to-pink-50/30 dark:from-gray-900 dark:to-pink-950/20">
                  <div className="relative h-72 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${details.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-pink-900/90 group-hover:via-purple-900/40 transition-all duration-500" />
                    
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-8 h-8 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 elegant-text group-hover:text-pink-200 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed group-hover:text-white transition-colors">
                        {details.description}
                      </p>
                      
                      {/* Hover arrow */}
                      <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <span className="text-sm font-medium">Explore</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}