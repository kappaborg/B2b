import { users } from '@/data/users';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newUser = { id: users.length + 1, ...data };
  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}
