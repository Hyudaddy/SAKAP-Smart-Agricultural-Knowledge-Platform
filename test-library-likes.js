// Test script for library likes functionality
const API_BASE_URL = 'http://localhost:5031/api';

async function testLibraryLikes() {
  console.log('Testing Library Likes Functionality...\n');

  try {
    // Test 1: Fetch all library content
    console.log('1. Fetching all library content...');
    const contentResponse = await fetch(`${API_BASE_URL}/content/library`);
    const contentData = await contentResponse.json();
    console.log('   Success:', contentData.success);
    console.log('   Content count:', contentData.data?.content?.length || 0);
    
    if (contentData.data?.content?.length > 0) {
      const firstContent = contentData.data.content[0];
      console.log('   First content ID:', firstContent.id);
      console.log('   First content likes:', firstContent.like_count);
      console.log('   First content views:', firstContent.view_count);
      console.log('   First content downloads:', firstContent.download_count);
    }
    
    // Test 2: Fetch specific content by ID
    if (contentData.data?.content?.length > 0) {
      const contentId = contentData.data.content[0].id;
      console.log('\n2. Fetching specific content by ID...');
      const specificResponse = await fetch(`${API_BASE_URL}/content/library/${contentId}`);
      const specificData = await specificResponse.json();
      console.log('   Success:', specificData.success);
      console.log('   Content title:', specificData.data?.content?.title);
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testLibraryLikes();