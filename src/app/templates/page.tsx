'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { MascotCard } from '@/components/mascot';

// Mock data for templates
const identityTemplates = [
  {
    id: 1,
    name: 'The Athlete',
    description: 'A template for athletes and sports enthusiasts',
    abilities: ['Basketball', 'Running', 'Swimming', 'Strength Training', 'Teamwork'],
    image: 'https://via.placeholder.com/300x200?text=The+Athlete',
  },
  {
    id: 2,
    name: 'The Archivist',
    description: 'A template for knowledge keepers and researchers',
    abilities: ['Research', 'Organization', 'Writing', 'Languages', 'Critical Thinking'],
    image: 'https://via.placeholder.com/300x200?text=The+Archivist',
  },
  {
    id: 3,
    name: 'The Future Musician',
    description: 'A template for futuristic musicians and composers',
    abilities: ['Music Production', 'Songwriting', 'Digital Audio', 'Performance', 'Sound Design'],
    image: 'https://via.placeholder.com/300x200?text=The+Future+Musician',
  },
  {
    id: 4,
    name: 'The Parallel Diplomat',
    description: 'A template for negotiators and diplomats across dimensions',
    abilities: ['Diplomacy', 'Languages', 'Cultural Awareness', 'Public Speaking', 'Conflict Resolution'],
    image: 'https://via.placeholder.com/300x200?text=The+Parallel+Diplomat',
  },
  {
    id: 5,
    name: 'The Worldbuilder',
    description: 'A template for creators of fictional worlds',
    abilities: ['Worldbuilding', 'Storytelling', 'Creative Writing', 'Visual Design', 'Research'],
    image: 'https://via.placeholder.com/300x200?text=The+Worldbuilder',
  },
];

const worldTemplates = [
  {
    id: 1,
    name: 'Neon Cyberpunk',
    description: 'A futuristic world with neon lights and advanced technology',
    timeSetting: '2150 AD',
    keyFeatures: ['Neon-lit cities', 'Advanced AI', 'Cybernetics', 'Corporate control', 'Urban decay'],
    image: 'https://via.placeholder.com/300x200?text=Neon+Cyberpunk',
  },
  {
    id: 2,
    name: 'Medieval Fantasy',
    description: 'A classic fantasy world with magic and medieval technology',
    timeSetting: 'Medieval Era',
    keyFeatures: ['Magic systems', 'Fantasy races', 'Medieval politics', 'Quests', 'Mythical creatures'],
    image: 'https://via.placeholder.com/300x200?text=Medieval+Fantasy',
  },
  {
    id: 3,
    name: 'Post-Apocalyptic',
    description: 'A world recovering from a global cataclysm',
    timeSetting: '2070 AD',
    keyFeatures: ['Scarce resources', 'Survivalist societies', 'Ruined cities', 'Radiation', 'Faction conflicts'],
    image: 'https://via.placeholder.com/300x200?text=Post-Apocalyptic',
  },
];

