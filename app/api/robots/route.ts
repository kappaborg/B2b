import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /checkout/
Disallow: /account/
Disallow: /cart/
Disallow: /_next/
Disallow: /.well-known/

# Allow specific areas for SEO
Allow: /
Allow: /products/
Allow: /categories/

# Sitemap location
Sitemap: ${appUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 