#!/usr/bin/env node

/**
 * Test with existing users from database
 */

const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: 30000
    };

    const req = http.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (err) {
          resolve({
            status: res.statusCode,
            data: { raw: data }
          });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function testWithExistingUsers() {
  console.log('🔍 Testing login with existing database users');
  console.log('============================================\n');

  const BASE_URL = 'http://localhost:5000';
  
  // Users we saw in the database inspection
  const existingUsers = [
    { email: 'fadimiluyi@icloud.com', name: 'Bankole Fadimiluyi' },
    { email: 'madsbt93@hotmail.dk', name: 'Mads By' },
    { email: 'abiolaadegbite1@gmail.com', name: 'Abiola Adegbite' },
    { email: 'test@synqit.com', name: 'Test User (just registered)' }
  ];

  // Common test passwords to try
  const commonPasswords = [
    'password123',
    'Password123!', 
    'TestPassword123!',
    '123456789',
    'password'
  ];

  for (const user of existingUsers) {
    console.log(`👤 Testing user: ${user.name} (${user.email})`);
    
    for (const password of commonPasswords) {
      try {
        const loginData = { email: user.email, password };
        const response = await makeRequest(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          body: loginData
        });

        console.log(`   🔑 Password "${password}": Status ${response.status}`);
        
        if (response.status === 200 && response.data.success !== false) {
          console.log(`   ✅ SUCCESS! Found working credentials:`);
          console.log(`      Email: ${user.email}`);
          console.log(`      Password: ${password}`);
          
          // Check for token
          const token = response.data.data?.accessToken || response.data.accessToken || response.data.token;
          if (token) {
            console.log(`      🎫 Token: ${token.substring(0, 30)}...`);
            console.log(`\n🎉 Use these credentials to test endpoints:`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Password: ${password}`);
            console.log(`   Token: ${token.substring(0, 50)}...\n`);
            return { email: user.email, password, token };
          }
          break;
        } else if (response.status === 400 || response.status === 401) {
          console.log(`   ❌ Invalid credentials`);
        } else {
          console.log(`   ⚠️  Server error: ${response.status}`);
          if (response.data.message) {
            console.log(`      Message: ${response.data.message}`);
          }
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    console.log('');
  }

  console.log('❌ No working credentials found with common passwords');
  console.log('\n💡 Solutions:');
  console.log('   1. Check server logs for detailed error messages');
  console.log('   2. Try registering a new user with known password');
  console.log('   3. Reset existing user password through your admin interface');
}

testWithExistingUsers().catch(console.error);