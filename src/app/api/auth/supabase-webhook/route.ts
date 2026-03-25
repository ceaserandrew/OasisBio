import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SUPABASE_WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

async function generateUniqueUsername(baseName: string): Promise<string> {
  const cleanName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (cleanName.length === 0) {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `user_${randomString}`;
  }

  let username = cleanName;
  let counter = 1;
  const maxAttempts = 1000;

  while (counter <= maxAttempts) {
    const existingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    if (!existingProfile) {
      return username;
    }

    username = `${cleanName}${counter}`;
    counter++;
  }

  const randomString = Math.random().toString(36).substring(2, 8);
  return `${cleanName}_${randomString}`;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-supabase-signature');
    if (SUPABASE_WEBHOOK_SECRET && signature !== SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = await request.json();
    const { type, record } = body;

    if (type !== 'INSERT') {
      return NextResponse.json({ message: 'Event type not handled' });
    }

    const { id, email, email_confirmed_at, created_at } = record;
    const name = record.user_metadata?.name || email.split('@')[0];

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' });
    }

    const username = await generateUniqueUsername(name);
    const displayName = name || username;

    const user = await prisma.user.create({
      data: {
        id,
        name,
        email,
        emailVerified: email_confirmed_at ? new Date(email_confirmed_at) : null,
        password: '',
        profiles: {
          create: {
            username,
            displayName,
          },
        },
      },
      include: {
        profiles: true,
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.profiles[0]?.username,
      },
    });
  } catch (error) {
    console.error('Error handling Supabase webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
