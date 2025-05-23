import { reviews } from '@/data/reviews';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newReview = {
    id: reviews.length + 1,
    productId: data.productId,
    rating: data.rating,
    comment: data.comment,
    date: new Date().toISOString().slice(0, 10),
  };
  reviews.push(newReview);
  return NextResponse.json(newReview, { status: 201 });
}
