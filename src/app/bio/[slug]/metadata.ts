import type { Metadata } from 'next';

// Mock data for the public OasisBio page
const oasisBioData = {
  title: 'Oasis Prime',
  tagline: 'A digital identity beyond time',
  description: 'Oasis Prime is a digital identity that exists across multiple time periods and dimensions. It serves as a bridge between different versions of self, connecting past, present, and future iterations.',
};

export const metadata: Metadata = {
  title: `${oasisBioData.title} – Fictional Character Profile | OasisBio`,
  description: oasisBioData.tagline + ' - ' + oasisBioData.description,
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
  authors: [
    {
      name: 'Oasis Company',
    },
  ],
  openGraph: {
    title: `${oasisBioData.title} – Fictional Character Profile | OasisBio`,
    description: oasisBioData.tagline + ' - ' + oasisBioData.description,
    type: 'profile',
    images: [
      {
        url: 'https://via.placeholder.com/800x600?text=Oasis+Prime+Model',
        width: 800,
        height: 600,
        alt: oasisBioData.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${oasisBioData.title} – Fictional Character Profile | OasisBio`,
    description: oasisBioData.tagline + ' - ' + oasisBioData.description,
    images: ['https://via.placeholder.com/800x600?text=Oasis+Prime+Model'],
  },
};
