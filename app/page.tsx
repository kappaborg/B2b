import BannerSection from '@/components/home/banner-section';
import Hero from '@/components/home/hero';
import Newsletter from '@/components/home/newsletter';
import Testimonials from '@/components/home/testimonials';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const Categories = dynamic(() => import('@/components/home/categories'), { ssr: false });
const FeaturedProducts = dynamic(() => import('@/components/home/featured-products'), { ssr: false });

export const metadata: Metadata = {
  title: 'Luxe Intimates | Premium Adult Products',
  description: 'Discover our curated collection of premium intimate products for adults.',
  openGraph: {
    title: 'Luxe Intimates | Premium Adult Products',
    description: 'Discover our curated collection of premium intimate products for adults.',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxe Intimates | Premium Adult Products',
    description: 'Discover our curated collection of premium intimate products for adults.',
    images: ['/og-image.jpg'],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col gap-12 md:gap-20">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <BannerSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}