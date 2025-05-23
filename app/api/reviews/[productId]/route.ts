import { reviews } from '@/data/reviews';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;
  const filtered = reviews.filter(r => r.productId === Number(productId));
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;
  const data = await request.json();
  const newReview = {
    id: reviews.length + 1,
    productId: Number(productId),
    rating: data.rating,
    comment: data.comment,
    date: new Date().toISOString().slice(0, 10),
  };
  reviews.push(newReview);
  return NextResponse.json(newReview, { status: 201 });
} 