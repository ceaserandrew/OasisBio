import { createReadStream } from 'fs';
import { join, basename } from 'path';
import { tmpdir } from 'os';
import unzipper from 'unzipper';
import { prisma } from '@/lib/prisma';
import { storage } from '@/lib/storage';

interface ImportOptions {
  userId: string;
  file: File;
}

interface ImportResult {
  imported: number;
  updated: number;
  failed: number;
  errors: string[];
}

interface ProcessResult {
  success: boolean;
  updated?: boolean;
  error?: string;
}

class ImportService {
  // Import characters from ZIP file
  async importCharacters(options: ImportOptions): Promise<ImportResult> {
    const { userId, file } = options;
    const tempDir = tmpdir();
    const importDir = join(tempDir, `oasisbio-import-${Date.now()}`);

    let imported = 0;
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Create temporary file
      const tempFile = join(tempDir, `import-${Date.now()}.zip`);
      const fs = require('fs');
      fs.writeFileSync(tempFile, buffer);

      // Extract ZIP file
      await this.extractZip(tempFile, importDir);

      // Read extracted files
      const extractedFiles = fs.readdirSync(importDir);

      // Process each character directory
      for (const item of extractedFiles) {
        const itemPath = join(importDir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          // This is a character directory (batch export)
          const result = await this.processCharacterDirectory(userId, itemPath);
          if (result.success) {
            if (result.updated) {
              updated++;
            } else {
              imported++;
            }
          } else {
            failed++;
            errors.push(result.error || 'Failed to import character');
          }
        } else if (item === 'character.json') {
          // This is a single character export
          const result = await this.processSingleCharacter(userId, importDir);
          if (result.success) {
            if (result.updated) {
              updated++;
            } else {
              imported++;
            }
          } else {
            failed++;
            errors.push(result.error || 'Failed to import character');
          }
        }
      }

      // Clean up temporary files
      fs.unlinkSync(tempFile);
      this.removeDir(importDir);

      return {
        imported,
        updated,
        failed,
        errors,
      };
    } catch (error) {
      console.error('Import error:', error);
      return {
        imported: 0,
        updated: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Import failed'],
      };
    }
  }

  // Extract ZIP file
  private async extractZip(zipPath: string, targetDir: string): Promise<void> {
    const fs = require('fs');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: targetDir }))
        .on('close', resolve)
        .on('error', reject);
    });
  }

  // Process character directory (batch export)
  private async processCharacterDirectory(userId: string, directoryPath: string): Promise<ProcessResult> {
    const fs = require('fs');
    const characterJsonPath = join(directoryPath, 'character.json');

    if (!fs.existsSync(characterJsonPath)) {
      return { success: false, error: 'character.json not found' };
    }

    try {
      const characterData = JSON.parse(fs.readFileSync(characterJsonPath, 'utf8'));
      return await this.createOrUpdateCharacter(userId, characterData, directoryPath);
    } catch (error) {
      return { success: false, error: `Failed to read character.json: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Process single character export
  private async processSingleCharacter(userId: string, directoryPath: string): Promise<ProcessResult> {
    const fs = require('fs');
    const characterJsonPath = join(directoryPath, 'character.json');

    if (!fs.existsSync(characterJsonPath)) {
      return { success: false, error: 'character.json not found' };
    }

    try {
      const characterData = JSON.parse(fs.readFileSync(characterJsonPath, 'utf8'));
      return await this.createOrUpdateCharacter(userId, characterData, directoryPath);
    } catch (error) {
      return { success: false, error: `Failed to read character.json: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Create or update character
  private async createOrUpdateCharacter(userId: string, characterData: any, directoryPath: string) {
    try {
      // Check if character already exists
      const existingCharacter = await prisma.oasisBio.findFirst({
        where: {
          userId,
          slug: this.generateSlug(characterData.name),
        },
      });

      // Create or update character
      let character;
      if (existingCharacter) {
        // Update existing character
        character = await prisma.oasisBio.update({
          where: { id: existingCharacter.id },
          data: {
            title: characterData.name,
            birthDate: characterData.birthday,
            gender: characterData.gender,
          },
        });
      } else {
        // Create new character
        character = await prisma.oasisBio.create({
          data: {
            userId,
            title: characterData.name,
            slug: this.generateSlug(characterData.name),
            birthDate: characterData.birthday,
            gender: characterData.gender,
            visibility: 'private',
          },
        });
      }

      // Process DCOS files
      await this.processDcosFiles(userId, character.id, directoryPath);

      // Process references
      await this.processReferences(userId, character.id, directoryPath);

      // Process world data
      await this.processWorldData(userId, character.id, directoryPath);

      // Process 3D model
      await this.processModel(userId, character.id, directoryPath);

      // Process cover and preview images
      await this.processImages(userId, character.id, directoryPath);

      return { success: true, updated: !!existingCharacter };
    } catch (error) {
      return { success: false, error: `Failed to create/update character: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // Process DCOS files
  private async processDcosFiles(userId: string, characterId: string, directoryPath: string) {
    const fs = require('fs');
    const dcosPath = join(directoryPath, 'dcos.md');

    if (fs.existsSync(dcosPath)) {
      try {
        const content = fs.readFileSync(dcosPath, 'utf8');
        const title = content.match(/^# DCOS: (.*)$/m)?.[1] || 'DCOS';

        // Check if DCOS already exists
        const existingDcos = await prisma.dcosFile.findFirst({
          where: {
            oasisBioId: characterId,
            title,
          },
        });

        if (existingDcos) {
          // Update existing DCOS
          await prisma.dcosFile.update({
            where: { id: existingDcos.id },
            data: {
              content,
            },
          });
        } else {
          // Create new DCOS
          await prisma.dcosFile.create({
            data: {
              oasisBioId: characterId,
              title,
              slug: this.generateSlug(title),
              content,
              folderPath: '/',
              status: 'draft',
            },
          });
        }
      } catch (error) {
        console.error('Failed to process DCOS files:', error);
      }
    }
  }

  // Process references
  private async processReferences(userId: string, characterId: string, directoryPath: string) {
    const fs = require('fs');
    const referencesPath = join(directoryPath, 'references.csv');

    if (fs.existsSync(referencesPath)) {
      try {
        const content = fs.readFileSync(referencesPath, 'utf8');
        const lines = content.split('\n').slice(1); // Skip header

        for (const line of lines) {
          if (line.trim()) {
            const [title, url, notes] = line.split(',');
            if (title && url) {
              // Check if reference already exists
              const existingReference = await prisma.referenceItem.findFirst({
                where: {
                  oasisBioId: characterId,
                  url,
                },
              });

              if (existingReference) {
                await prisma.referenceItem.update({
                  where: { id: existingReference.id },
                  data: {
                    title: title.trim(),
                    description: notes?.trim(),
                  },
                });
              } else {
                await prisma.referenceItem.create({
                  data: {
                    oasisBioId: characterId,
                    url: url.trim(),
                    title: title.trim(),
                    description: notes?.trim(),
                    sourceType: 'web',
                    tags: '',
                  },
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to process references:', error);
      }
    }
  }

  // Process world data
  private async processWorldData(userId: string, characterId: string, directoryPath: string) {
    const fs = require('fs');
    const worldPath = join(directoryPath, 'world.json');

    if (fs.existsSync(worldPath)) {
      try {
        const worldData = JSON.parse(fs.readFileSync(worldPath, 'utf8'));

        // Check if world already exists
        const existingWorld = await prisma.worldItem.findFirst({
          where: {
            oasisBioId: characterId,
            name: worldData.name,
          },
        });

        if (existingWorld) {
          // Update existing world
          await prisma.worldItem.update({
            where: { id: existingWorld.id },
            data: {
              summary: worldData.summary,
              timeSetting: worldData.time_structure,
              physicsRules: worldData.world_rules,
              socialStructure: worldData.civilization,
              aestheticKeywords: worldData.environment,
            },
          });
        } else {
          // Create new world
          await prisma.worldItem.create({
            data: {
              oasisBioId: characterId,
              name: worldData.name,
              summary: worldData.summary,
              timeSetting: worldData.time_structure,
              physicsRules: worldData.world_rules,
              socialStructure: worldData.civilization,
              aestheticKeywords: worldData.environment,
              visibility: 'private',
            },
          });
        }
      } catch (error) {
        console.error('Failed to process world data:', error);
      }
    }
  }

  // Process 3D model
  private async processModel(userId: string, characterId: string, directoryPath: string) {
    const fs = require('fs');
    const modelPath = join(directoryPath, 'model.glb');

    if (fs.existsSync(modelPath)) {
      try {
        const modelFile = fs.readFileSync(modelPath);
        const modelBlob = new Blob([modelFile], { type: 'model/gltf-binary' });

        // Upload model to R2
        const uploadResult = await storage.upload(modelBlob as File, {
          type: 'model',
          userId,
          characterId,
        });

        const filePath = uploadResult.key;

        // Update or create model item
        const existingModel = await prisma.modelItem.findFirst({
          where: {
            oasisBioId: characterId,
            isPrimary: true,
          },
        });

        if (existingModel) {
          await prisma.modelItem.update({
            where: { id: existingModel.id },
            data: {
              filePath,
              modelFormat: 'glb',
              version: { increment: 1 },
            },
          });
        } else {
          await prisma.modelItem.create({
            data: {
              oasisBioId: characterId,
              filePath,
              name: 'Model',
              modelFormat: 'glb',
              isPrimary: true,
            },
          });
        }
      } catch (error) {
        console.error('Failed to process model:', error);
      }
    }
  }

  // Process cover and preview images
  private async processImages(userId: string, characterId: string, directoryPath: string) {
    const fs = require('fs');

    // Process cover image
    const coverPath = join(directoryPath, 'cover.webp');
    if (fs.existsSync(coverPath)) {
      try {
        const coverFile = fs.readFileSync(coverPath);
        const coverBlob = new Blob([coverFile], { type: 'image/webp' });

        // Upload cover to Supabase
        await storage.upload(coverBlob as File, {
          type: 'character-cover',
          userId,
          characterId,
        });
      } catch (error) {
        console.error('Failed to process cover image:', error);
      }
    }

    // Process preview image
    const previewPath = join(directoryPath, 'preview.webp');
    if (fs.existsSync(previewPath)) {
      try {
        const previewFile = fs.readFileSync(previewPath);
        const previewBlob = new Blob([previewFile], { type: 'image/webp' });

        // Upload preview to Supabase
        await storage.upload(previewBlob as File, {
          type: 'model-preview',
          userId,
          characterId,
        });
      } catch (error) {
        console.error('Failed to process preview image:', error);
      }
    }
  }

  // Generate slug from string
  private generateSlug(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Remove directory recursively
  private removeDir(path: string) {
    const fs = require('fs');
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path);
      for (const file of files) {
        const curPath = join(path, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          this.removeDir(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      }
      fs.rmdirSync(path);
    }
  }
}

export const importService = new ImportService();