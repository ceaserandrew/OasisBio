import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/worlds/[id]/documents
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: worldId } = params;

    // Check if the world exists and belongs to the user
    const world = await prisma.worldItem.findUnique({
      where: { id: worldId },
      include: { oasisBio: { include: { user: true } } },
    });

    if (!world) {
      return NextResponse.json({ error: 'World not found' }, { status: 404 });
    }

    if (world.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get world documents
    const documents = await prisma.worldDocument.findMany({
      where: { worldId },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error getting world documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/worlds/[id]/documents
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: worldId } = params;
    const body = await request.json();

    // Validate request body
    if (!body.title || !body.content || !body.docType) {
      return NextResponse.json({ error: 'Title, content, and document type are required' }, { status: 400 });
    }

    // Check if the world exists and belongs to the user
    const world = await prisma.worldItem.findUnique({
      where: { id: worldId },
      include: { oasisBio: { include: { user: true } } },
    });

    if (!world) {
      return NextResponse.json({ error: 'World not found' }, { status: 404 });
    }

    if (world.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create world document
    const document = await prisma.worldDocument.create({
      data: {
        title: body.title,
        docType: body.docType,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        content: body.content,
        folderPath: body.folderPath || '/',
        sortOrder: body.sortOrder || 0,
        worldId,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating world document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
