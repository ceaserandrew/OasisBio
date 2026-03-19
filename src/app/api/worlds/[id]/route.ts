import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireWorldOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/worlds/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id: worldId } = params;
    const body = await request.json();

    await requireWorldOwnership(worldId, session.user.id);

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
    return handleApiError(error);
  }
}

// DELETE /api/worlds/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id: worldId } = params;

    await requireWorldOwnership(worldId, session.user.id);

    await prisma.worldItem.delete({
      where: { id: worldId },
    });

    return NextResponse.json({ message: 'World deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
