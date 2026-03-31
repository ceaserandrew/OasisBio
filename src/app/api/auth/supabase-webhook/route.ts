import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET!;

function verifyWebhookSignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('base64');
  return signature === digest;
}

async function generateUniqueUsername(baseName: string): Promise<string> {
  const cleanName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (cleanName.length === 0) {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `user_${randomString}`;
  }

  let username = cleanName;
  let counter = 1;

  while (true) {
    const existingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    if (!existingProfile) {
      return username;
    }

    username = `${cleanName}${counter}`;
    counter++;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    if (!signature || !verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const { type, data } = event;

    switch (type) {
      case 'user.created':
      case 'user.updated': {
        const { id, email, user_metadata } = data;
        const name = user_metadata.name || email?.split('@')[0] || 'User';

        await prisma.user.upsert({
          where: { id },
          update: {
            email,
            name,
          },
          create: {
            id,
            email,
            name,
            profiles: {
              create: {
                username: await generateUniqueUsername(name),
                displayName: name,
              },
            },
          },
        });
        break;
      }

      case 'user.deleted': {
        const { id } = data;
        await prisma.user.delete({
          where: { id },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
