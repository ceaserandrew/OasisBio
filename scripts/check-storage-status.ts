import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorageStatus() {
  console.log('🔍 Checking Supabase Storage status...\n');
  
  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Failed to list buckets:', bucketsError);
      process.exit(1);
    }
    
    console.log('📦 Existing buckets:');
    if (buckets.length === 0) {
      console.log('   - No buckets');
    } else {
      buckets.forEach((bucket, index) => {
        console.log(`   ${index + 1}. ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
        console.log(`      - Owner: ${bucket.owner}`);
        console.log(`      - Created: ${new Date(bucket.created_at).toLocaleString()}`);
        console.log(`      - Last updated: ${bucket.updated_at ? new Date(bucket.updated_at).toLocaleString() : 'N/A'}`);
      });
    }
    
    console.log('\n📋 Recommended buckets:');
    console.log('   - avatars (public)');
    console.log('   - character-covers (public)');
    console.log('   - model-previews (public)');
    console.log('   - models (private)');
    
  } catch (error) {
    console.error('❌ Failed to check storage status:', error);
    process.exit(1);
  }
}

checkStorageStatus();
