import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id]/references
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: oasisBioId } = params;

    // Check if the OasisBio belongs to the user
    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
      include: { user: true },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get reference items for the OasisBio
    const references = await prisma.referenceItem.findMany({
      where: { oasisBioId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(references);
  } catch (error) {
    console.error('Error getting reference items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/oasisbios/[id]/references
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: oasisBioId } = params;
    const body = await request.json();

    // Validate request body
    if (!body.url || !body.title) {
      return NextResponse.json({ error: 'URL and title are required' }, { status: 400 });
    }

    // Check if the OasisBio belongs to the user
    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
      include: { user: true },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create reference item
    const reference = await prisma.referenceItem.create({
      data: {
        url: body.url,
        title: body.title,
        description: body.description,
        sourceType: body.sourceType || 'article',
        provider: body.provider,
        coverImage: body.coverImage,
        metadata: body.metadata,
        eraId: body.eraId,
        worldId: body.worldId,
        tags: body.tags || '',
        oasisBioId,
      },
    });

    return NextResponse.json(reference, { status: 201 });
  } catch (error) {
    console.error('Error creating reference item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
