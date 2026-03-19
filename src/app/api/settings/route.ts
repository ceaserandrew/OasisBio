import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profiles: true,
        oasisBios: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = user.profiles[0];
    const publicOasisBiosCount = user.oasisBios.filter(
      (oasisBio) => oasisBio.status === 'published'
    ).length;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      profile: profile
        ? {
            id: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl,
            bio: profile.bio,
            website: profile.website,
            locale: profile.locale,
            defaultLanguage: profile.defaultLanguage,
          }
        : null,
      stats: {
        totalOasisBios: user.oasisBios.length,
        publicOasisBios: publicOasisBiosCount,
      },
      plan: {
        name: 'Free',
        storageLimit: 128,
        storageUsed: 0,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { section, data } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profiles: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let updatedProfile = null;

    if (section === 'account' || section === 'profile') {
      const profile = user.profiles[0];
      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      const updateData: any = {};
      if (data.username !== undefined) updateData.username = data.username;
      if (data.displayName !== undefined) updateData.displayName = data.displayName;
      if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.website !== undefined) updateData.website = data.website;
      if (data.locale !== undefined) updateData.locale = data.locale;
      if (data.defaultLanguage !== undefined) updateData.defaultLanguage = data.defaultLanguage;

      if (data.username && data.username !== profile.username) {
        const existingProfile = await prisma.profile.findUnique({
          where: { username: data.username },
        });

        if (existingProfile && existingProfile.id !== profile.id) {
          return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
        }
      }

      updatedProfile = await prisma.profile.update({
        where: { id: profile.id },
        data: updateData,
      });
    }

    if (section === 'security' && data.currentPassword && data.newPassword) {
      const passwordMatch = await bcrypt.compare(
        data.currentPassword,
        user.password
      );

      if (!passwordMatch) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
      profile: updatedProfile
        ? {
            id: updatedProfile.id,
            username: updatedProfile.username,
            displayName: updatedProfile.displayName,
            avatarUrl: updatedProfile.avatarUrl,
            bio: updatedProfile.bio,
            website: updatedProfile.website,
            locale: updatedProfile.locale,
            defaultLanguage: updatedProfile.defaultLanguage,
          }
        : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
