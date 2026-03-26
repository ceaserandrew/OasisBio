import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';

// ModelViewer is a client component, so we'll import it dynamically
import dynamic from 'next/dynamic';
const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { ssr: false });

// 模型数据
const mascotData = {
  deo: {
    name: 'Deo',
    gender: 'Male',
    description: 'Deo is the male mascot of OasisBio, representing creativity and innovation. Use his 3D model as a template for your own characters.',
    imageSrc: '/assets/deo/deo.png',
    imageAlt: 'Deo - Male Mascot',
    modelPath: '/assets/deo/deo_model/cartoon+dragon+3d+model.obj',
    mtlPath: '/assets/deo/deo_model/cartoon+dragon+3d+model.mtl',
    texturePath: '/assets/deo/deo_model/cartoon+dragon+3d+model_basecolor.jpg',
    downloadPath: '/assets/deo/deo_v_1.0.zip',
    details: [
      '3D Model Format: OBJ',
      'Texture Format: JPG',
      'Model Size: ~50MB',
      'Compatible with most 3D software',
      'Fully customizable',
    ],
    features: [
      'High-quality 3D model',
      'Detailed textures',
      'Low-poly design for optimal performance',
      'Ready for use in games and animations',
      'Includes material files',
    ],
  },
  dia: {
    name: 'Dia',
    gender: 'Female',
    description: 'Dia is the female mascot of OasisBio, representing imagination and artistry. Use her 3D model as a template for your own characters.',
    imageSrc: '/assets/deo/dia.png',
    imageAlt: 'Dia - Female Mascot',
    modelPath: '/assets/deo/dia_model/cute+dragon+3d+model.obj',
    mtlPath: '/assets/deo/dia_model/cute+dragon+3d+model.mtl',
    texturePath: '/assets/deo/dia_model/cute+dragon+3d+model_basecolor.jpg',
    downloadPath: '/assets/deo/dia_v_1.0.zip',
    details: [
      '3D Model Format: OBJ',
      'Texture Format: JPG',
      'Model Size: ~50MB',
      'Compatible with most 3D software',
      'Fully customizable',
    ],
    features: [
      'High-quality 3D model',
      'Detailed textures',
      'Low-poly design for optimal performance',
      'Ready for use in games and animations',
      'Includes material files',
    ],
  },
};

export default function MascotDetailPage() {
  const params = useParams();
  const mascotName = params.name as string;
  const mascot = mascotData[mascotName as keyof typeof mascotData];
  const [activeTab, setActiveTab] = useState('model');

  if (!mascot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mascot not found</h1>
          <Button asChild>
            <a href="/templates">Back to Templates</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-500 to-green-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{mascot.name}</h1>
            <p className="text-xl mb-8 text-white/90">{mascot.gender} Mascot</p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {mascot.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap mb-8 border-b border-gray-200">
              <Button 
                variant={activeTab === 'model' ? 'primary' : 'ghost'}
                onClick={() => setActiveTab('model')}
                className="px-4 py-2 border-b-2"
              >
                3D Model
              </Button>
              <Button 
                variant={activeTab === 'details' ? 'primary' : 'ghost'}
                onClick={() => setActiveTab('details')}
                className="px-4 py-2 border-b-2"
              >
                Details
              </Button>
              <Button 
                variant={activeTab === 'gallery' ? 'primary' : 'ghost'}
                onClick={() => setActiveTab('gallery')}
                className="px-4 py-2 border-b-2"
              >
                Gallery
              </Button>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {/* 3D Model Tab */}
              {activeTab === 'model' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                    <ModelViewer 
                      modelPath={mascot.modelPath}
                      mtlPath={mascot.mtlPath}
                      texturePath={mascot.texturePath}
                      width="100%"
                      height={500}
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">{mascot.name} 3D Model</h2>
                      <p className="text-gray-700 mb-6">
                        Explore the {mascot.name} 3D model. You can rotate, zoom, and examine the model from different angles.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-6 text-lg"
                        onClick={() => window.open(mascot.downloadPath, '_blank')}
                      >
                        Download 3D Model
                      </Button>
                      <Button 
                        variant="outline"
                        asChild
                        className="w-full py-6 text-lg"
                      >
                        <a href="/templates">Back to Templates</a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Model Details</CardTitle>
                      <CardDescription>Technical information about the 3D model</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {mascot.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 min-w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                              ✓
                            </div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Features</CardTitle>
                      <CardDescription>What makes this model special</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {mascot.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 min-w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                              ✓
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <div className="aspect-square bg-gray-100">
                        <img 
                          src={mascot.imageSrc} 
                          alt={mascot.name} 
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-md">{mascot.name} Portrait</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <div className="aspect-square bg-gray-100">
                        <img 
                          src="/assets/deo/deo and dia.png" 
                          alt="Deo and Dia Together" 
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-md">With {mascot.name === 'Deo' ? 'Dia' : 'Deo'}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <div className="aspect-square bg-gray-100">
                        <img 
                          src="/assets/deo/deo & dia in OasisBio center.png" 
                          alt="Deo & Dia in OasisBio Center" 
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-md">OasisBio Center</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Creating?</h2>
            <p className="text-xl mb-10 text-gray-600">
              Download the {mascot.name} 3D model and begin your creative journey with OasisBio.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white">
              Download {mascot.name} Model
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}