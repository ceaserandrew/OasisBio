'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

interface ExportHistoryItem {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  characterCount: number;
  timestamp: string;
}

export function ExportHistory() {
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExportHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/export/history');
        if (!response.ok) {
          throw new Error('Failed to fetch export history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError('Failed to load export history');
        console.error('Error fetching export history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExportHistory();
  }, []);

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground">No export history yet</p>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{item.fileName}</h4>
                  <span className="text-sm text-gray-500">{formatDate(item.timestamp)}</span>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{item.characterCount} character{item.characterCount !== 1 ? 's' : ''}</span>
                  <span>{formatFileSize(item.fileSize)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}