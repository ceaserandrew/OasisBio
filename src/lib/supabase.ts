import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Storage bucket names
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  CHARACTER_COVERS: 'character-covers',
  MODEL_PREVIEWS: 'model-previews',
  MODELS: 'models',
} as const;

// Storage path utilities
export const storagePath = {
  // Avatar paths
  avatar: {
    /**
     * Get avatar file path
     * @param userId - User ID
     * @param extension - File extension (default: webp)
     */
    getPath: (userId: string, extension: string = 'webp'): string => {
      return `${userId}/avatar.${extension}`;
    },
    
    /**
     * Get avatar URL
     * @param userId - User ID
     * @param extension - File extension (default: webp)
     */
    getUrl: (userId: string, extension: string = 'webp'): string => {
      const path = storagePath.avatar.getPath(userId, extension);
      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .getPublicUrl(path);
      return data.publicUrl;
    },
  },
  
  // Character cover paths
  characterCover: {
    /**
     * Get character cover file path
     * @param userId - User ID
     * @param characterId - Character ID
     * @param extension - File extension (default: webp)
     */
    getPath: (userId: string, characterId: string, extension: string = 'webp'): string => {
      return `${userId}/${characterId}/cover.${extension}`;
    },
    
    /**
     * Get character cover URL
     * @param userId - User ID
     * @param characterId - Character ID
     * @param extension - File extension (default: webp)
     */
    getUrl: (userId: string, characterId: string, extension: string = 'webp'): string => {
      const path = storagePath.characterCover.getPath(userId, characterId, extension);
      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.CHARACTER_COVERS)
        .getPublicUrl(path);
      return data.publicUrl;
    },
  },
  
  // Model preview paths
  modelPreview: {
    /**
     * Get model preview file path
     * @param userId - User ID
     * @param characterId - Character ID
     * @param extension - File extension (default: webp)
     */
    getPath: (userId: string, characterId: string, extension: string = 'webp'): string => {
      return `${userId}/${characterId}/preview.${extension}`;
    },
    
    /**
     * Get model preview URL
     * @param userId - User ID
     * @param characterId - Character ID
     * @param extension - File extension (default: webp)
     */
    getUrl: (userId: string, characterId: string, extension: string = 'webp'): string => {
      const path = storagePath.modelPreview.getPath(userId, characterId, extension);
      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.MODEL_PREVIEWS)
        .getPublicUrl(path);
      return data.publicUrl;
    },
  },
  
  // 3D model paths
  model: {
    /**
     * Get 3D model file path
     * @param userId - User ID
     * @param characterId - Character ID
     * @param modelId - Model ID
     * @param extension - File extension (default: glb)
     */
    getPath: (userId: string, characterId: string, modelId: string, extension: string = 'glb'): string => {
      return `${userId}/${characterId}/${modelId}.${extension}`;
    },
    
    /**
     * Get 3D model URL (signed URL for private bucket)
     * @param userId - User ID
     * @param characterId - Character ID
     * @param modelId - Model ID
     * @param extension - File extension (default: glb)
     * @param expiresIn - Expiration time in seconds (default: 3600)
     */
    getUrl: async (userId: string, characterId: string, modelId: string, extension: string = 'glb', expiresIn: number = 3600): Promise<string> => {
      const path = storagePath.model.getPath(userId, characterId, modelId, extension);
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.MODELS)
        .createSignedUrl(path, expiresIn);
      
      if (error) {
        console.error('Error getting model URL:', error);
        throw error;
      }
      
      return data.signedUrl;
    },
  },
};

// File naming utilities
export const generateFileName = (
  prefix: string,
  extension: string,
  includeTimestamp: boolean = true
): string => {
  const timestamp = includeTimestamp ? `_${Date.now()}` : '';
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}_${random}.${extension}`;
};

// File validation utilities
export const validateFile = (file: File, options: {
  maxSize: number;
  allowedTypes: string[];
}): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${(options.maxSize / 1024 / 1024).toFixed(1)} MB`,
    };
  }
  
  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`,
    };
  }
  
  return { valid: true };
};

// Upload utilities
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string;
    upsert?: boolean;
  }
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || true,
    });
  
  if (error) {
    console.error('Upload error:', error);
    throw error;
  }
  
  return data;
};

// Delete utilities
export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) {
    console.error('Delete error:', error);
    throw error;
  }
  
  return true;
};

export default supabase;
