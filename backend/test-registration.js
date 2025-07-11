const axios = require('axios');

async function testRegistration() {
  const testUser = {
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    userType: 'STARTUP'
  };

  try {
    console.log('Testing registration endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Registration response:', response.data);
  } catch (error) {
    console.log('Registration error:', error.response?.data || error.message);
  }
}

testRegistration();