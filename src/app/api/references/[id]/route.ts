import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/references/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: referenceId } = params;
    const body = await request.json();

    // Check if the reference item exists and belongs to the user
    const reference = await prisma.referenceItem.findUnique({
      where: { id: referenceId },
      include: { oasisBio: { include: { user: true } } },
    });

    if (!reference) {
      return NextResponse.json({ error: 'Reference item not found' }, { status: 404 });
    }

    if (reference.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update reference item
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
    console.error('Error updating reference item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/references/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: referenceId } = params;

    // Check if the reference item exists and belongs to the user
    const reference = await prisma.referenceItem.findUnique({
      where: { id: referenceId },
      include: { oasisBio: { include: { user: true } } },
    });

    if (!reference) {
      return NextResponse.json({ error: 'Reference item not found' }, { status: 404 });
    }

    if (reference.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete reference item
    await prisma.referenceItem.delete({
      where: { id: referenceId },
    });

    return NextResponse.json({ message: 'Reference item deleted successfully' });
  } catch (error) {
    console.error('Error deleting reference item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
