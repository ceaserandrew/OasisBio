import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id]/dcos
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

    // Get DCOS files for the OasisBio
    const dcosFiles = await prisma.dcosFile.findMany({
      where: { oasisBioId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(dcosFiles);
  } catch (error) {
    console.error('Error getting DCOS files:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/oasisbios/[id]/dcos
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
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
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

    // Create DCOS file
    const dcosFile = await prisma.dcosFile.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        content: body.content,
        folderPath: body.folderPath || '/',
        status: body.status || 'draft',
        eraId: body.eraId,
        oasisBioId,
      },
    });

    return NextResponse.json(dcosFile, { status: 201 });
  } catch (error) {
    console.error('Error creating DCOS file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
