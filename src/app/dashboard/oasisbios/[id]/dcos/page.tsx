'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { useParams } from 'next/navigation';

export default function DcosPage() {
  const params = useParams();
  const oasisBioId = params.id as string;
  
  const [dcosFiles, setDcosFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFile, setNewFile] = useState({
    title: '',
    content: '',
    folderPath: '/',
    status: 'draft',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch DCOS files from API
  useEffect(() => {
    const fetchDcosFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/oasisbios/${oasisBioId}/dcos`);
        if (!response.ok) {
          throw new Error('Failed to fetch DCOS files');
        }
        const data = await response.json();
        setDcosFiles(data);
        if (data.length > 0) {
          setSelectedFile(data[0]);
          setEditContent(data[0].content);
        }
      } catch (err) {
        setError('Failed to load DCOS files');
        console.error('Error fetching DCOS files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDcosFiles();
  }, [oasisBioId]);

  const handleSaveFile = async () => {
    if (selectedFile) {
      try {
        const response = await fetch(`/api/dcos/${selectedFile.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...selectedFile,
            content: editContent,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update DCOS file');
        }
        
        const updatedFile = await response.json();
        const updatedFiles = dcosFiles.map(file => 
          file.id === selectedFile.id ? updatedFile : file
        );
        setDcosFiles(updatedFiles);
        setSelectedFile(updatedFile);
        setIsEditing(false);
      } catch (err) {
        setError('Failed to update DCOS file');
        console.error('Error updating DCOS file:', err);
      }
    }
  };

  const handleAddFile = async () => {
    if (newFile.title.trim()) {
      try {
        const response = await fetch(`/api/oasisbios/${oasisBioId}/dcos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFile),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add DCOS file');
        }
        
        const addedFile = await response.json();
        const updatedFiles = [...dcosFiles, addedFile];
        setDcosFiles(updatedFiles);
        setSelectedFile(addedFile);
        setEditContent(addedFile.content);
        setNewFile({ title: '', content: '', folderPath: '/', status: 'draft' });
        setShowAddForm(false);
      } catch (err) {
        setError('Failed to add DCOS file');
        console.error('Error adding DCOS file:', err);
      }
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const response = await fetch(`/api/dcos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete DCOS file');
      }
      
      const updatedFiles = dcosFiles.filter(file => file.id !== id);
      setDcosFiles(updatedFiles);
      if (selectedFile && selectedFile.id === id) {
        setSelectedFile(updatedFiles[0] || null);
        setEditContent(updatedFiles[0]?.content || '');
      }
    } catch (err) {
      setError('Failed to delete DCOS file');
      console.error('Error deleting DCOS file:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading DCOS files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

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
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newFile.status}
                    onChange={(e) => setNewFile({ ...newFile, status: e.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
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
                {dcosFiles.length === 0 ? (
                  <div className="p-4 border border-gray-200 rounded-sm text-center">
                    <p className="text-gray-500">No DCOS files yet</p>
                  </div>
                ) : (
                  dcosFiles.map((file, index) => (
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
                          <p className="text-xs text-gray-500 mt-1">{file.status}</p>
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
                  ))
                )}
              </div>
            </div>
          </div>

          {/* File Editor */}
          <div className="lg:col-span-9">
            {selectedFile ? (
              <div className="border border-gray-200 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono">{selectedFile.status.toUpperCase()}</span>
                      <span className="text-xs font-mono text-gray-500">V{selectedFile.version}</span>
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
                      {selectedFile.content.split('\n').map((line: string, index: number) => {
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
            ) : (
              <div className="border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Select a DCOS file to view or add a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}