const fetch = require('node-fetch');

async function registerUser() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Expert Farmer',
        email: 'test.expert@example.com',
        password: 'password123',
        role: 'public'
      })
    });

    const data = await response.json();
    console.log('Registration response:', data);
    
    if (data.success) {
      console.log('User registered successfully!');
      console.log('User ID:', data.data.user.id);
      console.log('Token:', data.data.token);
    }
  } catch (error) {
    console.error('Error registering user:', error);
  }
}

registerUser();