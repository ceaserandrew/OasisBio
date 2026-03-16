import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id]/abilities
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

    // Get abilities for the OasisBio
    const abilities = await prisma.ability.findMany({
      where: { oasisBioId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(abilities);
  } catch (error) {
    console.error('Error getting abilities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/oasisbios/[id]/abilities
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
    if (!body.name || !body.category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
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

    // Create ability
    const ability = await prisma.ability.create({
      data: {
        name: body.name,
        category: body.category,
        type: body.type || 'custom',
        level: body.level || 1,
        description: body.description || '',
        relatedWorldId: body.relatedWorldId,
        relatedEraId: body.relatedEraId,
        oasisBioId,
      },
    });

    return NextResponse.json(ability, { status: 201 });
  } catch (error) {
    console.error('Error creating ability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
