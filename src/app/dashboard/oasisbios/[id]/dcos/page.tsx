'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';

// Mock data for DCOS files
const initialDcosFiles = [
  {
    id: 1,
    title: 'Core Identity',
    content: '# Core Identity\n\nThis is the central narrative of your OasisBio. It defines who you are at your core.\n\n## Core Principles\n- I speak as if every sentence is a map.\n- Never answer emotionally before observing patterns.\n- This identity belongs to a future archivist from 2094.\n',
    folder: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'Voice and Tone',
    content: '# Voice and Tone\n\n## Communication Style\n- Formal but approachable\n- Detailed and precise\n- Uses metaphors related to time and archives\n- Speaks in a measured, deliberate manner\n',
    folder: 'voice',
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: 3,
    title: 'Principles',
    content: '# Guiding Principles\n\n1. Preservation of knowledge\n2. Objectivity in observation\n3. Adaptability to changing contexts\n4. Respect for all forms of identity\n',
    folder: 'principles',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
];

export default function DcosPage() {
  const [dcosFiles, setDcosFiles] = useState(initialDcosFiles);
  const [selectedFile, setSelectedFile] = useState(initialDcosFiles[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(selectedFile.content);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFile, setNewFile] = useState({
    title: '',
    content: '',
    folder: 'core',
  });

  const handleSaveFile = () => {
    if (selectedFile) {
      const updatedFiles = dcosFiles.map(file => 
        file.id === selectedFile.id ? { ...file, content: editContent, updatedAt: new Date().toISOString() } : file
      );
      setDcosFiles(updatedFiles);
      setSelectedFile({ ...selectedFile, content: editContent, updatedAt: new Date().toISOString() });
      setIsEditing(false);
    }
  };

  const handleAddFile = () => {
    if (newFile.title.trim()) {
      const file = {
        id: dcosFiles.length + 1,
        ...newFile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedFiles = [...dcosFiles, file];
      setDcosFiles(updatedFiles);
      setSelectedFile(file);
      setEditContent(file.content);
      setNewFile({ title: '', content: '', folder: 'core' });
      setShowAddForm(false);
    }
  };

  const handleDeleteFile = (id: number) => {
    const updatedFiles = dcosFiles.filter(file => file.id !== id);
    setDcosFiles(updatedFiles);
    if (selectedFile && selectedFile.id === id) {
      setSelectedFile(updatedFiles[0]);
      setEditContent(updatedFiles[0]?.content || '');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-mono text-gray-500">01</span>
            <div className="h-px flex-grow bg-gray-200"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">DCOS Repository</h1>
          <p className="text-gray-600 max-w-2xl">Dynamic Core Operating Scripts — The intellectual foundation of your identity</p>
        </div>

        {/* Add File Form */}
        {showAddForm && (
          <Card className="mb-12 border border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-black text-white text-xs font-mono">NEW</span>
                <CardTitle className="font-display">Add New DCOS File</CardTitle>
              </div>
              <CardDescription>Create a new core narrative file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">File Title</label>
                  <Input 
                    value={newFile.title} 
                    onChange={(e) => setNewFile({ ...newFile, title: e.target.value })} 
                    placeholder="e.g., Core Identity"
                    className="border-gray-300 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Folder</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newFile.folder}
                    onChange={(e) => setNewFile({ ...newFile, folder: e.target.value })}
                  >
                    <option value="core">Core</option>
                    <option value="voice">Voice</option>
                    <option value="principles">Principles</option>
                    <option value="manifesto">Manifesto</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea 
                  className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black font-sans"
                  value={newFile.content}
                  onChange={(e) => setNewFile({ ...newFile, content: e.target.value })}
                  placeholder="Write your core narrative here...\n\n# Heading\n\n- Bullet points\n- More bullet points\n"
                  rows={10}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFile}>
                  Add File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* File List */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-display font-bold">Files</h2>
                <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                  {showAddForm ? 'Cancel' : 'Add File'}
                </Button>
              </div>
              <div className="space-y-3">
                {dcosFiles.map((file, index) => (
                  <div 
                    key={file.id}
                    className={`p-4 border border-gray-200 rounded-sm cursor-pointer transition-all ${selectedFile?.id === file.id ? 'border-black bg-gray-50' : 'hover:border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => {
                      setSelectedFile(file);
                      setEditContent(file.content);
                      setIsEditing(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">{String(index + 1).padStart(2, '0')}</div>
                        <h3 className="font-medium">{file.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{file.folder}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteFile(file.id)}
                        className="h-8 w-8 p-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Updated: {new Date(file.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* File Editor */}
          <div className="lg:col-span-9">
            {selectedFile && (
              <div className="border border-gray-200 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono">{selectedFile.folder.toUpperCase()}</span>
                      <span className="text-xs font-mono text-gray-500">V{String(selectedFile.id).padStart(2, '0')}</span>
                    </div>
                    <h2 className="text-3xl font-display font-bold">{selectedFile.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">Last updated: {new Date(selectedFile.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleSaveFile}>
                          Save
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => {
                          setIsEditing(false);
                          setEditContent(selectedFile.content);
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
                </div>
                
                <div className="min-h-[600px]">
                  {isEditing ? (
                    <textarea 
                      className="w-full px-6 py-8 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black font-sans text-lg leading-relaxed"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Write your core narrative here..."
                      rows={20}
                    />
                  ) : (
                    <div className="prose max-w-none">
                      {selectedFile.content.split('\n').map((line, index) => {
                        if (line.startsWith('# ')) {
                          return <h1 key={index} className="font-display font-bold">{line.replace('# ', '')}</h1>;
                        } else if (line.startsWith('## ')) {
                          return <h2 key={index} className="font-display font-bold">{line.replace('## ', '')}</h2>;
                        } else if (line.startsWith('- ')) {
                          return <li key={index}>{line.replace('- ', '')}</li>;
                        } else if (line.trim() === '') {
                          return <br key={index} />;
                        } else {
                          return <p key={index}>{line}</p>;
                        }
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}