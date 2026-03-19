'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Button } from '@/components/Button';

interface MascotCardProps {
  name: string;
  gender: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  onViewModel: () => void;
}

export function MascotCard({
  name,
  gender,
  description,
  imageSrc,
  imageAlt,
  onViewModel
}: MascotCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-video bg-gray-100 rounded-t-md overflow-hidden">
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold transition-all duration-300">{name}</CardTitle>
        <CardDescription className="transition-all duration-300">{gender} Mascot</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 transition-all duration-300">
          {description}
        </p>
        <Button 
          className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          onClick={onViewModel}
        >
          View 3D Model
        </Button>
      </CardContent>
    </Card>
  );
}
