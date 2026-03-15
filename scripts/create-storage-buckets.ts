import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://dhkgfdllgtmbkwcbubqt.supabase.co';
const supabaseKey = '*********************************************************************************************************************************************************************************************************';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBuckets() {
  console.log('📦 Creating Supabase Storage buckets...\n');
  
  const buckets = [
    {
      name: 'avatars',
      public: true,
      allowedMimeTypes: ['image/webp', 'image/png', 'image/jpeg'],
      maxFileSize: 512 * 1024, // 512 KB
      description: 'User avatars'
    },
    {
      name: 'character-covers',
      public: true,
      allowedMimeTypes: ['image/webp', 'image/png', 'image/jpeg'],
      maxFileSize: 800 * 1024, // 800 KB
      description: 'Character cover images'
    },
    {
      name: 'model-previews',
      public: true,
      allowedMimeTypes: ['image/webp', 'image/png', 'image/jpeg'],
      maxFileSize: 600 * 1024, // 600 KB
      description: 'Character model preview images'
    },
    {
      name: 'models',
      public: false,
      allowedMimeTypes: ['model/gltf-binary', 'application/octet-stream'],
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      description: '3D model files'
    }
  ];
  
  for (const bucketConfig of buckets) {
    try {
      console.log(`🔄 Creating bucket: ${bucketConfig.name}`);
      
      const { data, error } = await supabase.storage.createBucket(bucketConfig.name, {
        public: bucketConfig.public,
        allowedMimeTypes: bucketConfig.allowedMimeTypes,
        fileSizeLimit: bucketConfig.maxFileSize
      });
      
      if (error) {
        // Check if error is a StorageError and has a code property
        if ('code' in error && error.code === '409') {
          console.log(`   ⚠️  Bucket ${bucketConfig.name} already exists`);
        } else {
          console.error(`   ❌ Failed to create bucket ${bucketConfig.name}:`, error);
        }
      } else {
        console.log(`   ✅ Bucket ${bucketConfig.name} created successfully`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error creating bucket ${bucketConfig.name}:`, error);
    }
  }
  
  console.log('\n📋 Bucket creation complete!');
  console.log('\nNext steps:');
  console.log('1. Verify buckets in Supabase Dashboard');
  console.log('2. Set up RLS policies');
  console.log('3. Implement storage path management code');
}

createBuckets();
