import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/models/[id] - Update model
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id } = params;
    const body = await request.json();

    // Verify ownership
    const model = await prisma.modelItem.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, modelUrl, previewUrl, relatedWorldId, relatedEraId } = body;

    const updates: any = {};
    if (name) updates.name = name;
    if (modelUrl) updates.modelUrl = modelUrl;
    if (previewUrl) updates.previewUrl = previewUrl;
    if (relatedWorldId !== undefined) updates.relatedWorldId = relatedWorldId;
    if (relatedEraId !== undefined) updates.relatedEraId = relatedEraId;

    const updatedModel = await prisma.modelItem.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedModel);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/models/[id] - Delete model
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id } = params;

    // Verify ownership
    const model = await prisma.modelItem.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    if (model.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.modelItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Model deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
