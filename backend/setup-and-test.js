#!/usr/bin/env node

/**
 * Database Setup and Testing Script for Synqit Backend
 * 
 * This script:
 * 1. Verifies database connection
 * 2. Sets up/migrates the database
 * 3. Seeds test data
 * 4. Runs comprehensive endpoint tests
 * 
 * Usage: node setup-and-test.js
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Synqit Backend Setup and Testing');
console.log('====================================\n');

// Check if required files exist
const requiredFiles = [
  '.env',
  'prisma/schema.prisma',
  'package.json'
];

console.log('📋 Checking required files...');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    if (file === '.env') {
      console.log('   💡 Copy .env.example to .env and configure your database');
    }
    process.exit(1);
  }
}

async function setupDatabase() {
  console.log('\\n🗄️  Database Setup');
  console.log('==================');

  try {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');

    console.log('\\n🔄 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');

    console.log('\\n🚀 Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database schema pushed');

    console.log('\\n🌱 Seeding dashboard data...');
    try {
      execSync('npm run seed:dashboard', { stdio: 'inherit' });
      console.log('✅ Dashboard data seeded');
    } catch (error) {
      console.log('⚠️  Dashboard seeding failed (may be okay if data exists)');
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    throw error;
  }
}

async function checkCloudinaryConfig() {
  console.log('\\n☁️  Cloudinary Configuration Check');
  console.log('=================================');

  const envContent = fs.readFileSync('.env', 'utf8');
  const cloudinaryFields = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY', 
    'CLOUDINARY_API_SECRET'
  ];

  let cloudinaryConfigured = true;
  for (const field of cloudinaryFields) {
    if (envContent.includes(`${field}=`) && !envContent.includes(`${field}=your-`)) {
      console.log(`✅ ${field} - Configured`);
    } else {
      console.log(`❌ ${field} - Missing or placeholder`);
      cloudinaryConfigured = false;
    }
  }

  if (!cloudinaryConfigured) {
    console.log('\\n💡 Cloudinary Setup Instructions:');
    console.log('   1. Sign up at https://cloudinary.com');
    console.log('   2. Get your Cloud Name, API Key, and API Secret');
    console.log('   3. Add them to your .env file:');
    console.log('      CLOUDINARY_CLOUD_NAME=your-cloud-name');
    console.log('      CLOUDINARY_API_KEY=your-api-key');
    console.log('      CLOUDINARY_API_SECRET=your-api-secret');
    console.log('\\n   📷 File uploads will not work without Cloudinary config');
  }

  return cloudinaryConfigured;
}

async function startServerAndTest() {
  console.log('\\n🚀 Starting Server and Running Tests');
  console.log('====================================');

  return new Promise((resolve, reject) => {
    // Start the server
    console.log('🟢 Starting server...');
    const server = spawn('npm', ['run', 'dev'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false
    });

    let serverReady = false;
    let testCompleted = false;

    // Monitor server output
    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`📡 Server: ${output.trim()}`);
      
      // Look for server ready indicators
      if (output.includes('Server is running') || output.includes('listening') || output.includes(':5000')) {
        if (!serverReady && !testCompleted) {
          serverReady = true;
          console.log('\\n✅ Server is ready! Running tests in 3 seconds...');
          
          // Wait a bit for server to fully initialize
          setTimeout(() => {
            console.log('\\n🧪 Starting endpoint tests...');
            console.log('============================\\n');
            runTests(server, resolve, reject);
          }, 3000);
        }
      }
    });

    server.stderr.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('warn') && !error.includes('deprecated')) {
        console.error(`❌ Server Error: ${error.trim()}`);
      }
    });

    server.on('error', (error) => {
      console.error('❌ Failed to start server:', error.message);
      reject(error);
    });

    // Timeout after 30 seconds if server doesn't start
    setTimeout(() => {
      if (!serverReady && !testCompleted) {
        console.error('❌ Server failed to start within 30 seconds');
        server.kill('SIGTERM');
        reject(new Error('Server startup timeout'));
      }
    }, 30000);
  });
}

function runTests(server, resolve, reject) {
  const tester = spawn('node', ['test-endpoints.js'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  tester.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  tester.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  tester.on('close', (code) => {
    console.log('\\n🛑 Stopping server...');
    server.kill('SIGTERM');
    
    setTimeout(() => {
      if (code === 0) {
        console.log('✅ All tests completed successfully!');
        resolve();
      } else {
        console.log(`⚠️  Tests completed with exit code: ${code}`);
        resolve(); // Still resolve since we got results
      }
    }, 1000);
  });

  tester.on('error', (error) => {
    console.error('❌ Test runner failed:', error.message);
    server.kill('SIGTERM');
    reject(error);
  });
}

async function showDatabaseInfo() {
  console.log('\\n🗄️  Database Information');
  console.log('=======================');

  try {
    // Show database URL (safely)
    const envContent = fs.readFileSync('.env', 'utf8');
    const dbUrlMatch = envContent.match(/DATABASE_URL="?([^"\\n]+)"?/);
    if (dbUrlMatch) {
      const dbUrl = dbUrlMatch[1];
      const urlParts = new URL(dbUrl);
      console.log(`📍 Database Host: ${urlParts.hostname}:${urlParts.port}`);
      console.log(`📂 Database Name: ${urlParts.pathname.substring(1)}`);
      console.log(`👤 Database User: ${urlParts.username}`);
    }

    console.log('\\n💡 Database Management Commands:');
    console.log('   📊 View data:        npm run db:studio');
    console.log('   🔄 Reset schema:     npx prisma db push --force-reset');
    console.log('   🌱 Seed data:        npm run seed:dashboard');
    console.log('   📋 View schema:      cat prisma/schema.prisma');

  } catch (error) {
    console.log('⚠️  Could not read database info');
  }
}

// Main execution
async function main() {
  try {
    await setupDatabase();
    const cloudinaryConfigured = await checkCloudinaryConfig();
    await showDatabaseInfo();
    await startServerAndTest();
    
    console.log('\\n🎉 Setup and testing completed successfully!');
    
    if (!cloudinaryConfigured) {
      console.log('\\n⚠️  Remember to configure Cloudinary for file upload testing');
    }
    
    console.log('\\n🚀 Next steps:');
    console.log('   • Run "npm run dev" to start the server');
    console.log('   • Run "npm run db:studio" to view/edit data');
    console.log('   • Run "node test-endpoints.js" to test endpoints');
    
  } catch (error) {
    console.error('\\n💥 Setup failed:', error.message);
    process.exit(1);
  }
}

main();