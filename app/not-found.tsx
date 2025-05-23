import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
        
        {/* Debug info for development */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
        </div>
      </div>
    </div>
  );
} 