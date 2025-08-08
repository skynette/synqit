#!/usr/bin/env node

/**
 * Debug Login Response
 * This script tests the login endpoint and shows the full response
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
            headers: res.headers,
            data: jsonData
          });
        } catch (err) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: { raw: data }
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }

    req.end();
  });
}

async function debugLogin() {
  console.log('🔍 Debugging Login Response');
  console.log('===========================\n');

  const BASE_URL = 'http://localhost:5000';
  const TEST_EMAIL = 'test@synqit.com';
  const TEST_PASSWORD = 'TestPassword123!';

  try {
    console.log(`📧 Attempting login with: ${TEST_EMAIL}`);
    console.log(`🔒 Password: ${TEST_PASSWORD}\n`);

    const loginData = {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    };

    const response = await makeRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: loginData
    });

    console.log('📡 Raw Response:');
    console.log('===============');
    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, response.headers);
    console.log(`\nResponse Body:`);
    console.log(JSON.stringify(response.data, null, 2));

    // Check for common token locations
    console.log('\n🔍 Checking for auth token in response:');
    console.log('=====================================');

    const possibleTokenPaths = [
      'accessToken',
      'token',
      'authToken',
      'data.accessToken',
      'data.token',
      'data.authToken',
      'data.user.accessToken',
      'data.user.token'
    ];

    for (const path of possibleTokenPaths) {
      const pathParts = path.split('.');
      let current = response.data;
      
      for (const part of pathParts) {
        current = current?.[part];
      }
      
      if (current) {
        console.log(`✅ Found token at: ${path}`);
        console.log(`   Token: ${current.substring(0, 20)}...`);
        break;
      }
    }

    // Check if login was actually successful
    if (response.status === 200) {
      console.log('\n✅ Login returned 200 - Success!');
      if (response.data.success !== false) {
        console.log('✅ Response indicates success');
      } else {
        console.log('❌ Response indicates failure despite 200 status');
        console.log(`   Message: ${response.data.message}`);
      }
    } else {
      console.log(`\n❌ Login failed with status: ${response.status}`);
      if (response.data.message) {
        console.log(`   Error: ${response.data.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Login debug failed:', error.message);
  }
}

debugLogin().catch(console.error);