// Test script to check activity creation functionality
const API_BASE_URL = 'http://localhost:5031/api';

async function testCreateActivity() {
  console.log('Testing Activity Creation Functionality...\n');

  try {
    // Test 1: Fetch all activities first
    console.log('1. Fetching all activities...');
    const activitiesResponse = await fetch(`${API_BASE_URL}/content/activities`);
    console.log('   Response status:', activitiesResponse.status);
    console.log('   Response OK:', activitiesResponse.ok);
    
    if (!activitiesResponse.ok) {
      const errorText = await activitiesResponse.text();
      console.log('   Error response:', errorText);
      throw new Error(`HTTP error! status: ${activitiesResponse.status}`);
    }
    
    const activitiesData = await activitiesResponse.json();
    console.log('   Success:', activitiesData.success);
    console.log('   Activities count:', activitiesData.data?.activities?.length || 0);
    
    // Test 2: Try to create a new activity (this will likely fail without auth)
    console.log('\n2. Attempting to create a new activity...');
    const newActivity = {
      title: 'Test Activity',
      description: 'This is a test activity for verification',
      date: new Date().toISOString(),
      location: 'Test Location',
      organizer: 'Test Organizer',
      organizer_id: 'TEST-001',
      capacity: 50,
      status: 'upcoming',
      registered_count: 0
    };
    
    const createResponse = await fetch(`${API_BASE_URL}/content/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newActivity)
    });
    
    console.log('   Create response status:', createResponse.status);
    console.log('   Create response OK:', createResponse.ok);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('   Create success:', createData.success);
      console.log('   Created activity ID:', createData.data?.activity?.id);
    } else {
      const errorText = await createResponse.text();
      console.log('   Create error response:', errorText);
    }
    
    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('   Error details:', error);
  }
}

// Run the test
testCreateActivity();