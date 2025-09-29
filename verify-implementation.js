// Verification script for the library likes feature implementation
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Library Likes Feature Implementation...\n');

// List of files that should exist after implementation
const expectedFiles = [
  'backend/src/services/libraryService.ts',
  'backend/src/controllers/ContentController.ts',
  'backend/src/routes/content.ts',
  'frontend/src/pages/ManageELibrary.tsx',
  'frontend/src/pages/ELibrary.tsx',
  'shared/types/index.ts',
  'supabase_library_content_table.sql',
  'supabase_library_likes_table.sql',
  'supabase_schema.sql'
];

// List of key features to verify
const featuresToVerify = [
  'Database schema updated with like_count column',
  'library_content_likes table created',
  'Backend API endpoints for likes implemented',
  'Frontend components updated to use real data',
  'Like functionality integrated with API',
  'View and download tracking implemented'
];

// Check if expected files exist
console.log('📁 Checking for expected files...');
let filesFound = 0;
expectedFiles.forEach(file => {
  const fullPath = path.join('d:\\sakap-agri-assist-main', file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
    filesFound++;
  } else {
    console.log(`  ❌ ${file}`);
  }
});

console.log(`\n📊 Files found: ${filesFound}/${expectedFiles.length}\n`);

// Check for key implementation details
console.log('🔍 Verifying implementation details...\n');

// Check LibraryService for like methods
try {
  const libraryService = fs.readFileSync('d:\\sakap-agri-assist-main\\backend\\src\\services\\libraryService.ts', 'utf8');
  const hasLikeMethods = libraryService.includes('addLikeToContent') && 
                        libraryService.includes('removeLikeFromContent') && 
                        libraryService.includes('hasUserLikedContent');
  
  if (hasLikeMethods) {
    console.log('  ✅ LibraryService has like functionality methods');
  } else {
    console.log('  ❌ LibraryService missing like functionality methods');
  }
} catch (err) {
  console.log('  ❌ Could not read LibraryService file');
}

// Check ContentController for like endpoint
try {
  const contentController = fs.readFileSync('d:\\sakap-agri-assist-main\\backend\\src\\controllers\\ContentController.ts', 'utf8');
  const hasLikeEndpoint = contentController.includes('toggleLike');
  
  if (hasLikeEndpoint) {
    console.log('  ✅ ContentController has like endpoint');
  } else {
    console.log('  ❌ ContentController missing like endpoint');
  }
} catch (err) {
  console.log('  ❌ Could not read ContentController file');
}

// Check frontend components for real data usage
try {
  const manageELibrary = fs.readFileSync('d:\\sakap-agri-assist-main\\frontend\\src\\pages\\ManageELibrary.tsx', 'utf8');
  const usesRealData = manageELibrary.includes('fetch(') && manageELibrary.includes('/api/content/library');
  
  if (usesRealData) {
    console.log('  ✅ ManageELibrary uses real data from API');
  } else {
    console.log('  ❌ ManageELibrary not using real data from API');
  }
} catch (err) {
  console.log('  ❌ Could not read ManageELibrary file');
}

try {
  const eLibrary = fs.readFileSync('d:\\sakap-agri-assist-main\\frontend\\src\\pages\\ELibrary.tsx', 'utf8');
  const hasLikeFunctionality = eLibrary.includes('handleLike') && eLibrary.includes('/api/content/library');
  
  if (hasLikeFunctionality) {
    console.log('  ✅ ELibrary has like functionality');
  } else {
    console.log('  ❌ ELibrary missing like functionality');
  }
} catch (err) {
  console.log('  ❌ Could not read ELibrary file');
}

// Check database schema for like_count column
try {
  const dbSchema = fs.readFileSync('d:\\sakap-agri-assist-main\\supabase_schema.sql', 'utf8');
  const hasLikeCount = dbSchema.includes('like_count INTEGER DEFAULT 0');
  const hasLikesTable = dbSchema.includes('CREATE TABLE IF NOT EXISTS library_content_likes');
  
  if (hasLikeCount) {
    console.log('  ✅ Database schema has like_count column');
  } else {
    console.log('  ❌ Database schema missing like_count column');
  }
  
  if (hasLikesTable) {
    console.log('  ✅ Database schema has library_content_likes table');
  } else {
    console.log('  ❌ Database schema missing library_content_likes table');
  }
} catch (err) {
  console.log('  ❌ Could not read database schema file');
}

console.log('\n' + '='.repeat(50));
console.log('✅ VERIFICATION COMPLETE');
console.log('='.repeat(50));

if (filesFound === expectedFiles.length) {
  console.log('\n🎉 All expected files are present!');
} else {
  console.log(`\n⚠️  ${expectedFiles.length - filesFound} files are missing`);
}

console.log('\n📝 Next steps:');
console.log('1. Start the development server: npm run dev');
console.log('2. Visit http://localhost:8083/library to see the user-facing library');
console.log('3. Visit http://localhost:8083/manage-library to see the admin library management');
console.log('4. Log in as an admin user to test the full functionality');
console.log('5. Like some content and see the like counts update in real-time');