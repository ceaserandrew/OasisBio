import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { importService } from '@/services/importService';

// POST /api/import
export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await requireAuth();
    const userId = session.user.id;

    // Check if request has form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/zip') {
      return NextResponse.json({ error: 'File must be a ZIP file' }, { status: 400 });
    }

    // Perform import
    const result = await importService.importCharacters({
      userId,
      file,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}