import 'server-only';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * 验证用户会话
 * @returns 当前用户的会话，如果未登录则抛出错误
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new AuthError('Unauthorized', 401);
  }
  return session;
}

/**
 * 验证用户是否拥有指定的 OasisBio
 * @param oasisBioId OasisBio ID
 * @param userId 用户 ID
 * @returns OasisBio 对象
 */
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

/**
 * 验证用户是否拥有指定的 DCOS 文件
 * @param dcosFileId DCOS 文件 ID
 * @param userId 用户 ID
 * @returns DCOS 文件对象
 */
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

/**
 * 验证用户是否拥有指定的 Ability
 * @param abilityId Ability ID
 * @param userId 用户 ID
 * @returns Ability 对象
 */
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

/**
 * 验证用户是否拥有指定的 World
 * @param worldId World ID
 * @param userId 用户 ID
 * @returns World 对象
 */
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

/**
 * 验证用户是否拥有指定的 Reference
 * @param referenceId Reference ID
 * @param userId 用户 ID
 * @returns Reference 对象
 */
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

/**
 * 验证用户是否拥有指定的 World Document
 * @param documentId Document ID
 * @param userId 用户 ID
 * @returns Document 对象
 */
export async function requireWorldDocumentOwnership(documentId: string, userId: string) {
  const document = await prisma.worldDocument.findUnique({
    where: { id: documentId },
    include: { world: { include: { oasisBio: { include: { user: true } } } } },
  });

  if (!document) {
    throw new AuthError('World document not found', 404);
  }

  if (document.world.oasisBio.userId !== userId) {
    throw new AuthError('Unauthorized', 401);
  }

  return document;
}

/**
 * 统一的错误处理函数
 * @param error 错误对象
 * @returns NextResponse 对象
 */
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

/**
 * 自定义认证错误类
 */
class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}