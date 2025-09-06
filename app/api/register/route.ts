import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !isValidEmail(email) ||
    password.length < 6
  ) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.create({
      data: { email, password },
    });
    return NextResponse.json({ id: user.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'User creation failed' },
      { status: 500 }
    );
  }
}
