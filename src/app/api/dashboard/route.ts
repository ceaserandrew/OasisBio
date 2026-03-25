import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { getUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const user = await getUserFromSession(session);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;

    const oasisBiosCount = await prisma.oasisBio.count({
      where: { userId },
    });

    const worldsCount = await prisma.worldItem.count({
      where: { oasisBio: { userId } },
    });

    const modelsCount = await prisma.modelItem.count({
      where: { oasisBio: { userId } },
    });

    const recentActivities = [
      {
        id: 1,
        title: 'OasisBio Prime Updated',
        description: 'Added new abilities and updated profile',
        timestamp: '2 hours ago',
        type: 'oasisbio',
      },
      {
        id: 2,
        title: 'World: Neon Desert Created',
        description: 'New world added to your collection',
        timestamp: '1 day ago',
        type: 'world',
      },
      {
        id: 3,
        title: 'Model: Future Self Uploaded',
        description: '3D model uploaded successfully',
        timestamp: '3 days ago',
        type: 'model',
      },
    ];

    const accountStatus = {
      subscription: 'Free',
      oasisBiosLimit: 3,
      oasisBiosUsed: oasisBiosCount,
      storageUsed: 0,
      storageLimit: 128,
    };

    const systemStatus = {
      api: 'Online',
      database: 'Online',
      storage: 'Online',
    };

    const profile = user.profiles[0];

    const dashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: profile ? {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
        } : null,
      },
      stats: {
        oasisBios: oasisBiosCount,
        worlds: worldsCount,
        models: modelsCount,
      },
      recentActivities,
      accountStatus,
      systemStatus,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    return handleApiError(error);
  }
}
