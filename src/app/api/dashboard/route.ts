import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    // Fetch OasisBios count
    const oasisBiosCount = await prisma.oasisBio.count({
      where: { userId },
    });

    // Fetch worlds count
    const worldsCount = await prisma.worldItem.count({
      where: { userId },
    });

    // Fetch models count
    const modelsCount = await prisma.modelItem.count({
      where: { userId },
    });

    // Fetch recent activities (mock data for now)
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

    // Fetch account status
    const accountStatus = {
      subscription: 'Free',
      oasisBiosLimit: 3,
      oasisBiosUsed: oasisBiosCount,
      storageUsed: 0,
      storageLimit: 128,
    };

    // Fetch system status
    const systemStatus = {
      api: 'Online',
      database: 'Online',
      storage: 'Online',
    };

    const dashboardData = {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        profile: user?.profile,
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
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
