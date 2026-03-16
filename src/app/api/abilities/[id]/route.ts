import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/abilities/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: abilityId } = params;
    const body = await request.json();

    // Check if the ability exists and belongs to the user
    const ability = await prisma.ability.findUnique({
      where: { id: abilityId },
      include: { oasisBio: { include: { user: true } } },
    });

    if (!ability) {
      return NextResponse.json({ error: 'Ability not found' }, { status: 404 });
    }

    if (ability.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update ability
    const updatedAbility = await prisma.ability.update({
      where: { id: abilityId },
      data: {
        name: body.name,
        category: body.category,
        type: body.type,
        level: body.level,
        description: body.description,
        relatedWorldId: body.relatedWorldId,
        relatedEraId: body.relatedEraId,
      },
    });

    return NextResponse.json(updatedAbility);
  } catch (error) {
    console.error('Error updating ability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/abilities/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: abilityId } = params;

    // Check if the ability exists and belongs to the user
    const ability = await prisma.ability.findUnique({
      where: { id: abilityId },
      include: { oasisBio: { include: { user: true } } },
    });

    if (!ability) {
      return NextResponse.json({ error: 'Ability not found' }, { status: 404 });
    }

    if (ability.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete ability
    await prisma.ability.delete({
      where: { id: abilityId },
    });

    return NextResponse.json({ message: 'Ability deleted successfully' });
  } catch (error) {
    console.error('Error deleting ability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
