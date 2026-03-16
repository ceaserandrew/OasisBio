'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { useParams } from 'next/navigation';

export default function WorldsPage() {
  const params = useParams();
  const oasisBioId = params.id as string;
  
  const [worlds, setWorlds] = useState<any[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editWorld, setEditWorld] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorld, setNewWorld] = useState({
    name: '',
    summary: '',
    timeSetting: '',
    geography: '',
    physicsRules: '',
    socialStructure: '',
    aestheticKeywords: '',
    majorConflict: '',
    visibility: 'private',
    timeline: '',
    rules: '',
    factions: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch worlds from API
  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/oasisbios/${oasisBioId}/worlds`);
        if (!response.ok) {
          throw new Error('Failed to fetch worlds');
        }
        const data = await response.json();
        setWorlds(data);
        if (data.length > 0) {
          setSelectedWorld(data[0]);
          setEditWorld(data[0]);
        }
      } catch (err) {
        setError('Failed to load worlds');
        console.error('Error fetching worlds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorlds();
  }, [oasisBioId]);

  const handleSaveWorld = async () => {
    if (selectedWorld) {
      try {
        const response = await fetch(`/api/worlds/${selectedWorld.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editWorld),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update world');
        }
        
        const updatedWorld = await response.json();
        const updatedWorlds = worlds.map(world => 
          world.id === selectedWorld.id ? updatedWorld : world
        );
        setWorlds(updatedWorlds);
        setSelectedWorld(updatedWorld);
        setIsEditing(false);
      } catch (err) {
        setError('Failed to update world');
        console.error('Error updating world:', err);
      }
    }
  };

  const handleAddWorld = async () => {
    if (newWorld.name.trim()) {
      try {
        const response = await fetch(`/api/oasisbios/${oasisBioId}/worlds`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newWorld),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add world');
        }
        
        const addedWorld = await response.json();
        const updatedWorlds = [...worlds, addedWorld];
        setWorlds(updatedWorlds);
        setSelectedWorld(addedWorld);
        setEditWorld(addedWorld);
        setNewWorld({
          name: '',
          summary: '',
          timeSetting: '',
          geography: '',
          physicsRules: '',
          socialStructure: '',
          aestheticKeywords: '',
          majorConflict: '',
          visibility: 'private',
          timeline: '',
          rules: '',
          factions: '',
        });
        setShowAddForm(false);
      } catch (err) {
        setError('Failed to add world');
        console.error('Error adding world:', err);
      }
    }
  };

  const handleDeleteWorld = async (id: string) => {
    try {
      const response = await fetch(`/api/worlds/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete world');
      }
      
      const updatedWorlds = worlds.filter(world => world.id !== id);
      setWorlds(updatedWorlds);
      if (selectedWorld && selectedWorld.id === id) {
        setSelectedWorld(updatedWorlds[0] || null);
        setEditWorld(updatedWorlds[0] || null);
      }
    } catch (err) {
      setError('Failed to delete world');
      console.error('Error deleting world:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading worlds...</p>
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
            <h1 className="text-3xl font-bold mb-2">World Repository</h1>
            <p className="text-gray-600">Create and manage your fictional worlds</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New World'}
          </Button>
        </div>

        {/* Add World Form */}
        {showAddForm && (
          <Card className="mb-8 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Add New World</CardTitle>
              <CardDescription>Create a new fictional world</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">World Name</label>
                  <Input 
                    value={newWorld.name} 
                    onChange={(e) => setNewWorld({ ...newWorld, name: e.target.value })} 
                    placeholder="e.g., Neon Desert"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time Setting</label>
                  <Input 
                    value={newWorld.timeSetting} 
                    onChange={(e) => setNewWorld({ ...newWorld, timeSetting: e.target.value })} 
                    placeholder="e.g., 2150 AD"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Summary</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={newWorld.summary}
                  onChange={(e) => setNewWorld({ ...newWorld, summary: e.target.value })}
                  placeholder="Brief description of your world"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Geography</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newWorld.geography}
                    onChange={(e) => setNewWorld({ ...newWorld, geography: e.target.value })}
                    placeholder="Describe the physical landscape"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rules of Physics</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newWorld.physicsRules}
                    onChange={(e) => setNewWorld({ ...newWorld, physicsRules: e.target.value })}
                    placeholder="Describe the world's rules and systems"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Social Structure</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newWorld.socialStructure}
                    onChange={(e) => setNewWorld({ ...newWorld, socialStructure: e.target.value })}
                    placeholder="Describe the social organization"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Aesthetic Keywords</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newWorld.aestheticKeywords}
                    onChange={(e) => setNewWorld({ ...newWorld, aestheticKeywords: e.target.value })}
                    placeholder="Describe the visual style"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Major Conflict</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newWorld.majorConflict}
                    onChange={(e) => setNewWorld({ ...newWorld, majorConflict: e.target.value })}
                    placeholder="Describe major conflicts"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Factions</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newWorld.factions}
                    onChange={(e) => setNewWorld({ ...newWorld, factions: e.target.value })}
                    placeholder="List major factions or groups"
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={handleAddWorld} className="mt-2">
                Add World
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* World List */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader>
                <CardTitle>Worlds</CardTitle>
                <CardDescription>Your worldbuilding repository</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {worlds.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-gray-500">No worlds yet</p>
                    </div>
                  ) : (
                    worlds.map(world => (
                      <div 
                        key={world.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${selectedWorld?.id === world.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        onClick={() => {
                          setSelectedWorld(world);
                          setEditWorld(world);
                          setIsEditing(false);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{world.name}</h3>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteWorld(world.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">{world.timeSetting}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Updated: {new Date(world.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* World Details */}
          <div className="lg:col-span-3">
            {selectedWorld ? (
              <Card className="border-0 shadow-sm h-full">
                <CardHeader className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedWorld.name}</CardTitle>
                    <CardDescription>{selectedWorld.timeSetting} • Last updated: {new Date(selectedWorld.updatedAt).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleSaveWorld}>
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => {
                          setIsEditing(false);
                          setEditWorld(selectedWorld);
                        }}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Summary</h3>
                      {isEditing ? (
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          value={editWorld.summary}
                          onChange={(e) => setEditWorld({ ...editWorld, summary: e.target.value })}
                          placeholder="Brief description of your world"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-700">{selectedWorld.summary}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Geography</h3>
                        {isEditing ? (
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            value={editWorld.geography}
                            onChange={(e) => setEditWorld({ ...editWorld, geography: e.target.value })}
                            placeholder="Describe the physical landscape"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-700">{selectedWorld.geography}</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Rules of Physics</h3>
                        {isEditing ? (
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            value={editWorld.physicsRules}
                            onChange={(e) => setEditWorld({ ...editWorld, physicsRules: e.target.value })}
                            placeholder="Describe the world's rules and systems"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-700">{selectedWorld.physicsRules}</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Social Structure</h3>
                        {isEditing ? (
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            value={editWorld.socialStructure}
                            onChange={(e) => setEditWorld({ ...editWorld, socialStructure: e.target.value })}
                            placeholder="Describe the social organization"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-700">{selectedWorld.socialStructure}</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Aesthetic Keywords</h3>
                        {isEditing ? (
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            value={editWorld.aestheticKeywords}
                            onChange={(e) => setEditWorld({ ...editWorld, aestheticKeywords: e.target.value })}
                            placeholder="Describe the visual style"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-700">{selectedWorld.aestheticKeywords}</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Major Conflict</h3>
                        {isEditing ? (
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            value={editWorld.majorConflict}
                            onChange={(e) => setEditWorld({ ...editWorld, majorConflict: e.target.value })}
                            placeholder="Describe major conflicts"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-700">{selectedWorld.majorConflict}</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Factions</h3>
                        {isEditing ? (
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            value={editWorld.factions}
                            onChange={(e) => setEditWorld({ ...editWorld, factions: e.target.value })}
                            placeholder="List major factions or groups"
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-700">{selectedWorld.factions}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm h-full">
                <CardHeader>
                  <CardTitle>Select a World</CardTitle>
                  <CardDescription>Choose a world from the list or create a new one</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-gray-500">No world selected</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}