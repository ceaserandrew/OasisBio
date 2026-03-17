'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

interface DocMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
}

const docCategories = [
  {
    id: 'features',
    name: 'Features',
    description: 'Core features and functionality',
  },
  {
    id: 'guides',
    name: 'Guides',
    description: 'How-to guides and tutorials',
  },
  {
    id: 'specs',
    name: 'Specifications',
    description: 'Technical specifications',
  },
];

export default function DocsPage() {
  const [docs, setDocs] = useState<DocMeta[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch('/api/docs');
        const data = await response.json();
        setDocs(data);
      } catch (error) {
        console.error('Error fetching docs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const filteredDocs = docs.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-mono text-gray-500">DOCS</span>
            <div className="h-px flex-grow bg-gray-200"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Documentation</h1>
          <p className="text-gray-600 max-w-2xl">
            Welcome to the OasisBio documentation. Here you will find everything you need to understand and use our platform.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    selectedCategory === 'all'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Documents
                </button>
                {docCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      selectedCategory === category.id
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-grow">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No documents found</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredDocs.map((doc) => (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    className="block p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded">
                        {doc.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">{doc.title}</h2>
                    <p className="text-gray-600">{doc.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
