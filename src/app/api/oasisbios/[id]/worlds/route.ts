import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id]/worlds
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: oasisBioId } = params;

    // Check if the OasisBio belongs to the user
    const oasisBio = await prisma.oasisBio.findUnique({
      where: { id: oasisBioId },
      include: { user: true },
    });

    if (!oasisBio) {
      return NextResponse.json({ error: 'OasisBio not found' }, { status: 404 });
    }

    if (oasisBio.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get worlds for the OasisBio
    const worlds = await prisma.worldItem.findMany({
      where: { oasisBioId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(worlds);
  } catch (error) {
    console.error('Error getting worlds:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
