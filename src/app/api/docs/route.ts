import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), 'docs');

interface DocMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
}

function getCategoryFromPath(filePath: string): string {
  if (filePath.includes('/features/')) return 'features';
  if (filePath.includes('/guides/')) return 'guides';
  return 'specs';
}

function getAllDocs(): DocMeta[] {
  const docs: DocMeta[] = [];

  function walkDirectory(dir: string, baseSlug: string = '') {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        const newBaseSlug = baseSlug ? `${baseSlug}/${file}` : file;
        walkDirectory(filePath, newBaseSlug);
      } else if (file.endsWith('.md')) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        const slug = baseSlug ? `${baseSlug}/${file.replace('.md', '')}` : file.replace('.md', '');

        docs.push({
          slug,
          title: data.title || slug,
          description: data.description || '',
          category: getCategoryFromPath(filePath),
        });
      }
    });
  }

  walkDirectory(docsDirectory);
  return docs;
}

export async function GET() {
  try {
    const docs = getAllDocs();
    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error reading docs:', error);
    return NextResponse.json({ error: 'Failed to load docs' }, { status: 500 });
  }
}
