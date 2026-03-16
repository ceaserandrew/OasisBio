import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/dcos/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: dcosFileId } = params;
    const body = await request.json();

    // Check if the DCOS file exists and belongs to the user
    const dcosFile = await prisma.dcosFile.findUnique({
      where: { id: dcosFileId },
      include: { oasisBio: { include: { user: true } } },
    });

    if (!dcosFile) {
      return NextResponse.json({ error: 'DCOS file not found' }, { status: 404 });
    }

    if (dcosFile.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update DCOS file
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
    console.error('Error updating DCOS file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/dcos/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: dcosFileId } = params;

    // Check if the DCOS file exists and belongs to the user
    const dcosFile = await prisma.dcosFile.findUnique({
      where: { id: dcosFileId },
      include: { oasisBio: { include: { user: true } } },
    });

    if (!dcosFile) {
      return NextResponse.json({ error: 'DCOS file not found' }, { status: 404 });
    }

    if (dcosFile.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete DCOS file
    await prisma.dcosFile.delete({
      where: { id: dcosFileId },
    });

    return NextResponse.json({ message: 'DCOS file deleted successfully' });
  } catch (error) {
    console.error('Error deleting DCOS file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
