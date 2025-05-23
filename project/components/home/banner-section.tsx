import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BannerSection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* First Banner */}
        <div className="relative rounded-lg overflow-hidden min-h-[300px]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.pexels.com/photos/5641974/pexels-photo-5641974.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
          />
          <div className="absolute inset-0 bg-purple-900/60" />
          <div className="relative z-10 flex flex-col justify-center h-full p-8 text-white">
            <span className="text-sm font-medium mb-2">Special Offer</span>
            <h3 className="text-2xl font-bold mb-3">30% Off New Arrivals</h3>
            <p className="mb-4 text-white/90">Discover our latest collection with exclusive discounts.</p>
            <div>
              <Button asChild className="bg-white text-purple-800 hover:bg-white/90">
                <Link href="/sale">Shop Sale</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Second Banner */}
        <div className="relative rounded-lg overflow-hidden min-h-[300px]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.pexels.com/photos/8069244/pexels-photo-8069244.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
          />
          <div className="absolute inset-0 bg-pink-800/60" />
          <div className="relative z-10 flex flex-col justify-center h-full p-8 text-white">
            <span className="text-sm font-medium mb-2">Exclusive Collection</span>
            <h3 className="text-2xl font-bold mb-3">Couples Pleasure Sets</h3>
            <p className="mb-4 text-white/90">Enhance your intimate moments with our premium sets.</p>
            <div>
              <Button asChild className="bg-white text-pink-800 hover:bg-white/90">
                <Link href="/products/couples">Explore Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}