import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const publicOasisBios = await prisma.oasisBio.findMany({
      where: {
        visibility: 'public',
        status: 'active',
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        tagline: true,
        identityMode: true,
        currentEra: true,
        coverImageUrl: true,
        _count: {
          select: {
            abilities: true,
            worlds: true,
            models: true,
          },
        },
      },
    });

    return NextResponse.json(publicOasisBios);
  } catch (error) {
    console.error('Error fetching public OasisBios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public OasisBios' },
      { status: 500 }
    );
  }
}
