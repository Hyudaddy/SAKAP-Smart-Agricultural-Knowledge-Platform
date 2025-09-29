// Test script to check PDF URL format
const API_BASE_URL = 'http://localhost:5031/api';

async function testPdfUrlFormat() {
  console.log('Testing PDF URL Format...\n');

  try {
    // Fetch all library content
    console.log('1. Fetching all library content...');
    const response = await fetch(`${API_BASE_URL}/content/library`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('   Success:', data.success);
    console.log('   Content count:', data.data?.content?.length || 0);
    
    if (data.data?.content?.length > 0) {
      console.log('\n2. Analyzing PDF URLs...');
      data.data.content.forEach((content, index) => {
        if (content.content_type.toLowerCase() === 'pdf') {
          console.log(`   PDF Content ${index + 1}:`);
          console.log(`     Title: ${content.title}`);
          console.log(`     File URL: ${content.file_url}`);
          console.log(`     Full URL: http://localhost:5031${content.file_url}`);
          console.log(`     Google Docs Viewer URL: https://docs.google.com/gviewer?url=${encodeURIComponent('http://localhost:5031' + content.file_url)}&embedded=true`);
        }
      });
    }
    
    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPdfUrlFormat();