import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const oasisBio = await prisma.oasisBio.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      tagline: true,
      description: true,
    },
  });

  if (!oasisBio) {
    return {
      title: 'Not Found | OasisBio',
    };
  }

  const fullDescription = oasisBio.tagline 
    ? `${oasisBio.tagline}${oasisBio.description ? ' - ' + oasisBio.description : ''}`
    : oasisBio.description || 'A digital identity on OasisBio';

  return {
    title: `${oasisBio.title} – Character Profile | OasisBio`,
    description: fullDescription,
    keywords: [
      'OasisBio',
      'digital identity',
      'fictional character',
      'worldbuilding',
      '3D model',
      'GLB',
      'identity system',
      'character profile',
    ],
    authors: [{ name: 'Oasis Company' }],
    openGraph: {
      title: `${oasisBio.title} – Character Profile | OasisBio`,
      description: fullDescription,
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${oasisBio.title} – Character Profile | OasisBio`,
      description: fullDescription,
    },
  };
}
