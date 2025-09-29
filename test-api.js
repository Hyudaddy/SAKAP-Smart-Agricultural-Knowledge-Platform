const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAPI() {
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5011/health');
    const healthData = await healthResponse.json();
    console.log('Health:', healthData);

    // Test register endpoint
    console.log('\nTesting register endpoint...');
    const registerResponse = await fetch('http://localhost:5011/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123',
        role: 'public'
      }),
    });
    
    const registerData = await registerResponse.json();
    console.log('Register:', registerData);
    
    if (registerData.success && registerData.data && registerData.data.token) {
      const token = registerData.data.token;
      
      // Test login endpoint
      console.log('\nTesting login endpoint...');
      const loginResponse = await fetch('http://localhost:5011/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test2@example.com',
          password: 'password123'
        }),
      });
      
      const loginData = await loginResponse.json();
      console.log('Login:', loginData);
      
      if (loginData.success && loginData.data && loginData.data.token) {
        const loginToken = loginData.data.token;
        
        // Test get me endpoint
        console.log('\nTesting get me endpoint...');
        const meResponse = await fetch('http://localhost:5011/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginToken}`,
          },
        });
        
        const meData = await meResponse.json();
        console.log('Me:', meData);
        
        // Test get all users endpoint (this should fail for non-admin users)
        console.log('\nTesting get all users endpoint...');
        const usersResponse = await fetch('http://localhost:5011/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginToken}`,
          },
        });
        
        const usersData = await usersResponse.json();
        console.log('Users:', usersData);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();