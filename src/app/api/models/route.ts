import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// GET /api/models - Get user's models
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const models = await prisma.modelItem.findMany({
      where: { 
        oasisBio: { userId } 
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(models);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/models - Create new model
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const userId = session.user.id;

    const { name, modelUrl, previewUrl, oasisBioId, relatedWorldId, relatedEraId } = body;

    if (!name || !modelUrl || !oasisBioId) {
      return NextResponse.json({ error: 'Name, modelUrl, and oasisBioId are required' }, { status: 400 });
    }

    // Verify ownership of the OasisBio
    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const model = await prisma.modelItem.create({
      data: {
        name,
        modelUrl,
        previewUrl,
        oasisBioId,
        relatedWorldId,
        relatedEraId,
      },
    });

    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
