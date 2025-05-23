import { NextRequest, NextResponse } from 'next/server';

const promos = [
  { code: 'BOSNA10', discount: 0.10 },
  { code: 'WELCOME5', discount: 0.05 },
];

export async function GET() {
  return NextResponse.json(promos);
}

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  const promo = promos.find(p => p.code.toLowerCase() === code.toLowerCase());
  if (!promo) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }
  return NextResponse.json({ valid: true, discount: promo.discount });
} 