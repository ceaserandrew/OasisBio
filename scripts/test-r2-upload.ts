import { uploadToR2, r2Path } from '../src/lib/cloudflare-r2';
import * as fs from 'fs';
import * as path from 'path';

// Test R2 upload functionality
async function testR2Upload() {
  try {
    // Read test model file
    const testModelPath = path.join(__dirname, '../assets/deo/deo_model/cartoon+dragon+3d+model.obj');
    const testModelBuffer = fs.readFileSync(testModelPath);
    
    // Create a mock File object
    const mockFile = new Blob([testModelBuffer], { type: 'model/obj' });
    
    // Test upload to R2
    const userId = 'test-user-123';
    const characterId = 'test-character-456';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Test model upload
    const modelPath = r2Path.model.getPath(userId, characterId, 'obj');
    console.log('Uploading model to R2:', modelPath);
    
    const uploadResult = await uploadToR2(modelPath, testModelBuffer, 'model/obj');
    console.log('Upload successful:', uploadResult);
    
    // Test getting signed URL
    const modelUrl = await r2Path.model.getUrl(userId, characterId, 'obj');
    console.log('Model signed URL:', modelUrl);
    
    // Test history path
    const historyPath = r2Path.model.getHistoryPath(userId, characterId, timestamp, 'obj');
    console.log('History path:', historyPath);
    
    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run test
testR2Upload();