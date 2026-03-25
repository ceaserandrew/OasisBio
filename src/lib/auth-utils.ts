import 'server-only';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession, getUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function requireAuth() {
  const cookieStore = cookies();
  const cookieString = cookieStore.toString();
  const session = await getServerSession(cookieString);
  
  if (!session || !session.user?.id) {
    throw new AuthError('Unauthorized', 401);
  }
  
  return session;
}

export async function requireOasisBioOwnership(oasisBioId: string, userId: string) {
  const oasisBio = await prisma.oasisBio.findUnique({
    where: { id: oasisBioId },
    include: { user: true },
  });

  if (!oasisBio) {
    throw new AuthError('OasisBio not found', 404);
  }

  if (oasisBio.userId !== userId) {
    throw new AuthError('Unauthorized', 401);
  }

  return oasisBio;
}

export async function requireDcosFileOwnership(dcosFileId: string, userId: string) {
  const dcosFile = await prisma.dcosFile.findUnique({
    where: { id: dcosFileId },
    include: { oasisBio: { include: { user: true } } },
  });

  if (!dcosFile) {
    throw new AuthError('DCOS file not found', 404);
  }

  if (dcosFile.oasisBio.userId !== userId) {
    throw new AuthError('Unauthorized', 401);
  }

  return dcosFile;
}

export async function requireAbilityOwnership(abilityId: string, userId: string) {
  const ability = await prisma.ability.findUnique({
    where: { id: abilityId },
    include: { oasisBio: { include: { user: true } } },
  });

  if (!ability) {
    throw new AuthError('Ability not found', 404);
  }

  if (ability.oasisBio.userId !== userId) {
    throw new AuthError('Unauthorized', 401);
  }

  return ability;
}

export async function requireWorldOwnership(worldId: string, userId: string) {
  const world = await prisma.worldItem.findUnique({
    where: { id: worldId },
    include: { oasisBio: { include: { user: true } } },
  });

  if (!world) {
    throw new AuthError('World not found', 404);
  }

  if (world.oasisBio.userId !== userId) {
    throw new AuthError('Unauthorized', 401);
  }

  return world;
}

export async function requireReferenceOwnership(referenceId: string, userId: string) {
  const reference = await prisma.referenceItem.findUnique({
    where: { id: referenceId },
    include: { oasisBio: { include: { user: true } } },
  });

  if (!reference) {
    throw new AuthError('Reference item not found', 404);
  }

  if (reference.oasisBio.userId !== userId) {
    throw new AuthError('Unauthorized', 401);
  }

  return reference;
}

export async function requireWorldDocumentOwnership(documentId: string, userId: string) {
  const document = await prisma.worldDocument.findUnique({
    where: { id: documentId },
    include: { world: { include: { oasisBio: { include: { user: true } } } },
  });

  if (!document) {
    throw new AuthError('World document not found', 404);
  }

  if (document.world.oasisBio.userId !== userId) {
    throw new AuthError('Unauthorized', 401);
  }

  return document;
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
