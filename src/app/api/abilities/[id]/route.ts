import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAbilityOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/abilities/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id: abilityId } = params;
    const body = await request.json();

    await requireAbilityOwnership(abilityId, session.user.id);

    const updatedAbility = await prisma.ability.update({
      where: { id: abilityId },
      data: {
        name: body.name,
        category: body.category,
        level: body.level,
        description: body.description,
        relatedWorldId: body.relatedWorldId,
        relatedEraId: body.relatedEraId,
      },
    });

    return NextResponse.json(updatedAbility);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/abilities/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id: abilityId } = params;

    await requireAbilityOwnership(abilityId, session.user.id);

    await prisma.ability.delete({
      where: { id: abilityId },
    });

    return NextResponse.json({ message: 'Ability deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
