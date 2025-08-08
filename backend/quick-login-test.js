#!/usr/bin/env node

/**
 * Quick Login Test - Shows exact login response structure
 */

const http = require('http');

function login() {
  const postData = JSON.stringify({
    email: 'test@synqit.com',
    password: 'TestPassword123!'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('🚀 Login Response:');
      console.log('==================');
      console.log(`Status: ${res.statusCode}`);
      console.log(`\nResponse Body:`);
      
      try {
        const jsonData = JSON.parse(data);
        console.log(JSON.stringify(jsonData, null, 2));
        
        console.log('\n🔍 Looking for tokens:');
        console.log('===================');
        
        // Check common token locations
        if (jsonData.accessToken) console.log(`✅ jsonData.accessToken: ${jsonData.accessToken.substring(0, 30)}...`);
        if (jsonData.token) console.log(`✅ jsonData.token: ${jsonData.token.substring(0, 30)}...`);
        if (jsonData.data?.accessToken) console.log(`✅ jsonData.data.accessToken: ${jsonData.data.accessToken.substring(0, 30)}...`);
        if (jsonData.data?.token) console.log(`✅ jsonData.data.token: ${jsonData.data.token.substring(0, 30)}...`);
        if (jsonData.data?.user?.accessToken) console.log(`✅ jsonData.data.user.accessToken: ${jsonData.data.user.accessToken.substring(0, 30)}...`);
        
      } catch (error) {
        console.log('Raw response (not JSON):');
        console.log(data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    console.log('\n💡 Make sure your server is running with: npm run dev');
  });

  req.write(postData);
  req.end();
}

console.log('🔍 Testing login endpoint...');
console.log('============================\n');

login();