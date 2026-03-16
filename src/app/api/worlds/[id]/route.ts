import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/worlds/[id]
export async function PUT(
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

    // Update world
    const updatedWorld = await prisma.worldItem.update({
      where: { id: worldId },
      data: {
        name: body.name,
        summary: body.summary,
        timeSetting: body.timeSetting,
        geography: body.geography,
        physicsRules: body.physicsRules,
        socialStructure: body.socialStructure,
        aestheticKeywords: body.aestheticKeywords,
        majorConflict: body.majorConflict,
        visibility: body.visibility,
        timeline: body.timeline,
        rules: body.rules,
        factions: body.factions,
      },
    });

    return NextResponse.json(updatedWorld);
  } catch (error) {
    console.error('Error updating world:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/worlds/[id]
export async function DELETE(
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

    // Delete world
    await prisma.worldItem.delete({
      where: { id: worldId },
    });

    return NextResponse.json({ message: 'World deleted successfully' });
  } catch (error) {
    console.error('Error deleting world:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
