import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Luxe Intimates API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    routes: {
      home: '/',
      products: '/products',
      admin: '/admin',
      api: '/api'
    }
  });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
} 