'use client';

import React, { useState } from 'react';
import { Button } from './Button';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterIds: string[];
  onExport: (type: 'single' | 'batch', characterIds: string[], include: {
    character: boolean;
    dcos: boolean;
    references: boolean;
    world: boolean;
    model: boolean;
    cover: boolean;
    preview: boolean;
  }) => void;
}

export function ExportModal({ isOpen, onClose, characterIds, onExport }: ExportModalProps) {
  const [exportType, setExportType] = useState<'single' | 'batch'>(characterIds.length === 1 ? 'single' : 'batch');
  const [include, setInclude] = useState({
    character: true,
    dcos: true,
    references: true,
    world: true,
    model: true,
    cover: true,
    preview: true,
  });
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleIncludeChange = (key: keyof typeof include) => {
    setInclude(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(exportType, characterIds, include);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Export Character{characterIds.length > 1 ? 's' : ''}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {characterIds.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="exportType"
                    value="batch"
                    checked={exportType === 'batch'}
                    onChange={() => setExportType('batch')}
                    className="mr-2"
                  />
                  <span>Batch Export</span>
                </label>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include in Export
            </label>
            <div className="space-y-2">
              {Object.entries(include).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleIncludeChange(key as keyof typeof include)}
                    className="mr-2"
                  />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1"
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}