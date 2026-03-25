'use client';

import React, { useState } from 'react';
import { Button } from './Button';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    imported: number;
    updated: number;
    failed: number;
    errors: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/zip') {
        setError('File must be a ZIP file');
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
        setSuccess(null);
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    setError(null);
    setSuccess(null);

    try {
      await onImport(file);
    } catch (err) {
      setError('Import failed. Please try again.');
      console.error('Import error:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Import Characters</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {!success ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload ZIP File
                </label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                    className="hidden"
                    id="import-file"
                  />
                  <label
                    htmlFor="import-file"
                    className="cursor-pointer"
                  >
                    <div className="text-gray-500 mb-2">
                      {file ? (
                        <p>{file.name}</p>
                      ) : (
                        <p>Drag and drop your ZIP file here, or click to browse</p>
                      )}
                    </div>
                    {!file && (
                      <Button variant="outline">
                        Browse Files
                      </Button>
                    )}
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!file || isImporting}
                  className="flex-1"
                >
                  {isImporting ? 'Importing...' : 'Import'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-md">
                <h3 className="font-medium text-green-700 mb-2">Import Successful</h3>
                <ul className="text-sm">
                  <li>Imported: {success.imported}</li>
                  <li>Updated: {success.updated}</li>
                  <li>Failed: {success.failed}</li>
                </ul>
              </div>

              {success.errors.length > 0 && (
                <div className="p-4 bg-amber-50 rounded-md">
                  <h3 className="font-medium text-amber-700 mb-2">Errors</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {success.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  Import Another
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}