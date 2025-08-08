#!/usr/bin/env node

/**
 * File Upload Testing Script for Synqit Backend
 * 
 * This script tests the Cloudinary file upload functionality by:
 * 1. Creating a test image file
 * 2. Testing profile image upload
 * 3. Testing company logo upload
 * 4. Testing project banner upload
 * 
 * Prerequisites:
 * - Server running at localhost:5000
 * - Valid authentication token
 * - Cloudinary configured in .env
 * 
 * Usage: node test-file-uploads.js [auth-token]
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');

const BASE_URL = 'http://localhost:5000';
const AUTH_TOKEN = process.argv[2];

if (!AUTH_TOKEN) {
  console.log('❌ Usage: node test-file-uploads.js [auth-token]');
  console.log('\\n💡 To get an auth token:');
  console.log('   1. Run: node test-endpoints.js');
  console.log('   2. Look for the login success message with token');
  console.log('   3. Or login via API and copy the accessToken');
  process.exit(1);
}

// Create a simple test image (SVG)
function createTestImage(name, color = '#007bff') {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${color}"/>
  <text x="100" y="100" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">
    ${name}
  </text>
  <text x="100" y="120" font-family="Arial" font-size="10" fill="white" text-anchor="middle" dominant-baseline="middle">
    Test Image
  </text>
</svg>`;
  
  const filename = `test-${name.toLowerCase().replace(/\\s+/g, '-')}.svg`;
  fs.writeFileSync(filename, svgContent);
  return filename;
}

// Upload file using multipart/form-data
function uploadFile(endpoint, fieldName, filePath) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append(fieldName, fs.createReadStream(filePath));

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        ...form.getHeaders()
      }
    };

    const req = http.request(options, (res) => {
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
    form.pipe(req);
  });
}

async function testFileUploads() {
  console.log('📷 Testing File Upload Functionality');
  console.log('===================================\\n');

  console.log('🎨 Creating test images...');
  
  // Create test images
  const testImages = [
    { name: 'Profile Image', file: createTestImage('Profile Image', '#28a745'), endpoint: '/api/profile/image', field: 'profileImage' },
    { name: 'Company Logo', file: createTestImage('Company Logo', '#dc3545'), endpoint: '/api/profile/company/logo', field: 'companyLogo' },
    { name: 'Company Banner', file: createTestImage('Company Banner', '#ffc107'), endpoint: '/api/profile/company/banner', field: 'companyBanner' },
    { name: 'Project Logo', file: createTestImage('Project Logo', '#17a2b8'), endpoint: '/api/project/logo', field: 'projectLogo' },
    { name: 'Project Banner', file: createTestImage('Project Banner', '#6f42c1'), endpoint: '/api/project/banner', field: 'projectBanner' }
  ];

  console.log(`✅ Created ${testImages.length} test images\\n`);

  const results = [];

  for (const image of testImages) {
    console.log(`📤 Testing ${image.name} upload...`);
    
    try {
      const response = await uploadFile(image.endpoint, image.field, image.file);
      
      if (response.status === 200) {
        console.log(`✅ ${image.name} uploaded successfully`);
        if (response.data.data && response.data.data[image.field.replace('Image', '').replace('Logo', 'Logo').replace('Banner', 'Banner')]) {
          const uploadedUrl = response.data.data[image.field.replace('Image', '').replace('Logo', 'Logo').replace('Banner', 'Banner')];
          console.log(`   📍 URL: ${uploadedUrl}`);
        }
        results.push({ name: image.name, success: true, status: response.status });
      } else {
        console.log(`❌ ${image.name} upload failed (Status: ${response.status})`);
        if (response.data.message) {
          console.log(`   💬 ${response.data.message}`);
        }
        results.push({ name: image.name, success: false, status: response.status, error: response.data.message });
      }
    } catch (error) {
      console.log(`❌ ${image.name} upload error: ${error.message}`);
      results.push({ name: image.name, success: false, error: error.message });
    }
    
    console.log(''); // Empty line for readability
  }

  // Cleanup test images
  console.log('🧹 Cleaning up test images...');
  testImages.forEach(image => {
    try {
      fs.unlinkSync(image.file);
      console.log(`🗑️  Deleted ${image.file}`);
    } catch (error) {
      console.log(`⚠️  Could not delete ${image.file}: ${error.message}`);
    }
  });

  // Summary
  console.log('\\n📊 File Upload Test Results');
  console.log('===========================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((successful / results.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\\n❌ Failed Uploads:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`  - ${result.name}: ${result.error || \`Status \${result.status}\`}`);
    });

    console.log('\\n🔧 Troubleshooting:');
    console.log('  1. Ensure Cloudinary is configured in .env:');
    console.log('     CLOUDINARY_CLOUD_NAME=your-cloud-name');
    console.log('     CLOUDINARY_API_KEY=your-api-key');
    console.log('     CLOUDINARY_API_SECRET=your-api-secret');
    console.log('  2. Check if your auth token is valid');
    console.log('  3. Ensure server is running with: npm run dev');
  }

  if (successful > 0) {
    console.log('\\n🎉 File upload system is working!');
    console.log('   You can now upload images through the API');
  }
}

// Check if FormData is available
try {
  require.resolve('form-data');
} catch (error) {
  console.log('❌ form-data package is required for file upload testing');
  console.log('💡 Install it with: npm install form-data');
  process.exit(1);
}

// Run the tests
console.log(`🔑 Using auth token: ${AUTH_TOKEN.substring(0, 20)}...\\n`);
testFileUploads().catch(console.error);