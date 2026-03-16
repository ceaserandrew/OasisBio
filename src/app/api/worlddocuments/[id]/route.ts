import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/worlddocuments/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: documentId } = params;
    const body = await request.json();

    // Check if the document exists and belongs to the user
    const document = await prisma.worldDocument.findUnique({
      where: { id: documentId },
      include: { world: { include: { oasisBio: { include: { user: true } } } } },
    });

    if (!document) {
      return NextResponse.json({ error: 'World document not found' }, { status: 404 });
    }

    if (document.world.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update world document
    const updatedDocument = await prisma.worldDocument.update({
      where: { id: documentId },
      data: {
        title: body.title,
        docType: body.docType,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
        content: body.content,
        folderPath: body.folderPath,
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('Error updating world document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/worlddocuments/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: documentId } = params;

    // Check if the document exists and belongs to the user
    const document = await prisma.worldDocument.findUnique({
      where: { id: documentId },
      include: { world: { include: { oasisBio: { include: { user: true } } } } },
    });

    if (!document) {
      return NextResponse.json({ error: 'World document not found' }, { status: 404 });
    }

    if (document.world.oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete world document
    await prisma.worldDocument.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ message: 'World document deleted successfully' });
  } catch (error) {
    console.error('Error deleting world document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
