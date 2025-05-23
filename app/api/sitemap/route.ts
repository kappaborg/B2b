import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // In a real application, you would fetch this data from your database
  const staticPages = [
    '',
    '/products',
    '/categories',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];
  
  // Mock product data - in real app, fetch from database
  const products = [
    { id: 1, slug: 'silk-lingerie-set', updatedAt: '2024-01-15' },
    { id: 2, slug: 'lace-bralette', updatedAt: '2024-01-14' },
    { id: 3, slug: 'satin-chemise', updatedAt: '2024-01-13' },
    { id: 4, slug: 'rose-gold-choker', updatedAt: '2024-01-12' },
    { id: 5, slug: 'crystal-body-chain', updatedAt: '2024-01-11' },
  ];
  
  const categories = [
    { slug: 'lingerie', updatedAt: '2024-01-10' },
    { slug: 'toys', updatedAt: '2024-01-09' },
    { slug: 'accessories', updatedAt: '2024-01-08' },
  ];
  
  const generateSitemapXml = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;
    
    // Static pages
    staticPages.forEach(page => {
      const url = `${appUrl}${page}`;
      const priority = page === '' ? '1.0' : '0.8';
      const changefreq = page === '' ? 'daily' : 'weekly';
      
      xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });
    
    // Product pages
    products.forEach(product => {
      xml += `
  <url>
    <loc>${appUrl}/products/${product.id}</loc>
    <lastmod>${product.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });
    
    // Category pages
    categories.forEach(category => {
      xml += `
  <url>
    <loc>${appUrl}/categories/${category.slug}</loc>
    <lastmod>${category.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    xml += `
</urlset>`;
    
    return xml;
  };
  
  const sitemap = generateSitemapXml();
  
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 