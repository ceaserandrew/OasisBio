'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';

interface OasisBio {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  identityMode: string;
  currentEra: string | null;
  coverImageUrl: string | null;
  _count: {
    abilities: number;
    worlds: number;
    models: number;
  };
}

export default function ExploreContent() {
  const [oasisBios, setOasisBios] = useState<OasisBio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOasisBios = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/oasisbios/public');
        if (!response.ok) {
          throw new Error('Failed to fetch OasisBios');
        }
        const data = await response.json();
        setOasisBios(data);
      } catch (err) {
        setError('Failed to load OasisBios');
        console.error('Error fetching OasisBios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOasisBios();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (oasisBios.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">No OasisBios found.</p>
        <Button asChild>
          <a href="/auth/login">Create Your First OasisBio</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {oasisBios.map(oasisBio => (
        <Card key={oasisBio.id} className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{oasisBio.title}</CardTitle>
                {oasisBio.tagline && (
                  <CardDescription>{oasisBio.tagline}</CardDescription>
                )}
              </div>
              <span className="px-2 py-1 bg-muted text-xs font-mono rounded">
                {oasisBio.identityMode.toUpperCase()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {oasisBio.coverImageUrl ? (
                  <img 
                    src={oasisBio.coverImageUrl} 
                    alt={oasisBio.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground">No preview</span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mb-4">
              <span>{oasisBio._count.abilities} Abilities</span>
              <span>{oasisBio._count.worlds} Worlds</span>
              <span>{oasisBio._count.models} Models</span>
            </div>
            {oasisBio.currentEra && (
              <div className="text-sm text-muted-foreground mb-4">
                Current Era: {oasisBio.currentEra}
              </div>
            )}
            <Button asChild size="sm" className="w-full">
              <a href={`/bio/${oasisBio.slug}`}>View Profile</a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
