// Test script for news service
// This script can be used to verify that the news service works correctly

const { newsService } = require('./frontend/src/services/newsService');

async function testNewsService() {
  console.log('Testing news service...');
  
  try {
    // Test fetching all news
    console.log('Fetching all news...');
    const allNews = await newsService.getAllNews();
    console.log(`Found ${allNews.length} news articles`);
    
    // Test fetching published news
    console.log('Fetching published news...');
    const publishedNews = await newsService.getPublishedNews();
    console.log(`Found ${publishedNews.length} published news articles`);
    
    // Test creating a news article (this will only work if Supabase is properly configured)
    console.log('Creating a test news article...');
    const testNews = {
      title: 'Test Article',
      content: 'This is a test article created by the test script.',
      author_id: 'ATI-ADMIN-001',
      author_name: 'Test Admin',
      category: 'test',
      is_published: true,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const createdNews = await newsService.createNews(testNews);
    console.log('Created news article with ID:', createdNews.id);
    
    console.log('News service test completed successfully!');
  } catch (error) {
    console.error('Error testing news service:', error.message);
  }
}

// Run the test
testNewsService();