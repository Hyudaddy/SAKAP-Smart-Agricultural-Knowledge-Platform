// Test script to check frontend connection to backend
const API_BASE_URL = 'http://localhost:5031/api';

async function testFrontendConnection() {
  console.log('Testing Frontend Connection to Backend...\n');

  try {
    // Test 1: Fetch all library content
    console.log('1. Fetching all library content...');
    const contentResponse = await fetch(`${API_BASE_URL}/content/library`);
    console.log('   Response status:', contentResponse.status);
    console.log('   Response OK:', contentResponse.ok);
    
    if (!contentResponse.ok) {
      const errorText = await contentResponse.text();
      console.log('   Error response:', errorText);
      throw new Error(`HTTP error! status: ${contentResponse.status}`);
    }
    
    const contentType = contentResponse.headers.get('content-type');
    console.log('   Content-Type:', contentType);
    
    const contentData = await contentResponse.json();
    console.log('   Success:', contentData.success);
    console.log('   Content count:', contentData.data?.content?.length || 0);
    
    if (contentData.data?.content?.length > 0) {
      const firstContent = contentData.data.content[0];
      console.log('   First content ID:', firstContent.id);
      console.log('   First content title:', firstContent.title);
      console.log('   First content likes:', firstContent.like_count);
      console.log('   First content views:', firstContent.view_count);
      console.log('   First content downloads:', firstContent.download_count);
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Error details:', error);
  }
}

// Run the test
testFrontendConnection();