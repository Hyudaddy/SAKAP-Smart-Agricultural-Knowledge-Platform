// Test script to check library content creation page
console.log('Testing Library Content Creation Page...\n');

// Check if the page exists by trying to access it
fetch('http://localhost:8081/create-library-content')
  .then(response => {
    console.log('Page access test:');
    console.log('  Status:', response.status);
    console.log('  OK:', response.ok);
    return response.text();
  })
  .then(html => {
    // Check if the page contains expected content
    const hasExpectedContent = html.includes('Add New Library Content') || html.includes('Create Content');
    console.log('  Contains expected content:', hasExpectedContent);
    
    if (hasExpectedContent) {
      console.log('✅ Library content creation page is accessible');
    } else {
      console.log('⚠️  Page exists but may not have expected content');
    }
  })
  .catch(error => {
    console.log('❌ Error accessing page:', error.message);
  });

// Test the API endpoint for creating content
console.log('\nTesting API endpoint for content creation...');

// First, check if we can fetch existing content
fetch('http://localhost:5031/api/content/library')
  .then(response => response.json())
  .then(data => {
    console.log('Library content fetch test:');
    console.log('  Success:', data.success);
    console.log('  Content count:', data.data?.content?.length || 0);
    
    if (data.success) {
      console.log('✅ Library content API is working');
    } else {
      console.log('❌ Library content API error:', data.message);
    }
  })
  .catch(error => {
    console.log('❌ Error fetching library content:', error.message);
  });