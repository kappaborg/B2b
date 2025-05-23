import { NextResponse } from 'next/server';

const categories = [
  { id: 1, name: 'Lingerie' },
  { id: 2, name: 'Toys' },
  { id: 3, name: 'Wellness' },
  { id: 4, name: 'Accessories' },
  { id: 5, name: 'Gift Sets' },
];

export async function GET() {
  return NextResponse.json(categories);
} 