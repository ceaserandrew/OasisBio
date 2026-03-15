import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profiles: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const profile = user.profiles[0];

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, displayName, avatarUrl, bio, website, locale, defaultLanguage } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profiles: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let profile = user.profiles[0];

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    if (username && username !== profile.username) {
      const existingProfile = await prisma.profile.findUnique({
        where: { username },
      });

      if (existingProfile && existingProfile.id !== profile.id) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        username: username ?? profile.username,
        displayName: displayName ?? profile.displayName,
        avatarUrl: avatarUrl ?? profile.avatarUrl,
        bio: bio ?? profile.bio,
        website: website ?? profile.website,
        locale: locale ?? profile.locale,
        defaultLanguage: defaultLanguage ?? profile.defaultLanguage,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: {
        id: updatedProfile.id,
        username: updatedProfile.username,
        displayName: updatedProfile.displayName,
        avatarUrl: updatedProfile.avatarUrl,
        bio: updatedProfile.bio,
        website: updatedProfile.website,
        locale: updatedProfile.locale,
        defaultLanguage: updatedProfile.defaultLanguage,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
