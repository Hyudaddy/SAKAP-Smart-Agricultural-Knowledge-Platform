// Test script for auth service
// This script can be used to verify that the auth service works correctly

// Mock localStorage for Node.js environment
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  }
};

// Mock fetch for Node.js environment
global.fetch = async (url, options) => {
  console.log(`Fetching ${url} with options:`, options);
  
  // Simulate a successful response for testing
  if (url.includes('/api/auth/login')) {
    return {
      json: async () => ({
        success: true,
        data: {
          user: {
            id: 'ATI-ADMIN-001',
            name: 'Test Admin',
            email: 'admin@test.com',
            role: 'admin'
          },
          token: 'test-jwt-token'
        }
      })
    };
  }
  
  if (url.includes('/api/content/news') && options.method === 'POST') {
    // Check if authorization header is present
    if (options.headers && options.headers.Authorization) {
      return {
        json: async () => ({
          success: true,
          data: {
            news: {
              id: 'NEWS-0001',
              title: 'Test News Article',
              content: 'This is a test news article',
              author_id: 'ATI-ADMIN-001',
              author_name: 'Test Admin',
              category: 'test',
              is_published: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
        })
      };
    } else {
      return {
        json: async () => ({
          success: false,
          message: 'Access denied. No token provided.'
        })
      };
    }
  }
  
  return {
    json: async () => ({ success: true, data: { news: [] } })
  };
};

// Test the auth service and news service
async function testServices() {
  console.log('Testing auth service and news service...');
  
  try {
    // Import the services
    const { authService } = require('./frontend/src/services/authService');
    const { newsService } = require('./frontend/src/services/newsService');
    
    // Test 1: Try to create news without authentication
    console.log('\n--- Test 1: Creating news without authentication ---');
    try {
      await newsService.createNews({
        title: 'Test Article',
        content: 'This is a test article',
        author_id: 'ATI-ADMIN-001',
        author_name: 'Test Admin',
        category: 'test',
        is_published: true
      });
      console.log('ERROR: Should have failed without authentication');
    } catch (error) {
      console.log('SUCCESS: Correctly failed without authentication:', error.message);
    }
    
    // Test 2: Login and then create news
    console.log('\n--- Test 2: Login and create news ---');
    
    // Simulate login
    const loginResponse = await authService.login({
      email: 'admin@test.com',
      password: 'password123'
    });
    
    console.log('Login response:', loginResponse);
    
    if (loginResponse.success) {
      console.log('Login successful, token stored');
      
      // Try to create news with authentication
      const newsResponse = await newsService.createNews({
        title: 'Test Article',
        content: 'This is a test article',
        author_id: 'ATI-ADMIN-001',
        author_name: 'Test Admin',
        category: 'test',
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      console.log('News creation response:', newsResponse);
      console.log('SUCCESS: News created with authentication');
    } else {
      console.log('Login failed:', loginResponse.message);
    }
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the test
testServices();