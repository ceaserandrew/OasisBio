import { createWriteStream, ReadStream } from 'fs';
import { join, basename } from 'path';
import { tmpdir } from 'os';
import archiver from 'archiver';
import { prisma } from '@/lib/prisma';
import { storage } from '@/lib/storage';
import { r2Path, uploadToR2 } from '@/lib/cloudflare-r2';

interface ExportOptions {
  userId: string;
  characterIds: string[];
  type: 'single' | 'batch';
  include: {
    character: boolean;
    dcos: boolean;
    references: boolean;
    world: boolean;
    model: boolean;
    cover: boolean;
    preview: boolean;
  };
}

interface ExportResult {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  characters: number;
  timestamp: string;
}

interface ExportHistoryItem {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  characterCount: number;
  timestamp: string;
}

class ExportService {
  // Export characters
  async exportCharacters(options: ExportOptions): Promise<ExportResult> {
    const { userId, characterIds, type, include } = options;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Create temporary directory for export
    const tempDir = tmpdir();
    const exportDir = join(tempDir, `oasisbio-export-${timestamp}`);

    // Create archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    const zipPath = join(tempDir, `${type === 'single' ? 'character' : 'batch'}-export-${timestamp}.zip`);
    const output = createWriteStream(zipPath);

    // Wait for archive to finish
    await new Promise<void>((resolve, reject) => {
      output.on('close', resolve);
      archive.on('error', reject);
      archive.pipe(output);
    });

    // Process each character
    let totalSize = 0;
    for (const characterId of characterIds) {
      // Get character data
      const character = await prisma.oasisBio.findUnique({
        where: { id: characterId },
        include: {
          abilities: true,
          dcosFiles: include.dcos,
          references: include.references,
          worlds: include.world,
        },
      });

      if (!character) continue;

      const characterDir = type === 'single' ? '' : character.title;

      // Add character JSON
      if (include.character) {
        const characterData = {
          id: character.id,
          name: character.title,
          birthday: character.birthDate,
          gender: character.gender,
          abilities: character.abilities || [],
          tags: '',
          world_id: character.worlds?.[0]?.id,
          dcos_ids: character.dcosFiles?.map(d => d.id) || [],
        };
        archive.append(JSON.stringify(characterData, null, 2), {
          name: join(characterDir, 'character.json'),
        });
      }

      // Add DCOS files
      if (include.dcos && character.dcosFiles && character.dcosFiles.length > 0) {
        for (const dcos of character.dcosFiles) {
          archive.append(dcos.content, {
            name: join(characterDir, `dcos.md`),
          });
        }
      }

      // Add references
      if (include.references && character.references && character.references.length > 0) {
        const referencesCsv = 'Title,URL,Notes\n' + character.references
          .map(ref => `${ref.title},${ref.url},${ref.description || ''}`)
          .join('\n');
        archive.append(referencesCsv, {
          name: join(characterDir, 'references.csv'),
        });
      }

      // Add world data
      if (include.world && character.worlds && character.worlds.length > 0) {
        const world = character.worlds[0];
        const worldData = {
          id: world.id,
          name: world.name,
          summary: world.summary,
          time_structure: world.timeSetting,
          world_rules: world.physicsRules,
          civilization: world.socialStructure,
          environment: world.aestheticKeywords,
          narrative_context: world.majorConflict,
        };
        archive.append(JSON.stringify(worldData, null, 2), {
          name: join(characterDir, 'world.json'),
        });
      }

      // Add 3D model
      if (include.model) {
        try {
          // Get model URL from R2
          const modelUrl = await storage.getUrl({
            type: 'model',
            userId,
            characterId,
          });

          // Download model and add to archive
          // This would require additional logic to download the file
          // For simplicity, we'll skip this step in the initial implementation
        } catch (error) {
          console.error('Error adding model to export:', error);
        }
      }

      // Add cover and preview images
      if (include.cover) {
        try {
          // Get cover URL from Supabase
          // This would require additional logic to download the file
          // For simplicity, we'll skip this step in the initial implementation
        } catch (error) {
          console.error('Error adding cover to export:', error);
        }
      }

      if (include.preview) {
        try {
          // Get preview URL from Supabase
          // This would require additional logic to download the file
          // For simplicity, we'll skip this step in the initial implementation
        } catch (error) {
          console.error('Error adding preview to export:', error);
        }
      }
    }

    // Finalize archive
    await archive.finalize();

    // Get file size
    const fileSize = output.bytesWritten;
    totalSize += fileSize;

    // Upload to R2
    const fileName = basename(zipPath);
    const r2Key = r2Path.export.getPath(userId, timestamp, fileName);

    // Read the zip file and upload to R2
    const fs = require('fs');
    const zipBuffer = fs.readFileSync(zipPath);

    await uploadToR2(r2Key, zipBuffer, 'application/zip');

    // Get signed URL for download
    const downloadUrl = await r2Path.export.getUrl(userId, timestamp, fileName);

    // Record export history
    await this.recordExportHistory({
      userId,
      fileName,
      fileSize,
      characterCount: characterIds.length,
      timestamp,
    });

    // Clean up temporary files
    fs.unlinkSync(zipPath);

    return {
      downloadUrl,
      fileName,
      fileSize,
      characters: characterIds.length,
      timestamp,
    };
  }

  // Get export history
  async getExportHistory(userId: string): Promise<ExportHistoryItem[]> {
    const history = await prisma.exportHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3, // Limit to 3 most recent exports
    });

    return history.map(item => ({
      id: item.id,
      userId: item.userId,
      fileName: item.fileName,
      fileSize: item.fileSize,
      characterCount: item.characterCount,
      timestamp: item.createdAt.toISOString(),
    }));
  }

  // Record export history
  private async recordExportHistory(data: {
    userId: string;
    fileName: string;
    fileSize: number;
    characterCount: number;
    timestamp: string;
  }) {
    await prisma.exportHistory.create({
      data: {
        userId: data.userId,
        fileName: data.fileName,
        fileSize: data.fileSize,
        characterCount: data.characterCount,
      },
    });

    // Clean up old export history (keep only 3 most recent)
    const history = await prisma.exportHistory.findMany({
      where: { userId: data.userId },
      orderBy: { createdAt: 'desc' },
      skip: 3,
    });

    for (const item of history) {
      await prisma.exportHistory.delete({ where: { id: item.id } });
    }
  }
}

export const exportService = new ExportService();