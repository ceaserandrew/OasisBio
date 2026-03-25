import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { exportService } from '@/services/exportService';

// POST /api/export
export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await requireAuth();
    const userId = session.user.id;
    const body = await request.json();
    const { type, characterIds, include } = body;

    // Validate request
    if (!type || !['single', 'batch'].includes(type)) {
      return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    if (type === 'single' && (!characterIds || characterIds.length !== 1)) {
      return NextResponse.json({ error: 'Single export requires exactly one character ID' }, { status: 400 });
    }

    if (type === 'batch' && (!characterIds || characterIds.length === 0)) {
      return NextResponse.json({ error: 'Batch export requires at least one character ID' }, { status: 400 });
    }

    // Perform export
    const result = await exportService.exportCharacters({
      userId,
      characterIds,
      type,
      include: include || {
        character: true,
        dcos: true,
        references: true,
        world: true,
        model: true,
        cover: true,
        preview: true,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/export/history
export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await requireAuth();
    const userId = session.user.id;
    const exportHistory = await exportService.getExportHistory(userId);

    return NextResponse.json(exportHistory, { status: 200 });
  } catch (error) {
    console.error('Get export history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}