const abilityTemplates = [
  {
    id: 1,
    category: 'Languages',
    abilities: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Arabic'],
  },
  {
    id: 2,
    category: 'Technology',
    abilities: ['Programming', 'Web Development', 'Data Analysis', 'AI', 'Cybersecurity', '3D Modeling', 'Game Design'],
  },
  {
    id: 3,
    category: 'Arts',
    abilities: ['Drawing', 'Painting', 'Photography', 'Sculpture', 'Digital Art', 'Animation', 'Film Making'],
  },
  {
    id: 4,
    category: 'Music',
    abilities: ['Guitar', 'Piano', 'Drums', 'Singing', 'Music Production', 'Songwriting', 'DJing'],
  },
  {
    id: 5,
    category: 'Sports',
    abilities: ['Basketball', 'Football', 'Soccer', 'Tennis', 'Swimming', 'Running', 'Weightlifting'],
  },
];

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('identity');

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Templates & Presets</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600">
              Start with our pre-built templates to quickly create your OasisBio.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <Button 
              variant={activeTab === 'identity' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('identity')}
              className="px-4 py-4 border-b-2"
            >
              Identity Templates
            </Button>
            <Button 
              variant={activeTab === 'world' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('world')}
              className="px-4 py-4 border-b-2"
            >
              World Templates
            </Button>
            <Button 
              variant={activeTab === 'ability' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('ability')}
              className="px-4 py-4 border-b-2"
            >
              Ability Presets
            </Button>
            <Button 
              variant={activeTab === 'mascot' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('mascot')}
              className="px-4 py-4 border-b-2"
            >
              Deo Mascots
            </Button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Identity Templates */}
            {activeTab === 'identity' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8">Identity Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {identityTemplates.map(template => (
                    <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="aspect-video bg-gray-100 rounded-t-md overflow-hidden">
                        <img 
                          src={template.image} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Key Abilities:</h3>
                          <div className="flex flex-wrap gap-2">
                            {template.abilities.slice(0, 5).map((ability, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                                {ability}
                              </span>
                            ))}
                            {template.abilities.length > 5 && (
                              <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                                +{template.abilities.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                        <Button asChild className="w-full">
                          <a href="/dashboard/oasisbios/new?template={template.id}">Use Template</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* World Templates */}
            {activeTab === 'world' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8">World Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {worldTemplates.map(template => (
                    <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="aspect-video bg-gray-100 rounded-t-md overflow-hidden">
                        <img 
                          src={template.image} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.timeSetting}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">
                          {template.description}
                        </p>
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Key Features:</h3>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {template.keyFeatures.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                        <Button asChild className="w-full">
                          <a href="/dashboard/worlds/new?template={template.id}">Use Template</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Ability Presets */}
            {activeTab === 'ability' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8">Ability Presets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {abilityTemplates.map(template => (
                    <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-lg">{template.category}</CardTitle>
                        <CardDescription>{template.abilities.length} abilities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {template.abilities.map((ability, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                                {ability}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button asChild className="w-full">
                          <a href="/dashboard/oasisbios/new?abilities={template.id}">Add All Abilities</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Deo Mascots */}
            {activeTab === 'mascot' && (
              <div className="space-y-12 bg-gradient-to-br from-blue-500 to-green-500 text-white p-8 md:p-16 rounded-2xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl animate-fade-in">
                <div className="text-center max-w-3xl mx-auto transform transition-all duration-700 hover:scale-105">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Deo Mascots</h2>
                  <p className="text-lg text-white/90 leading-relaxed">
                    Meet our mascots Deo and Dia, the face of OasisBio. They represent the creative spirit of our platform and can be used as templates for your 3D models.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Deo (Male) */}
                  <div className="transform transition-all duration-700 hover:translate-x-2">
                    <MascotCard
                      name="Deo"
                      gender="Male"
                      description="Deo is the male mascot of OasisBio, representing creativity and innovation. Use his 3D model as a template for your own characters."
                      imageSrc="/assets/deo/deo.png"
                      imageAlt="Deo - Male Mascot"
                      modelPath="/assets/deo/deo_model/cartoon+dragon+3d+model.obj"
                      mtlPath="/assets/deo/deo_model/cartoon+dragon+3d+model.mtl"
                      texturePath="/assets/deo/deo_model/cartoon+dragon+3d+model_basecolor.jpg"
                      downloadPath="/assets/deo/deo_v_1.0.zip"
                    />
                  </div>
                  
                  {/* Dia (Female) */}
                  <div className="transform transition-all duration-700 hover:translate-x-2">
                    <MascotCard
                      name="Dia"
                      gender="Female"
                      description="Dia is the female mascot of OasisBio, representing imagination and artistry. Use her 3D model as a template for your own characters."
                      imageSrc="/assets/deo/dia.png"
                      imageAlt="Dia - Female Mascot"
                      modelPath="/assets/deo/dia_model/cute+dragon+3d+model.obj"
                      mtlPath="/assets/deo/dia_model/cute+dragon+3d+model.mtl"
                      texturePath="/assets/deo/dia_model/cute+dragon+3d+model_basecolor.jpg"
                      downloadPath="/assets/deo/dia_v_1.0.zip"
                    />
                  </div>
                </div>
                
                {/* Group Image */}
                <div className="mt-16 transform transition-all duration-700 hover:scale-[1.01]">
                  <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="aspect-square lg:aspect-auto bg-gray-100 rounded-l-xl overflow-hidden">
                        <img 
                          src="/assets/deo/deo and dia.png" 
                          alt="Deo and Dia Together" 
                          className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                        />
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl text-gray-900 transform transition-all duration-300 hover:scale-105">Deo & Dia</CardTitle>
                          <CardDescription className="text-gray-700">Our Mascot Family</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 mb-6 leading-relaxed">
                            Deo and Dia are the perfect templates for creating your own 3D characters. Their versatile design allows you to customize them to fit any world or identity you create on OasisBio.
                          </p>
                          <p className="text-gray-600 leading-relaxed">
                            Use these mascots as a starting point for your creative journey. With OasisBio, you can bring your imagination to life and share it with the world.
                          </p>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </div>
                
                {/* Additional Mascot Images */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6 text-center text-white transform transition-all duration-300 hover:scale-105">More Deo & Dia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="transform transition-all duration-500 hover:-translate-y-2">
                      <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl">
                        <div className="aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                          <img 
                            src="/assets/deo/deo & dia in OasisBio center.png" 
                            alt="Deo & Dia in OasisBio Center" 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-md text-gray-900">OasisBio Center</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                    <div className="transform transition-all duration-500 hover:-translate-y-2">
                      <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl">
                        <div className="aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                          <img 
                            src="/assets/deo/deo & dia in PR.png" 
                            alt="Deo & Dia in PR" 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-md text-gray-900">PR Event</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                    <div className="transform transition-all duration-500 hover:-translate-y-2">
                      <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl">
                        <div className="aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                          <img 
                            src="/assets/deo/deo & dia wear OITS uniform.png" 
                            alt="Deo & Dia in OITS Uniform" 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-md text-gray-900">OITS Uniform</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                  </div>
                </div>
                
                {/* CTA Section */}
                <div className="mt-16 text-center">
                  <h3 className="text-2xl font-bold mb-6 text-white">Ready to Use Deo & Dia?</h3>
                  <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                    Download their 3D models and start creating your own characters today. The possibilities are endless!
                  </p>
                  <Button size="lg" className="bg-white text-blue-500 hover:bg-blue-50 transition-colors duration-300 transform hover:scale-105">
                    Explore More Templates
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Create Your OasisBio?</h2>
            <p className="text-xl mb-10 text-gray-600">
              Start with a template or build your identity from scratch.
            </p>
            <Button size="lg" asChild>
              <a href="/create">Get Started</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}