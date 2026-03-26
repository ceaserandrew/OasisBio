import React from 'react';

// ExploreContent is a client component, so we'll import it dynamically
import dynamic from 'next/dynamic';
const ExploreContent = dynamic(() => import('@/components/ExploreContent'), { ssr: false });

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <ExploreContent />
    </div>
  );
}