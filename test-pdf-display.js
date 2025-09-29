// Test script to check PDF display issues
const API_BASE_URL = 'http://localhost:5031/api';

async function testPdfDisplay() {
  console.log('Testing PDF Display Issues...\n');

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
      console.log('\n2. Analyzing content types and URLs...');
      data.data.content.forEach((content, index) => {
        console.log(`   Content ${index + 1}:`);
        console.log(`     ID: ${content.id}`);
        console.log(`     Title: ${content.title}`);
        console.log(`     Type: ${content.content_type}`);
        console.log(`     URL: ${content.file_url}`);
        
        // Check if it's a PDF
        if (content.content_type.toLowerCase() === 'pdf') {
          console.log(`     ⚠️  This is a PDF - checking URL accessibility...`);
          
          // Try to access the PDF URL directly
          fetch(`http://localhost:5031${content.file_url}`)
            .then(pdfResponse => {
              console.log(`     PDF URL status: ${pdfResponse.status}`);
              console.log(`     PDF URL OK: ${pdfResponse.ok}`);
              console.log(`     Content-Type: ${pdfResponse.headers.get('content-type')}`);
            })
            .catch(err => {
              console.log(`     ❌ Error accessing PDF: ${err.message}`);
            });
        }
      });
    }
    
    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPdfDisplay();