import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireDcosFileOwnership, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// PUT /api/dcos/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id: dcosFileId } = params;
    const body = await request.json();

    const dcosFile = await requireDcosFileOwnership(dcosFileId, session.user.id);

    const updatedDcosFile = await prisma.dcosFile.update({
      where: { id: dcosFileId },
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        content: body.content,
        folderPath: body.folderPath,
        status: body.status,
        eraId: body.eraId,
        version: dcosFile.version + 1,
      },
    });

    return NextResponse.json(updatedDcosFile);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/dcos/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const { id: dcosFileId } = params;

    await requireDcosFileOwnership(dcosFileId, session.user.id);

    await prisma.dcosFile.delete({
      where: { id: dcosFileId },
    });

    return NextResponse.json({ message: 'DCOS file deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
