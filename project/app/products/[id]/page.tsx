import { Metadata } from 'next';
import ProductClient from './ProductClient';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${params.id}`);
  if (!res.ok) return { title: 'Product Not Found' };
  const product = await res.json();
  return {
    title: `${product.name} | Luxe Intimates`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Luxe Intimates`,
      description: product.description,
      images: product.images?.length ? [product.images[0]] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Luxe Intimates`,
      description: product.description,
      images: product.images?.length ? [product.images[0]] : [],
    },
  };
}

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}

async function getReviews(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/reviews/${id}`);
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductDetails({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  const reviews = await getReviews(params.id);

  return <ProductClient product={product} reviews={reviews} />;
}