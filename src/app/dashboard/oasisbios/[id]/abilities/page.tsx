'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { useParams } from 'next/navigation';

// Mock data for ability categories and presets
const abilityCategories = [
  { id: 'languages', name: 'Languages' },
  { id: 'sports', name: 'Sports' },
  { id: 'arts', name: 'Arts' },
  { id: 'music', name: 'Music' },
  { id: 'technology', name: 'Technology' },
  { id: 'science', name: 'Science' },
  { id: 'social', name: 'Social Skills' },
  { id: 'survival', name: 'Survival Skills' },
  { id: 'worldbuilding', name: 'Worldbuilding Skills' },
  { id: 'combat', name: 'Combat / Fantasy Skills' },
  { id: 'spiritual', name: 'Spiritual / Abstract Traits' },
  { id: 'profession', name: 'Profession Tags' },
];

const presetAbilities = {
  languages: ['English', 'Spanish', 'Japanese', 'French', 'Mandarin'],
  sports: ['Basketball', 'Football', 'Running', 'Swimming', 'Skateboarding'],
  arts: ['Drawing', 'Photography', 'Filmmaking', 'Fashion Styling', 'Calligraphy'],
  music: ['Rap', 'Singing', 'Beatmaking', 'Guitar', 'Piano'],
  technology: ['Frontend Development', 'AI Prompting', 'Game Design', '3D Modeling', 'Data Analysis'],
  combat: ['Telepathy', 'Alchemy', 'World Mapping', 'Beast Taming', 'Portal Hacking'],
};

