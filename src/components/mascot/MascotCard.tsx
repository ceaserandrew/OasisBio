'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Button } from '@/components/Button';
import { ModelViewer } from '@/components/ModelViewer';
import Link from 'next/link';

interface MascotCardProps {
  name: string;
  gender: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  modelPath: string;
  mtlPath: string;
  texturePath: string;
  downloadPath: string;
}

export function MascotCard({
  name,
  gender,
  description,
  imageSrc,
  imageAlt,
  modelPath,
  mtlPath,
  texturePath,
  downloadPath
}: MascotCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const handleViewModel = () => {
    setShowModel(true);
  };

  const handleDownloadModel = () => {
    // 触发文件下载
    window.open(downloadPath, '_blank');
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden">
      <div className="aspect-video bg-gray-100 rounded-t-xl overflow-hidden relative">
        {!showModel ? (
          <>
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            {/* 3D Model Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-105">
              3D Model Available
            </div>
            {/* Overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="w-full h-full">
            <ModelViewer 
              modelPath={modelPath}
              mtlPath={mtlPath}
              texturePath={texturePath}
              width="100%"
              height="100%"
            />
          </div>
        )}
      </div>
      <CardHeader className="pb-2 p-6">
        <CardTitle className="text-lg font-semibold transition-all duration-300 text-gray-900 transform hover:scale-105">{name}</CardTitle>
        <CardDescription className="transition-all duration-300 text-gray-700">{gender} Mascot</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="text-gray-700 mb-6 transition-all duration-300 leading-relaxed">
          {description}
        </p>
        {!showModel ? (
          <div className="space-y-3">
            <Button 
              className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-6 text-lg"
              onClick={handleViewModel}
              disabled={isLoading}
            >
              View 3D Model
            </Button>
            <Button 
              variant="outline"
              className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] py-6 text-lg"
              onClick={handleDownloadModel}
            >
              Download Model
            </Button>
            <Button 
              variant="ghost"
              asChild
              className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] py-6 text-lg"
            >
              <Link href={`/templates/mascots/${name.toLowerCase()}`}>
                View Details
              </Link>
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline"
            className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] py-6 text-lg"
            onClick={() => setShowModel(false)}
          >
            Back to Image
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
