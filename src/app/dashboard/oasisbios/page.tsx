'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useRouter } from 'next/navigation';

export default function OasisBiosPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [oasisBios, setOasisBios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const fetchOasisBios = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/oasisbios');
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
  }, [session, router]);

  // Show loading while checking session
  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-40 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border rounded-lg p-6">
                <div className="h-6 w-48 bg-muted animate-pulse rounded mb-4"></div>
                <div className="h-4 w-64 bg-muted animate-pulse rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My OasisBios</h1>
            <Button asChild>
              <a href="/dashboard/oasisbios/new">Create New OasisBio</a>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My OasisBios</h1>
          <Button asChild>
            <a href="/dashboard/oasisbios/new">Create New OasisBio</a>
          </Button>
        </div>

        {oasisBios.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No OasisBios Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You haven't created any OasisBios yet. Start by creating your first one.
              </p>
              <Button className="mt-4" asChild>
                <a href="/dashboard/oasisbios/new">Create First OasisBio</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {oasisBios.map((oasisBio) => (
              <Card key={oasisBio.id}>
                <CardHeader>
                  <CardTitle>{oasisBio.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{oasisBio.tagline || 'No tagline'}</p>
                  <div className="flex justify-between">
                    <Button variant="outline" asChild>
                      <a href={`/dashboard/oasisbios/${oasisBio.id}`}>Edit</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={`/bio/${oasisBio.slug}`}>View</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
