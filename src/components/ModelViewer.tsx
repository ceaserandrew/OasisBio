'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ModelViewerProps {
  modelUrl: string;
  width?: number;
  height?: number;
}

export default function ModelViewer({ modelUrl, width = 800, height = 600 }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let animationId: number | null = null;
    let scene: any = null;
    let camera: any = null;
    let renderer: any = null;
    let controls: any = null;
    let model: any = null;

    const loadThreeJS = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamically import Three.js and its components
        const THREE = await import('three');
        // @ts-ignore - three.js examples don't have type declarations
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls');
        // @ts-ignore - three.js examples don't have type declarations
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');

        if (!containerRef.current) return;

        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x222222);

        // Create camera
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);

        // Add controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Load GLB model
        const loader = new GLTFLoader();

        loader.load(
          modelUrl,
          (gltf: any) => {
            model = gltf.scene;
            if (model) {
              scene.add(model);
              
              // Center the model
              const box = new THREE.Box3().setFromObject(model);
              const center = box.getCenter(new THREE.Vector3());
              model.position.sub(center);
              
              // Scale the model to fit in the view
              const size = box.getSize(new THREE.Vector3());
              const maxSize = Math.max(size.x, size.y, size.z);
              const scale = 4 / maxSize;
              model.scale.set(scale, scale, scale);
            }
            setIsLoading(false);
          },
          (xhr: any) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error: any) => {
            console.error('Error loading model:', error);
            setError('Failed to load model');
            setIsLoading(false);
            // Fallback to cube if model fails to load
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshStandardMaterial({ 
              color: 0x0070f3,
              metalness: 0.3,
              roughness: 0.4
            });
            model = new THREE.Mesh(geometry, material);
            scene.add(model);
          }
        );

        // Add renderer to DOM
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          controls.update();
          if (model) {
            model.rotation.y += 0.005;
          }
          renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
          if (!camera || !renderer) return;
          const container = containerRef.current;
          if (!container) return;
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          window.removeEventListener('resize', handleResize);
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }
          // Dispose of Three.js resources
          if (model) {
            // Dispose of model resources
            model.traverse((object: any) => {
              if (object instanceof THREE.Mesh) {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                  if (Array.isArray(object.material)) {
                    object.material.forEach((m: any) => m.dispose());
                  } else {
                    object.material.dispose();
                  }
                }
              }
            });
          }
          if (renderer) {
            renderer.dispose();
          }
        };
      } catch (err) {
        console.error('Error loading Three.js:', err);
        setError('Failed to load 3D viewer');
        setIsLoading(false);
      }
    };

    loadThreeJS();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [modelUrl, width, height]);

  if (isLoading) {
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center bg-background"
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading 3D model...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center bg-background"
        style={{ width, height }}
      >
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <p>Showing fallback model</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{ width, height }}
    />
  );
}