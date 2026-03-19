import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireReferenceOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/references/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id: referenceId } = params;
    const body = await request.json();

    await requireReferenceOwnership(referenceId, session.user.id);

    const updatedReference = await prisma.referenceItem.update({
      where: { id: referenceId },
      data: {
        url: body.url,
        title: body.title,
        description: body.description,
        sourceType: body.sourceType,
        provider: body.provider,
        coverImage: body.coverImage,
        metadata: body.metadata,
        eraId: body.eraId,
        worldId: body.worldId,
        tags: body.tags,
      },
    });

    return NextResponse.json(updatedReference);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/references/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id: referenceId } = params;

    await requireReferenceOwnership(referenceId, session.user.id);

    await prisma.referenceItem.delete({
      where: { id: referenceId },
    });

    return NextResponse.json({ message: 'Reference item deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
