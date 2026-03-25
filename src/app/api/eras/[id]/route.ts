import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/eras/[id] - Update era
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id } = params;
    const body = await request.json();

    // Verify ownership
    const era = await prisma.era.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!era) {
      return NextResponse.json({ error: 'Era not found' }, { status: 404 });
    }

    if (era.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, startYear, endYear, location, significance } = body;

    const updates: any = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (startYear !== undefined) updates.startYear = startYear;
    if (endYear !== undefined) updates.endYear = endYear;
    if (location) updates.location = location;
    if (significance) updates.significance = significance;

    const updatedEra = await prisma.era.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedEra);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/eras/[id] - Delete era
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id } = params;

    // Verify ownership
    const era = await prisma.era.findUnique({
      where: { id },
      include: { oasisBio: true },
    });

    if (!era) {
      return NextResponse.json({ error: 'Era not found' }, { status: 404 });
    }

    if (era.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.era.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Era deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
