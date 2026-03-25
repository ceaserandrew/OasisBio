'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { useSession, signOut } from '@/lib/auth.client';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/navigation/NavigationBar';
import { ModelUpload, ModelPreviewUpload } from '@/components/FileUpload';

// Mock data for models
const initialModels = [
  {
    id: 1,
    name: 'Oasis Prime',
    objUrl: '/models/oasis-prime.obj',
    mtlUrl: '/models/oasis-prime.mtl' as string | null,
    previewImage: 'https://via.placeholder.com/300x300?text=Oasis+Prime',
    relatedWorldId: null as number | null,
    relatedEraId: null as number | null,
    uploadedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Future Self',
    objUrl: '/models/future-self.obj',
    mtlUrl: '/models/future-self.mtl' as string | null,
    previewImage: 'https://via.placeholder.com/300x300?text=Future+Self',
    relatedWorldId: 1 as number | null,
    relatedEraId: 2 as number | null,
    uploadedAt: '2024-01-16T14:00:00Z',
  },
];

export default function ModelsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
  };

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  // Show loading while checking session
  if (!session) {
    return null;
  }

  const [models, setModels] = useState(initialModels);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    modelUrl: '',
    previewUrl: '',
    relatedWorldId: null as number | null,
    relatedEraId: null as number | null,
  });

  const handleModelUpload = (url: string) => {
    setNewModel({ ...newModel, modelUrl: url });
  };

  const handlePreviewUpload = (url: string) => {
    setNewModel({ ...newModel, previewUrl: url });
  };

  const handleUploadModel = () => {
    if (newModel.name && newModel.modelUrl) {
      // In a real implementation, this would save the model to the database
      // For now, we'll just add a mock model
      const model = {
        id: models.length + 1,
        name: newModel.name,
        objUrl: newModel.modelUrl,
        mtlUrl: null,
        previewImage: newModel.previewUrl || 'https://via.placeholder.com/300x300?text=' + newModel.name.replace(/\s+/g, '+'),
        relatedWorldId: newModel.relatedWorldId,
        relatedEraId: newModel.relatedEraId,
        uploadedAt: new Date().toISOString(),
      };
      setModels([...models, model]);
      setNewModel({
        name: '',
        modelUrl: '',
        previewUrl: '',
        relatedWorldId: null,
        relatedEraId: null,
      });
      setShowUploadForm(false);
    }
  };

  const handleDeleteModel = (id: number) => {
    setModels(models.filter(model => model.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Left Navigation Bar */}
        <NavigationBar user={session?.user} onLogout={handleLogout} />

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">Model Manager</h1>
                <p className="text-muted-foreground">Upload and manage your 3D models</p>
              </div>
              <Button onClick={() => setShowUploadForm(!showUploadForm)}>
                {showUploadForm ? 'Cancel' : 'Upload New Model'}
              </Button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
              <Card className="mb-8 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Upload New Model</CardTitle>
                  <CardDescription>Upload OBJ files and associated materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Model Name</label>
                    <Input 
                      value={newModel.name} 
                      onChange={(e) => setNewModel({ ...newModel, name: e.target.value })} 
                      placeholder="e.g., Oasis Prime"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">3D Model (GLB)</label>
                    <ModelUpload 
                      userId={session.user.id}
                      characterId="models"
                      modelId={Date.now().toString()}
                      onSuccess={handleModelUpload}
                      onError={(error) => console.error('Model upload error:', error)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Model Preview (Image)</label>
                    <ModelPreviewUpload 
                      userId={session.user.id}
                      characterId="models"
                      onSuccess={handlePreviewUpload}
                      onError={(error) => console.error('Preview upload error:', error)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Related World</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={newModel.relatedWorldId || ''}
                        onChange={(e) => setNewModel({ ...newModel, relatedWorldId: e.target.value ? parseInt(e.target.value) : null })}
                      >
                        <option value="">None</option>
                        <option value="1">Neon Desert</option>
                        <option value="2">Archive City</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Related Era</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={newModel.relatedEraId || ''}
                        onChange={(e) => setNewModel({ ...newModel, relatedEraId: e.target.value ? parseInt(e.target.value) : null })}
                      >
                        <option value="">None</option>
                        <option value="1">Past</option>
                        <option value="2">Present</option>
                        <option value="3">Future</option>
                      </select>
                    </div>
                  </div>
                  <Button onClick={handleUploadModel} className="mt-2">
                    Upload Model
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Model Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map(model => (
                <Card key={model.id} className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <CardDescription>Uploaded: {new Date(model.uploadedAt).toLocaleDateString()}</CardDescription>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteModel(model.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        <img 
                          src={model.previewImage} 
                          alt={model.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">OBJ File</span>
                        <span className="text-sm text-gray-600">{model.objUrl.split('/').pop()}</span>
                      </div>
                      {model.mtlUrl && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">MTL File</span>
                          <span className="text-sm text-gray-600">{model.mtlUrl.split('/').pop()}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 mb-4">
                      {model.relatedWorldId && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Related World</span>
                          <span className="text-sm text-gray-600">
                            {model.relatedWorldId === 1 ? 'Neon Desert' : 'Archive City'}
                          </span>
                        </div>
                      )}
                      {model.relatedEraId && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Related Era</span>
                          <span className="text-sm text-gray-600">
                            {model.relatedEraId === 1 ? 'Past' : model.relatedEraId === 2 ? 'Present' : 'Future'}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button asChild size="sm" className="w-full">
                      <a href={`/dashboard/models/${model.id}/preview`}>
                        Preview Model
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}