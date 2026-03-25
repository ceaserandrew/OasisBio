import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/worlds - Get worlds for a specific OasisBio
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const oasisBioId = searchParams.get('oasisBioId');

    if (!oasisBioId) {
      return NextResponse.json({ error: 'OasisBio ID is required' }, { status: 400 });
    }

    // Verify ownership of the OasisBio
    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const worlds = await prisma.worldItem.findMany({
      where: { oasisBioId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(worlds);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/worlds - Create new world
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const { oasisBioId, name, description, type, setting } = body;

    if (!oasisBioId || !name) {
      return NextResponse.json({ error: 'OasisBio ID and name are required' }, { status: 400 });
    }

    // Verify ownership of the OasisBio
    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const world = await prisma.worldItem.create({
      data: {
        oasisBioId,
        name,
        description,
        type: type || 'fantasy',
        setting,
      },
    });

    return NextResponse.json(world, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
