// Test script to verify activities functionality
const fetch = require('node-fetch');

async function testActivitiesAPI() {
  try {
    console.log('Testing Activities API...');
    
    // Test fetching all activities
    console.log('\n1. Fetching all activities...');
    const activitiesResponse = await fetch('http://localhost:5030/api/content/activities');
    const activitiesData = await activitiesResponse.json();
    console.log('Activities response status:', activitiesResponse.status);
    console.log('Activities data:', JSON.stringify(activitiesData, null, 2));
    
    // Test creating a new activity (as admin)
    console.log('\n2. Creating a new activity...');
    const newActivity = {
      title: 'Test Activity',
      description: 'This is a test activity created via API',
      date: new Date().toISOString(),
      location: 'Test Location',
      organizer: 'Test Admin',
      organizer_id: 'ATI-ADMIN-001',
      capacity: 50,
      status: 'upcoming',
      registered_count: 0
    };
    
    const createResponse = await fetch('http://localhost:5030/api/content/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newActivity)
    });
    
    const createData = await createResponse.json();
    console.log('Create activity response status:', createResponse.status);
    console.log('Create activity data:', JSON.stringify(createData, null, 2));
    
  } catch (error) {
    console.error('Error testing activities API:', error);
  }
}

testActivitiesAPI();