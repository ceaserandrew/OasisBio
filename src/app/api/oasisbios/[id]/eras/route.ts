import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/oasisbios/[id]/eras
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

    // Get eras for the OasisBio
    const eras = await prisma.eraIdentity.findMany({
      where: { oasisBioId },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(eras);
  } catch (error) {
    console.error('Error getting eras:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
