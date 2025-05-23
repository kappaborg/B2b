import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DebugPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Vercel Deployment Debug</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">🏠 Pages Test</h2>
            <div className="space-y-2">
              <Link href="/" className="block text-blue-600 hover:underline">
                ✅ Home (/)
              </Link>
              <Link href="/products" className="block text-blue-600 hover:underline">
                ✅ Products (/products)
              </Link>
              <Link href="/admin" className="block text-blue-600 hover:underline">
                ✅ Admin (/admin)
              </Link>
              <Link href="/cart" className="block text-blue-600 hover:underline">
                ✅ Cart (/cart)
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">🔗 API Test</h2>
            <div className="space-y-2">
              <a href="/api/health" target="_blank" className="block text-blue-600 hover:underline">
                ✅ Health Check (/api/health)
              </a>
              <a href="/api/products" target="_blank" className="block text-blue-600 hover:underline">
                ✅ Products API (/api/products)
              </a>
              <a href="/api/categories" target="_blank" className="block text-blue-600 hover:underline">
                ✅ Categories API (/api/categories)
              </a>
              <a href="/robots.txt" target="_blank" className="block text-blue-600 hover:underline">
                ✅ Robots.txt (/robots.txt)
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Environment Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Timestamp:</strong> {new Date().toISOString()}
            </div>
            <div>
              <strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'SSR'}
            </div>
            <div>
              <strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side rendered'}
            </div>
            <div>
              <strong>Referrer:</strong> {typeof document !== 'undefined' ? document.referrer || 'Direct' : 'SSR'}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700">
              🏠 Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 