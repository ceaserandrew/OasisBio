'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { useParams } from 'next/navigation';

const referenceTypes = [
  'article',
  'video',
  'song',
  'image',
  'research',
  'moodboard',
  'social account',
  'archive page',
];

export default function ReferencesPage() {
  const params = useParams();
  const oasisBioId = params.id as string;
  
  const [references, setReferences] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReference, setNewReference] = useState({
    url: '',
    title: '',
    sourceType: 'article',
    description: '',
    tags: '',
    eraId: '',
    worldId: '',
  });
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch references from API
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/oasisbios/${oasisBioId}/references`);
        if (!response.ok) {
          throw new Error('Failed to fetch references');
        }
        const data = await response.json();
        setReferences(data);
      } catch (err) {
        setError('Failed to load references');
        console.error('Error fetching references:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferences();
  }, [oasisBioId]);

  const handleAddReference = async () => {
    if (newReference.url.trim() && newReference.title.trim()) {
      try {
        const response = await fetch(`/api/oasisbios/${oasisBioId}/references`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newReference,
            sourceType: newReference.sourceType,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add reference');
        }
        
        const addedReference = await response.json();
        setReferences([...references, addedReference]);
        setNewReference({
          url: '',
          title: '',
          sourceType: 'article',
          description: '',
          tags: '',
          eraId: '',
          worldId: '',
        });
        setShowAddForm(false);
      } catch (err) {
        setError('Failed to add reference');
        console.error('Error adding reference:', err);
      }
    }
  };

  const handleDeleteReference = async (id: string) => {
    try {
      const response = await fetch(`/api/references/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete reference');
      }
      
      setReferences(references.filter(ref => ref.id !== id));
    } catch (err) {
      setError('Failed to delete reference');
      console.error('Error deleting reference:', err);
    }
  };

  const filteredReferences = references.filter(ref => {
    const matchesType = filterType === 'all' || ref.sourceType === filterType;
    const matchesSearch = searchTerm === '' || 
      ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.tags.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading references...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">References Library</h1>
            <p className="text-gray-600">Manage your reference materials</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New Reference'}
          </Button>
        </div>

        {/* Add Reference Form */}
        {showAddForm && (
          <Card className="mb-8 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Add New Reference</CardTitle>
              <CardDescription>Add a new reference to your library</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <Input 
                    value={newReference.url} 
                    onChange={(e) => setNewReference({ ...newReference, url: e.target.value })} 
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    value={newReference.title} 
                    onChange={(e) => setNewReference({ ...newReference, title: e.target.value })} 
                    placeholder="Reference title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newReference.sourceType}
                    onChange={(e) => setNewReference({ ...newReference, sourceType: e.target.value })}
                  >
                    {referenceTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <Input 
                    value={newReference.tags} 
                    onChange={(e) => setNewReference({ ...newReference, tags: e.target.value })} 
                    placeholder="identity, technology, future"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={newReference.description}
                  onChange={(e) => setNewReference({ ...newReference, description: e.target.value })}
                  placeholder="Add a description for this reference"
                  rows={3}
                />
              </div>
              <Button onClick={handleAddReference} className="mt-2">
                Add Reference
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-grow md:flex-grow-0">
            <Input 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search references..."
              className="w-full md:w-64"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filterType === 'all' ? 'primary' : 'secondary'}
              onClick={() => setFilterType('all')}
              size="sm"
            >
              All
            </Button>
            {referenceTypes.map(type => (
              <Button 
                key={type}
                variant={filterType === type ? 'primary' : 'secondary'}
                onClick={() => setFilterType(type)}
                size="sm"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Reference Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReferences.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No references found</p>
            </div>
          ) : (
            filteredReferences.map(reference => (
              <Card key={reference.id} className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{reference.title}</CardTitle>
                      <CardDescription>{reference.sourceType.charAt(0).toUpperCase() + reference.sourceType.slice(1)}</CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteReference(reference.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {reference.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {reference.description}
                    </p>
                  )}
                  <div className="mb-4">
                    <a 
                      href={reference.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-black hover:underline"
                    >
                      {reference.url}
                    </a>
                  </div>
                  {reference.tags && (
                    <div className="flex flex-wrap gap-2">
                      {reference.tags.split(',').map((tag: string, index: number) => (
                        <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-4">
                    Added: {new Date(reference.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}