export default function AbilitiesPage() {
  const params = useParams();
  const oasisBioId = params.id as string;
  
  const [abilities, setAbilities] = useState<any[]>([]);
  const [worlds, setWorlds] = useState<any[]>([]);
  const [eras, setEras] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAbility, setNewAbility] = useState({
    name: '',
    category: 'technology',
    type: 'custom' as 'custom' | 'official',
    level: 1,
    description: '',
    relatedWorldId: '',
    relatedEraId: '',
  });
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch abilities, worlds, and eras from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch abilities
        const abilitiesResponse = await fetch(`/api/oasisbios/${oasisBioId}/abilities`);
        if (!abilitiesResponse.ok) {
          throw new Error('Failed to fetch abilities');
        }
        const abilitiesData = await abilitiesResponse.json();
        setAbilities(abilitiesData);
        
        // Fetch worlds
        const worldsResponse = await fetch(`/api/oasisbios/${oasisBioId}/worlds`);
        if (worldsResponse.ok) {
          const worldsData = await worldsResponse.json();
          setWorlds(worldsData);
        }
        
        // Fetch eras
        const erasResponse = await fetch(`/api/oasisbios/${oasisBioId}/eras`);
        if (erasResponse.ok) {
          const erasData = await erasResponse.json();
          setEras(erasData);
        }
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [oasisBioId]);

  const handleAddAbility = async () => {
    if (newAbility.name.trim()) {
      try {
        const response = await fetch(`/api/oasisbios/${oasisBioId}/abilities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAbility),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add ability');
        }
        
        const addedAbility = await response.json();
        setAbilities([...abilities, addedAbility]);
        setNewAbility({
          name: '',
          category: 'technology',
          type: 'custom',
          level: 1,
          description: '',
          relatedWorldId: '',
          relatedEraId: '',
        });
        setShowAddForm(false);
      } catch (err) {
        setError('Failed to add ability');
        console.error('Error adding ability:', err);
      }
    }
  };

  const handleAddPresetAbility = async (category: string, abilityName: string) => {
    const existingAbility = abilities.find(a => a.name === abilityName);
    if (!existingAbility) {
      try {
        const response = await fetch(`/api/oasisbios/${oasisBioId}/abilities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: abilityName,
            category,
            type: 'official',
            level: 1,
            description: '',
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add preset ability');
        }
        
        const addedAbility = await response.json();
        setAbilities([...abilities, addedAbility]);
      } catch (err) {
        setError('Failed to add preset ability');
        console.error('Error adding preset ability:', err);
      }
    }
  };

  const handleUpdateLevel = async (id: string, level: number) => {
    try {
      const ability = abilities.find(a => a.id === id);
      if (!ability) return;
      
      const response = await fetch(`/api/abilities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ability,
          level,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update ability level');
      }
      
      const updatedAbility = await response.json();
      setAbilities(abilities.map(ability => 
        ability.id === id ? updatedAbility : ability
      ));
    } catch (err) {
      setError('Failed to update ability level');
      console.error('Error updating ability level:', err);
    }
  };

  const handleDeleteAbility = async (id: string) => {
    try {
      const response = await fetch(`/api/abilities/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete ability');
      }
      
      setAbilities(abilities.filter(ability => ability.id !== id));
    } catch (err) {
      setError('Failed to delete ability');
      console.error('Error deleting ability:', err);
    }
  };

  const filteredAbilities = filterCategory === 'all' 
    ? abilities 
    : abilities.filter(ability => ability.category === filterCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading abilities...</p>
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
            <h1 className="text-3xl font-bold mb-2">Ability Pool</h1>
            <p className="text-gray-600">Manage your skills and abilities</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New Ability'}
          </Button>
        </div>

        {/* Add Ability Form */}
        {showAddForm && (
          <Card className="mb-8 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Add New Ability</CardTitle>
              <CardDescription>Create a custom ability or select from presets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ability Name</label>
                  <Input 
                    value={newAbility.name} 
                    onChange={(e) => setNewAbility({ ...newAbility, name: e.target.value })} 
                    placeholder="e.g., JavaScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newAbility.category}
                    onChange={(e) => setNewAbility({ ...newAbility, category: e.target.value })}
                  >
                    {abilityCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newAbility.type}
                    onChange={(e) => setNewAbility({ ...newAbility, type: e.target.value as 'custom' | 'official' })}
                  >
                    <option value="custom">Custom</option>
                    <option value="official">Official</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Level (1-5)</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newAbility.level}
                    onChange={(e) => setNewAbility({ ...newAbility, level: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(level => (
                      <option key={level} value={level}>
                        {level} - {level === 1 ? 'Beginner' : level === 2 ? 'Novice' : level === 3 ? 'Intermediate' : level === 4 ? 'Advanced' : 'Expert'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Related World</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newAbility.relatedWorldId}
                    onChange={(e) => setNewAbility({ ...newAbility, relatedWorldId: e.target.value })}
                  >
                    <option value="">Select a world</option>
                    {worlds.map(world => (
                      <option key={world.id} value={world.id}>
                        {world.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Related Era</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newAbility.relatedEraId}
                    onChange={(e) => setNewAbility({ ...newAbility, relatedEraId: e.target.value })}
                  >
                    <option value="">Select an era</option>
                    {eras.map(era => (
                      <option key={era.id} value={era.id}>
                        {era.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={newAbility.description}
                  onChange={(e) => setNewAbility({ ...newAbility, description: e.target.value })}
                  placeholder="Add a description for this ability"
                  rows={3}
                />
              </div>
              <Button onClick={handleAddAbility} className="mt-2">
                Add Ability
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button 
            variant={filterCategory === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilterCategory('all')}
            size="sm"
          >
            All
          </Button>
          {abilityCategories.map(category => (
            <Button 
              key={category.id}
              variant={filterCategory === category.id ? 'primary' : 'secondary'}
              onClick={() => setFilterCategory(category.id)}
              size="sm"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Ability List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAbilities.map(ability => (
            <Card key={ability.id} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ability.name}</CardTitle>
                    <CardDescription>{abilityCategories.find(c => c.id === ability.category)?.name}</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteAbility(ability.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Level</span>
                    <span className="text-sm font-medium">{ability.level}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-black h-2 rounded-full" 
                      style={{ width: `${(ability.level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded mr-2">
                    {ability.type === 'official' ? 'Official' : 'Custom'}
                  </span>
                  {ability.relatedWorldId && worlds.find(w => w.id === ability.relatedWorldId) && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-xs font-medium rounded mr-2">
                      World: {worlds.find(w => w.id === ability.relatedWorldId)?.name}
                    </span>
                  )}
                  {ability.relatedEraId && eras.find(e => e.id === ability.relatedEraId) && (
                    <span className="inline-block px-2 py-1 bg-green-100 text-xs font-medium rounded">
                      Era: {eras.find(e => e.id === ability.relatedEraId)?.name}
                    </span>
                  )}
                </div>
                {ability.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {ability.description}
                  </p>
                )}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <Button 
                      key={level}
                      size="sm"
                      variant={ability.level === level ? 'primary' : 'secondary'}
                      onClick={() => handleUpdateLevel(ability.id, level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preset Abilities */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Official Presets</CardTitle>
            <CardDescription>Add pre-defined abilities to your pool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(presetAbilities).map(([categoryId, abilityList]) => {
                const category = abilityCategories.find(c => c.id === categoryId);
                return (
                  <div key={categoryId}>
                    <h3 className="text-lg font-medium mb-3">{category?.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {abilityList.map(abilityName => (
                        <Button 
                          key={abilityName}
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAddPresetAbility(categoryId, abilityName)}
                        >
                          {abilityName}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}